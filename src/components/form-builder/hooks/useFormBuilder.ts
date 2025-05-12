import { useReducer, useCallback, useMemo } from 'react';
import type { FormFieldDefinition, FormValues, TypedFormApi } from '../types';
import { formBuilderReducer, initialState } from './formBuilderReducer';
import { useFormMutations } from './useFormMutations';
import { makeNewField, mapFieldsForServer, calculateDropIndex } from '../utils/fieldHelpers';

interface UseFormBuilderProps {
  formId: string;
  initialFieldsData?: FormFieldDefinition[];
  initialName: string;
  initialDescription: string;
  initialVersion: number;
  form: TypedFormApi<FormValues>
}

export function useFormBuilder({
  formId,
  initialFieldsData,
  initialName,
  initialDescription,
  initialVersion,
  form,
}: UseFormBuilderProps) {
  const [state, dispatch] = useReducer(
    formBuilderReducer,
    initialState({
      initialFields: initialFieldsData,
      initialName,
      initialDescription,
      initialVersion,
    })
  );

  const {
    fields,
    formName,
    formDescription,
    version,
    selectedFieldId,
    dragOverIndex,
    isPreviewMode,
  } = state;

  const { create, update, save } = useFormMutations();

  const selectedFieldDef = useMemo(
    () => fields.find(f => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  );

  const setFormName = useCallback(
    (name: string) => dispatch({ type: 'SET_NAME', name }),
    []
  );

  const setFormDescription = useCallback(
    (description: string) => dispatch({ type: 'SET_DESCRIPTION', description }),
    []
  );

  const setSelectedFieldDef = useCallback(
    (field: FormFieldDefinition | null) => dispatch({ type: 'SELECT_FIELD', fieldId: field?.id ?? null }),
    []
  );

  const setIsPreviewMode = useCallback(
    (on: boolean) => dispatch({ type: 'TOGGLE_PREVIEW', on }),
    []
  );

  const addField = useCallback(
    (type: FormFieldDefinition['type'], label?: string, atIndex?: number) => {
      const newField = makeNewField(type, label);
      dispatch({
        type: 'ADD_FIELD',
        field: newField,
        atIndex,
      });
      form.setFieldValue(newField.id as keyof FormValues, '');
    },
    [form]
  );

  const removeField = useCallback((fieldId: string) => {
    dispatch({ type: 'REMOVE_FIELD', fieldId });
  }, []);

  const handlePropertyChange = useCallback(
    (propertyKey: string, value: unknown) => {
      if (!selectedFieldId) return;
      dispatch({
        type: 'CHANGE_PROPERTY',
        fieldId: selectedFieldId,
        propertyKey,
        value,
      });
    },
    [selectedFieldId]
  );

  const saveForm = useCallback(() => {
    const currentFormIdForMutation = formId.startsWith('new-form-') ? undefined : formId;
    
    const payload = {
      id: currentFormIdForMutation,
      name: formName,
      description: formDescription,
      version,
      fields: mapFieldsForServer(fields),
    };

    save(payload);
  }, [formId, formName, formDescription, version, fields, save]);

  const handleDragOverList = useCallback(
    (event: React.DragEvent<Element>, fieldListRefCurrent: HTMLDivElement | null) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      
      const newIndex = calculateDropIndex(event, fieldListRefCurrent, fields.length);
      if (dragOverIndex !== newIndex) {
        dispatch({ type: 'SET_DRAG_OVER', index: newIndex });
      }
    },
    [dragOverIndex, fields.length]
  );

  const handleDropOnList = useCallback(
    (event: React.DragEvent<Element>) => {
      event.preventDefault();
      const typeFromPalette = event.dataTransfer.getData('application/form-field-type') as FormFieldDefinition['type'];
      const labelFromPalette = event.dataTransfer.getData('application/form-field-label');

      if (typeFromPalette && labelFromPalette) {
        const targetIndex = dragOverIndex !== null ? dragOverIndex : fields.length;
        addField(typeFromPalette, labelFromPalette, targetIndex);
        dispatch({ type: 'SET_DRAG_OVER', index: null });
      }
    },
    [dragOverIndex, fields.length, addField]
  );

  const handleDragEnd = useCallback(() => {
    dispatch({ type: 'DRAG_END' });
  }, []);

  const setFields = useCallback((newOrder: FormFieldDefinition[]) => {
    dispatch({ type: 'SET_FIELDS', fields: newOrder });
  }, []);

  const saveError = create.error ?? update.error;

  return useMemo(() => ({
    fields,
    formName,
    formDescription,
    currentVersion: version,
    selectedFieldDef,
    dragOverIndex,
    isPreviewMode,
    setFormName,
    setFormDescription,
    setSelectedFieldDef,
    setIsPreviewMode,
    addField,
    removeField,
    handlePropertyChange,
    saveForm,
    handleDragOverList,
    handleDropOnList,
    handleDragEnd,
    setFields,
    isSaving: update.isPending,
    isCreating: create.isPending,
    createError: create.error,
    updateError: update.error,
    saveError,
  }), [
    fields,
    formName,
    formDescription,
    version,
    selectedFieldDef,
    dragOverIndex,
    isPreviewMode,
    setFormName,
    setFormDescription,
    setSelectedFieldDef,
    setIsPreviewMode,
    addField,
    removeField,
    handlePropertyChange,
    saveForm,
    handleDragOverList,
    handleDropOnList,
    handleDragEnd,
    setFields,
    create.isPending,
    update.isPending,
    create.error,
    update.error,
    saveError,
  ]);
}