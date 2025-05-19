import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { DatePickerFieldDefinition, ValidatorFn } from '@/components/form-builder/types';

const getInputProps = (fieldDef: DatePickerFieldDefinition, fieldApi?: AnyFieldApi) => {
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

export const Preview: React.FC<{ fieldDef: DatePickerFieldDefinition; fieldApi?: AnyFieldApi }> = ({
  fieldDef,
  fieldApi,
}) => {
  return (
    <input
      type="date"
      {...getInputProps(fieldDef, fieldApi)}
      className={commonInputClasses}
      placeholder={fieldDef.placeholder || 'Select date'}
    />
  );
};

export const Settings: React.FC<{
  fieldDef: DatePickerFieldDefinition;
  onPropertyChange: (property: keyof DatePickerFieldDefinition, value: unknown) => void;
}> = () => {
  return <p className="text-xs text-gray-500 mt-2">No specific settings for Date Picker yet.</p>;
};

export const getValidators = (
  fieldDef: DatePickerFieldDefinition,
): {
  onChange?: ValidatorFn;
} => {
  if (fieldDef.validatorsConfig?.required) {
    return {
      onChange: (params: { value: unknown }) => {
        if (!params.value) {
          return `${fieldDef.label} is required.`;
        }
        return undefined;
      },
    };
  }
  return {};
};

export const mapToSchemaType = (): string => 'date'; 