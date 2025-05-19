'use client';
import React, { ChangeEvent } from 'react';
import { NumberFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: NumberFieldDefinition;
  /** Callback mirroring usePropertyChanger – change(key, value) */
  onChange: <K extends keyof NumberFieldDefinition>(key: K, value: NumberFieldDefinition[K]) => void;
}

/**
 * ValidationSettings – exposes Number-specific validation controls (currently
 * only the *Required* checkbox). Min/Max, step, etc. live in the main settings
 * panel as they are more about field behaviour than validation rules.
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  const handleRequired = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('validatorsConfig', {
      ...(fieldDef.validatorsConfig ?? {}),
      required: checked,
    } as NumberFieldDefinition['validatorsConfig']);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>

      {/* Required checkbox */}
      <div className="flex items-center mb-3">
        <input
          id="number-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleRequired}
        />
        <label htmlFor="number-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>
    </div>
  );
};

export default ValidationSettings; 