'use client';
import React, { ChangeEvent } from 'react';
import { DropdownFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: DropdownFieldDefinition;
  onChange: <K extends keyof DropdownFieldDefinition>(key: K, value: DropdownFieldDefinition[K]) => void;
}

const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  const handleRequiredToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('validatorsConfig', {
      ...(fieldDef.validatorsConfig ?? {}),
      required: checked,
    } as DropdownFieldDefinition['validatorsConfig']);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>
      <div className="flex items-center mb-3">
        <input
          id="dropdown-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleRequiredToggle}
        />
        <label htmlFor="dropdown-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>
    </div>
  );
};

export default ValidationSettings; 