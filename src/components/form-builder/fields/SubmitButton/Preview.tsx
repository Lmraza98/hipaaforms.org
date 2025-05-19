'use client';
import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { SubmitButtonFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

interface SubmitButtonPreviewProps {
  fieldDef: SubmitButtonFieldDefinition;
  fieldApi?: AnyFieldApi; // not used – submit button has no form value
  /** When true, the label / text is not editable (live form runtime) */
  isPreviewMode?: boolean;
}

export const Preview: React.FC<SubmitButtonPreviewProps> = ({ fieldDef, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: textRef, handleBlur: saveText } = useEditableText<HTMLSpanElement>(
    fieldDef.buttonText || fieldDef.label,
    (newText) => change('buttonText', newText),
  );

  const editable = !isPreviewMode;

  // Tailwind utilities from generic style props (margin, padding, text color, ...)
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  /* --------------------------------- Variants -------------------------------- */
  const sizeCls = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[fieldDef.size ?? 'md'];

  const variantCls = {
    primary: 'bg-blue-600 text-gray-100 hover:bg-blue-700',
    secondary: 'bg-gray-600 text-gray-100 hover:bg-gray-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    link: 'text-blue-600 underline px-0 py-0',
  }[fieldDef.variant ?? 'primary'];

  const disabledCls = fieldDef.isDisabled ? 'opacity-50 cursor-not-allowed' : '';
  const widthCls = fieldDef.width === 'auto' ? 'w-auto' : 'w-full';
  const customCls = fieldDef.customClasses ?? '';

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthCls}`}> {/* wrapper to respect margin/padding props */}
      <button
        type="submit"
        disabled={fieldDef.isDisabled}
        style={twInline}
        className={[
          sizeCls,
          variantCls,
          widthCls,
          disabledCls,
          twText,
          customCls,
          'rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        ].filter(Boolean).join(' ')}
      >
        <span
          ref={textRef}
          contentEditable={editable}
          suppressContentEditableWarning
          onBlur={editable ? saveText : undefined}
          className={editable ? 'cursor-text outline-none' : ''}
        >
          {fieldDef.buttonText || fieldDef.label || 'Submit'}
        </span>
      </button>
    </div>
  );
};

// ------------------- Validators / schema helpers -----------------

export const getValidators = (): { onChange?: ValidatorFn } => {
  return {};
};

export const mapToSchemaType = (): string => 'submit';
