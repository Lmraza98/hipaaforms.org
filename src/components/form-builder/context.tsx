'use client';
import React, { createContext, useContext } from 'react';
import { useForm, type FormApi } from '@tanstack/react-form';
import { useFormBuilder } from './hooks/useFormBuilder';
import type { FormBuilderContextValue, FormBuilderProviderProps, FormValues } from './types';

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

export function FormBuilderProvider({
  formId,
  initialFieldsData,
  initialName,
  initialDescription,
  initialVersion,
  userRole,
  children,
}: FormBuilderProviderProps) {
  // 1) create the form instance here
  const form = useForm({
    defaultValues: initialFieldsData
      .reduce((acc, f) => ({ ...acc, [f.id]: '' }), {} as Record<string, unknown>),
    onSubmit: async ({ value }) => {
      // you can replace with your real save
      console.log('submitted', value);
    },
  }) as unknown as FormApi<FormValues, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, unknown>

  // 2) now pass that `form` into your hook
  const {
    fields,
    setFields,
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    currentVersion,
    selectedFieldDef,
    setSelectedFieldDef,
    addField,
    removeField,
    reorderField,
    handlePropertyChange,
    saveForm,
    isSaving,
    isCreating,
    dragOverIndex,
    draggedItemId,
    handleDragStartFromList,
    handleDragEndList,
    handleDragOverList,
    handleDropOnList,
    isPreviewMode,
    setIsPreviewMode,
  } = useFormBuilder({
    formId,
    initialFieldsData,
    initialName,
    initialDescription,
    initialVersion,
    form,
    userRole,
  });

  return (
    <FormBuilderContext.Provider
      value={{
        fields,
        setFields,
        formName,
        setFormName,
        formDescription,
        setFormDescription,
        currentVersion,
        selectedFieldDef,
        setSelectedFieldDef,
        addField,
        removeField,
        reorderField,
        handlePropertyChange,
        saveForm,
        isSaving,
        isCreating,
        dragOverIndex,
        draggedItemId,
        handleDragStartFromList,
        handleDragEndList,
        handleDragOverList,
        handleDropOnList,
        isPreviewMode,
        setIsPreviewMode,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilderContext() {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) throw new Error('useFormBuilderContext must be inside a FormBuilderProvider');
  return ctx;
}