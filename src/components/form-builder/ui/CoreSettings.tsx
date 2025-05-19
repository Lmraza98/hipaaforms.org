'use client';
import React, { ChangeEvent } from 'react';

/**
 * CoreSettings is a small reusable panel that exposes the most common text
 * configuration inputs shared by a variety of field types: label, subheading
 * and visibilityCondition.
 *
 * It purposely stays **dumb** – all state is lifted up to the parent via the
 * provided onChange callback.
 */
type CoreFieldShape = {
  label: string;
  subheading?: string;
  visibilityCondition?: string;
};

export interface CoreSettingsProps<T extends CoreFieldShape> {
  fieldDef: T;
  /**
   * Callback used to update the field definition.
   * Mirrors the signature of usePropertyChanger → change(key, value).
   */
  onChange: <K extends keyof T>(key: K, value: T[K]) => void;

  /**
   * When true, the "Label" input section is hidden. Useful for field types
   * whose primary text is not the `label` prop (e.g. paragraphs, images).
   */
  hideLabel?: boolean;
}

function CoreSettings<T extends CoreFieldShape>({
  fieldDef,
  onChange,
  hideLabel = false,
}: CoreSettingsProps<T>) {
  // Generic change handler factory
  const handleInput = <K extends keyof T>(key: K) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = (e.target as HTMLInputElement).value as T[K];
    onChange(key, value);
  };

  return (
    <div className="space-y-4">
      {/* 1. Label */}
      {!hideLabel && (
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-800">General</h4>
          <div className="mb-3">
            <label
              htmlFor="field-label"
              className="block mb-1.5 font-medium text-gray-700 text-sm"
            >
              Label:
            </label>
            <input
              id="field-label"
              type="text"
              value={fieldDef.label as string}
              onChange={handleInput('label' as keyof T)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>
          {/* Subheading – optional */}
          {'subheading' in fieldDef && (
            <div className="mb-3">
              <label
                htmlFor="field-subheading"
                className="block mb-1.5 font-medium text-gray-700 text-sm"
              >
                Subheading (optional):
              </label>
              <input
                id="field-subheading"
                type="text"
                value={(fieldDef.subheading as string) ?? ''}
                onChange={handleInput('subheading' as keyof T)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                placeholder="Add a subheading"
              />
            </div>
          )}
        </div>
      )}

      {/* 2. Visibility Condition */}
      {'visibilityCondition' in fieldDef && (
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-800">
            Visibility
          </h4>
          <label
            htmlFor="visibility-condition"
            className="block mb-1.5 font-medium text-gray-700 text-sm"
          >
            Conditional Display Rules (optional):
          </label>
          <textarea
            id="visibility-condition"
            value={(fieldDef.visibilityCondition as string) ?? ''}
            onChange={handleInput('visibilityCondition' as keyof T)}
            rows={2}
            placeholder="e.g. form.age > 18"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          />
        </div>
      )}
    </div>
  );
}

export default CoreSettings; 