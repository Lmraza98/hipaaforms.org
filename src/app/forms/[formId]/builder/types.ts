export type ValidatorFn<TValue = unknown> = (params: { value: TValue }) => string | undefined | Promise<string | undefined>;

export interface BaseFieldDefinition {
  id: string;
  label: string;
  placeholder?: string;
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