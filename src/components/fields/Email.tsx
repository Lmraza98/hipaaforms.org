import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { EmailFieldDefinition, ValidatorFn } from '@/app/forms/[formId]/builder/FormBuilder.client'; // Adjust path

const getInputProps = (fieldDef: EmailFieldDefinition, fieldApi?: AnyFieldApi) => {
  return fieldApi ? {
    id: fieldApi.name,
    name: fieldApi.name,
    value: fieldApi.state.value || '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: ChangeEvent<HTMLInputElement>) => fieldApi.handleChange(e.target.value),
  } : {
    readOnly: true,
    placeholder: fieldDef.placeholder,
    value: '',
  };
};

const commonInputClasses = "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

export const Preview: React.FC<{ fieldDef: EmailFieldDefinition; fieldApi?: AnyFieldApi }> = ({ fieldDef, fieldApi }) => {
  return <input type="email" {...getInputProps(fieldDef, fieldApi)} className={commonInputClasses} placeholder={fieldDef.placeholder} />;
};

export const Settings: React.FC<{
  fieldDef: EmailFieldDefinition;
  onPropertyChange: (property: keyof EmailFieldDefinition, value: any) => void;
}> = ({ fieldDef, onPropertyChange }) => {
  return (
    <div>
      <p className="text-xs text-gray-500 mt-2">No specific settings for Email beyond common properties.</p>
      {/* Add email specific settings here if any, e.g., domain restriction */}
    </div>
  );
};

// This function provides the TanStack Form validators for an Email field
export const getValidators = (fieldDef: EmailFieldDefinition): { onChange?: ValidatorFn } => {
  let combinedOnChange: ValidatorFn | undefined = undefined;

  const emailFormatValidator: ValidatorFn<string> = (params) => {
    if (!params.value) return undefined; // Don't validate format if empty, required check handles that
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(params.value) ? undefined : 'Must be a valid email address.';
  };

  if (fieldDef.validatorsConfig?.required) {
    combinedOnChange = (params: { value: unknown }) => {
      if (!params.value && params.value !== 0 && params.value !== false) {
        return `${fieldDef.label} is required.`;
      }
      // If required check passes, then run email format validation on the string value
      return emailFormatValidator({ value: params.value as string });
    };
  } else {
    // Not required, but still validate format if a value is present
    combinedOnChange = (params: { value: unknown }) => {
      if (params.value) { // Only validate format if there's some value
        return emailFormatValidator({ value: params.value as string });
      }
      return undefined;
    };
  }
  return { onChange: combinedOnChange };
};

export const mapToSchemaType = (fieldDef: EmailFieldDefinition): string => 'email'; 