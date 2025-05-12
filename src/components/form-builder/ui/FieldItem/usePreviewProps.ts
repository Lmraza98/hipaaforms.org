import { getFieldModule } from '../../fields';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { FormFieldDefinition } from '../../types';

type PreviewProps<T extends FormFieldDefinition> = {
  fieldDef: T;
  fieldApi?: AnyFieldApi;
  formName?: string;
  setFormName?: (n: string) => void;
  onPropertyChange: <K extends keyof T>(k: K, v: T[K]) => void;
  isPreviewMode?: boolean;
};

export function usePreviewProps<T extends FormFieldDefinition>(params: PreviewProps<T>) {
  const { fieldDef, fieldApi, formName, setFormName, onPropertyChange, isPreviewMode } = params;
  const { Preview } = getFieldModule(fieldDef.type);
  const props: PreviewProps<T> = { fieldDef, onPropertyChange, isPreviewMode };
  if (fieldApi) props.fieldApi = fieldApi;
  if (fieldDef.type === 'Heading') {
    props.formName = formName;
    props.setFormName = setFormName;
  }
  return { Component: Preview, props };
} 