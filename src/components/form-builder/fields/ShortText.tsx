import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { ShortTextFieldDefinition, ValidatorFn } from '@/components/form-builder/types';

// Helper for common input props
const getInputProps = (fieldDef: ShortTextFieldDefinition, fieldApi?: AnyFieldApi) => {
  return fieldApi ? {
    id: fieldApi.name,
    name: fieldApi.name,
    value: fieldApi.state.value || '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: ChangeEvent<HTMLInputElement>) => fieldApi.handleChange(e.target.value),
  } : {
    readOnly: true,
    placeholder: fieldDef.placeholder,
    value: '', // Default for palette preview
  };
};

const commonInputClasses = "w-full px-3 py-2 rounded text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

export const Preview: React.FC<{ fieldDef: ShortTextFieldDefinition; fieldApi?: AnyFieldApi }> = ({ fieldDef, fieldApi }) => {
  return <input type="text" {...getInputProps(fieldDef, fieldApi)} className={commonInputClasses} placeholder={fieldDef.placeholder} />;
};

export const Settings: React.FC<{
  fieldDef: ShortTextFieldDefinition;
  onPropertyChange: (property: keyof ShortTextFieldDefinition, value: unknown) => void;
}> = () => {
  // Basic settings: Label and Placeholder are handled by PropertiesPanel directly for now
  // This component would include settings specific to ShortText if any arise.
  return (
    <div>
      {/* Example: If ShortText had a 'maxLength' property */}
      {/* <label htmlFor="max-length" className="block mb-1 text-sm font-medium">Max Length:</label>
      <input
        id="max-length"
        type="number"
        value={fieldDef.maxLength || ''}
        onChange={(e) => onPropertyChange('maxLength', parseInt(e.target.value, 10))}
        className="w-full p-2 border rounded"
      /> */}
       <p className="text-xs text-gray-500 mt-2">No specific settings for Short Text beyond common properties.</p>
    </div>
  );
};

// No specific complex validators for ShortText beyond generic 'required'
// The getValidators function will primarily handle the 'required' flag from validatorsConfig
export const getValidators = (fieldDef: ShortTextFieldDefinition): { onChange?: ValidatorFn } => {
  if (fieldDef.validatorsConfig?.required) {
    return {
      onChange: (params: { value: unknown }) => {
        if (!params.value && params.value !== 0 && params.value !== false) {
          return `${fieldDef.label} is required.`;
        }
        return undefined;
      }
    };
  }
  return {}; // No validators if not required
};

// export const mapToSchemaType = (fieldDef: ShortTextFieldDefinition): string => 'text'; 
export const mapToSchemaType = (): string => 'text'; 
