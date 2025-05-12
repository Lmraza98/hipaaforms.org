import type { FormApi, AnyFieldApi, FormValidateOrFn, FormAsyncValidateOrFn } from '@tanstack/react-form';

export type FormValues = Record<string, unknown>;

export type ValidatorFn<TValue = unknown> = (params: { value: TValue }) => string | undefined | Promise<string | undefined>;

export interface BaseFieldDefinition {
  id: string;
  label: string;
  placeholder?: string;
  isSystemGenerated?: boolean;
  // Generic validators property
  validatorsConfig?: {
    required?: boolean;
    // other generic validator configs like minLength, pattern etc. can go here
    // Field-specific validators will be part of their specific definitions or handled by their modules
  };
}

export interface ShortTextFieldDefinition extends BaseFieldDefinition {
  type: 'ShortText';
  // No specific props for ShortText yet
}

export interface EmailFieldDefinition extends BaseFieldDefinition {
  type: 'Email';
  // No specific props for Email yet
}

export interface LongTextFieldDefinition extends BaseFieldDefinition {
  type: 'LongText';
  rows?: number;
}

export interface FullNameFieldDefinition extends BaseFieldDefinition {
  type: 'FullName';
}

export interface PhoneFieldDefinition extends BaseFieldDefinition {
  type: 'Phone';
}

export interface NumberFieldDefinition extends BaseFieldDefinition {
  type: 'Number';
  min?: number;
  max?: number;
}

export interface TimeFieldDefinition extends BaseFieldDefinition {
  type: 'Time';
}

export interface FillInTheBlankFieldDefinition extends BaseFieldDefinition {
  type: 'FillInTheBlank';
}

export interface ParagraphFieldDefinition extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'> {
  type: 'Paragraph';
  content: string;
  // Label is used as the primary text for paragraph.
}

export interface DatePickerFieldDefinition extends BaseFieldDefinition {
  type: 'DatePicker';
}

export interface DropdownFieldDefinition extends BaseFieldDefinition {
  type: 'Dropdown';
  options: string[];
  allowMultiple?: boolean;
}

export interface HeadingFieldDefinition extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'> {
  type: 'Heading';
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subheading?: string;
  // Label is used as the heading text.
}

export interface SubmitButtonFieldDefinition extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'> {
  type: 'SubmitButton';
  buttonText?: string;
}

export interface AddressFieldDefinition extends BaseFieldDefinition { type: 'Address'; }
export interface AppointmentFieldDefinition extends BaseFieldDefinition { type: 'Appointment'; }
export interface SignatureFieldDefinition extends BaseFieldDefinition { type: 'Signature'; }
export interface SingleChoiceFieldDefinition extends BaseFieldDefinition { type: 'SingleChoice'; options: string[]; }
export interface MultiChoiceFieldDefinition extends BaseFieldDefinition { type: 'MultiChoice'; options: string[]; }
export interface ImageFieldDefinition extends Omit<BaseFieldDefinition, 'placeholder' | 'validatorsConfig'> { type: 'Image'; src?: string; alt?: string; }

export type FormFieldDefinition =
  | ShortTextFieldDefinition
  | EmailFieldDefinition
  | LongTextFieldDefinition
  | FullNameFieldDefinition
  | PhoneFieldDefinition
  | NumberFieldDefinition
  | TimeFieldDefinition
  | FillInTheBlankFieldDefinition
  | ParagraphFieldDefinition
  | DatePickerFieldDefinition
  | DropdownFieldDefinition
  | HeadingFieldDefinition
  | SubmitButtonFieldDefinition
  | AddressFieldDefinition
  | AppointmentFieldDefinition
  | SignatureFieldDefinition
  | SingleChoiceFieldDefinition
  | MultiChoiceFieldDefinition
  | ImageFieldDefinition;

