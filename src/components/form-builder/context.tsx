'use client';
import React, { createContext, useContext } from 'react';
import { useForm, FormValidateOrFn, FormAsyncValidateOrFn } from '@tanstack/react-form';
import { useFormBuilder } from './hooks/useFormBuilder';
import type { FormBuilderContextValue, FormBuilderProviderProps, FormValues } from './types';

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

export function FormBuilderProvider({
  formId,
  initialFieldsData,
  initialName,
  initialDescription,
  initialVersion,
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
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    currentVersion,
    selectedFieldDef,
    setSelectedFieldDef,
    addField,
    removeField,
    handlePropertyChange,
    saveForm,
    isSaving,
    isCreating,
    dragOverIndex,
    handleDragOverList,
    handleDropOnList,
    isPreviewMode,
    setIsPreviewMode,
    setFields,
  } = useFormBuilder({
    formId,
    initialFieldsData,
    initialName,
    initialDescription,
    initialVersion,
    form,
  });

  return (
    <FormBuilderContext.Provider
      value={{
        fields,
        formName,
        setFormName,
        formDescription,
        setFormDescription,
        currentVersion,
        selectedFieldDef,
        setSelectedFieldDef,
        addField,
        removeField,
        handlePropertyChange,
        saveForm,
        isSaving,
        isCreating,
        dragOverIndex,
        handleDragOverList,
        handleDropOnList,
        isPreviewMode,
        setIsPreviewMode,
        setFields,
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