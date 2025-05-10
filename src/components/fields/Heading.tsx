import React, { ChangeEvent } from 'react';
import { HeadingFieldDefinition, ValidatorFn } from '@/app/forms/[formId]/builder/types'; // Adjust path

export const Preview: React.FC<{ fieldDef: HeadingFieldDefinition }> = ({ fieldDef }) => {
  const Tag = fieldDef.level || 'h2';
  return <Tag className="text-lg font-semibold text-gray-700 my-2">{fieldDef.label}</Tag>;
  // Note: Headings usually don't use fieldApi as they are not input fields
};

export const Settings: React.FC<{
  fieldDef: HeadingFieldDefinition;
  onPropertyChange: (property: keyof HeadingFieldDefinition, value: unknown) => void;
}> = ({ fieldDef, onPropertyChange }) => {
  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onPropertyChange('level', e.target.value as HeadingFieldDefinition['level']);
  };

  return (
    <div>
      <label htmlFor="heading-level" className="block mb-1.5 font-medium text-gray-700 text-sm">
        Heading Level:
      </label>
      <select
        id="heading-level"
        value={fieldDef.level || 'h2'}
        onChange={handleLevelChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
      </select>
    </div>
  );
};

// No validators for Heading
// Headings typically don't have data validators or map to a schema input type
export const getValidators = (): { onChange?: ValidatorFn } => {
  return {}; // No validators for Heading
};
// export const getValidators = (fieldDef: HeadingFieldDefinition): { onChange?: ValidatorFn } => {
//     return {}; // No validators for Heading
//   };

export const mapToSchemaType = (): string => 'heading'; // Or handle as non-input in backend 
// export const mapToSchemaType = (fieldDef: HeadingFieldDefinition): string => 'heading'; // Or handle as non-input in backend 