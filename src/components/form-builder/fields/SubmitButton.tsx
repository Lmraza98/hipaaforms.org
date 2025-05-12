import React, { ChangeEvent } from 'react';
import { SubmitButtonFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../hooks/usePropertyChanger';

export const Preview: React.FC<{
  fieldDef: SubmitButtonFieldDefinition;
}> = ({ fieldDef }) => {
  return (
    <button
      type="submit"
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {fieldDef.buttonText || fieldDef.label || 'Submit'}
    </button>
  );
};

export const Settings: React.FC<{
  fieldDef: SubmitButtonFieldDefinition;
}> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleButtonTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    change('buttonText', e.target.value);
  };

  return (
    <div>
      <label htmlFor="button-text" className="block mb-1.5 font-medium text-gray-700 text-sm">
        Button Text:
      </label>
      <input
        id="button-text"
        type="text"
        value={fieldDef.buttonText || ''}
        onChange={handleButtonTextChange}
        placeholder={fieldDef.label || 'Submit'}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

// SubmitButtons typically don't have data validators or map to a schema input type
export const getValidators = (): { onChange?: ValidatorFn } => {
  return {}; // No validators for SubmitButton
};
// export const getValidators = (fieldDef: SubmitButtonFieldDefinition): { onChange?: ValidatorFn } => {
//     return {}; // No validators for SubmitButton
// };

export const mapToSchemaType = (): string => 'submit'; // Or handle as non-input in backend 
// export const mapToSchemaType = (fieldDef: SubmitButtonFieldDefinition): string => 'submit'; // Or handle as non-input in backend 