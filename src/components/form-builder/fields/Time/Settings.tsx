'use client';
import React, { ChangeEvent } from 'react';
import { TimeFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ValidationSettings from './ValidationSettings';

export const Settings: React.FC<{ fieldDef: TimeFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  // Generic handler creators
  const handleInput = (key: keyof TimeFieldDefinition) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const val = e.target.value as TimeFieldDefinition[typeof key];
    change(key, val);
  };

  // Number inputs need special treatment (empty → undefined, else number)
  const handleNumber = (key: keyof TimeFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    change(key, v === '' ? undefined : (Number(v) as never));
  };

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />

      <ValidationSettings fieldDef={fieldDef} onChange={change} />

      {/* Custom Time Options */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Time Options</h4>

        {/* Placeholder */}
        <div className="mb-3">
          <label htmlFor="time-placeholder" className="block text-sm font-medium mb-1 text-gray-700">
            Placeholder
          </label>
          <input
            id="time-placeholder"
            type="text"
            value={fieldDef.placeholder ?? ''}
            onChange={handleInput('placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Min / Max Time */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Min Time (HH:MM)</label>
            <input
              type="time"
              value={fieldDef.minTime ?? ''}
              onChange={(e) => change('minTime', e.target.value || undefined)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Max Time (HH:MM)</label>
            <input
              type="time"
              value={fieldDef.maxTime ?? ''}
              onChange={(e) => change('maxTime', e.target.value || undefined)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Step */}
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1 text-gray-700">Step (minutes)</label>
          <input
            type="number"
            min={1}
            value={fieldDef.stepMinutes ?? 1}
            onChange={handleNumber('stepMinutes')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Format selector */}
        <div className="mt-3">
          <label className="block text-sm font-medium mb-1 text-gray-700">Format Hint</label>
          <select
            value={fieldDef.format ?? '24h'}
            onChange={handleInput('format')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">24-hour</option>
            <option value="12h">12-hour</option>
          </select>
        </div>

        {/* Autocomplete */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Autocomplete</label>
          <select
            value={fieldDef.autocompleteAttr ?? 'off'}
            onChange={handleInput('autocompleteAttr')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="off">Off</option>
            <option value="bday">Birthdate (month & day)</option>
            <option value="birthdate">Birthdate (full)</option>
          </select>
        </div>
      </div>

      <StyleSettings fieldDef={fieldDef} onChange={change} />
    </div>
  );
};