export interface HeadingPreviewProps {
  fieldDef: HeadingFieldDefinition;
  onPropertyChange: (property: keyof HeadingFieldDefinition, value: unknown) => void;
}

export interface FieldCanvasProps {
  fields: FormFieldDefinition[];
  form: TypedFormApi<FormValues>;
  formName?: string;
  setFormName?: (name: string) => void;
  selectedFieldDef: FormFieldDefinition | null;
  dragOverIndex: number | null;
  handleDragOverList: (event: React.DragEvent<Element>, fieldListRefCurrent: HTMLDivElement | null) => void;
  handleDropOnList: (event: React.DragEvent<Element>) => void;
  handleDragStartFromList: (event: React.DragEvent<Element>, fieldDef: FormFieldDefinition, index: number) => void;
  handleDragEndList: (event: React.DragEvent<Element>) => void;
  handleFieldClick: (fieldDef: FormFieldDefinition) => void;
  removeField: (fieldId: string) => void;
  getFieldValidators: (fieldDef: FormFieldDefinition) => { onChange?: FieldValidator<unknown> };
  draggedItemId: string | null;
  setIsPropertiesOpen: (isOpen: boolean) => void;
  onPropertyChange: (propertyKey: string, value: unknown) => void;
}

/**
 * Validator signature for a single field value.
 */
export type FieldValidator<T> = (
  params: { value: T }
) => string | undefined | Promise<string | undefined>;

export interface FieldModule<
  TDef extends FormFieldDefinition = FormFieldDefinition
> {
  Preview: React.FC<{ fieldDef: TDef; fieldApi?: AnyFieldApi }>;
  Settings: React.FC<{
    fieldDef: TDef;
    onPropertyChange: (property: keyof TDef, value: unknown) => void;
  }>;
  /**
   * Return an object whose keys map to validator functions
   */
  getValidators?: (fieldDef: TDef) => {
    onChange?: FieldValidator<unknown>;
  };
  /**
   * Map this fieldDef to the backend schema's fieldType string
   */
  mapToSchemaType?: (fieldDef: TDef) => string;
}

export type FieldType = FormFieldDefinition['type'];

// 2) define a registry type
//    – keys are each FieldType (optional, so you can add modules over time)
//    – plus a mandatory Default entry
export type FieldRegistry = {
  [T in FieldType]?: FieldModule<Extract<FormFieldDefinition, { type: T }>>;
} & {
  Default: FieldModule<FormFieldDefinition>;
};

export interface FormBuilderContextValue {
  // state
  fields: FormFieldDefinition[];
  formName: string;
  formDescription: string;
  currentVersion: number;
  selectedFieldDef: FormFieldDefinition | null;
  isPreviewMode: boolean;

  // setters
  setFields: React.Dispatch<React.SetStateAction<FormFieldDefinition[]>>;
  setFormName: (name: string) => void;
  setFormDescription: (desc: string) => void;
  setSelectedFieldDef: (field: FormFieldDefinition | null) => void;
  setIsPreviewMode: (isPreview: boolean) => void;

  // actions
  addField: (type: FormFieldDefinition['type'], label?: string, index?: number) => void;
  removeField: (fieldId: string) => void;
  handlePropertyChange: (propertyKey: string, value: unknown) => void;
  saveForm: () => void;

  // UI state
  isSaving: boolean;
  isCreating: boolean;

  // drag/drop
  dragOverIndex: number | null;
  handleDragOverList: (e: React.DragEvent, ref: HTMLDivElement | null) => void;
  handleDropOnList: (e: React.DragEvent) => void;
}

export interface FormBuilderProviderProps {
  formId: string;
  initialFieldsData: FormFieldDefinition[];
  initialName: string;
  initialDescription: string;
  initialVersion: number;
  userRole: string;
  children: React.ReactNode;
}

export type TypedFormApi<TValues extends object> = FormApi<
  TValues,
  FormValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  FormAsyncValidateOrFn<TValues> | undefined,
  unknown
>