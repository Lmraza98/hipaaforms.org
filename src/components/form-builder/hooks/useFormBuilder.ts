import { useState, useCallback } from 'react';
import { trpc } from '@/trpc/client';
import { FormFieldDefinition, FormValues } from '@/components/form-builder/types'; // Assuming types are here
import { getDefaultFieldDefinition } from '@/components/form-builder/fields';
import type { UserRole } from '@/server/trpc/routers/form'; // Import UserRole
import type { FormApi, FormValidateOrFn, FormAsyncValidateOrFn } from '@tanstack/react-form'
import { mapToInputSchema } from '@/utils/fieldMapper'; // Corrected path
// 1) Create a named alias for your form instance:

// Ensure all field types listed in Palette are defined above

let fieldIdCounter = 1;
const getNewFieldId = (type: FormFieldDefinition['type']) => `${type.toLowerCase().replace(/\s+/g, '_')}_new_${fieldIdCounter++}`; // Added _new_ to distinguish from potentially existing ids

// FormValues will be a Record of fieldId to its value type

// type FormBuilderForm = ReturnType<typeof useForm<FormValues>>

interface UseFormBuilderProps {
    formId: string;
    initialFieldsData?: FormFieldDefinition[];
    initialName: string;
    initialDescription: string;
    initialVersion: number;
    form: FormApi<
      FormValues,
      FormValidateOrFn<FormValues> | undefined,
      FormValidateOrFn<FormValues> | undefined,
      FormAsyncValidateOrFn<FormValues> | undefined,
      FormValidateOrFn<FormValues> | undefined,
      FormAsyncValidateOrFn<FormValues> | undefined,
      FormValidateOrFn<FormValues> | undefined,
      FormAsyncValidateOrFn<FormValues> | undefined,
      FormAsyncValidateOrFn<FormValues> | undefined,
      unknown
    >;
    userRole: string;          // ← add this line
}

interface FormUpdateMutationSuccessData {
  id?: string;
  version?: number;
  name?: string | null;
  description?: string | null;
  userRole?: UserRole;
}

