'use client';

import React, { DragEvent } from 'react';
import { AnyFieldApi, FormApi, Field } from '@tanstack/react-form';
import { getFieldModule, FieldValidator } from '@/components/fields';
import type { FormFieldDefinition } from './types';
import { FormValues } from '@/hooks/useFormBuilder';

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
  handleDragStartFromList: (event: DragEvent, fieldDef: FormFieldDefinition, index: number) => void;
  handleDragEndList: (event: DragEvent) => void;
  handleFieldClick: (fieldDef: FormFieldDefinition) => void;
  removeField: (fieldId: string) => void;
  isDragging: boolean;
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
}: FieldItemProps) => {
  const { Preview } = getFieldModule(fieldDef.type);
  const fieldValidators = getFieldValidators(fieldDef);

  if (fieldDef.type === 'SubmitButton') {
    return (
      <div 
        draggable
        onDragStart={(e) => handleDragStartFromList(e, fieldDef, index)}
        onDragEnd={handleDragEndList}
        onClick={() => handleFieldClick(fieldDef)}
        className={`cursor-grab ${selectedFieldDef?.id === fieldDef.id ? 'outline outline-2 outline-blue-500 outline-offset-2 rounded-lg' : ''} ${isDragging ? 'opacity-50' : ''}`}
      >
        <div className="p-4 border rounded-lg bg-white shadow-sm mb-3 border-gray-300">
          <label className="block mb-1.5 font-medium text-gray-700 text-sm">
            {fieldDef.label || `${fieldDef.type} Field`}
          </label>
          <Preview fieldDef={fieldDef} />
          <div className="flex justify-between items-center mt-2">
            <small className="text-gray-500 text-xs">Type: {fieldDef.type}</small>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); removeField(fieldDef.id); }}
              className="text-red-500 hover:text-red-700 text-xs"
              title="Remove field"
            >
              Remove
            </button>
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
        const baseClasses = "p-4 border rounded-lg bg-white shadow-sm mb-3";
        const selectedClasses = selectedFieldDef?.id === fieldDef.id ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-300";
        return (
          <div
            draggable
            onDragStart={(e) => handleDragStartFromList(e, fieldDef, index)}
            onDragEnd={handleDragEndList}
            onClick={() => handleFieldClick(fieldDef)}
            className={`cursor-grab ${selectedFieldDef?.id === fieldDef.id ? 'outline outline-2 outline-blue-500 outline-offset-2 rounded-lg' : ''} ${isDragging ? 'opacity-50' : ''}`}
          >
            <div className={`${baseClasses} ${selectedClasses}`}>
              <label htmlFor={fieldApi.name} className="block mb-1.5 font-medium text-gray-700 text-sm">
                {fieldDef.label || `${fieldDef.type} Field`}
              </label>
              <Preview fieldDef={fieldDef} fieldApi={fieldApi} /> 
              <FieldInfo field={fieldApi} />
              <div className="flex justify-between items-center mt-2">
                {!fieldApi && <small className="text-gray-500 text-xs">Type: {fieldDef.type}</small>}
                {fieldApi && <small className="text-gray-500 text-xs">ID: {fieldApi.name}</small>}
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeField(fieldDef.id); }}
                  className="text-red-500 hover:text-red-700 text-xs"
                  title="Remove field"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </Field>
  );
};

export const FieldItem = React.memo(FieldItemComponent); 