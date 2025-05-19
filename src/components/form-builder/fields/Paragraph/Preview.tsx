'use client';
import React from 'react';
import { ParagraphFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

interface ParagraphPreviewProps {
  fieldDef: ParagraphFieldDefinition;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<ParagraphPreviewProps> = ({ fieldDef, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: paraRef, handleBlur: saveText } = useEditableText<HTMLParagraphElement>(
    fieldDef.content,
    (txt) => change('content', txt),
  );

  // Translate design-time style props to Tailwind classes / inline style
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);
  const widthClass = fieldDef.width ?? 'w-full';

  // Fallback to a sensible gray text colour when none specified via style props.
  const fallbackColorClass = !fieldDef.textColor ? 'text-gray-700' : '';

  const editable = !isPreviewMode;

  return (
    <p
      ref={paraRef}
      className={`whitespace-pre-wrap ${twText} ${fallbackColorClass} ${widthClass}`}
      style={twInline}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={editable ? saveText : undefined}
    />
  );
};

// ------------- Validators / schema helpers -----------------
export const getValidators = (): { onChange?: ValidatorFn } => ({ /* Paragraph: no custom validators */ });

export const mapToSchemaType = (): string => 'paragraph';
