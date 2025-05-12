import { FormValues, FormFieldDefinition, TypedFormApi } from '../../types';

export interface FieldItemProps<T extends FormFieldDefinition> {
  fieldDef: T;
  selectedFieldDef: T | null;
  form: TypedFormApi<FormValues>;
  handleFieldClick: (fieldDef: T) => void;
  removeField?: (fieldId: T['id']) => void;
  formName?: string;
  setFormName?: (name: string) => void;
  onPropertyChange: <K extends keyof T>(propertyKey: K, value: T[K]) => void;
  isPreviewMode?: boolean;
  justAdded?: boolean;
} 