'use client';
import React, { useRef } from 'react';
import { useForm } from '@tanstack/react-form';
import { FieldItem } from './FieldItem';
import { getFieldModule } from '@/components/form-builder/fields/index';
import { useFormBuilderContext } from './context';
import type { FormFieldDefinition, FieldValidator, FormValues } from './types';

export const FieldCanvas = React.memo(() => {
  const {
    fields,
    formName,
    setFormName,
    selectedFieldDef,
    setSelectedFieldDef,
    dragOverIndex,
    handleDragOverList,
    handleDropOnList,
    handleDragStartFromList,
    handleDragEndList,
    removeField,
    draggedItemId,
    handlePropertyChange
  } = useFormBuilderContext();

  const fieldListRef = useRef<HTMLDivElement>(null);

  // Create dynamic heading field
  const dynamicHeadingField: FormFieldDefinition = {
    id: 'form_title_heading',
    type: 'Heading',
    label: formName || 'Form Title',
    level: 'h1',
    isSystemGenerated: true,
  };

  // Prepend the dynamic heading to the fields array
  const fieldsWithHeading = [dynamicHeadingField, ...fields];

  // Create form instance (similar to FormBuilderClient.tsx)
  const form = useForm({
    defaultValues: fields.reduce((acc, f) => ({ ...acc, [f.id]: '' }), {} as FormValues),
    onSubmit: async ({ value }: { value: FormValues }) => {
      console.log('Form submitted with values:', value);
    },
  });

  const handleFieldClick = (fieldDef: FormFieldDefinition) => {
    setSelectedFieldDef(fieldDef);
  };

  const getFieldValidators = (fieldDef: FormFieldDefinition): { onChange?: FieldValidator<unknown> } => {
    const fieldModule = getFieldModule(fieldDef.type);
    const combinedValidators: { onChange?: FieldValidator<unknown> } = {};

    const canHaveValidators = !['Heading', 'Paragraph', 'Image', 'SubmitButton'].includes(fieldDef.type);

    if (canHaveValidators && 'validatorsConfig' in fieldDef && fieldDef.validatorsConfig?.required) {
      combinedValidators.onChange = (params: { value: unknown }) => {
        if (params.value === undefined || params.value === null || params.value === '') {
          if (typeof params.value !== 'number' && typeof params.value !== 'boolean') {
            return `${fieldDef.label || 'Field'} is required.`;
          }
        }
        return undefined;
      };
    }

    if (fieldModule.getValidators) {
      const moduleSpecificDef = fieldDef as Extract<FormFieldDefinition, { type: typeof fieldDef.type }>;
      const moduleValidators = fieldModule.getValidators(moduleSpecificDef);

      if (moduleValidators?.onChange) {
        const existingOnChange = combinedValidators.onChange;
        if (existingOnChange) {
          combinedValidators.onChange = async (params: { value: unknown }) => {
            const requiredError = await existingOnChange(params);
            if (requiredError) return requiredError;
            return typeof moduleValidators.onChange === 'function' ? moduleValidators.onChange(params) : undefined;
          };
        } else {
          combinedValidators.onChange = moduleValidators.onChange;
        }
      }
    }
    return combinedValidators;
  };

  return (
    <div 
      ref={fieldListRef}
      className="h-full p-4 sm:p-6 overflow-y-auto order-first md:order-none sm:w-[800px] bg-white"
      onDragOver={(e) => handleDragOverList(e, fieldListRef.current)}
      onDrop={handleDropOnList}
    >
      {fields.length === 0 && dragOverIndex === null && (
        <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-md">
          Drag fields from the palette here to build your form
        </div>
      )}

{fieldsWithHeading.map((fieldDef, index) => (
  <React.Fragment key={fieldDef.id}>
    {dragOverIndex === index && (
      <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder" />
    )}

    {/* wrapper: full-width relative container */}
    <div className="relative mb-4 overflow-x-visible">
      {/* FieldItem takes full width */}
      <FieldItem
        fieldDef={fieldDef}
        index={index}
        selectedFieldDef={selectedFieldDef}
        form={form}
        formName={fieldDef.isSystemGenerated && fieldDef.type === 'Heading' ? formName : undefined}
        setFormName={fieldDef.isSystemGenerated && fieldDef.type === 'Heading' ? setFormName : undefined}
        handleDragStartFromList={handleDragStartFromList}
        handleDragEndList={handleDragEndList}
        handleFieldClick={handleFieldClick}
        removeField={removeField}
        isDragging={draggedItemId === fieldDef.id}
        onPropertyChange={handlePropertyChange}
        getFieldValidators={getFieldValidators}
      />

      {/* Conditionally hide Edit Properties button for system generated fields */}
      {!fieldDef.isSystemGenerated && (
        <div className="flex flex-col absolute top-1/2 right-[-10px]
                transform -translate-y-1/2">
            <button
            type="button"
            onClick={() => handleFieldClick(fieldDef)}
            className="
                
                text-sm text-blue-600 hover:underline
                whitespace-nowrap
            "
            >
            Edit Properties
            </button>
            <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeField(fieldDef.id); }}
                className="text-red-500 hover:text-red-700 text-xs "
                title="Remove field"
                >
                Remove
            </button>
        </div>
      )}
    
    </div>
  </React.Fragment>
))}

      
      {dragOverIndex === fieldsWithHeading.length && fieldsWithHeading.length > 0 && (
        <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"></div>
      )}
      {fieldsWithHeading.length === 0 && dragOverIndex === 0 && dragOverIndex !== null && (
        <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"></div>
      )}
    </div>
  );
});

FieldCanvas.displayName = 'FieldCanvas'; 