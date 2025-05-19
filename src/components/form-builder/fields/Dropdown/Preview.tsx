'use client';
import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { DropdownFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

/**
 * Build unified props for <select> that work for both palette preview (no fieldApi)
 * and runtime rendering (with fieldApi).
 */
const getInputProps = (
  fieldDef: DropdownFieldDefinition,
  fieldApi?: AnyFieldApi,
) => {
  // Palette preview → read-only, no event handlers
  if (!fieldApi) {
    return {
      id: fieldDef.id,
      name: fieldDef.id,
      multiple: fieldDef.allowMultiple ?? false,
      autoComplete: fieldDef.autocompleteAttr ?? 'off',
      readOnly: true,
      value: fieldDef.allowMultiple ? [] : '',
    } as const;
  }

  const isMulti = !!fieldDef.allowMultiple;
  const curVal = fieldApi.state.value ?? (isMulti ? [] : '');

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (isMulti) {
      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
      fieldApi.handleChange(selected);
    } else {
      fieldApi.handleChange(e.target.value);
    }
  };

  return {
    id: fieldApi.name,
    name: fieldApi.name,
    multiple: isMulti,
    autoComplete: fieldDef.autocompleteAttr ?? 'off',
    value: curVal,
    onBlur: fieldApi.handleBlur,
    onChange: handleChange,
  } as const;
};

interface DropdownPreviewProps {
  fieldDef: DropdownFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean; // provided by Canvas to disable in-place editing when true
}

export const Preview: React.FC<DropdownPreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );
  
  const fallbackColorClass = !fieldDef.textColor ? 'text-gray-700' : '';

  const editable = !isPreviewMode;

  // Convert style props to Tailwind utilities & optional inline colour
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const widthClass = fieldDef.width ?? 'w-full';

  const baseClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900';

  const inputProps = getInputProps(fieldDef, fieldApi);
  const options = fieldDef.options ?? [];
  const hasPlaceholder = !fieldDef.allowMultiple && fieldDef.placeholder;

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      {/* Editable label */}
      <label
        ref={labelRef}
        htmlFor={inputProps.id}
        className={`block mb-1 font-medium ${fallbackColorClass} ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={editable ? saveLabel : undefined}
      />

      {/* Select */}
      <select
        {...inputProps}
        className={`${baseClasses} ${fallbackColorClass} ${twText} ${widthClass}`}
        style={twInline}
      >
        {hasPlaceholder && (
          <option value="" disabled>
            {fieldDef.placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>

      {/* Hidden text input for custom tags – real UX handled in settings panel */}
      {fieldDef.allowCustom && <input type="text" className="sr-only" aria-hidden="true" />}
    </div>
  );
};

// ---------------- Validators & schema helpers ----------------
export const getValidators = (
  fieldDef: DropdownFieldDefinition,
): { onChange?: ValidatorFn } => {
  const req = fieldDef.validatorsConfig?.required;
  const min = fieldDef.minSelections;
  const max = fieldDef.maxSelections;

  if (!req && min === undefined && max === undefined) return {};

  return {
    onChange: ({ value }) => {
      const arr = fieldDef.allowMultiple ? ((value as string[]) ?? []) : [value as string];

      if (req && arr.length === 0) {
        return `${fieldDef.label} is required.`;
      }
      if (min !== undefined && arr.length < min) {
        return `Select at least ${min}.`;
      }
      if (max !== undefined && arr.length > max) {
        return `Select at most ${max}.`;
      }
      return undefined;
    },
  };
};

export const mapToSchemaType = (fieldDef: DropdownFieldDefinition): string =>
  fieldDef.allowMultiple ? 'multiselect' : 'select';
