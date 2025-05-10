import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '@/server/db'; // Assuming prisma client is exported from @/server/db
import { TRPCError } from '@trpc/server';

// Define UserRole enum based on provided details
const UserRoleSchema = z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']);
export type UserRole = z.infer<typeof UserRoleSchema>;

// Zod schema for FormField options (basic structure)
// You might want to make this more specific based on fieldType in the future
export const FormFieldOptionsSchema = z.object({
  label: z.string().min(1, "Label cannot be empty"),
  fieldType: z.enum(['text', 'textarea', 'email', 'select', 'checkbox', 'radio', 'date', 'number', 'password', 'url', 'tel']),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  selectOptions: z.array(z.string()).optional(), // For select, radio, checkbox group
  validationRegex: z.string().optional(),
  validationMessage: z.string().optional(),
  minLength: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional()
});

// Zod schema for creating a FormField
const FormFieldCreateInputSchema = z.object({
  order: z.number().int(),
  options: FormFieldOptionsSchema, // Options are required for creation
});

// Zod schema for updating a FormField
const FormFieldUpdateInputSchema = z.object({
  id: z.string().cuid().optional(), // Optional: new fields won't have an ID yet
  order: z.number().int(), // Order is always required
  options: FormFieldOptionsSchema, // Full options object required for create/update
});

// Zod schema for creating a Form
const FormCreateInputSchema = z.object({
  name: z.string().min(1, "Form name cannot be empty"),
  description: z.string().optional(),
  organizationId: z.string().cuid("Valid Organization ID is required."), // Organization context for the new form
  fields: z.array(FormFieldCreateInputSchema).optional(),
});

// Zod schema for updating a Form
const FormUpdateInputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Form name cannot be empty").optional(),
  description: z.string().optional().nullable(), // Allow setting description to null
  version: z.number().int().positive("Version must be a positive integer."), // Added version
  fields: z.array(FormFieldUpdateInputSchema).optional(), // Added fields for update
});

