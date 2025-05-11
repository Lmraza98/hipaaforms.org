'use client';
import React, { ChangeEvent, useState, useEffect, KeyboardEvent } from 'react';
import { HeadingFieldDefinition, HeadingPreviewProps, ValidatorFn } from '@/components/form-builder/types';
import { AnyFieldApi } from '@tanstack/react-form';

// Original preview component renamed to HeadingPreviewEditor
export const HeadingPreviewEditor: React.FC<HeadingPreviewProps> = ({ fieldDef, onPropertyChange }) => {
  const Tag = fieldDef.level || 'h2';
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(fieldDef.label);

  useEffect(() => {
    if (!isEditing) {
      setCurrentText(fieldDef.label);
    }
  }, [fieldDef.label, isEditing]);

  const handleSave = () => {
    if (currentText.trim() !== fieldDef.label) {
      onPropertyChange('label', currentText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentText(fieldDef.label); // Revert to original
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`text-lg font-semibold text-gray-700 my-2 w-full focus:outline-none bg-transparent`}
        autoFocus
      />
    );
  }

  return (
    <Tag
      className="text-lg font-semibold text-gray-700 my-2 cursor-pointer hover:text-blue-600 transition-colors"
      onClick={() => setIsEditing(true)}
      title="Click to edit heading text"
    >
      {currentText}
    </Tag>
  );
};

// New wrapper component that matches the FieldModule interface
export const Preview: React.FC<{ fieldDef: HeadingFieldDefinition; fieldApi?: AnyFieldApi }> = ({ fieldDef }) => {
  // In non-editable mode, just render the heading without editing capabilities
  const Tag = fieldDef.level || 'h2';
  return (
    <Tag className="text-lg font-semibold text-gray-700 my-2">
      {fieldDef.label}
    </Tag>
  );
};

export const Settings: React.FC<{
  fieldDef: HeadingFieldDefinition;
  onPropertyChange: (property: keyof HeadingFieldDefinition, value: unknown) => void;
}> = ({ fieldDef, onPropertyChange }) => {
  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onPropertyChange('level', e.target.value as HeadingFieldDefinition['level']);
  };

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPropertyChange('label', e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="heading-text-input" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Heading Text:
        </label>
        <input
          type="text"
          id="heading-text-input"
          value={fieldDef.label}
          onChange={handleLabelChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
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