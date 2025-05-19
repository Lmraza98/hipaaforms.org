'use client';
import React, { ChangeEvent } from 'react';
import { ImageFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';

export const Settings: React.FC<{ fieldDef: ImageFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleInput = (key: keyof ImageFieldDefinition) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    change(key, e.target.value as never);
  };

  return (
    <div className="space-y-4">
      {/* Core field props – hide label since images don't display it */}
      <CoreSettings fieldDef={fieldDef} onChange={change} hideLabel />

      {/* Tailwind-based style props */}
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      {/* Source & alt */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Image Source</h4>
        <label className="block text-sm font-medium mb-1 text-gray-700">Image URL</label>
        <input
          type="text"
          value={fieldDef.src ?? ''}
          onChange={handleInput('src')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        />

        <label className="block text-sm font-medium mt-3 mb-1 text-gray-700">Alt Text</label>
        <input
          type="text"
          value={fieldDef.alt ?? ''}
          onChange={handleInput('alt')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        />
      </div>

      {/* Display options */}
      <div>
        <h4 className="text-sm font-semibold mt-4 mb-2 text-gray-800">Display</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Width</label>
            <input
              type="text"
              placeholder="w-full"
              value={fieldDef.width ?? ''}
              onChange={handleInput('width')}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Height</label>
            <input
              type="text"
              placeholder="h-48"
              value={fieldDef.height ?? ''}
              onChange={handleInput('height')}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700"
            />
          </div>
        </div>

        <label className="block text-sm font-medium mt-3 mb-1 text-gray-700">Object Fit</label>
        <select
          value={fieldDef.fit ?? 'contain'}
          onChange={handleInput('fit')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
          <option value="scale-down">Scale-down</option>
        </select>

        <label className="block text-sm font-medium mt-3 mb-1 text-gray-700">Border Utility</label>
        <input
          type="text"
          placeholder="border border-gray-300"
          value={fieldDef.border ?? ''}
          onChange={handleInput('border')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        />

        <label className="block text-sm font-medium mt-3 mb-1 text-gray-700">Border Radius</label>
        <input
          type="text"
          placeholder="rounded-md"
          value={fieldDef.borderRadius ?? ''}
          onChange={handleInput('borderRadius')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
        />
      </div>
    </div>
  );
}; 