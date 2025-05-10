import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { FormFieldDefinition } from '@/app/forms/[formId]/builder/types'; // Assuming types are here
import { BaseFieldDefinition } from '@/app/forms/[formId]/builder/types'; // Adjust path

// This is a fallback for field types not yet fully implemented in the registry
export const Preview: React.FC<{ fieldDef: FormFieldDefinition; fieldApi?: AnyFieldApi }> = ({ fieldDef, fieldApi }) => {
  const commonInputClasses = "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
  const inputProps = fieldApi ? {
    id: fieldApi.name,
    name: fieldApi.name,
    value: fieldApi.state.value || '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => fieldApi.handleChange(e.target.value),
  } : {
    readOnly: true,
    placeholder: fieldDef.label || `Preview for ${fieldDef.type}`,
  };

  return <input type="text" {...inputProps} className={commonInputClasses} placeholder={fieldDef.label || `Preview for ${fieldDef.type}`} />;
};

export const Settings: React.FC<{
  fieldDef: FormFieldDefinition;
  onPropertyChange: (property: keyof FormFieldDefinition, value: unknown) => void;
}> = ({ fieldDef }) => {
  return <p className="text-xs text-gray-500">Settings for {fieldDef.type} not implemented yet.</p>;
};

type onChangeParams = {
    value: unknown;
}

// Fallback getValidators
export const getValidators = (fieldDef: FormFieldDefinition): { onChange?: (params: onChangeParams) => string | undefined } => {
  // Default fields might not have specific validation, or it could be based on a generic required flag if we add one to BaseFieldDefinition.
  // For now, returning no validators for default/unknown types.
  if ((fieldDef as BaseFieldDefinition).validatorsConfig?.required) {
      return {
          onChange: (params: onChangeParams) => {
              if (!params.value && params.value !== 0 && params.value !== false) {
                  return `${fieldDef.label} is required`;
              }
              return undefined;
          }
      }
  }
  return {};
};

// Fallback mapToSchemaType
export const mapToSchemaType = (fieldDef: FormFieldDefinition): string => {
  console.warn(`mapToSchemaType not implemented for ${fieldDef.type}, defaulting to 'text'.`);
  return 'text'; // Default or throw error
}; 