'use client';
import React from 'react';
import { HeadingFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import StyleSettings from '../../ui/StyleSettings';
import CoreSettings from '../../ui/CoreSettings';

export const Settings: React.FC<{ fieldDef: HeadingFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  return (
    <div className="space-y-4">
      {/* Core text settings (label, subheading, visibility) */}
      <CoreSettings fieldDef={fieldDef} onChange={change} />

      {/* 1. Level */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Level</h4>
        <label
          htmlFor="heading-level"
          className="block mb-1.5 font-medium text-gray-700 text-sm"
        >
          Heading Level:
        </label>
        <select
          id="heading-level"
          value={fieldDef.level}
          onChange={(e) => change('level', e.target.value as HeadingFieldDefinition['level'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </div>

      {/* Styling */}
      <StyleSettings fieldDef={fieldDef} onChange={change} />
    </div>
  );
};
