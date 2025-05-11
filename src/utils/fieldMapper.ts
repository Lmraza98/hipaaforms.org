import { FormFieldDefinition } from '@/components/form-builder/types';
import { getFieldModule } from '@/components/form-builder/fields';

// Define the allowed backend field types - REVERTED TO ORIGINAL RESTRICTED LIST
export const BACKEND_FIELD_TYPES = [
    'text', 'textarea', 'email', 'select', 'checkbox', 'radio',
    'date', 'number', 'password', 'url', 'tel'
] as const;
export type BackendFieldType = typeof BACKEND_FIELD_TYPES[number];

export type BackendFieldInputOptions = {
    label: string;
    fieldType: BackendFieldType;
    required: boolean;
    placeholder?: string;
    selectOptions?: string[]; // Changed from unknown[] to string[]
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // For Heading
    rows?: number; // For LongText
    min?: number; // For Number
    max?: number; // For Number
    src?: string; // For Image
    alt?: string; // For Image
    // Add other specific options as needed
    [key: string]: unknown; // Allows for other dynamic properties
};

export type BackendFieldInput = {
  id?: string; // Undefined if it's a new field not yet persisted
  order: number;
  options: BackendFieldInputOptions;
};

export function mapToInputSchema(field: FormFieldDefinition, order: number): BackendFieldInput {
  const fieldModule = getFieldModule(field.type);
  const typedField = field as Extract<FormFieldDefinition, { type: typeof field.type }>;
  
  let mappedTypeString: string = field.type.toLowerCase();
  if (fieldModule.mapToSchemaType) {
      const schemaTypeResult = fieldModule.mapToSchemaType(typedField);
      if (typeof schemaTypeResult === 'string') {
        mappedTypeString = schemaTypeResult;
      } else {
        console.warn(`mapToSchemaType for ${field.type} did not return a string. Using ${mappedTypeString}.`);
      }
  }

  let fieldTypeForBackend = mappedTypeString as BackendFieldType;

  if (!BACKEND_FIELD_TYPES.includes(fieldTypeForBackend)) {
    console.warn(`Invalid fieldType '${mappedTypeString}' mapped for backend from field type '${field.type}'. Field ID: '${field.id}'. Defaulting to 'text'.`);
    fieldTypeForBackend = 'text'; // Explicitly default to 'text' if not a valid backend type
  }

  let required = false;
  if ('validatorsConfig' in field && field.validatorsConfig && typeof field.validatorsConfig === 'object' && field.validatorsConfig !== null) {
    required = !!field.validatorsConfig.required;
  }

  let placeholder: string | undefined = undefined;
  if ('placeholder' in field && typeof field.placeholder === 'string') {
    placeholder = field.placeholder;
  }

  const specificOptions: Partial<BackendFieldInputOptions> = {};
  switch (field.type) {
    case 'Dropdown':
    case 'SingleChoice':
    case 'MultiChoice':
      if ('options' in field && Array.isArray(field.options)) {
        specificOptions.selectOptions = field.options.map(option => {
          if (typeof option === 'string') {
            return option;
          }
          // Assuming option is { value: string, label: string } or similar
          if (option && typeof option === 'object' && option !== null && 'value' in option) {
            const val = (option as { value: unknown }).value;
            if (typeof val === 'string') {
              return val;
            }
          }
          console.warn('Invalid option found in selectOptions (expected string or {value: string}):', option);
          return null; // Return null for invalid options
        }).filter(value => value !== null) as string[]; // Filter out nulls and assert as string[]
      }
      break;
    case 'Heading':
      if ('level' in field && field.level) specificOptions.headingLevel = field.level;
      break;
    case 'LongText':
      if ('rows' in field && typeof field.rows === 'number') specificOptions.rows = field.rows;
      break;
    case 'Number':
      if ('min' in field && typeof field.min === 'number') specificOptions.min = field.min;
      if ('max' in field && typeof field.max === 'number') specificOptions.max = field.max;
      break;
    case 'Image':
      if ('src' in field && typeof field.src === 'string') specificOptions.src = field.src;
      if ('alt' in field && typeof field.alt === 'string') specificOptions.alt = field.alt;
      break;
  }

  return {
    id: field.id.includes('_new_') || field.id.startsWith('default_') ? undefined : field.id,
    order,
    options: {
      label: field.label || `${field.type} Field`,
      fieldType: fieldTypeForBackend,
      required: required,
      placeholder: placeholder,
      ...specificOptions
    }
  };
} 