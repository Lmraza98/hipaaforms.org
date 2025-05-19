'use client';
import React, { ChangeEvent } from 'react';
import { SingleChoiceFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: SingleChoiceFieldDefinition;
  onChange: <K extends keyof SingleChoiceFieldDefinition>(key: K, value: SingleChoiceFieldDefinition[K]) => void;
}

/**
 * ValidationSettings – exposes the minimal validation controls for SingleChoice:
 * currently only the "Required" toggle.
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  // Update nested required flag inside validatorsConfig in an immutable way
  const handleRequired = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('validatorsConfig', {
      ...(fieldDef.validatorsConfig ?? {}),
      required: checked,
    } as SingleChoiceFieldDefinition['validatorsConfig']);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>
      <label className="flex items-center text-sm">
        <input
          type="checkbox"
          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleRequired}
        />
        Required
      </label>
    </div>
  );
};

export default ValidationSettings; 