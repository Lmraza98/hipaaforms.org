import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { DropdownFieldDefinition, ValidatorFn } from '@/components/form-builder/types'; 

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

const commonInputClasses = "w-full px-3 py-2 rounded  text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

export const Preview: React.FC<{ fieldDef: DropdownFieldDefinition; fieldApi?: AnyFieldApi }> = ({ fieldDef, fieldApi }) => {
  return (
    <select {...getInputProps(fieldDef, fieldApi)} className={commonInputClasses} multiple={fieldDef.allowMultiple}>
      <option value="" disabled={!!fieldApi} >{fieldDef.placeholder || 'Select an option'}</option>
      {fieldDef.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
};

export const Settings: React.FC<{
  fieldDef: DropdownFieldDefinition;
  onPropertyChange: (property: keyof DropdownFieldDefinition, value: unknown) => void;
}> = ({ fieldDef, onPropertyChange }) => {
  const handleOptionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onPropertyChange('options', e.target.value.split('\n'));
  };

  // Example for allowMultiple
  const handleAllowMultipleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPropertyChange('allowMultiple', e.target.checked);
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
          className={commonInputClasses}
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