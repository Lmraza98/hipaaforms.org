'use client';
import React, { ChangeEvent } from 'react';
import { ShortTextFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: ShortTextFieldDefinition;
  onChange: <K extends keyof ShortTextFieldDefinition>(key: K, value: ShortTextFieldDefinition[K]) => void;
}

const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  // Helper: update nested validatorsConfig.required checkbox
  const handleRequiredToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('validatorsConfig', {
      ...(fieldDef.validatorsConfig ?? {}),
      required: checked,
    } as ShortTextFieldDefinition['validatorsConfig']);
  };

  const handleCheckbox = (key: keyof ShortTextFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange(key, e.target.checked as never);

  const handleNumber = (key: keyof ShortTextFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : Number(e.target.value);
    onChange(key, val as never);
  };

  const handleText = (key: keyof ShortTextFieldDefinition) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => onChange(key, e.target.value as never);

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>

      {/* Required */}
      <div className="flex items-center mb-3">
        <input
          id="shorttext-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleRequiredToggle}
        />
        <label htmlFor="shorttext-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>

      {/* Placeholder */}
      <div className="mb-3">
        <label htmlFor="st-placeholder" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Placeholder
        </label>
        <input
          id="st-placeholder"
          type="text"
          value={fieldDef.placeholder ?? ''}
          onChange={handleText('placeholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Autocomplete */}
      <div className="mb-3">
        <label htmlFor="st-autocomplete" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Autocomplete
        </label>
        <select
          id="st-autocomplete"
          value={fieldDef.autocompleteAttr ?? 'off'}
          onChange={handleText('autocompleteAttr')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="off">Off</option>
          <option value="name">Name</option>
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="organization-title">Org Title</option>
        </select>
      </div>

      {/* Min length */}
      <div className="mb-3">
        <label htmlFor="st-minlength" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Min Length
        </label>
        <input
          id="st-minlength"
          type="number"
          value={fieldDef.minLength ?? ''}
          onChange={handleNumber('minLength')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Max length */}
      <div className="mb-3">
        <label htmlFor="st-maxlength" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Max Length
        </label>
        <input
          id="st-maxlength"
          type="number"
          value={fieldDef.maxLength ?? ''}
          onChange={handleNumber('maxLength')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Regex pattern */}
      <div className="mb-3">
        <label htmlFor="st-regex" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Regex Pattern
        </label>
        <input
          id="st-regex"
          type="text"
          placeholder="e.g. ^[A-Za-z]+$"
          value={fieldDef.regexPattern ?? ''}
          onChange={handleText('regexPattern')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Case-sensitive regex */}
      <div className="flex items-center mb-3">
        <input
          id="st-regex-case"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.regexCaseSensitive ?? false}
          onChange={handleCheckbox('regexCaseSensitive')}
        />
        <label htmlFor="st-regex-case" className="text-sm text-gray-700 font-medium">
          Case-sensitive regex
        </label>
      </div>
    </div>
  );
};

export default ValidationSettings; 