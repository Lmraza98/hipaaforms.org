'use client';

import React, { ChangeEvent } from 'react';
import { getFieldModule } from '@/components/form-builder/fields';
import { useFormBuilderContext } from './context';
import { usePropertyChanger } from '../hooks/usePropertyChanger';
import type { FormFieldDefinition } from '../types';

export const PropertiesPanel = () => {
  const { selectedFieldDef } = useFormBuilderContext();
  const change = usePropertyChanger(selectedFieldDef as FormFieldDefinition);

  if (!selectedFieldDef) {
    return null;
  }

  const { Settings: FieldSettingsComponent } = getFieldModule(selectedFieldDef.type);

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    change('label', event.target.value); 
  };

  const handlePlaceholderChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Ensure the field type can have a placeholder before attempting to change it.
    if ('placeholder' in selectedFieldDef) {
      (change as unknown as (key: string, value: unknown) => void)('placeholder', event.target.value);
    }
  };
  
  const handleRequiredChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Check if the field type can have validatorsConfig.
    if ('validatorsConfig' in selectedFieldDef || 
        !(selectedFieldDef.type === 'Heading' || selectedFieldDef.type === 'Paragraph' || 
          selectedFieldDef.type === 'Image' || selectedFieldDef.type === 'SubmitButton')) {
      const isChecked = event.target.checked;
      // Safely access validatorsConfig, providing a default if it's null/undefined.
      const currentConfig = (selectedFieldDef as { validatorsConfig?: { required?: boolean } }).validatorsConfig || {};
      const newValidatorsConfig = { ...currentConfig, required: isChecked };
      (change as unknown as (key: string, value: unknown) => void)('validatorsConfig', newValidatorsConfig);
    }
  };
  
  // Determine if field can have placeholder, ensuring selectedFieldDef is not null.
  const fieldCanHavePlaceholder = selectedFieldDef && 'placeholder' in selectedFieldDef;
  // Determine if field can have validatorsConfig, ensuring selectedFieldDef is not null.
  const fieldCanHaveValidatorsConfig = selectedFieldDef && 
    ('validatorsConfig' in selectedFieldDef || 
     !(selectedFieldDef.type === 'Heading' || selectedFieldDef.type === 'Paragraph' || 
       selectedFieldDef.type === 'Image' || selectedFieldDef.type === 'SubmitButton'));
  
  let currentPlaceholder = '';
  if (selectedFieldDef && 'placeholder' in selectedFieldDef && typeof selectedFieldDef.placeholder === 'string') {
    currentPlaceholder = selectedFieldDef.placeholder;
  }

  let isCurrentlyRequired = false;
  if (selectedFieldDef && 'validatorsConfig' in selectedFieldDef && 
      (selectedFieldDef as { validatorsConfig?: { required?: boolean } }).validatorsConfig) {
    isCurrentlyRequired = !!(selectedFieldDef as { validatorsConfig?: { required?: boolean } }).validatorsConfig?.required;
  }

  return (
    <div className="flex-grow flex flex-col">
      <div className="mb-4 pb-2.5 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-lg hidden md:block">Properties</h3>
        <span className="text-sm text-gray-500">Selected: {selectedFieldDef.label || 'Untitled Field'} ({selectedFieldDef.type})</span>
      </div>

      <div className="mb-4">
        <label htmlFor="label-input" className="block mb-1.5 font-medium text-gray-700 text-sm placeholder:text-gray-400">
          Label / Name:
        </label>
        <input
          id="label-input"
          type="text"
          value={selectedFieldDef.label || ''}
          onChange={handleLabelChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
      </div>

      {fieldCanHavePlaceholder && (
        <div className="mb-4">
          <label htmlFor="placeholder-input" className="block mb-1.5 font-medium text-gray-700 text-sm">
            Placeholder:
          </label>
          <input
            id="placeholder-input"
            type="text"
            value={currentPlaceholder}
            onChange={handlePlaceholderChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          />
        </div>
      )}
      
      {fieldCanHaveValidatorsConfig && (
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input 
              type="checkbox"
              checked={isCurrentlyRequired} 
              onChange={handleRequiredChange}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 selection:text-gray-700"
            />
            Required
          </label>
        </div>
      )}

      {FieldSettingsComponent && (
        <FieldSettingsComponent 
          fieldDef={selectedFieldDef} 
          onPropertyChange={(property, value) => 
            (change as unknown as (key: string, value: unknown) => void)(property, value)
          } 
        />
      )}
      
      <div className="flex-grow"></div> {/* Spacer */}
    </div>
  );
}; 