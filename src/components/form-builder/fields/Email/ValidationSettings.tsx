import React, { ChangeEvent } from 'react';
import { EmailFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: EmailFieldDefinition;
  /**
   * Callback mirroring usePropertyChanger – change(key, value)
   */
  onChange: <K extends keyof EmailFieldDefinition>(key: K, value: EmailFieldDefinition[K]) => void;
}

/**
 * ValidationSettings – exposes Email-specific validation controls:
 *  • required checkbox
 *  • allowed domains (comma-separated list)
 *  • autocomplete attribute selector
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  // Generic helpers --------

  const handleCheckbox = (nestedRequired: boolean) => (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (nestedRequired) {
      onChange('validatorsConfig', {
        ...(fieldDef.validatorsConfig ?? {}),
        required: checked,
      } as EmailFieldDefinition['validatorsConfig']);
    }
  };

  const handleSelect = (key: keyof EmailFieldDefinition) => (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(key as keyof EmailFieldDefinition, e.target.value as never);
  };

  const allowedDomainsValue = (fieldDef.allowedDomains ?? []).join(', ');

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation</h4>

      {/* Required */}
      <div className="flex items-center mb-3">
        <input
          id="email-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleCheckbox(true)}
        />
        <label htmlFor="email-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>

      {/* Allowed Domains */}
      <div className="mb-3">
        <label htmlFor="allowed-domains" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Allowed Domains (comma-separated)
        </label>
        <input
          id="allowed-domains"
          type="text"
          placeholder="acme.com, example.org"
          value={allowedDomainsValue}
          onChange={(e) => {
            const list = e.target.value
              .split(',')
              .map((d) => d.trim())
              .filter(Boolean);
            onChange('allowedDomains', list.length > 0 ? list : undefined);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        />
      </div>

      {/* Autocomplete */}
      <div className="mb-3">
        <label htmlFor="autocomplete" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Autocomplete Attribute
        </label>
        <select
          id="autocomplete"
          value={fieldDef.autocompleteAttr ?? 'email'}
          onChange={handleSelect('autocompleteAttr')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="email">email</option>
          <option value="username">username</option>
          <option value="off">off</option>
        </select>
      </div>
    </div>
  );
};

export default ValidationSettings; 