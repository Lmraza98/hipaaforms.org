'use client';
import React, { ChangeEvent } from 'react';
import { LongTextFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: LongTextFieldDefinition;
  onChange: <K extends keyof LongTextFieldDefinition>(key: K, value: LongTextFieldDefinition[K]) => void;
}

const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  // Toggle for validatorsConfig.required
  const handleRequiredToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('validatorsConfig', {
      ...(fieldDef.validatorsConfig ?? {}),
      required: checked,
    } as LongTextFieldDefinition['validatorsConfig']);
  };

  const handleCheckbox = (key: keyof LongTextFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange(key, e.target.checked as never);

  const handleNumber = (key: keyof LongTextFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : Number(e.target.value);
    onChange(key, val as never);
  };

  const handleText = (key: keyof LongTextFieldDefinition) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => onChange(key, e.target.value as never);

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>

      {/* Required */}
      <div className="flex items-center mb-3">
        <input
          id="lt-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleRequiredToggle}
        />
        <label htmlFor="lt-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>

      {/* Placeholder */}
      <div className="mb-3">
        <label htmlFor="lt-placeholder" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Placeholder
        </label>
        <input
          id="lt-placeholder"
          type="text"
          value={fieldDef.placeholder ?? ''}
          onChange={handleText('placeholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Rows */}
      <div className="mb-3">
        <label htmlFor="lt-rows" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Rows
        </label>
        <input
          id="lt-rows"
          type="number"
          min={1}
          value={fieldDef.rows ?? 3}
          onChange={handleNumber('rows')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Autocomplete */}
      <div className="mb-3">
        <label htmlFor="lt-autocomplete" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Autocomplete
        </label>
        <select
          id="lt-autocomplete"
          value={fieldDef.autocompleteAttr ?? 'off'}
          onChange={handleText('autocompleteAttr')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="off">Off</option>
          <option value="on">On</option>
          <option value="street-address">Street address</option>
        </select>
      </div>

      {/* Min length */}
      <div className="mb-3">
        <label htmlFor="lt-minlength" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Min Length
        </label>
        <input
          id="lt-minlength"
          type="number"
          value={fieldDef.minLength ?? ''}
          onChange={handleNumber('minLength')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Max length */}
      <div className="mb-3">
        <label htmlFor="lt-maxlength" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Max Length
        </label>
        <input
          id="lt-maxlength"
          type="number"
          value={fieldDef.maxLength ?? ''}
          onChange={handleNumber('maxLength')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Regex pattern */}
      <div className="mb-3">
        <label htmlFor="lt-regex" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Regex Pattern
        </label>
        <input
          id="lt-regex"
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
          id="lt-regex-case"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.regexCaseSensitive ?? false}
          onChange={handleCheckbox('regexCaseSensitive')}
        />
        <label htmlFor="lt-regex-case" className="text-sm text-gray-700 font-medium">
          Case-sensitive regex
        </label>
      </div>
    </div>
  );
};

export default ValidationSettings; 