export const formRouter = router({
  // Form Procedures
  create: protectedProcedure
    .input(FormCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, description, organizationId, fields } = input;
      const userId = ctx.user.id;

      // Check if user is part of the organization and has a role that allows form creation
      // (e.g., OWNER, ADMIN, EDITOR)
      const userOrgMembership = await prisma.userOnOrg.findUnique({
        where: {
          userId_organizationId: {
            userId: userId,
            organizationId: organizationId,
          },
        },
      });
      console.log("userOrgMembership", JSON.stringify(userOrgMembership, null, 2));

      // if (!userOrgMembership || !["OWNER", "ADMIN", "EDITOR"].includes(userOrgMembership.role)) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You do not have permission to create forms in this organization.",
      //   });
      // }

      const form = await prisma.form.create({
        data: {
          name,
          description,
          userId, // creator of the form
          organizationId, // associate form with the organization from input
          version: 1, // Initial version
          fields: fields && fields.length > 0
            ? {
                create: fields.map(field => ({
                  order: field.order,
                  options: field.options, // Prisma expects Json type
                })),
              }
            : undefined,
        },
        include: {
          fields: true, // Return fields with the created form
        },
      });
      return form;
    }),

  getById: protectedProcedure
    // Loosen CUID validation for now to handle non-CUID formId from URL like "test-form-001"
    // This implies that the lookup logic might need to handle slugs or other identifiers
    // if the ID is not a CUID. For now, it will just pass the string to Prisma.
    .input(z.object({ id: z.string().min(1, "ID cannot be empty") }))
    .query(async ({ ctx, input }) => {
      const sessionUser = ctx.user;
      const form = await prisma.form.findUnique({
        where: { id: input.id }, 
        include: {
          fields: {
            orderBy: { order: 'asc' },
          },
          // Include the organization relation if you need its details, 
          // otherwise form.organizationId (the scalar field) is sufficient.
          // organization: true, 
        },
      });

      if (!form) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found.' });
      }

      // Now that Form model has organizationId, this check should be valid
      // once Prisma Client is regenerated after migration.
      if (!form.organizationId) { 
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Form is not associated with an organization. This should not happen if forms always require an organization.',
        });
      }

      const userOrgMembership = await prisma.userOnOrg.findUnique({
        where: {
          userId_organizationId: {
            userId: sessionUser.id,
            organizationId: form.organizationId,
          },
        },
      });

      if (!userOrgMembership) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have access to this form\'s organization.' });
      }

      const canViewRoles: UserRole[] = ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'];
      if (!canViewRoles.includes(userOrgMembership.role as UserRole)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Your role does not permit viewing this form.' });
      }
      
      return {
        ...form,
        // userOrgMembership.role seems correct based on linter
        userRole: userOrgMembership.role as UserRole,
      };
    }),

  update: protectedProcedure
    .input(FormUpdateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user;
      const { id: formId, name, description, version: inputVersion, fields: inputFields } = input;

      const currentForm = await prisma.form.findUnique({
        where: { id: formId },
        include: {
          organization: true,
        }
      });

      if (!currentForm) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found.' });
      }

      const organizationId = currentForm.organizationId;
      if (!organizationId) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Form is not associated with an organization.' });
      }

      // 2. Perform RBAC check: User must be OWNER, ADMIN, or EDITOR
      const userOrgMembership = await prisma.userOnOrg.findUnique({
        where: {
          userId_organizationId: {
            userId: sessionUser.id,
            organizationId: organizationId,
          },
        },
      });

      if (!userOrgMembership) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have access to this form\'s organization.' });
      }

      const canEditRoles: UserRole[] = ['OWNER', 'ADMIN', 'EDITOR'];
      if (!canEditRoles.includes(userOrgMembership.role as UserRole)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Your role does not permit editing this form.' });
      }

      // 3. Version Check
      // currentForm.version seems correct based on linter
      if (currentForm.version !== inputVersion) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'This form has been updated by someone else. Please refresh and try again.',
        });
      }

      // 4. Prisma Transaction for updates
      return prisma.$transaction(async (tx) => {
        // Update Form details
        await tx.form.update({
          where: { id: formId },
          data: {
            name: name,
            description: description,
            // currentForm.version seems correct based on linter
            version: (currentForm.version || 0) + 1, // Increment version
            updatedAt: new Date(), // Explicitly bump updatedAt
          },
        });

        if (inputFields) {
          // Get current field IDs from the database for this form
          const currentDbFields = await tx.formField.findMany({
            where: { formId: formId },
            select: { id: true },
          });
          const currentDbFieldIds = new Set(currentDbFields.map(f => f.id));
          const inputFieldIds = new Set(inputFields.filter(f => f.id).map(f => f.id as string));

          // Fields to delete: in DB but not in input
          const fieldsToDelete = Array.from(currentDbFieldIds).filter(id => !inputFieldIds.has(id));
          if (fieldsToDelete.length > 0) {
            await tx.formField.deleteMany({
              where: { id: { in: fieldsToDelete } },
            });
          }

          // Process creates and updates for inputFields
          for (const fieldData of inputFields) {
            if (fieldData.id && currentDbFieldIds.has(fieldData.id)) {
              // Update existing field
              await tx.formField.update({
                where: { id: fieldData.id },
                data: {
                  order: fieldData.order,
                  options: fieldData.options, // Assumes FormFieldOptionsSchema matches Prisma Json type
                },
              });
            } else {
              // Create new field (either id is undefined, or it's an ID not in DB - though latter is less likely if client manages IDs correctly)
              await tx.formField.create({
                data: {
                  formId: formId,
                  order: fieldData.order,
                  options: fieldData.options,
                  // id: fieldData.id, // if you want client-generated CUIDs for new fields, ensure they are valid
                },
              });
            }
          }
        }
        
        // Re-fetch the form with updated fields and correct user role for the response
        const finalForm = await tx.form.findUnique({
          where: { id: formId },
          include: {
            fields: { orderBy: { order: 'asc' } },
          },
        });

        return {
          ...finalForm,
          // userOrgMembership.role seems correct based on linter
          userRole: userOrgMembership.role as UserRole, // Add userRole to the response
        };
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const existingForm = await prisma.form.findUnique({ where: { id: input.id } });

      if (!existingForm) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found.' });
      }
      if (existingForm.userId !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to delete this form.' });
      }
      // Cascading delete for FormFields is handled by Prisma schema (onDelete: Cascade)
      return prisma.form.delete({ where: { id: input.id } });
    }),

  listByUser: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      return prisma.form.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { fields: true, submissions: true }
          }
        }
      });
    }),

  // FormField Procedures
  createField: protectedProcedure
    .input(z.object({ formId: z.string().cuid(), field: FormFieldCreateInputSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { formId, field } = input;

      const form = await prisma.form.findUnique({ where: { id: formId } });
      if (!form) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Parent form not found.' });
      }
      if (form.userId !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to add fields to this form.' });
      }

      return prisma.formField.create({
        data: {
          formId,
          order: field.order,
          options: field.options, // Prisma expects Json
        },
      });
    }),

  updateField: protectedProcedure
    .input(FormFieldUpdateInputSchema.extend({ formId: z.string().cuid() })) // formId needed for auth check
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { id: fieldId, formId, ...updateData } = input;

      const formField = await prisma.formField.findUnique({
        where: { id: fieldId },
        include: { form: true },
      });

      if (!formField) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'FormField not found.' });
      }
      if (formField.form.userId !== userId || formField.formId !== formId) {
         throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to update this field.' });
      }
      
      // Ensure options are merged if partially updated
      let newOptions = updateData.options;
      if (updateData.options && formField.options && typeof formField.options === 'object' && typeof updateData.options === 'object') {
        newOptions = { ...(formField.options as object), ...updateData.options };
      }

      return prisma.formField.update({
        where: { id: fieldId },
        data: {
          ...updateData,
          options: newOptions ? newOptions : undefined, // Prisma expects Json or undefined
        },
      });
    }),

  deleteField: protectedProcedure
    .input(z.object({ id: z.string().cuid(), formId: z.string().cuid() })) // formId for auth
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { id: fieldId, formId } = input;

      const formField = await prisma.formField.findUnique({
        where: { id: fieldId },
        include: { form: true },
      });

      if (!formField) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'FormField not found.' });
      }
      if (formField.form.userId !== userId || formField.formId !== formId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to delete this field.' });
      }

      return prisma.formField.delete({ where: { id: fieldId } });
    }),

  // New procedure to create a blank form
  createBlank: protectedProcedure
    .input(z.object({
      name: z.string().min(1, "Form name cannot be empty").default("Untitled Form"),
      organizationId: z.string().cuid("Valid Organization ID is required."),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log("createBlank input", JSON.stringify(input, null, 2));
      const { name, organizationId } = input;
      const userId = ctx.user.id;

      // RBAC: Check if user can create forms in this organization
      const userOrgMembership = await prisma.userOnOrg.findUnique({
        where: {
          // Assuming 'userId_organizationId' is the correct composite key name
          userId_organizationId: {
            userId: userId,
            organizationId: organizationId,
          },
        },
      });

      console.log("userOrgMembership", JSON.stringify(userOrgMembership, null, 2));

      // // Assuming 'role' is the correct field name on userOrgMembership
      // if (!userOrgMembership || !["OWNER", "ADMIN", "EDITOR"].includes(userOrgMembership.role as UserRole)) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You do not have permission to create forms in this organization.",
      //   });
      // }

      const newForm = await prisma.form.create({
        data: {
          name,
          userId,
          organizationId: organizationId, // Reverted to use organizationId directly
          version: 1,
          description: "", // Default empty description
          fields: { create: [] }, // Create with no fields
        },
      });

      return { id: newForm.id };
    }),
});

// Export type for this router, can be used in client
export type FormRouter = typeof formRouter; 