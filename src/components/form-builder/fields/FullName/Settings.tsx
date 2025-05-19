'use client';
import React from 'react';
import { FullNameFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ValidationSettings from './ValidationSettings';

export const Settings: React.FC<{ fieldDef: FullNameFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const layout = fieldDef.nameLayout ?? 'single';

  const handleInput = (key: keyof FullNameFieldDefinition) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      change(key, e.target.value as never);

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />

      {/* Name layout selection */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Name Layout</h4>
        <select
          value={layout}
          onChange={handleInput('nameLayout')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="single">Single – Full Name</option>
          <option value="firstOnly">First Name Only</option>
          <option value="split">Split – First & Last</option>
        </select>
      </div>

      {layout !== 'single' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First placeholder */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm" htmlFor="first-placeholder">
              First Placeholder
            </label>
            <input
              id="first-placeholder"
              type="text"
              value={fieldDef.firstPlaceholder ?? ''}
              onChange={handleInput('firstPlaceholder')}
              placeholder="First Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>

          {/* Last placeholder (always shown even for firstOnly – user can ignore) */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm" htmlFor="last-placeholder">
              Last Placeholder
            </label>
            <input
              id="last-placeholder"
              type="text"
              value={fieldDef.lastPlaceholder ?? ''}
              onChange={handleInput('lastPlaceholder')}
              placeholder="Last Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>
        </div>
      )}

      <ValidationSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />
    </div>
  );
}; 