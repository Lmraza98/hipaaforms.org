'use client';

import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { EmailFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { stylePropsToTw } from '@/utils/tw';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';

// -------------- helpers -----------------

const getInputProps = (fieldDef: EmailFieldDefinition, fieldApi?: AnyFieldApi) => {
  const autoComplete = fieldDef.autocompleteAttr ?? 'email';

  if (fieldApi) {
    // Strip dots so Chrome recognises autofill token
    const token = fieldApi.name.replace(/\./g, '');
    return {
      id: token,
      name: token,
      autoComplete,
      value: fieldApi.state.value || '',
      onBlur: fieldApi.handleBlur,
      onChange: (e: ChangeEvent<HTMLInputElement>) => fieldApi.handleChange(e.target.value),
    } as const;
  }

  return {
    readOnly: true,
    autoComplete,
    placeholder: fieldDef.placeholder,
    value: '',
  } as const;
};

// -------------- component -----------------

interface EmailPreviewProps {
  fieldDef: EmailFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<EmailPreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseInputClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900';

  const widthClass = fieldDef.width ?? 'w-full';

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      <label
        ref={labelRef}
        htmlFor={fieldApi ? fieldApi.name.replace(/\./g, '') : undefined}
        className={`block mb-1 font-medium ${twText} ${!isPreviewMode ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={!isPreviewMode}
        suppressContentEditableWarning
        onBlur={!isPreviewMode ? saveLabel : undefined}
      />

      <input
        type="email"
        {...getInputProps(fieldDef, fieldApi)}
        className={`${baseInputClasses} ${twText} ${widthClass}`}
        placeholder={fieldDef.placeholder}
        style={twInline}
      />
    </div>
  );
};

// -------------- validators -----------------

export const getValidators = (
  fieldDef: EmailFieldDefinition,
): { onChange?: ValidatorFn } => {
  const { validatorsConfig, allowedDomains } = fieldDef;

  const baseEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return {
    onChange: ({ value }) => {
      const val = (value ?? '') as string;

      // Required
      if (validatorsConfig?.required && val.trim() === '') {
        return `${fieldDef.label} is required.`;
      }

      if (val.trim() === '') return undefined; // nothing else to check

      // Syntax
      if (!baseEmailRegex.test(val)) {
        return 'Must be a valid email address.';
      }

      // Allowed domains
      if (allowedDomains && allowedDomains.length > 0) {
        const domain = val.split('@')[1]?.toLowerCase();
        const permitted = allowedDomains.map((d) => d.toLowerCase());
        if (!domain || !permitted.includes(domain)) {
          return `Email must use one of: ${allowedDomains.join(', ')}`;
        }
      }

      return undefined;
    },
  };
};

// -------------- schema helper -------------

export const mapToSchemaType = (): string => 'email';
