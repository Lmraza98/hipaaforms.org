'use client';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { HeadingFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../hooks/usePropertyChanger';

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
  isPreviewMode 
}) => {
  const change = usePropertyChanger(fieldDef);
  const [currentSubheadingText, setCurrentSubheadingText] = useState<string | null>(fieldDef.subheading || null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.textContent = isSystemGenerated ? (formName || '') : fieldDef.label;
    }
    if (subheadingRef.current) {
      subheadingRef.current.textContent = fieldDef.subheading || null;
    }
  }, [fieldDef.label, fieldDef.subheading, formName, isSystemGenerated]);

  const handleHeadingSave = () => {
    const newText = headingRef.current?.textContent || '';
    if (isSystemGenerated && setFormName) {
      setFormName(newText);
    } else {
      change('label', newText);
    }
  };

  const handleSubheadingSave = () => {
    const newText = subheadingRef.current?.textContent || '';
    change('subheading', newText);
  };

  const contentEditableForRegularHeading = !isPreviewMode;
  const HeadingTag = fieldDef.level || 'h2';

  const headingBaseClasses = "w-full outline-none min-w-[100px] break-all";
  const headingTagClasses = "text-2xl font-semibold text-gray-900";
  const subheadingBaseClasses = "text-sm text-gray-600 outline-none w-full";

  return (
    <div className="my-1 w-full">
      {React.createElement(
        HeadingTag,
        {
          ref: headingRef,
          className: `${headingBaseClasses} ${headingTagClasses} ${contentEditableForRegularHeading && !isSystemGenerated ? 'cursor-text' : 'cursor-default'}`,
          contentEditable: contentEditableForRegularHeading && !isSystemGenerated,
          suppressContentEditableWarning: true,
          onInput: contentEditableForRegularHeading && !isSystemGenerated ? () => {
            const text = headingRef.current?.textContent || '';
            if (isSystemGenerated && setFormName) {
              setFormName(text);
            } else {
              change('label', text);
            }
          } : undefined,
          onBlur: contentEditableForRegularHeading && !isSystemGenerated ? handleHeadingSave : undefined,
          title: contentEditableForRegularHeading && !isSystemGenerated ? (isSystemGenerated ? "Form title (handled separately)" : "Click to edit heading") : undefined
        }
      )}
      <p
        ref={subheadingRef}
        className={`${subheadingBaseClasses} min-h-[20px] mt-1 ${contentEditableForRegularHeading ? 'cursor-text' : 'cursor-default'} ${currentSubheadingText === '' && !isSystemGenerated && !isPreviewMode ? 'italic text-gray-400' : ''}`}
        contentEditable={contentEditableForRegularHeading}
        suppressContentEditableWarning
        onInput={contentEditableForRegularHeading ? () => setCurrentSubheadingText(subheadingRef.current?.textContent || null) : undefined}
        onBlur={contentEditableForRegularHeading ? handleSubheadingSave : undefined}
        title={contentEditableForRegularHeading ? (isSystemGenerated ? "Form subtitle (handled separately)" : "Click to edit subheading") : undefined}
        data-placeholder={contentEditableForRegularHeading && !isSystemGenerated ? (isSystemGenerated ? "Optional: Add a short description for your form" : "Subheading") : undefined}
      />
    </div>
  );
};

export const Settings: React.FC<{
  fieldDef: HeadingFieldDefinition;
}> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    change('level', e.target.value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
  };

  return (
    <div>
      <label htmlFor="heading-level" className="block mb-1.5 font-medium text-gray-700 text-sm">
        Heading Level:
      </label>
      <select
        id="heading-level"
        value={fieldDef.level}
        onChange={handleLevelChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
      </select>
    </div>
  );
};

export const getValidators = (): { onChange?: ValidatorFn } => ({});
export const mapToSchemaType = (): string => 'heading';