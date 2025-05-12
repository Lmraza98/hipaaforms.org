'use client';
import React, { useRef, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { FieldItem } from './FieldItem';
import { getFieldModule } from '@/components/form-builder/fields/index';
import { useFormBuilderContext } from './context';
import type { FormFieldDefinition, FieldValidator, FormValues } from './types';

// Standard fade-up animation
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Define props for FieldCanvas
interface FieldCanvasProps {
  paletteWrapperRef: React.RefObject<HTMLDivElement | null>;
  propertiesWrapperRef: React.RefObject<HTMLDivElement | null>;
}

export const FieldCanvas = React.memo(({
  paletteWrapperRef,
  propertiesWrapperRef,
}: FieldCanvasProps) => {
  const {
    fields,
    formName,
    setFormName,
    selectedFieldDef,
    setSelectedFieldDef,
    dragOverIndex,
    handleDragOverList,
    handleDropOnList,
    removeField,
    handlePropertyChange,
    isPreviewMode,
    setFields,
  } = useFormBuilderContext();

  const fieldListRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside relevant areas for deselection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!selectedFieldDef) return; // Nothing to deselect

      const target = event.target as Node;

      // If the click is inside the palette drawer's container, do nothing
      if (paletteWrapperRef.current && paletteWrapperRef.current.contains(target)) {
        return;
      }

      // If the click is inside the properties drawer's container, do nothing
      if (propertiesWrapperRef.current && propertiesWrapperRef.current.contains(target)) {
        return;
      }

      // If the click is outside the main canvas area (fieldListRef), then deselect
      if (fieldListRef.current && !fieldListRef.current.contains(target)) {
        setSelectedFieldDef(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedFieldDef, setSelectedFieldDef, paletteWrapperRef, propertiesWrapperRef, fieldListRef]);

  // Create dynamic heading field
  const dynamicHeadingField: FormFieldDefinition = {
    id: 'form_title_heading',
    type: 'Heading',
    label: formName || 'Form Title',
    level: 'h1',
    isSystemGenerated: false,
  };

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

  // Callback for when reordering is complete via Framer Motion
  const onReorderFields = (newOrder: FormFieldDefinition[]) => {
    // The newOrder from Reorder.Group contains only the reorderable items.
    // We need to filter out any non-reorderable items (like a system-generated title)
    // before setting the state, or ensure they are correctly handled.
    // For now, assuming `fields` in context only contains user-added, reorderable fields.
    setFields(newOrder);
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
      className="p-4 sm:p-6 order-first md:order-none bg-white w-full sm:w-[800px]"
      onDragOver={(e) => handleDragOverList(e, fieldListRef.current)}
      onDrop={handleDropOnList}
    >
      {/* Static Form Title - Not part of reorderable list */}
      <FieldItem
        fieldDef={dynamicHeadingField}
        selectedFieldDef={selectedFieldDef}
        form={form}
        formName={formName}
        setFormName={setFormName}
        handleFieldClick={handleFieldClick} // Allow selecting to edit properties if desired
        removeField={() => {}} // Cannot remove system title
        onPropertyChange={handlePropertyChange}
        getFieldValidators={getFieldValidators}
        isPreviewMode={isPreviewMode}
      />

      {/* Placeholder for dropping new items from palette AT THE VERY TOP */}
      {fields.length === 0 && dragOverIndex === 0 && (
         <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder" />
      )}
      {/* Only show this if no fields and no active drag-over for a new item at index 0 */}
      {fields.length === 0 && dragOverIndex === null && (
        <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-md">
          Drag fields from the palette here to build your form
        </div>
      )}

      <AnimatePresence>
        {dragOverIndex === 0 && fields.length > 0 && ( // Placeholder when dragging to top of existing items
            <motion.div 
              key="drop-placeholder-top"
              className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder" 
              layout // Ensure placeholder animates with list
            />
        )}
      </AnimatePresence>

      <Reorder.Group
        axis="y"
        values={fields} // `fields` from context should be the array of user-added fields
        onReorder={onReorderFields}
        className="space-y-0" // Reorder.Item will have its own margin/padding
      >
        <AnimatePresence initial={false}>
          {fields.map((fieldDef, index) => (
            <React.Fragment key={fieldDef.id}>
              {/* Placeholder for dropping new items from palette BETWEEN items */}
              {/* index here is for `fields` array, dragOverIndex refers to `fieldsWithHeading` if not adjusted */}
              {/* We need to adjust dragOverIndex if dynamicHeadingField is always first.
                  If dragOverIndex is for inserting into `fields`, then it's fine.
                  Assuming handleDragOverList sets dragOverIndex relative to the `fields` array (0 to N).
              */}
               {dragOverIndex === index && index !== 0 && ( //  index !== 0 because top placeholder is handled above
                <motion.div 
                  key={`drop-placeholder-${index}`}
                  className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"
                  layout
                />
              )}
              <Reorder.Item
                key={fieldDef.id}
                value={fieldDef}
                initial="hidden"
                animate="show"
                exit="hidden" // Or a different exit animation
                variants={fadeUp}
                layout // Enables smooth animation on reorder, add, remove
                className="relative mb-4 overflow-x-visible" // Keep your styling for the item wrapper
                // style={{ listStyle: \'none\' }} // Reorder.Item renders a li by default
              >
                {/* FieldItem takes full width */}
                <FieldItem
                  fieldDef={fieldDef}
                  selectedFieldDef={selectedFieldDef}
                  form={form}
                  // No formName/setFormName for regular fields
                  // handleDragStartFromList and handleDragEndList are removed
                  // as Reorder.Item handles drag for reordering
                  handleFieldClick={handleFieldClick}
                  removeField={removeField}
                  // isDragging is handled by Reorder.Item\'s internal state
                  onPropertyChange={handlePropertyChange}
                  getFieldValidators={getFieldValidators}
                  isPreviewMode={isPreviewMode}
                />
                {/* Conditionally hide Edit Properties button for system generated fields */}
                {/* This UI should probably be part of FieldItem itself or be aware of Reorder.Item */}
                {!fieldDef.isSystemGenerated && !isPreviewMode && (
                  <div className="flex flex-col absolute top-1/2 right-1 md:right-[-10px]
                      transform -translate-y-1/2">
                    <button
                      type="button"
                      onClick={() => handleFieldClick(fieldDef)}
                      className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                    >
                      Edit
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
              </Reorder.Item>
              {/* Placeholder for dropping new items from palette AFTER the last item in `fields` */}
              {/* This covers the case where dragOverIndex is for appending a new field */}
              {dragOverIndex === index + 1 && index === fields.length -1 && (
                 <motion.div 
                  key={`drop-placeholder-after-${index}`}
                  className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"
                  layout
                />
              )}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      
      <AnimatePresence>
        {/* Placeholder for dropping new items AT THE VERY BOTTOM if not covered by map */}
        {/* This is when dragOverIndex is fields.length and fields.length > 0 */}
        {dragOverIndex === fields.length && fields.length > 0 && (
           <motion.div
            key="drop-placeholder-bottom"
            className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"
            layout
           />
        )}
      </AnimatePresence>

      {/* Original logic for placeholders - needs careful review with Reorder.Group */}
      {/* {dragOverIndex === fieldsWithHeading.length && fieldsWithHeading.length > 0 && (
        <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"></div>
      )}
      {fieldsWithHeading.length === 0 && dragOverIndex === 0 && dragOverIndex !== null && (
        <div className="h-2 my-2 bg-blue-300 rounded-full drop-placeholder"></div>
      )} */}
    </div>
  );
});

FieldCanvas.displayName = 'FieldCanvas'; 