'use client';
import React, { useState } from 'react';
import { HeadingFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw, StyleProps } from '@/utils/tw';

interface EditableHeadingPreviewProps {
  fieldDef: HeadingFieldDefinition;
  formName?: string;
  setFormName?: (name: string) => void;
  isSystemGenerated?: boolean;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<EditableHeadingPreviewProps> = ({
  fieldDef,
  formName,
  setFormName,
  isSystemGenerated,
  isPreviewMode,
}) => {
  const change = usePropertyChanger(fieldDef);
  const [currentSubheadingText, setCurrentSubheadingText] = useState<string | null>(
    fieldDef.subheading || null
  );

  const { ref: headingRef, handleBlur: saveHeading } =
    useEditableText<HTMLHeadingElement>(
      isSystemGenerated ? formName ?? '' : fieldDef.label,
      (newText) => {
        if (isSystemGenerated && setFormName) {
          setFormName(newText);
        } else {
          change('label', newText);
        }
      }
    );

  const { ref: subheadingRef, handleBlur: saveSubheading } =
    useEditableText<HTMLParagraphElement>(fieldDef.subheading ?? '', (newText) =>
      change('subheading', newText)
    );

  const contentEditableForRegularHeading = !isPreviewMode;
  const HeadingTag = fieldDef.level || 'h2';

  // Tailwind utility classes / inline style derived from fieldDef
  const { className: twText, style: twInline } = stylePropsToTw(
    fieldDef as unknown as StyleProps
  );

  const headingBaseClasses = 'w-full outline-none break-all';
  const subheadingBaseClasses = `text-sm text-gray-600 outline-none w-full ${fieldDef.alignment ? `text-${fieldDef.alignment}` : ''}`;

  return (
    <div className={`${fieldDef.margin || 'my-1'} ${fieldDef.padding || ''} w-full`}>
      {React.createElement(HeadingTag, {
        ref: headingRef,
        className: `${twText} ${headingBaseClasses} ${
          contentEditableForRegularHeading && !isSystemGenerated
            ? 'cursor-text'
            : 'cursor-default'
        }`,
        style: twInline,
        contentEditable: contentEditableForRegularHeading && !isSystemGenerated,
        suppressContentEditableWarning: true,
        onBlur:
          contentEditableForRegularHeading && !isSystemGenerated
            ? saveHeading
            : undefined,
        title:
          contentEditableForRegularHeading && !isSystemGenerated
            ? isSystemGenerated
              ? 'Form title (handled separately)'
              : 'Click to edit heading'
            : undefined,
      })}
      <p
        ref={subheadingRef}
        className={`${subheadingBaseClasses} min-h-[20px] mt-1 ${
          contentEditableForRegularHeading ? 'cursor-text' : 'cursor-default'
        } ${
          currentSubheadingText === '' &&
          !isSystemGenerated &&
          !isPreviewMode
            ? 'italic text-gray-400'
            : ''
        }`}
        contentEditable={contentEditableForRegularHeading}
        suppressContentEditableWarning
        onInput={contentEditableForRegularHeading ? () => setCurrentSubheadingText(subheadingRef.current?.textContent || null) : undefined}
        onBlur={contentEditableForRegularHeading ? saveSubheading : undefined}
        title={
          contentEditableForRegularHeading
            ? isSystemGenerated
              ? 'Form subtitle (handled separately)'
              : 'Click to edit subheading'
            : undefined
        }
        data-placeholder={
          contentEditableForRegularHeading && !isSystemGenerated
            ? isSystemGenerated
              ? 'Optional: Add a short description for your form'
              : 'Subheading'
            : undefined
        }
      />
    </div>
  );
};

// Validators / schema helpers -------------------------
export const getValidators = (): { onChange?: ValidatorFn } => ({
  /* Heading has no specific validators beyond generic */
});

export const mapToSchemaType = (): string => 'heading';
