import React from 'react';
import { FillInTheBlankFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';

export const Settings: React.FC<{ fieldDef: FillInTheBlankFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleInput = (key: keyof FillInTheBlankFieldDefinition) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      change(key, e.target.value as never);

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />

      {/* Template */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Template</h4>
        <textarea
          value={fieldDef.label}
          onChange={handleInput('label')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          placeholder="The capital of France is ___ ."
        />
      </div>

      {/* Blank Settings */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Blank Settings</h4>
        <label className="block mb-1.5 font-medium text-gray-700 text-sm">Blank Marker</label>
        <input
          type="text"
          value={fieldDef.blankMarker ?? '___'}
          onChange={handleInput('blankMarker')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
      </div>

      {/* Answer Key */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Answer Key (optional)</h4>
        <p className="text-xs text-gray-500 mb-1">
          Provide comma-separated answers that correspond to each blank in order.
        </p>
        <input
          type="text"
          value={(fieldDef.answers ?? []).join(', ')}
          onChange={(e) =>
            change(
              'answers',
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            checked={fieldDef.caseSensitive ?? false}
            onChange={(e) => change('caseSensitive', e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-sm">Case-sensitive answers</span>
        </label>
      </div>
    </div>
  );
};
