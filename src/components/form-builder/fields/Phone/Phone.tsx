import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { PhoneFieldDefinition, ValidatorFn } from '@/components/form-builder/types';

const getInputProps = (fieldDef: PhoneFieldDefinition, fieldApi?: AnyFieldApi) => {
  return fieldApi
    ? {
        id: fieldApi.name,
        name: fieldApi.name,
        value: fieldApi.state.value || '',
        onBlur: fieldApi.handleBlur,
        onChange: (e: ChangeEvent<HTMLInputElement>) => fieldApi.handleChange(e.target.value),
      }
    : {
        readOnly: true,
        placeholder: fieldDef.placeholder,
        value: '',
      };
};

const commonInputClasses =
  'w-full px-3 py-2 rounded text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500';

export const Preview: React.FC<{ fieldDef: PhoneFieldDefinition; fieldApi?: AnyFieldApi }> = ({
  fieldDef,
  fieldApi,
}) => {
  return (
    <input
      type="tel"
      {...getInputProps(fieldDef, fieldApi)}
      className={commonInputClasses}
      placeholder={fieldDef.placeholder || 'Phone number'}
    />
  );
};

export const Settings: React.FC<{
  fieldDef: PhoneFieldDefinition;
  onPropertyChange: (property: keyof PhoneFieldDefinition, value: unknown) => void;
}> = () => {
  return <p className="text-xs text-gray-500 mt-2">No specific settings for Phone beyond common properties.</p>;
};

// Basic US/international number validator
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[\s\-]?[0-9]{1,4}[\s\-]?[0-9]{1,9}$/;

export const getValidators = (
  fieldDef: PhoneFieldDefinition,
): {
  onChange?: ValidatorFn;
} => {
  return {
    onChange: (params: { value: unknown }) => {
      const value = params.value as string;
      if (fieldDef.validatorsConfig?.required && !value) {
        return `${fieldDef.label} is required.`;
      }
      if (value && !phoneRegex.test(value)) {
        return 'Enter a valid phone number.';
      }
      return undefined;
    },
  };
};

export const mapToSchemaType = (): string => 'phone'; 