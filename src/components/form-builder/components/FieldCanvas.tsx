'use client';
import React, { useRef, useCallback, useMemo } from 'react';
import { useFormBuilderContext } from './context';
import type { FormFieldDefinition, FormValues, TypedFormApi, HeadingFieldDefinition } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import { usePrevious } from '../hooks/usePrevious';
import { FieldList } from './FieldList';
import { DropPlaceholder } from './DropPlaceholder';
import { FormTitle } from './FormTitle';

// Define props for FieldCanvas
interface FieldCanvasProps {
  paletteWrapperRef: React.RefObject<HTMLDivElement | null>;
  propertiesWrapperRef: React.RefObject<HTMLDivElement | null>;
  form: TypedFormApi<FormValues>
}

export const FieldCanvas = React.memo(({
  paletteWrapperRef,
  propertiesWrapperRef,
  form,
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
    setFields,
    isPreviewMode,
  } = useFormBuilderContext();

  const fieldListRef = useRef<HTMLDivElement>(null);
  const prevIds = usePrevious(fields.map(f => f.id)) ?? [];

  // Use the click outside hook
  useClickOutside(
    [fieldListRef, paletteWrapperRef, propertiesWrapperRef],
    () => setSelectedFieldDef(null),
    Boolean(selectedFieldDef)
  );

  // Memoize the dynamic heading field
  const dynamicHeadingField = useMemo<HeadingFieldDefinition>(() => ({
    id: 'form_title_heading',
    type: 'Heading',
    label: formName || 'Form Title',
    level: 'h1',
    isSystemGenerated: false,
  }), [formName]);

  // Memoize handlers
  const handleFieldClick = useCallback(
    (fieldDef: FormFieldDefinition) => setSelectedFieldDef(fieldDef),
    [setSelectedFieldDef]
  );

  const onReorderFields = useCallback(
    (newOrder: FormFieldDefinition[]) => setFields(newOrder),
    [setFields]
  );

  const handleRemoveField = useCallback(
    (id: string) => removeField(id),
    [removeField]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => handleDragOverList(e, fieldListRef.current),
    [handleDragOverList]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => handleDropOnList(e),
    [handleDropOnList]
  );

  // Memoize fieldItemProps
  const fieldItemProps = useMemo(() => ({
    form,
    handleFieldClick,
    removeField: handleRemoveField,
    isPreviewMode,
    selectedFieldDef,
  }), [
    form,
    handleFieldClick,
    handleRemoveField,
    isPreviewMode,
    selectedFieldDef,
  ]);

  return (
    <div
      ref={fieldListRef}
      className="p-4 sm:p-6 order-first md:order-none bg-white w-full sm:w-[800px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <FormTitle
        fieldDef={dynamicHeadingField}
        selectedFieldDef={selectedFieldDef as HeadingFieldDefinition | null}
        form={form}
        formName={formName}
        setFormName={setFormName}
        onSelect={handleFieldClick}
        isPreviewMode={isPreviewMode}
      />

      {/* Empty state */}
      {fields.length === 0 && dragOverIndex === null && (
        <DropPlaceholder position="top" variant="empty" />
      )}

      {/* Drop indicator for top position */}
      {dragOverIndex === 0 && <DropPlaceholder position="top" />}

      <FieldList
        fields={fields}
        prevIds={prevIds}
        dragOverIndex={dragOverIndex}
        onReorder={onReorderFields}
        fieldItemProps={fieldItemProps}
      />

      {/* Drop indicator for bottom position */}
      {dragOverIndex === fields.length && fields.length > 0 && (
        <DropPlaceholder position="bottom" />
      )}
    </div>
  );
});

FieldCanvas.displayName = 'FieldCanvas'; 