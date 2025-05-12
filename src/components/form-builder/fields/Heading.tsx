'use client';
import React, { useState, useEffect, useRef } from 'react';
import { HeadingFieldDefinition, ValidatorFn } from '@/components/form-builder/types';

interface EditableHeadingPreviewProps {
  fieldDef: HeadingFieldDefinition;
  onPropertyChange?: (property: keyof HeadingFieldDefinition, value: unknown) => void;
  formName?: string; 
  setFormName?: (name: string) => void; 
  isSystemGenerated?: boolean;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<EditableHeadingPreviewProps> = ({
  fieldDef,
  onPropertyChange,
  formName,
  setFormName,
  isSystemGenerated,
  isPreviewMode,
}) => {
  const Tag = fieldDef.level || 'h2';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentHeadingText, setCurrentHeadingText] = useState(fieldDef.label);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSubheadingText, setCurrentSubheadingText] = useState(fieldDef.subheading || '');

  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const newLabel = isSystemGenerated && formName !== undefined ? formName : fieldDef.label;
    setCurrentHeadingText(newLabel);
    if (headingRef.current && headingRef.current.textContent !== newLabel) {
      headingRef.current.textContent = newLabel;
    }
  }, [fieldDef.label, formName, isSystemGenerated]);

  useEffect(() => {
    const newSubText = fieldDef.subheading || '';
    setCurrentSubheadingText(newSubText);
    if (subheadingRef.current && subheadingRef.current.textContent !== newSubText) {
      subheadingRef.current.textContent = newSubText;
    }
  }, [fieldDef.subheading]);

  const handleHeadingSave = () => {
    const newLabel = headingRef.current?.textContent?.trim() || '';
    if (isSystemGenerated && setFormName) {
      if (newLabel !== formName) setFormName(newLabel);
    } else {
      if (newLabel !== fieldDef.label) onPropertyChange?.('label', newLabel);
    }
    setCurrentHeadingText(newLabel);
  };

  const handleSubheadingSave = () => {
    const newSubheading = subheadingRef.current?.textContent?.trim() || '';
    if (newSubheading !== (fieldDef.subheading || '')) {
      onPropertyChange?.('subheading', newSubheading);
    }
    setCurrentSubheadingText(newSubheading);
  };

  const headingBaseClasses = `font-semibold text-gray-900 w-full bg-transparent focus:outline-none`;
  const headingTagClasses = `${Tag === 'h1' ? 'text-2xl' : 'text-xl'}`;
  const subheadingBaseClasses = `text-sm text-gray-600 w-full bg-transparent focus:outline-none`;

  const contentEditableForRegularHeading = !isPreviewMode;

  return (
    <div className="my-1 w-full">
      <Tag
        ref={headingRef}
        className={`${headingBaseClasses} ${headingTagClasses} ${contentEditableForRegularHeading && !isSystemGenerated ? 'cursor-text' : 'cursor-default'}`}
        contentEditable={contentEditableForRegularHeading && !isSystemGenerated}
        suppressContentEditableWarning
        onInput={contentEditableForRegularHeading && !isSystemGenerated ? () => setCurrentHeadingText(headingRef.current?.textContent || '') : undefined}
        onBlur={contentEditableForRegularHeading && !isSystemGenerated ? handleHeadingSave : undefined}
        title={contentEditableForRegularHeading && !isSystemGenerated ? (isSystemGenerated ? "Form title (handled separately)" : "Click to edit heading") : undefined}
      >
        {/* Content is now managed by the browser during typing; useEffect sets initial DOM content */}
      </Tag>

      <p
        ref={subheadingRef}
        className={`${subheadingBaseClasses} min-h-[20px] mt-1 ${contentEditableForRegularHeading ? 'cursor-text' : 'cursor-default'} ${currentSubheadingText === '' && !isSystemGenerated && !isPreviewMode ? 'italic text-gray-400' : ''}`}
        contentEditable={contentEditableForRegularHeading}
        suppressContentEditableWarning
        onInput={contentEditableForRegularHeading ? () => setCurrentSubheadingText(subheadingRef.current?.textContent || '') : undefined}
        onBlur={contentEditableForRegularHeading ? handleSubheadingSave : undefined}
        title={contentEditableForRegularHeading ? (isSystemGenerated ? "Form subtitle (handled separately)" : "Click to edit subheading") : undefined}
        data-placeholder={contentEditableForRegularHeading && !isSystemGenerated ? (isSystemGenerated ? "Optional: Add a short description for your form" : "Subheading") : undefined}
      >
        {/* Content is now managed by the browser during typing; useEffect sets initial DOM content. The className handles placeholder appearance. */}
      </p>
    </div>
  );
};

export const Settings: React.FC<{
  fieldDef: HeadingFieldDefinition;
  onPropertyChange: (property: keyof HeadingFieldDefinition, value: unknown) => void;
}> = ({ fieldDef, onPropertyChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`heading-text-input-${fieldDef.id}`} className="block mb-1.5 font-medium text-gray-700 text-sm">
          Heading Text:
        </label>
        <input
          type="text"
          id={`heading-text-input-${fieldDef.id}`}
          value={fieldDef.label}
          onChange={(e) => onPropertyChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
      </div>
      <div>
        <label htmlFor={`subheading-text-input-${fieldDef.id}`} className="block mb-1.5 font-medium text-gray-700 text-sm">
          Subheading Text (Optional):
        </label>
        <input
          type="text"
          id={`subheading-text-input-${fieldDef.id}`}
          value={fieldDef.subheading || ''}
          onChange={(e) => onPropertyChange('subheading', e.target.value)}
          placeholder="Enter subheading here"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
      </div>
      <div>
        <label htmlFor={`heading-level-${fieldDef.id}`} className="block mb-1.5 font-medium text-gray-700 text-sm">
          Heading Level:
        </label>
        <select
          id={`heading-level-${fieldDef.id}`}
          value={fieldDef.level || 'h2'}
          onChange={(e) => onPropertyChange('level', e.target.value as HeadingFieldDefinition['level'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="h1">H1 (Title)</option>
          <option value="h2">H2 (Heading)</option>
          <option value="h3">H3 (Sub-heading)</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </div>
    </div>
  );
};

export const getValidators = (): { onChange?: ValidatorFn } => ({});
export const mapToSchemaType = (): string => 'heading';