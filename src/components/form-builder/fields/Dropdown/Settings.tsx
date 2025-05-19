'use client';
import React, { ChangeEvent } from 'react';
import { DropdownFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ValidationSettings from './ValidationSettings';

type Option = { value: string; label?: string };

export const Settings: React.FC<{ fieldDef: DropdownFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleOptionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const next: Option[] = e.target.value.split('\n').map((line) => {
      const [value, label] = line.split('|');
      return { value: value.trim(), label: label?.trim() } as Option;
    });
    change('options', next);
  };

  const handleCheckbox = (key: keyof DropdownFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) =>
    change(key, e.target.checked as never);

  const handleNumber = (key: keyof DropdownFieldDefinition) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    change(key, val as never);
  };

  const handleText = (key: keyof DropdownFieldDefinition) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => change(key, e.target.value as never);

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />
      <ValidationSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      {/* Options textarea */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Options</h4>
        <textarea
          rows={4}
          value={(fieldDef.options ?? [])
            .map((o) => (o.label ? `${o.value}|${o.label}` : o.value))
            .join('\n')}
          onChange={handleOptionsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use <code>value|Label</code> per line (Label optional).
        </p>
      </div>

      {/* Allow multiple */}
      <label className="flex items-center mt-2 text-sm">
        <input
          type="checkbox"
          checked={fieldDef.allowMultiple ?? false}
          onChange={handleCheckbox('allowMultiple')}
          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Allow multiple selections
      </label>

      {/* Min / max selections when multi-select */}
      {fieldDef.allowMultiple && (
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Min selections</label>
            <input
              type="number"
              min={0}
              value={fieldDef.minSelections ?? ''}
              onChange={handleNumber('minSelections')}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max selections</label>
            <input
              type="number"
              min={1}
              value={fieldDef.maxSelections ?? ''}
              onChange={handleNumber('maxSelections')}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      )}

      {/* Placeholder */}
      <div>
        <h4 className="text-sm font-semibold mt-4 mb-1 text-gray-800">Placeholder (single-select)</h4>
        <input
          type="text"
          value={fieldDef.placeholder ?? ''}
          onChange={handleText('placeholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Autocomplete */}
      <div>
        <h4 className="text-sm font-semibold mt-4 mb-1 text-gray-800">Autocomplete</h4>
        <select
          value={fieldDef.autocompleteAttr ?? 'off'}
          onChange={handleText('autocompleteAttr')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="off">Off</option>
          <option value="country">Country</option>
          <option value="bday-month">Birth Month</option>
        </select>
      </div>
    </div>
  );
};
