'use client';
import React from 'react';
import { SubmitButtonFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';

export const Settings: React.FC<{ fieldDef: SubmitButtonFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleSelect = (key: keyof SubmitButtonFieldDefinition) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      change(key as never, (e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value) as never);

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} hideLabel />
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      {/* Button text */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Button Text</h4>
        <input
          type="text"
          value={fieldDef.buttonText ?? ''}
          onChange={(e) => change('buttonText', e.target.value)}
          placeholder="Submit"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Variant */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Variant</h4>
        <select
          value={fieldDef.variant ?? 'primary'}
          onChange={handleSelect('variant')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
          <option value="link">Link</option>
        </select>
      </div>

      {/* Size */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Size</h4>
        <select
          value={fieldDef.size ?? 'md'}
          onChange={handleSelect('size')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      {/* Width */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Width</h4>
        <select
          value={fieldDef.width ?? 'full'}
          onChange={handleSelect('width')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="full">Full</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      {/* Disabled checkbox */}
      <div>
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={fieldDef.isDisabled ?? false}
            onChange={handleSelect('isDisabled')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Disabled
        </label>
      </div>

      {/* Custom classes */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Custom Tailwind Classes (optional)</h4>
        <input
          type="text"
          value={fieldDef.customClasses ?? ''}
          onChange={(e) => change('customClasses', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>
    </div>
  );
};
