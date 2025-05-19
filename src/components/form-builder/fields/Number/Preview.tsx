'use client';
import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { NumberFieldDefinition } from '@/components/form-builder/types';
import { stylePropsToTw } from '@/utils/tw';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';

/**
 * Converts the raw string emitted by <input type="number"> into the correct
 * numeric representation respecting allowDecimals flag. Empty string ⇒ undefined.
 */
const parseNumberInput = (raw: string, allowDecimals?: boolean): number | undefined => {
  if (raw === '') return undefined;
  const parsed = allowDecimals ? parseFloat(raw) : parseInt(raw, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const getInputProps = (fieldDef: NumberFieldDefinition, fieldApi?: AnyFieldApi) => {
  if (!fieldApi) {
    return {
      id: fieldDef.id,
      name: fieldDef.id,
      defaultValue: '',
      readOnly: true,
      placeholder: fieldDef.placeholder,
      autoComplete: fieldDef.autocompleteAttr ?? 'off',
    } as const;
  }

  return {
    id: fieldApi.name,
    name: fieldApi.name,
    value: fieldApi.state.value ?? '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      fieldApi.handleChange(parseNumberInput(e.target.value, fieldDef.allowDecimals)),
    autoComplete: fieldDef.autocompleteAttr ?? 'off',
  } as const;
};

interface NumberPreviewProps {
  fieldDef: NumberFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<NumberPreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const editable = !isPreviewMode;

  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseInputClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900';

  const widthClass = fieldDef.width ?? 'w-full';

  const inputProps = getInputProps(fieldDef, fieldApi);

  const stepAttr = fieldDef.step ?? (fieldDef.allowDecimals ? 'any' : 1);

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      <label
        ref={labelRef}
        htmlFor={inputProps.id}
        className={`block mb-1 font-medium ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={editable ? saveLabel : undefined}
      />

      <input
        type="number"
        {...inputProps}
        min={fieldDef.min}
        max={fieldDef.max}
        step={stepAttr}
        className={`${baseInputClasses} ${twText} ${widthClass}`}
        placeholder={fieldDef.placeholder}
        style={twInline}
      />
    </div>
  );
};

// ---------------- Validators & schema helpers ------------------

import type { ValidatorFn } from '@/components/form-builder/types';

export const getValidators = (fieldDef: NumberFieldDefinition): { onChange?: ValidatorFn } => {
  const req = fieldDef.validatorsConfig?.required;
  const { min, max } = fieldDef;
  if (!req && min === undefined && max === undefined) return {};

  return {
    onChange: ({ value }) => {
      if (req && (value === undefined || value === null || value === '')) {
        return `${fieldDef.label} is required.`;
      }
      if (value === undefined || value === '') return undefined;
      const num = Number(value);
      if (Number.isNaN(num)) return 'Must be a number.';
      if (min !== undefined && num < min) return `Must be at least ${min}.`;
      if (max !== undefined && num > max) return `Must be at most ${max}.`;
      return undefined;
    },
  };
};

export const mapToSchemaType = (): string => 'number';
