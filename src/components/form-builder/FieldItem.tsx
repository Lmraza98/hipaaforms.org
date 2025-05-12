'use client';
import React, { DragEvent } from 'react';
import { AnyFieldApi, FormApi, Field } from '@tanstack/react-form';
import { getFieldModule } from '@/components/form-builder/fields';
import type { FormFieldDefinition, FieldValidator } from './types';
import { FormValues } from '@/components/form-builder/types';

interface FieldInfoProps {
  field: AnyFieldApi;
}

function FieldInfo({ field }: FieldInfoProps) {
  return (
    <div className="text-xs text-red-500 mt-1 h-4">
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p>{field.state.meta.errors.join(', ')}</p>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </div>
  );
}

interface FieldItemProps {
  fieldDef: FormFieldDefinition;
  index: number;
  selectedFieldDef: FormFieldDefinition | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormApi<FormValues, any, any, any, any, any, any, any, any, unknown>;
  getFieldValidators: (fieldDef: FormFieldDefinition) => { onChange?: FieldValidator<unknown> };
  handleDragStartFromList: (event: React.DragEvent<Element>, fieldDef: FormFieldDefinition, index: number) => void;
  handleDragEndList: (event: React.DragEvent<Element>) => void;
  handleFieldClick: (fieldDef: FormFieldDefinition) => void;
  removeField: (fieldId: string) => void;
  isDragging: boolean;
  formName?: string;
  setFormName?: (name: string) => void;
  onPropertyChange: (propertyKey: string, value: unknown) => void;
  isPreviewMode?: boolean;
}

const FieldItemComponent = ({ 
  fieldDef, 
  index, 
  selectedFieldDef, 
  form,
  getFieldValidators, 
  handleDragStartFromList, 
  handleDragEndList, 
  handleFieldClick, 
  removeField,
  isDragging,
  formName,
  setFormName,
  onPropertyChange,
  isPreviewMode,
}: FieldItemProps) => {
  const { Preview } = getFieldModule(fieldDef.type);
  const fieldValidators = getFieldValidators(fieldDef);

  const isSystemTitleHeading = fieldDef.isSystemGenerated && fieldDef.type === 'Heading';

  if (fieldDef.type === 'SubmitButton') {
    // SubmitButton doesn't use fieldApi and is unlikely to be the system title heading
    // but we handle the props consistently.
    const propsForPreview = {
      fieldDef,
      ...(isSystemTitleHeading && { formName, setFormName }),
      onPropertyChange: (property: keyof typeof fieldDef, value: unknown) => 
        onPropertyChange(`${fieldDef.id}.${String(property)}`, value),
      isPreviewMode,
    };
    return (
      <div 
        draggable={!isSystemTitleHeading && !isPreviewMode}
        onDragStart={(e) => !isSystemTitleHeading && !isPreviewMode && handleDragStartFromList(e, fieldDef, index)}
        onDragEnd={!isSystemTitleHeading && !isPreviewMode ? handleDragEndList : undefined}
        onClick={() => !isSystemTitleHeading && !isPreviewMode && handleFieldClick(fieldDef)}
        className={`
          ${!isSystemTitleHeading && !isPreviewMode ? 'cursor-grab' : 'cursor-default'} 
          ${selectedFieldDef?.id === fieldDef.id && !isSystemTitleHeading && !isPreviewMode ? 'rounded-lg' : ''} 
          ${isDragging && !isSystemTitleHeading && !isPreviewMode ? 'opacity-50' : ''}
        `}
      >
        <div className={`p-4 rounded-lg bg-white mb-3 ${isPreviewMode ? 'border-transparent' : ''}`}>
          <label className="block mb-1.5 font-medium text-gray-700 text-sm">
            {fieldDef.label || `${fieldDef.type} Field`}
          </label>
          <Preview {...propsForPreview} />
          <div className="flex justify-between items-center mt-2">
            <small className="text-gray-500 text-xs">Type: {fieldDef.type}</small>
            {!isSystemTitleHeading && !isPreviewMode && (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeField(fieldDef.id); }}
                className="text-red-500 hover:text-red-700 text-xs"
                title="Remove field"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Field
      form={form}
      name={fieldDef.id as keyof FormValues}
      validators={fieldValidators}
    >
      {(fieldApi: AnyFieldApi) => {
        const propsForPreview = {
          fieldDef,
          fieldApi,
          ...(isSystemTitleHeading && { formName, setFormName }),
          onPropertyChange: (property: keyof typeof fieldDef, value: unknown) => 
            onPropertyChange(`${fieldDef.id}.${String(property)}`, value),
          isPreviewMode,
        };

        const baseClasses = "p-4 rounded-lg bg-white mb-3";
        const selectedClasses = selectedFieldDef?.id === fieldDef.id && !isSystemTitleHeading && !isPreviewMode ? "ring-2 ring-blue-500" : "";
        return (
          <div
            draggable={!isSystemTitleHeading && !isPreviewMode}
            onDragStart={(e) => !isSystemTitleHeading && !isPreviewMode && handleDragStartFromList(e, fieldDef, index)}
            onDragEnd={!isSystemTitleHeading && !isPreviewMode ? handleDragEndList : undefined}
            onClick={() => !isSystemTitleHeading && !isPreviewMode && handleFieldClick(fieldDef)}
            className={`
              ${!isSystemTitleHeading && !isPreviewMode ? 'cursor-grab' : 'cursor-default'} 
              ${selectedFieldDef?.id === fieldDef.id && !isSystemTitleHeading && !isPreviewMode ? 'outline-offset-2 rounded-lg' : ''} 
              ${isDragging && !isSystemTitleHeading && !isPreviewMode ? 'opacity-50' : ''}
            `}
          >
            <div className={`${baseClasses} ${selectedClasses} ${isPreviewMode ? 'border-transparent' : ''}`}>
           
              <Preview {...propsForPreview} /> 
              <FieldInfo field={fieldApi} />
            
            </div>
          </div>
        );
      }}
    </Field>
  );
};

export const FieldItem = React.memo(FieldItemComponent); 