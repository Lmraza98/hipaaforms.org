import { useState, useCallback, useRef } from 'react';
import { trpc } from '@/trpc/client';
import { FormFieldDefinition, FormValues } from '@/components/form-builder/types'; // Assuming types are here
import { getDefaultFieldDefinition } from '@/components/form-builder/fields';
import type { UserRole } from '@/server/trpc/routers/form'; // Import UserRole
import type { FormApi } from '@tanstack/react-form'
import { mapToInputSchema } from '@/utils/fieldMapper'; // Corrected path
// 1) Create a named alias for your form instance:

// Ensure all field types listed in Palette are defined above
const ALL_FIELD_TYPES: FormFieldDefinition['type'][] = [
    'Heading', 'FullName', 'Email', 'Address', 'Phone', 'DatePicker', 'Appointment',
    'Signature', 'FillInTheBlank', 'ShortText', 'LongText', 'Paragraph',
    'Dropdown', 'SingleChoice', 'MultiChoice', 'Number', 'Image', 'Time', 'SubmitButton'
];

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
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
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
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const draggedItem = useRef<FormFieldDefinition | null>(null);
  const draggedItemIndex = useRef<number | null>(null);

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
    const newField = getDefaultFieldDefinition(type, newFieldId, label || `\${type} Field`);
    setFields((currentFields) => {
      const newFields = [...currentFields];
      const targetIndex = index !== undefined ? index : currentFields.length;
      newFields.splice(targetIndex, 0, newField);
      return newFields;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setFieldValue(newField.id as keyof FormValues, '' as any);
  }, [form]);

  const removeField = useCallback((fieldId: string) => {
    setFields((currentFields) => currentFields.filter(f => f.id !== fieldId));
    setSelectedFieldDef(prev => prev?.id === fieldId ? null : prev);
    // If you have a way to remove field from TanStack form instance:
    // form.removeField(fieldId); // This is hypothetical
  }, [form]); // form dependency might be needed if interacting with it

  const reorderField = useCallback((startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;
    setFields(prevFields => {
      const newFields = [...prevFields];
      const [movedItem] = newFields.splice(startIndex, 1);
      newFields.splice(endIndex, 0, movedItem);
      return newFields;
    });
  }, []);
  
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
  const handleDragStartFromList = useCallback((event: React.DragEvent<Element>, fieldDef: FormFieldDefinition, index: number) => {
    draggedItem.current = fieldDef;
    draggedItemIndex.current = index;
    setDraggedItemId(fieldDef.id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/form-field-id', fieldDef.id);
    event.dataTransfer.setData('application/form-field-type', fieldDef.type);
  }, []);

  const handleDragEndList = useCallback(() => {
    draggedItem.current = null;
    draggedItemIndex.current = null;
    setDragOverIndex(null);
    setDraggedItemId(null);
  }, []);

  const handleDragOverList = useCallback((event: React.DragEvent<Element>, fieldListRefCurrent: HTMLDivElement | null) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    if (!fieldListRefCurrent) return;

    const listItems = Array.from(fieldListRefCurrent.children) as HTMLElement[];
    const mouseY = event.clientY;
    let newIndex = fields.length;

    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      if (item.classList.contains('drop-placeholder')) continue; 
      
      const rect = item.getBoundingClientRect();
      if (mouseY < rect.top + rect.height / 2) {
        newIndex = i;
        break;
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
    const droppedFieldId = event.dataTransfer.getData('application/form-field-id');

    const targetDropIndex = dragOverIndex !== null ? dragOverIndex : fields.length;

    if (droppedFieldId && draggedItemIndex.current !== null) {
      if (draggedItemIndex.current !== targetDropIndex) {
        const effectiveTargetIndex = draggedItemIndex.current < targetDropIndex ? targetDropIndex -1 : targetDropIndex;
        reorderField(draggedItemIndex.current, effectiveTargetIndex);
      }
    } else if (typeFromPalette && ALL_FIELD_TYPES.includes(typeFromPalette)) {
      addField(typeFromPalette, labelFromPalette, targetDropIndex);
    } else {
      console.error('Invalid drop operation. Data:', { typeFromPalette, droppedFieldId });
    }
  }, [dragOverIndex, fields.length, addField, reorderField]);

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
    reorderField,
    saveForm,
    handlePropertyChange,
    isSaving: updateFormMutation.isPending,
    isCreating: createFormMutation.isPending,
    dragOverIndex,
    draggedItemId,
    handleDragStartFromList,
    handleDragEndList,
    handleDragOverList,
    handleDropOnList,
  };
}

// Helper for getFieldValidators (to be used in the component or passed if complex)
// For now, this logic remains in FormBuilderClient.tsx as it depends on form.Field

// </rewritten_file> 