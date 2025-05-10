import type { FC } from 'react';
import { z } from 'zod';

// Placeholder for actual validation functions/schema
export type ValidatorFunction = (value: unknown) => string | undefined | Promise<string | undefined>;
export interface Validators {
  [key: string]: ValidatorFunction | ValidatorFunction[];
}

// Placeholder for the Field API type
export interface AnyFieldApi {
  // Example properties, adjust as needed
  setValue: (value: unknown) => void;
  setTouched: (touched: boolean) => void;
  setError: (error?: string) => void;
  getValue: () => unknown;
  getTouched: () => boolean;
  getError: () => string | undefined;
}

// Placeholder for the onPropertyChange callback signature
export type OnPropertyChange<TConfig extends object> = <K extends keyof TConfig>(
  property: K,
  value: TConfig[K]
) => void;

/**
 * Represents the type of field as it's understood by the backend schema.
 * This might be more abstract than the UI field types.
 * Example: 'string', 'number', 'boolean', 'date', 'object', 'array'
 */
export type BackendFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox_group'
  | 'file'
  | 'email'
  | 'password'
  | 'url'
  | 'object_id' // For relations
  | 'custom_json'; // For more complex, unstructured data

/**
 * Base properties shared by all form field definitions.
 */
export interface FormFieldDefinitionSharedProps {
  id: string; // Unique identifier for this field instance within a form
  name: string; // Corresponds to the HTML name attribute, used for form submission
  label: string;
  helpText?: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  defaultValue?: unknown;
}

/**
 * Generic Form Field Definition.
 * @template FieldType - A string literal union representing the type of the field (e.g., "text", "select").
 * @template Config - An object type representing the specific configuration options for this FieldType.
 */
export interface FormFieldDefinition<
  FieldType extends string = string,
  Config extends object = object
> extends FormFieldDefinitionSharedProps {
  type: FieldType;
  config: Config;
}

/**
 * Represents a module for a specific form field type.
 * It includes components for previewing and configuring the field,
 * and functions for mapping to backend schema and getting validators.
 *
 * @template TDef - The specific FormFieldDefinition type this module handles.
 */
export interface FieldModule<TDef extends FormFieldDefinition<string, object>> {
  /**
   * React component for rendering a preview of the field.
   * Used in the form builder canvas and potentially in the live form.
   */
  Preview: FC<{ fieldDef: TDef; fieldApi?: AnyFieldApi }>;

  /**
   * Optional React component for rendering the settings/configuration UI for this field type.
   * Used in the form builder's property panel.
   */
  Settings?: FC<{
    fieldDef: TDef;
    onPropertyChange: OnPropertyChange<TDef['config']>;
  }>;

  /**
   * Optional function to map this field definition to a backend schema type.
   * This helps in translating the form builder's field representation
   * to what the server/database expects.
   *
   * @param def - The field definition instance.
   * @returns The corresponding BackendFieldType.
   */
  mapToSchemaType?: (def: TDef) => BackendFieldType;

  /**
   * Optional function to get validation rules/logic for this field.
   * These validators can be used for both client-side and server-side validation.
   *
   * @param def - The field definition instance.
   * @returns A Validators object.
   */
  getValidators?: (def: TDef) => Validators;
}

// --- Concrete Field Type Definitions ---
// These are the primary definitions for specific field types and their configs.

// --- Text Field ---
export const TEXT_FIELD_TYPE = 'text';
export interface TextFieldConfig {
  minLength?: number;
  maxLength?: number;
  pattern?: string; // regex
}
export type TextFieldDefinition = FormFieldDefinition<typeof TEXT_FIELD_TYPE, TextFieldConfig>;

// --- Select Field ---
export const SELECT_FIELD_TYPE = 'select';
export interface SelectOption {
  value: string | number;
  label: string;
}
export interface SelectFieldConfig {
  options: SelectOption[];
  allowMultiple?: boolean; // For multi-select
}
export type SelectFieldDefinition = FormFieldDefinition<typeof SELECT_FIELD_TYPE, SelectFieldConfig>;

// --- A type for any specific field definition ---
// This can be useful when you have a collection of different field types.
// Example: FormFieldDefinitionType = TextFieldDefinition | SelectFieldDefinition | ... other fields
// For now, we can use a more generic FormFieldDefinition<string, any> if the specific type isn't known.
// For the registry, we'd ideally want a union of all concrete field definitions.
// export type AnyFormFieldDefinition = FormFieldDefinition<string, Record<string, any>>;

// To use with z.infer as requested, you would typically define Zod schemas
// that correspond to these types, especially for backend validation.

// Example for a Zod schema that might be used with BackendFieldType and FormFieldDefinition
// This is highly dependent on how you structure your overall validation.

// This is a generic Zod schema for a field, you'd likely have more specific ones.
export const BaseFieldZodSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  label: z.string().min(1),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  readonly: z.boolean().optional(),
  defaultValue: z.unknown().optional(), // Added to reflect FormFieldDefinitionSharedProps
});

// Example: Zod schema for TextFieldConfig
export const TextFieldConfigZodSchema = z.object({
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(0).optional(),
  pattern: z.string().optional(),
});

// Example: Zod schema for a full TextFieldDefinition
export const TextFieldDefinitionZodSchema = BaseFieldZodSchema.extend({
  type: z.literal(TEXT_FIELD_TYPE),
  config: TextFieldConfigZodSchema,
  defaultValue: z.string().optional(), // Default for text is string
});