export function useFormBuilder({
  formId,
  initialFieldsData,
  initialName,
  initialDescription,
  initialVersion,
  form,
}: UseFormBuilderProps) {
  const [fields, setFields] = useState<FormFieldDefinition[]>(initialFieldsData || []);
  const [formName, setFormName] = useState<string>(initialName);
  const [formDescription, setFormDescription] = useState<string>(initialDescription);
  const [currentVersion, setCurrentVersion] = useState<number>(initialVersion);
  const [selectedFieldDef, setSelectedFieldDef] = useState<FormFieldDefinition | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const createFormMutation = trpc.form.create.useMutation({
    onSuccess: (data: { id: string; version?: number }) => {
      alert('Form created successfully! (Simulated)');
      console.log('Created form with ID:', data.id);
      // Potentially update formId in component state or navigate
      // For now, the component using the hook can decide how to handle this
      if (data.version) {
        setCurrentVersion(data.version);
      }
    },
    onError: (error: { message: string }) => {
      console.error('Error creating form (Simulated):', error);
      alert(`Error creating form: \${error.message}.`);
    },
  });

  const updateFormMutation = trpc.form.update.useMutation({
    onSuccess: (data: FormUpdateMutationSuccessData | null) => {
      alert('Form structure saved successfully! (Simulated)');
      if (data && typeof data.version === 'number') {
        setCurrentVersion(data.version);
      }
    },
    onError: (error: { message: string }) => {
      console.error('Error saving form structure (Simulated):', error);
      alert(`Error saving form structure: ${error.message}.`);
    },
  });

  const addField = useCallback((type: FormFieldDefinition['type'], label?: string, index?: number) => {
    const newFieldId = getNewFieldId(type);
    const newField = getDefaultFieldDefinition(type, newFieldId, label || `${type} Field`);
    setFields((currentFields) => {
      const newFields = [...currentFields];
      let targetIndex: number;

      if (index !== undefined) {
        // If an index is explicitly passed (e.g., from drag and drop)
        targetIndex = index;
      } else if (selectedFieldDef) {
        // If a field is selected, insert below it
        const selectedIdx = currentFields.findIndex(f => f.id === selectedFieldDef.id);
        targetIndex = selectedIdx !== -1 ? selectedIdx + 1 : currentFields.length;
      } else {
        // Otherwise, add to the end
        targetIndex = currentFields.length;
      }
      
      newFields.splice(targetIndex, 0, newField);
      return newFields;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setFieldValue(newField.id as keyof FormValues, '' as any);
  }, [form, selectedFieldDef]);

  const removeField = useCallback((fieldId: string) => {
    setFields((currentFields) => currentFields.filter(f => f.id !== fieldId));
    setSelectedFieldDef(prev => prev?.id === fieldId ? null : prev);
    // If you have a way to remove field from TanStack form instance:
    // form.removeField(fieldId); // This is hypothetical
  }, [form]); // form dependency might be needed if interacting with it

  const handlePropertyChange = useCallback((propertyKey: string, value: unknown) => {
    if (!selectedFieldDef) return;
    const tempUpdatedField = { ...selectedFieldDef };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tempUpdatedField as any)[propertyKey] = value;
    const updatedField = tempUpdatedField as FormFieldDefinition;

    setFields((prevFields) =>
      prevFields.map((f) =>
        f.id === selectedFieldDef.id ? updatedField : f
      )
    );
    setSelectedFieldDef(updatedField); // Keep the selected field updated
  }, [selectedFieldDef]);


  const saveForm = useCallback(() => {
    const currentFormIdForMutation = formId.startsWith('new-form-') ? undefined : formId;
    
    const fieldsForMutation = fields.map((field, index) => mapToInputSchema(field, index));

    if (currentFormIdForMutation && updateFormMutation) {
       updateFormMutation.mutate({
        id: currentFormIdForMutation,
        name: formName,
        description: formDescription,
        fields: fieldsForMutation,
        version: currentVersion,
      });
    } else if (createFormMutation) {
      createFormMutation.mutate({
        name: formName,
        description: formDescription,
        organizationId: "clxulb602000008jrftmg826j", // FIXME: Hardcoded orgId - should come from props or context
        fields: fieldsForMutation,
      });
    }
  }, [formId, formName, formDescription, fields, currentVersion, updateFormMutation, createFormMutation]);
  
  // Drag Handlers
  const handleDragOverList = useCallback((event: React.DragEvent<Element>, fieldListRefCurrent: HTMLDivElement | null) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    if (!fieldListRefCurrent) return;

    // Get all field items (excluding the form title and drop placeholders)
    const fieldItems = Array.from(fieldListRefCurrent.querySelectorAll('.field-item')) as HTMLElement[];
    const mouseY = event.clientY;
    let newIndex = fields.length;

    // If there are no fields, allow dropping at index 0
    if (fieldItems.length === 0) {
      setDragOverIndex(0);
      return;
    }

    // Find the closest field item to the mouse position
    for (let i = 0; i < fieldItems.length; i++) {
      const item = fieldItems[i];
      const rect = item.getBoundingClientRect();
      const itemMiddle = rect.top + rect.height / 2;

      // If mouse is above the middle of the first item, drop at index 0
      if (i === 0 && mouseY < itemMiddle) {
        newIndex = 0;
        break;
      }

      // If mouse is below the middle of the current item
      if (mouseY > itemMiddle) {
        // If this is the last item or mouse is above the middle of the next item
        if (i === fieldItems.length - 1 || mouseY < fieldItems[i + 1].getBoundingClientRect().top + fieldItems[i + 1].getBoundingClientRect().height / 2) {
          newIndex = i;
          break;
        }
      }
    }

    if (dragOverIndex !== newIndex) {
      setDragOverIndex(newIndex);
    }
  }, [fields.length, dragOverIndex]);
  
  const handleDropOnList = useCallback((event: React.DragEvent<Element>) => {
    event.preventDefault();
    const typeFromPalette = event.dataTransfer.getData('application/form-field-type') as FormFieldDefinition['type'];
    const labelFromPalette = event.dataTransfer.getData('application/form-field-label');

    if (typeFromPalette && labelFromPalette) {
      const targetIndex = dragOverIndex !== null ? dragOverIndex : fields.length;
      addField(typeFromPalette, labelFromPalette, targetIndex);
      setDragOverIndex(null); // Reset drag over index after drop
    }
  }, [dragOverIndex, fields.length, addField]);

  return {
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
    saveForm,
    handlePropertyChange,
    isSaving: updateFormMutation.isPending,
    isCreating: createFormMutation.isPending,
    dragOverIndex,
    handleDragOverList,
    handleDropOnList,
    isPreviewMode,
    setIsPreviewMode,
  };
}

// Helper for getFieldValidators (to be used in the component or passed if complex)
// For now, this logic remains in FormBuilderClient.tsx as it depends on form.Field

// </rewritten_file> 