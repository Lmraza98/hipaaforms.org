import React from 'react';
import { FieldItem } from './FieldItem';
import type { FormFieldDefinition, FormValues, TypedFormApi } from '../types';
import { usePropertyChanger } from '../hooks/usePropertyChanger';

interface TypedFieldItemProps<T extends FormFieldDefinition> {
  fieldDef: T;
  selectedFieldDef: T | null;
  form: TypedFormApi<FormValues>;
  formName?: string;
  setFormName?: (name: string) => void;
  handleFieldClick: (fieldDef: T) => void;
  removeField?: (id: string) => void;
  isPreviewMode?: boolean;
  justAdded?: boolean;
}

export const TypedFieldItem = React.memo(<T extends FormFieldDefinition>({
  fieldDef,
  ...props
}: TypedFieldItemProps<T>) => {
  const change = usePropertyChanger(fieldDef);

  return (
    <FieldItem<T>
      {...props}
      fieldDef={fieldDef}
      onPropertyChange={change}
    />
  );
});

TypedFieldItem.displayName = 'TypedFieldItem'; 