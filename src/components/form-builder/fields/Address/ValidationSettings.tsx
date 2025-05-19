'use client';
import React, { ChangeEvent } from 'react';
import { AddressFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: AddressFieldDefinition;
  onChange: <K extends keyof AddressFieldDefinition>(key: K, value: AddressFieldDefinition[K]) => void;
}

/**
 * ValidationSettings – controls for Address field: required, layout, ZIP validation, placeholders.
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  const layout: NonNullable<AddressFieldDefinition['addressLayout']> = fieldDef.addressLayout ?? 'single';

  // Generic helpers
  const handleCheckbox = (key: keyof AddressFieldDefinition, nested?: boolean) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      if (nested && key === 'validatorsConfig') {
        // For required toggle inside validatorsConfig
        onChange('validatorsConfig', {
          ...(fieldDef.validatorsConfig ?? {}),
          required: checked,
        } as AddressFieldDefinition['validatorsConfig']);
      } else {
        onChange(key as keyof AddressFieldDefinition, checked as never);
      }
    };

  const handleText = (key: keyof AddressFieldDefinition) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value as AddressFieldDefinition[typeof key];
      onChange(key, val as never);
    };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>

      {/* Required */}
      <div className="flex items-center mb-3">
        <input
          id="address-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleCheckbox('validatorsConfig', true)}
        />
        <label htmlFor="address-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>

      {/* Layout selection */}
      <div className="mb-3">
        <label htmlFor="address-layout" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Layout
        </label>
        <select
          id="address-layout"
          value={layout}
          onChange={handleText('addressLayout')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="single">Single – Street Address</option>
          <option value="split">Split – Street, City, State, ZIP</option>
        </select>
      </div>

      {/* ZIP Pattern */}
      <div className="mb-3">
        <label htmlFor="zip-pattern" className="block mb-1.5 font-medium text-gray-700 text-sm">
          ZIP / Postal Code Pattern
        </label>
        <select
          id="zip-pattern"
          value={fieldDef.zipPattern ?? 'US'}
          onChange={handleText('zipPattern')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="US">US</option>
          <option value="CA">Canada</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Custom ZIP regex */}
      {fieldDef.zipPattern === 'custom' && (
        <div className="mb-3">
          <label htmlFor="custom-zip" className="block mb-1.5 font-medium text-gray-700 text-sm">
            Custom ZIP Regex
          </label>
          <input
            id="custom-zip"
            type="text"
            placeholder="e.g. ^[0-9]{4}$"
            value={fieldDef.customZipRegex ?? ''}
            onChange={handleText('customZipRegex')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          />
        </div>
      )}

      {/* Placeholders (split only) */}
      {layout === 'split' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Street placeholder */}
          <div className="sm:col-span-2">
            <label className="block mb-1.5 font-medium text-gray-700 text-sm" htmlFor="street-ph">
              Street Placeholder
            </label>
            <input
              id="street-ph"
              type="text"
              value={fieldDef.streetPlaceholder ?? ''}
              onChange={handleText('streetPlaceholder')}
              placeholder="Street Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>

          {/* City placeholder */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm" htmlFor="city-ph">
              City Placeholder
            </label>
            <input
              id="city-ph"
              type="text"
              value={fieldDef.cityPlaceholder ?? ''}
              onChange={handleText('cityPlaceholder')}
              placeholder="City"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>

          {/* State placeholder */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm" htmlFor="state-ph">
              State Placeholder
            </label>
            <input
              id="state-ph"
              type="text"
              value={fieldDef.statePlaceholder ?? ''}
              onChange={handleText('statePlaceholder')}
              placeholder="State"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>

          {/* ZIP placeholder */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm" htmlFor="zip-ph">
              ZIP Placeholder
            </label>
            <input
              id="zip-ph"
              type="text"
              value={fieldDef.zipPlaceholder ?? ''}
              onChange={handleText('zipPlaceholder')}
              placeholder="ZIP Code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationSettings; 