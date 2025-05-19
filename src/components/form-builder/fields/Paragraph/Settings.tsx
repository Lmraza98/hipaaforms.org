'use client';
import React from 'react';
import { ParagraphFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';

export const Settings: React.FC<{ fieldDef: ParagraphFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  return (
    <div className="space-y-4">
      {/* General (hide label because paragraph uses content) */}
      <CoreSettings fieldDef={fieldDef} onChange={change} hideLabel />

      {/* Shared style-related properties */}
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      {/* Paragraph content */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="para-content">
          Paragraph Content
        </label>
        <textarea
          id="para-content"
          rows={4}
          value={fieldDef.content}
          onChange={(e) => change('content', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};
