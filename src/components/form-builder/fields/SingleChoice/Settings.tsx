'use client';
import React from 'react';
import { SingleChoiceFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ValidationSettings from './ValidationSettings';

export const Settings: React.FC<{ fieldDef: SingleChoiceFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  // Orientation change handler
  const handleOrientationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    change('orientation', e.target.value as 'vertical' | 'horizontal');
  };

  // Options textarea handler – supports "value|Label" syntax line per option
  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const parsed = e.target.value
      .split('\n')
      .filter(Boolean) // remove empty lines
      .map((line) => {
        const [val, lbl] = line.split('|');
        return { value: val.trim(), label: lbl?.trim() };
      });
    change('options', parsed);
  };

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />
      <ValidationSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      {/* Options input */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Options</h4>
        <textarea
          rows={4}
          value={(fieldDef.options ?? [])
            .map((opt) => {
              if (typeof opt === 'string') return opt;
              return opt.label ? `${opt.value}|${opt.label}` : opt.value;
            })
            .join('\n')}
          onChange={handleOptionsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500">
          Use <code>value|Label</code> per line (Label optional).
        </p>
      </div>

      {/* Orientation */}
      <div>
        <label className="block mt-4 text-sm font-medium text-gray-700 mb-1">Orientation</label>
        <select
          value={fieldDef.orientation ?? 'vertical'}
          onChange={handleOrientationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </div>

      {/* Shuffle options */}
      <label className="flex items-center mt-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={fieldDef.shuffleOptions ?? false}
          onChange={(e) => change('shuffleOptions', e.target.checked)}
          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Randomize option order each load
      </label>

      {/* Autocomplete */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Autocomplete</label>
        <select
          value={fieldDef.autocompleteAttr ?? 'off'}
          onChange={(e) => change('autocompleteAttr', e.target.value as 'off' | 'sex' | 'honorific-prefix')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        >
          <option value="off">Off</option>
          <option value="sex">Sex</option>
          <option value="honorific-prefix">Honorific Prefix</option>
        </select>
      </div>
    </div>
  );
};
