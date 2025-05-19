'use client';
import React, { ChangeEvent } from 'react';
import { MultiChoiceFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: MultiChoiceFieldDefinition;
  onChange: <K extends keyof MultiChoiceFieldDefinition>(
    key: K,
    value: MultiChoiceFieldDefinition[K],
  ) => void;
}

/**
 * ValidationSettings – exposes basic validation controls for MultiChoice fields.
 * Currently only the "Required" toggle – min/max handled in the main Settings panel.
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  const handleRequired = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('validatorsConfig', {
      ...(fieldDef.validatorsConfig ?? {}),
      required: checked,
    } as MultiChoiceFieldDefinition['validatorsConfig']);
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