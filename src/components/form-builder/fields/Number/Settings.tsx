'use client';
import React, { ChangeEvent } from 'react';
import { NumberFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ValidationSettings from './ValidationSettings';

export const Settings: React.FC<{ fieldDef: NumberFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  // Generic helpers
  const handleNumber = (key: keyof NumberFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : Number(e.target.value);
    change(key as keyof NumberFieldDefinition, val as never);
  };

  const handleText = (key: keyof NumberFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    change(key as keyof NumberFieldDefinition, e.target.value as never);
  };

  const handleCheckbox = (key: keyof NumberFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    change(key as keyof NumberFieldDefinition, e.target.checked as never);
  };

  const handleSelect = (key: keyof NumberFieldDefinition) => (e: ChangeEvent<HTMLSelectElement>) => {
    change(key as keyof NumberFieldDefinition, e.target.value as never);
  };

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />

      {/* Number specific options */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Number Options</h4>

        {/* Placeholder */}
        <label className="block text-sm font-medium mb-1 text-gray-700">Placeholder</label>
        <input
          type="text"
          value={fieldDef.placeholder ?? ''}
          onChange={handleText('placeholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />

        {/* Min / Max */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Min</label>
            <input
              type="number"
              value={fieldDef.min ?? ''}
              onChange={handleNumber('min')}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Max</label>
            <input
              type="number"
              value={fieldDef.max ?? ''}
              onChange={handleNumber('max')}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Step */}
        <label className="block text-sm font-medium mt-3 mb-1 text-gray-700">Step</label>
        <input
          type="number"
          min={0.01}
          step="any"
          value={fieldDef.step ?? ''}
          onChange={handleNumber('step')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />

        {/* Allow decimals */}
        <label className="flex items-center mt-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={fieldDef.allowDecimals ?? false}
            onChange={handleCheckbox('allowDecimals')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Allow decimals
        </label>

        {/* Autocomplete */}
        <label className="block text-sm font-medium mt-4 mb-1 text-gray-700">Autocomplete</label>
        <select
          value={fieldDef.autocompleteAttr ?? 'off'}
          onChange={handleSelect('autocompleteAttr')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="off">Off</option>
          <option value="cc-number">Credit Card Number</option>
          <option value="tel-national">Telephone (national)</option>
        </select>
      </div>

      <ValidationSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />
    </div>
  );
};
