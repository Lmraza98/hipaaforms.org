'use client';
import React, { ChangeEvent } from 'react';
import { FullNameFieldDefinition } from '@/components/form-builder/types';

// Local helper type narrowing
interface ValidationSettingsProps {
  fieldDef: FullNameFieldDefinition;
  /**
   * Callback that mirrors usePropertyChanger signature – change(key, value)
   */
  onChange: <K extends keyof FullNameFieldDefinition>(key: K, value: FullNameFieldDefinition[K]) => void;
}

/**
 * ValidationSettings – exposes Full Name–specific validation controls such as
 * required, length limits and regex restrictions.
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  // Checkbox generic helper
  const handleCheckbox = (key: keyof FullNameFieldDefinition, nested?: boolean) => (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (nested && key === 'validatorsConfig') {
      // For `required` which sits inside validatorsConfig
      onChange('validatorsConfig', {
        ...(fieldDef.validatorsConfig ?? {}),
        required: checked,
      } as FullNameFieldDefinition['validatorsConfig']);
    } else {
      onChange(key as keyof FullNameFieldDefinition, checked as never);
    }
  };

  // Numeric input helper
  const handleNumber = (key: keyof FullNameFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : Number(e.target.value);
    onChange(key as keyof FullNameFieldDefinition, val as never);
  };

  // Text input helper
  const handleText = (key: keyof FullNameFieldDefinition) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value as FullNameFieldDefinition[typeof key];
    onChange(key as keyof FullNameFieldDefinition, val as never);
  };

  const showAutocomplete = fieldDef.nameLayout !== 'split';

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>

      {/* Required */}
      <div className="flex items-center mb-3">
        <input
          id="full-name-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleCheckbox('validatorsConfig', true)}
        />
        <label htmlFor="full-name-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>

      {/* Min length */}
      <div className="mb-3">
        <label htmlFor="full-name-min" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Min Length
        </label>
        <input
          id="full-name-min"
          type="number"
          value={fieldDef.minLength ?? ''}
          onChange={handleNumber('minLength')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Max length */}
      <div className="mb-3">
        <label htmlFor="full-name-max" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Max Length
        </label>
        <input
          id="full-name-max"
          type="number"
          value={fieldDef.maxLength ?? ''}
          onChange={handleNumber('maxLength')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Only alphabetic */}
      <div className="flex items-center mb-3">
        <input
          id="only-alpha"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.onlyAlphabetic ?? false}
          onChange={handleCheckbox('onlyAlphabetic')}
        />
        <label htmlFor="only-alpha" className="text-sm text-gray-700 font-medium">
          Only alphabetic characters
        </label>
      </div>

      {/* Allow middle initial */}
      <div className="flex items-center mb-3 ml-4">
        <input
          id="allow-middle-initial"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.allowMiddleInitial ?? false}
          onChange={handleCheckbox('allowMiddleInitial')}
          disabled={!fieldDef.onlyAlphabetic}
        />
        <label htmlFor="allow-middle-initial" className="text-sm text-gray-700 font-medium">
          Allow middle initial (e.g. John D.)
        </label>
      </div>

      {/* Custom regex */}
      <div className="mb-3">
        <label htmlFor="custom-regex" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Custom Regex Pattern
        </label>
        <input
          id="custom-regex"
          type="text"
          placeholder="e.g. ^[A-Za-z\s'-]+$"
          value={fieldDef.customRegex ?? ''}
          onChange={handleText('customRegex')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Autocomplete attr – hidden in split layout */}
      {showAutocomplete && (
        <div className="mb-3">
          <label htmlFor="autocomplete" className="block mb-1.5 font-medium text-gray-700 text-sm">
            Autocomplete Attribute
          </label>
          <select
            id="autocomplete"
            value={fieldDef.autocomplete ?? fieldDef.autocompleteAttr ?? 'off'}
            onChange={handleText('autocomplete')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          >
            <option value="off">Off</option>
            <option value="name">Full Name</option>
            <option value="given-name">Given Name</option>
            <option value="family-name">Family Name</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ValidationSettings; 