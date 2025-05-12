import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { DropdownFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../hooks/usePropertyChanger';

const getInputProps = (fieldDef: DropdownFieldDefinition, fieldApi?: AnyFieldApi) => {
  return fieldApi ? {
    id: fieldApi.name,
    name: fieldApi.name,
    value: fieldApi.state.value || '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => fieldApi.handleChange(e.target.value),
  } : {
    readOnly: true, // For palette, effectively
    value: '', // Default for palette preview
  };
};

export const Preview: React.FC<{
  fieldDef: DropdownFieldDefinition;
  fieldApi?: AnyFieldApi;
}> = ({ fieldDef, fieldApi }) => {
  const inputProps = getInputProps(fieldDef, fieldApi);
  const options = fieldDef.options || [];

  return (
    <select
      {...inputProps}
      multiple={fieldDef.allowMultiple}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export const Settings: React.FC<{
  fieldDef: DropdownFieldDefinition;
}> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleOptionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    change('options', e.target.value.split('\n'));
  };

  const handleAllowMultipleChange = (e: ChangeEvent<HTMLInputElement>) => {
    change('allowMultiple', e.target.checked);
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="dropdown-options" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Options (one per line):
        </label>
        <textarea
          id="dropdown-options"
          value={fieldDef.options?.join('\n') || ''}
          onChange={handleOptionsChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={!!fieldDef.allowMultiple}
            onChange={handleAllowMultipleChange}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Allow multiple selections
        </label>
      </div>
    </div>
  );
};

// Validators can be added if needed, e.g., ensuring a selection is made if required
export const getValidators = (fieldDef: DropdownFieldDefinition): { onChange?: ValidatorFn } => {
  if (fieldDef.validatorsConfig?.required) {
    return {
      onChange: (params: { value: unknown }) => {
        // For multi-select, params.value might be an array. For single, a string.
        const hasValue = Array.isArray(params.value) ? params.value.length > 0 : (params.value !== '' && params.value !== null && params.value !== undefined);
        if (!hasValue) {
          return `${fieldDef.label} is required.`;
        }
        return undefined;
      }
    };
  }
  return {};
};

export const mapToSchemaType = (fieldDef: DropdownFieldDefinition): string => fieldDef.allowMultiple ? 'multiselect' : 'select'; 