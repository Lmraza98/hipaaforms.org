import React from 'react';
import { notFound } from 'next/navigation';
import { TRPCError } from '@trpc/server';
import { appRouter } from '@/server/trpc/routers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Import authOptions from the new location
import type { Session } from 'next-auth';
import FormBuilderClient from './FormBuilder.client'; 
// import { User } from '@/server/trpc/trpc'; // Consider importing User type for context
import { type FormFieldDefinition } from './types'; // Ensure this is the correct import for the client component's expected type
import { z } from 'zod';
import { FormFieldOptionsSchema } from '@/server/trpc/routers/form';
// Infer the type from the Zod schema
type FormFieldOptionsType = z.infer<typeof FormFieldOptionsSchema>;

export default async function FormBuilderPage({
    params,
}: {
    params: Promise<{ formId: string }> 
}) {
const { formId } = await params;

  // Use the imported Session type for better type safety if next-auth.d.ts is correctly set up
  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p>You must be logged in to access this page.</p>
      </div>
    );
  }

  // Construct user object for tRPC context
  // session.user should now be correctly typed if next-auth.d.ts is working.
  const userForContext = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role ?? null, 
      organizationId: session.user.organizationId ?? null, 
  };

  const caller = appRouter.createCaller({
    session: session, 
    user: userForContext, 
  });

  let formWithRole;
  try {
    formWithRole = await caller.form.getById({ id: formId });
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'NOT_FOUND') notFound();
      if (error.code === 'FORBIDDEN') {
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Access Denied (403)</h1>
            <p>You do not have permission to view or edit this form.</p>
          </div>
        );
      }
    }
    console.error('Error fetching form data:', error);
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Error</h1>
        <p>Could not load the form data. Please try again later.</p>
      </div>
    );
  }

  if (!formWithRole) notFound();

  const { userRole, fields, ...formDetails } = formWithRole;
  
  // Transform fields to match FormFieldDefinition[]
  const transformedFields: FormFieldDefinition[] = fields.map(field => {
    const options = field.options as FormFieldOptionsType;
    return {
      ...field, 
      ...options, 
      type: options.fieldType as FormFieldDefinition['type'], // Map fieldType to type and assert to union of literal types
      // Ensure other properties required by FormFieldDefinition are present
      // or have defaults if not in options
      label: options.label, // Explicitly ensuring label is passed
      // 'name' is also part of FormFieldDefinitionSharedProps.
      // If options can have 'name', it will be spread. Otherwise, ensure it's handled if critical.
      // For now, focusing on the reported linter errors (type, label)
      id: field.id, // Ensure id from the field itself is preserved if not in options
    } as FormFieldDefinition; // Add assertion to FormFieldDefinition
  });
  // const initialData = deserializeFieldsToNodes(fields);

  return (
    <>
      <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <span>Forms</span> &rsaquo; 
        <span>{formDetails.name || 'Loading...'} (v{formDetails.version || 1})</span>
      </div>
      <div style={{ height: 'calc(100vh - 120px)', width: '100%' }}>
        <FormBuilderClient 
          formId={formDetails.id}
          initialFields={transformedFields} // Use the transformed fields
          initialName={formDetails.name || ''}
          initialDescription={formDetails.description || ''}
          currentVersion={formDetails.version || 1}
          userRole={userRole}
        />
      </div>
    </>
  );
} 