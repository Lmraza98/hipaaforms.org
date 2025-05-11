import {
  FormFieldDefinition,
  BaseFieldDefinition,
  ShortTextFieldDefinition,
  FieldModule,
  FieldRegistry
} from '@/components/form-builder/types';
import * as ShortText from './ShortText';
import * as Email from './Email';
import * as Heading from './Heading';
import * as SubmitButton from './SubmitButton';
import * as Dropdown from './Dropdown';
import * as DefaultField from './DefaultPreview';

export const fieldRegistry: FieldRegistry = {
  ShortText: ShortText as FieldModule<
    Extract<FormFieldDefinition, { type: 'ShortText' }>
  >,
  Email: Email as FieldModule<
    Extract<FormFieldDefinition, { type: 'Email' }>
  >,
  Heading: Heading as FieldModule<
    Extract<FormFieldDefinition, { type: 'Heading' }>
  >,
  SubmitButton: SubmitButton as FieldModule<
    Extract<FormFieldDefinition, { type: 'SubmitButton' }>
  >,
  Dropdown: Dropdown as FieldModule<
    Extract<FormFieldDefinition, { type: 'Dropdown' }>
  >,

  // …other field modules…

  Default: DefaultField as FieldModule<FormFieldDefinition>,
};

export const getFieldModule = <
  T extends FormFieldDefinition['type']
>(
  type: T
): FieldModule<Extract<FormFieldDefinition, { type: T }>> => {
  const fieldModule =
    fieldRegistry[type] as
      | FieldModule<Extract<FormFieldDefinition, { type: T }>>
      | undefined;

  if (fieldModule) return fieldModule;

  return fieldRegistry.Default as FieldModule<
    Extract<FormFieldDefinition, { type: T }>
  >;
};

export const getDefaultFieldDefinition = (
  type: FormFieldDefinition['type'],
  id: string,
  label: string
): FormFieldDefinition => {
  const base: Omit<BaseFieldDefinition, 'type'> = {
    id,
    label,
    placeholder: `Enter ${label.toLowerCase()}`,
    validatorsConfig: { required: false },
  };

  switch (type) {
    case 'ShortText':
    case 'Email':
    case 'FullName':
    case 'Phone':
    case 'Number':
    case 'Time':
    case 'FillInTheBlank':
    case 'Address':
    case 'Appointment':
    case 'Signature':
      return { ...base, type };

    case 'LongText':
      return { ...base, type, rows: 3 };

    case 'Dropdown':
    case 'SingleChoice':
    case 'MultiChoice':
      return { ...base, type, options: ['Option 1', 'Option 2'] };

    case 'DatePicker':
      return { ...base, type };

    case 'Heading':
      return { id, label, type, level: 'h2' };

    case 'Paragraph':
      return {
        id,
        label,
        type,
        content: 'Editable paragraph text...',
      };

    case 'Image':
      return { id, label, type, src: '', alt: 'image' };

    case 'SubmitButton':
      return {
        id,
        label,
        type,
        buttonText: label || 'Submit',
      };

    default:
      console.warn(
        `Unknown field type "${type}", falling back to ShortText.`
      );
      const fallback: ShortTextFieldDefinition = {
        id,
        label,
        placeholder: `Enter ${label.toLowerCase()}`,
        validatorsConfig: { required: false },
        type: 'ShortText',
      };
      return fallback;
  }
};
