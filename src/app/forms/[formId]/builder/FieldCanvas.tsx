'use client';

import React, { DragEvent, useRef } from 'react';
import { FormApi } from '@tanstack/react-form';
import { FieldItem } from './FieldItem';
import type { FormFieldDefinition } from './types';
import { FormValues } from '@/hooks/useFormBuilder';
import { FieldValidator } from '@/components/fields'; 

interface FieldCanvasProps {
  fields: FormFieldDefinition[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormApi<FormValues, any, any, any, any, any, any, any, any, unknown>; 
  selectedFieldDef: FormFieldDefinition | null;
  dragOverIndex: number | null;
  handleDragOverList: (event: DragEvent, fieldListRefCurrent: HTMLDivElement | null) => void;
  handleDropOnList: (event: DragEvent) => void;
  handleDragStartFromList: (event: DragEvent, fieldDef: FormFieldDefinition, index: number) => void;
  handleDragEndList: (event: DragEvent) => void;
  handleFieldClick: (fieldDef: FormFieldDefinition) => void;
  removeField: (fieldId: string) => void;
  getFieldValidators: (fieldDef: FormFieldDefinition) => { onChange?: FieldValidator<unknown> };
  draggedItemId: string | null; 
}

export const FieldCanvas = React.memo(({
  fields,
  form,
  selectedFieldDef,
  dragOverIndex,
  handleDragOverList,
  handleDropOnList,
  handleDragStartFromList,
  handleDragEndList,
  handleFieldClick,
  removeField,
  getFieldValidators,
  draggedItemId,
}: FieldCanvasProps) => {
  const fieldListRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={fieldListRef}
      className="flex-grow h-full p-4 sm:p-6 overflow-y-auto order-first md:order-none"
      onDragOver={(e) => handleDragOverList(e, fieldListRef.current)}
      onDrop={handleDropOnList}
    >
      {fields.length === 0 && dragOverIndex === null && (
        <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-md">
          Drag fields from the palette here to build your form
        </div>
      )}

      {fields.map((fieldDef, index) => (
        <React.Fragment key={fieldDef.id}>
          {dragOverIndex === index && (
            <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"></div>
          )}
          <FieldItem
            fieldDef={fieldDef}
            index={index}
            selectedFieldDef={selectedFieldDef}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form={form as any} // Cast to any to resolve complex type mismatch temporarily
            getFieldValidators={getFieldValidators}
            handleDragStartFromList={handleDragStartFromList}
            handleDragEndList={handleDragEndList}
            handleFieldClick={handleFieldClick}
            removeField={removeField}
            isDragging={draggedItemId === fieldDef.id}
          />
        </React.Fragment>
      ))}
      
      {dragOverIndex === fields.length && fields.length > 0 && (
        <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"></div>
      )}
      {fields.length === 0 && dragOverIndex === 0 && dragOverIndex !== null && (
        <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"></div>
      )}
    </div>
  );
});

FieldCanvas.displayName = 'FieldCanvas'; 