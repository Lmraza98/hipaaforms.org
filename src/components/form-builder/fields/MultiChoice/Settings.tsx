'use client';
import React from 'react';
import { MultiChoiceFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ValidationSettings from './ValidationSettings';

export const Settings: React.FC<{ fieldDef: MultiChoiceFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  // Handle textarea lines to option objects
  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const parsed = e.target.value
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [val, lbl] = line.split('|');
        return { value: val.trim(), label: lbl?.trim() };
      });
    change('options', parsed);
  };

  const handleOrientationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    change('orientation', e.target.value as 'vertical' | 'horizontal');
  };

  const handleMinSelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    change('minSelections', val ? parseInt(val, 10) : undefined);
  };

  const handleMaxSelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    change('maxSelections', val ? parseInt(val, 10) : undefined);
  };

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />
      <ValidationSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      {/* Options */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Options</h4>
        <textarea
          rows={4}
          value={(fieldDef.options ?? [])
            .map((o) => (o.label ? `${o.value}|${o.label}` : o.value))
            .join('\n')}
          onChange={handleOptionsChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500">
          Use <code>value|Label</code> per line (Label optional).
        </p>
      </div>

      {/* Orientation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Orientation</label>
        <select
          value={fieldDef.orientation ?? 'vertical'}
          onChange={handleOrientationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </div>

      {/* Shuffle */}
      <label className="flex items-center mt-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={fieldDef.shuffleOptions ?? false}
          onChange={(e) => change('shuffleOptions', e.target.checked)}
          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Randomize option order each load
      </label>

      {/* Min / Max selections */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min selections</label>
          <input
            type="number"
            min={0}
            value={fieldDef.minSelections ?? ''}
            onChange={handleMinSelChange}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max selections</label>
          <input
            type="number"
            min={1}
            value={fieldDef.maxSelections ?? ''}
            onChange={handleMaxSelChange}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}; 