// You would create similar Zod schemas for other field types (SelectField, etc.)
// and then create a discriminated union for all possible field definitions.
//
// For example:
// const AnyFieldDefinitionZodSchema = z.discriminatedUnion("type", [
//   TextFieldDefinitionZodSchema,
//   // ... other field definition Zod schemas
// ]);
//
// export type InferredAnyFieldDefinition = z.infer<typeof AnyFieldDefinitionZodSchema>;

/**
 * A generic registry for field modules.
 * The key is the field type string, and the value is the corresponding FieldModule.
 *
 * Using `FieldModule<any>` here is a concession. Ideally, each entry
 * would be more specific, but that makes the registry type complex to define generically
 * without knowing all field types upfront.
 *
 * You might refine this to something like:
 * type FieldRegistry = {
 *   [TEXT_FIELD_TYPE]: FieldModule<TextFieldDefinition>;
 *   [SELECT_FIELD_TYPE]: FieldModule<SelectFieldDefinition>;
 *   // ... and so on for each field type
 * }
 *
 * Or, for a more dynamic approach where TDef is inferred:
 * interface FieldRegistry {
 *   [fieldType: string]: FieldModule<FormFieldDefinition<typeof fieldType, any>>;
 * }
 */
export interface FieldRegistry {
  [fieldType: string]: FieldModule<FormFieldDefinition<string, object>>;
}

// This type could represent the structure of a complete form definition
export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  fields: FormFieldDefinition<string, object>[]; // Array of different field definitions
  // Potentially:
  // layout?: any; // Information about how fields are arranged
  // settings?: any; // Form-level settings
}

// If you want to use z.infer for the entire form data submitted by the user:
// You'd build a Zod schema dynamically based on the `FormDefinition`.
// For example, if you have `formDefinition.fields`, you iterate through them,
// get their `name` and `mapToSchemaType` (or use `getValidators` to build Zod types),
// and construct a `z.object({})` for the submission.

// Example backend input schema generation (conceptual)
/*
import { z } from 'zod';

function generateZodSchemaFromFieldDefinition(fieldDef: FormFieldDefinition<any, any>): z.ZodTypeAny {
  // This is a simplified example. You'd need to handle different field types,
  // required status, validators, etc.
  switch (fieldDef.type) {
    case TEXT_FIELD_TYPE:
      let textSchema = z.string();
      if (fieldDef.required) textSchema = textSchema.min(1, \`\${fieldDef.label} is required\`);
      if ((fieldDef.config as TextFieldConfig).minLength !== undefined) {
        textSchema = textSchema.min((fieldDef.config as TextFieldConfig).minLength!);
      }
      if ((fieldDef.config as TextFieldConfig).maxLength !== undefined) {
        textSchema = textSchema.max((fieldDef.config as TextFieldConfig).maxLength!);
      }
      if ((fieldDef.config as TextFieldConfig).pattern) {
        textSchema = textSchema.regex(new RegExp((fieldDef.config as TextFieldConfig).pattern!));
      }
      return fieldDef.required ? textSchema : textSchema.optional();
    case SELECT_FIELD_TYPE:
      const options = (fieldDef.config as SelectFieldConfig).options.map(opt => opt.value);
      // This creates an enum from actual values. Ensure values are appropriate for z.enum.
      // z.enum requires at least one value for non-empty array, or two for regular enum
      let selectSchema;
      if (options.length > 0) {
        const stringOptions = options.map(String); // z.enum requires string values
         selectSchema = z.enum([stringOptions[0], ...stringOptions.slice(1) as [string, ...string[]]]);
      } else {
        selectSchema = z.string(); // Fallback if no options, or handle as error
      }

      if ((fieldDef.config as SelectFieldConfig).allowMultiple) {
        const arraySchema = z.array(selectSchema);
        return fieldDef.required ? arraySchema.min(1) : arraySchema.optional();
      }
      return fieldDef.required ? selectSchema : selectSchema.optional();
    // Add cases for other field types
    default:
      return z.any(); // Fallback for unknown types
  }
}

export function generateFormZodSchema(formDefinition: FormDefinition): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of formDefinition.fields) {
    shape[field.name] = generateZodSchemaFromFieldDefinition(field);
  }
  return z.object(shape);
}

// Then you can get the inferred type:
// type InferredFormData = z.infer<ReturnType<typeof generateFormZodSchema>>;
*/

// Note on `FormFieldDefinition<T extends string = string>`
// The initial request `FormFieldDefinition<T extends string = string>` is good.
// The refinement `FormFieldDefinition<FieldType extends string = string, Config extends object = {}>`
// makes the `Config` part explicit, which is crucial for type safety of `fieldDef.config`.
// The `extends object = {}` provides a default for Config if not specified.
// Using `Record<string, any>` or `object` for Config is a general placeholder; specific field types
// should define their concrete Config interface (e.g., `TextFieldConfig`, `SelectFieldConfig`).

// Definitions for TEXT_FIELD_TYPE, TextFieldConfig, SelectFieldDefinition etc. are now above near FieldModule.
// DELETE THE FOLLOWING REDUNDANT BLOCK:
// export const TEXT_FIELD_TYPE = 'text';
// export interface TextFieldConfig {
//   minLength?: number;
//   maxLength?: number;
//   pattern?: string; // regex
// }
// export type TextFieldDefinition = FormFieldDefinition<typeof TEXT_FIELD_TYPE, TextFieldConfig>;
// 
// export const SELECT_FIELD_TYPE = 'select';
// export interface SelectOption {
//   value: string | number;
//   label: string;
// }
// export interface SelectFieldConfig {
//   options: SelectOption[];
//   allowMultiple?: boolean; // For multi-select
// }
// export type SelectFieldDefinition = FormFieldDefinition<typeof SELECT_FIELD_TYPE, SelectFieldConfig>; 