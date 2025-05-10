import React, { ChangeEvent } from 'react';
import { FormFieldDefinition, SubmitButtonFieldDefinition, ValidatorFn } from '@/app/forms/[formId]/builder/FormBuilder.client'; // Adjust path

export const Preview: React.FC<{ fieldDef: SubmitButtonFieldDefinition }> = ({ fieldDef }) => {
  // In builder preview, it's just a visual button.
  // The actual form submission is handled by the main form's submit button.
  return (
    <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      {fieldDef.buttonText || fieldDef.label || 'Submit'}
    </button>
  );
};

export const Settings: React.FC<{
  fieldDef: SubmitButtonFieldDefinition;
  onPropertyChange: (property: keyof SubmitButtonFieldDefinition, value: any) => void;
}> = ({ fieldDef, onPropertyChange }) => {
  const handleButtonTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPropertyChange('buttonText', e.target.value);
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
export const getValidators = (fieldDef: SubmitButtonFieldDefinition): { onChange?: ValidatorFn } => {
  return {}; // No validators for SubmitButton
};

export const mapToSchemaType = (fieldDef: SubmitButtonFieldDefinition): string => 'submit'; // Or handle as non-input in backend 