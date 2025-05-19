import React, { ChangeEvent } from 'react';
import { TimeFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: TimeFieldDefinition;
  /** Mirrors usePropertyChanger signature – change(key, value) */
  onChange: <K extends keyof TimeFieldDefinition>(key: K, value: TimeFieldDefinition[K]) => void;
}

/**
 * ValidationSettings – exposes generic validation controls for Time input
 * (currently only the "required" flag as min/max validation is enforced
 * automatically by the browser and additional logic in getValidators).
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  // Handle checkbox
  const handleRequired = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('validatorsConfig', {
      ...(fieldDef.validatorsConfig ?? {}),
      required: checked,
    } as TimeFieldDefinition['validatorsConfig']);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>

      {/* Required */}
      <div className="flex items-center mb-3">
        <input
          id="time-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleRequired}
        />
        <label htmlFor="time-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>
    </div>
  );
};

export default ValidationSettings; 