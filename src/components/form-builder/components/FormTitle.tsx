import React from 'react';
import { TypedFieldItem } from './TypedFieldItem';
import type { FormFieldDefinition, FormValues, TypedFormApi, HeadingFieldDefinition } from '../types';

interface FormTitleProps {
  fieldDef: HeadingFieldDefinition;
  selectedFieldDef: HeadingFieldDefinition | null;
  form: TypedFormApi<FormValues>;
  formName: string;
  setFormName: (name: string) => void;
  onSelect: (field: FormFieldDefinition) => void;
  isPreviewMode: boolean;
}

export const FormTitle = React.memo(({
  fieldDef,
  selectedFieldDef,
  form,
  formName,
  setFormName,
  onSelect,
  isPreviewMode,
}: FormTitleProps) => (
  <div className="form-title">
    <TypedFieldItem
      fieldDef={fieldDef}
      selectedFieldDef={selectedFieldDef}
      form={form}
      formName={formName}
      setFormName={setFormName}
      handleFieldClick={onSelect}
      isPreviewMode={isPreviewMode}
    />
  </div>
));

FormTitle.displayName = 'FormTitle'; 