'use client';

import React from 'react';
import { SignatureFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ColorSelector from '../../ui/ColorSelector';

export const Settings: React.FC<{ fieldDef: SignatureFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleNumberInput = (key: keyof SignatureFieldDefinition) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      change(key, Number(e.target.value));

  const handleSelect = (key: keyof SignatureFieldDefinition) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      change(key, e.target.value as never);

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      <h4 className="text-sm font-semibold mb-2 text-gray-800">Signature Options</h4>

      {/* Canvas height */}
      <div className="mb-3">
        <label className="block mb-1.5 font-medium text-gray-700 text-sm">Canvas Height (px)</label>
        <input
          type="number"
          value={fieldDef.canvasHeight ?? 160}
          onChange={handleNumberInput('canvasHeight')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Stroke width */}
      <div className="mb-3">
        <label className="block mb-1.5 font-medium text-gray-700 text-sm">Stroke Width (px)</label>
        <input
          type="number"
          value={fieldDef.strokeWidth ?? 2}
          onChange={handleNumberInput('strokeWidth')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Stroke color */}
      <ColorSelector
        label="Stroke Color"
        value={fieldDef.strokeColor ?? '#000000'}
        onChange={(hex) => change('strokeColor', hex)}
        className="mb-3"
      />

      {/* Background color */}
      <ColorSelector
        label="Background Color"
        value={fieldDef.backgroundColor ?? '#ffffff'}
        onChange={(hex) => change('backgroundColor', hex)}
        className="mb-3"
      />

      {/* Export format */}
      <div className="mb-3">
        <label className="block mb-1.5 font-medium text-gray-700 text-sm">Export Format</label>
        <select
          value={fieldDef.exportFormat ?? 'png'}
          onChange={handleSelect('exportFormat')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>
    </div>
  );
};
