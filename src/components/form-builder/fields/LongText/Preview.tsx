'use client';
import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { LongTextFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

/**
 * Ensure IDs / names do not include dots – certain browsers treat dots as
 * namespace separators which breaks native autocomplete predictions.
 */
const sanitizeName = (val: string) => val.replace(/\./g, '_');

/**
 * Creates the props object for the <textarea> element.  Works for both the
 * design-time palette preview (no fieldApi) and the live runtime (with fieldApi).
 */
const getTextareaProps = (fieldDef: LongTextFieldDefinition, fieldApi?: AnyFieldApi) => {
  if (!fieldApi) {
    return {
      id: sanitizeName(fieldDef.id),
      name: sanitizeName(fieldDef.id),
      defaultValue: '',
      readOnly: true,
      placeholder: fieldDef.placeholder,
      autoComplete: fieldDef.autocompleteAttr ?? 'off',
    } as const;
  }

  return {
    id: sanitizeName(fieldApi.name),
    name: sanitizeName(fieldApi.name),
    value: (fieldApi.state.value as string) ?? '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => fieldApi.handleChange(e.target.value),
    autoComplete: fieldDef.autocompleteAttr ?? 'off',
  } as const;
};

interface LongTextPreviewProps {
  fieldDef: LongTextFieldDefinition;
  fieldApi?: AnyFieldApi;
  /** When true the label becomes non-editable – used in final form runtime. */
  isPreviewMode?: boolean;
}

export const Preview: React.FC<LongTextPreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const editable = !isPreviewMode;

  // Text-related Tailwind utilities derived from style props
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseTextareaClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900';

  const widthClass = fieldDef.width ?? 'w-full';

  const textareaProps = getTextareaProps(fieldDef, fieldApi);

  const rows = fieldDef.rows ?? 3;

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      <label
        ref={labelRef}
        htmlFor={textareaProps.id}
        className={`block mb-1 font-medium ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={editable ? saveLabel : undefined}
      />

      <textarea
        rows={rows}
        {...textareaProps}
        className={`${baseTextareaClasses} ${twText} ${widthClass}`}
        placeholder={fieldDef.placeholder || 'Long answer'}
        style={twInline}
      />
    </div>
  );
};

// ------------------- Validators / schema helpers -----------------

export const getValidators = (fieldDef: LongTextFieldDefinition): { onChange?: ValidatorFn } => {
  const { validatorsConfig, minLength, maxLength, regexPattern, regexCaseSensitive } = fieldDef;

  if (!validatorsConfig?.required && !minLength && !maxLength && !regexPattern) {
    return {};
  }

  return {
    onChange: ({ value }) => {
      const str = (value ?? '') as string;

      if (validatorsConfig?.required && !str.trim()) {
        return `${fieldDef.label} is required.`;
      }
      if (minLength !== undefined && str.length < minLength) {
        return `Must be at least ${minLength} characters.`;
      }
      if (maxLength !== undefined && str.length > maxLength) {
        return `Must be at most ${maxLength} characters.`;
      }
      if (regexPattern) {
        try {
          const re = new RegExp(regexPattern, regexCaseSensitive ? '' : 'i');
          if (!re.test(str)) return 'Does not match required pattern.';
        } catch {
          /* invalid regex – silently ignore */
        }
      }
      return undefined;
    },
  };
};

export const mapToSchemaType = (): string => 'textarea';
