'use client';
import React, { createContext, useContext } from 'react';
import { useForm } from '@tanstack/react-form';
import { useFormBuilder } from '../hooks/useFormBuilder';
import type { FormBuilderContextValue, FormBuilderProviderProps, FormValues } from '../types';
import { FormAsyncValidateOrFn, FormValidateOrFn } from '@tanstack/react-form';

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
  const form = useForm<FormValues,
    FormValidateOrFn<FormValues> | undefined,
    FormValidateOrFn<FormValues> | undefined,
    FormAsyncValidateOrFn<FormValues> | undefined,
    FormValidateOrFn<FormValues> | undefined,
    FormAsyncValidateOrFn<FormValues> | undefined,
    FormValidateOrFn<FormValues> | undefined,
    FormAsyncValidateOrFn<FormValues> | undefined,
    FormAsyncValidateOrFn<FormValues> | undefined,
    unknown>({
      defaultValues: initialFieldsData
        .reduce((acc, f) => ({ ...acc, [f.id]: '' }), {} as Record<string, unknown>),
      onSubmit: async ({ value }) => {
        // you can replace with your real save
        console.log('submitted', value);
      },
    })

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
    // reorderField,
    handlePropertyChange,
    saveForm,
    isSaving,
    isCreating,
    dragOverIndex,
    // draggedItemId,
    // handleDragStartFromList,
    // handleDragEndList,
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
        // reorderField,
        handlePropertyChange,
        saveForm,
        isSaving,
        isCreating,
        dragOverIndex,
        // draggedItemId,
        // handleDragStartFromList,
        // handleDragEndList,
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