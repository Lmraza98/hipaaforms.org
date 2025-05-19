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
import * as FullName from './FullName';
import * as LongText from './LongText';
import * as DefaultField from './DefaultPreview/DefaultPreview';
import * as Address from './Address/Address';
import * as Phone from './Phone/Phone';
import * as DatePicker from './Datepicker/DatePicker';
import * as Appointment from './Appointment';
import * as Signature from './Signature';
import * as FillInTheBlank from './FillInTheBlank';
import * as Paragraph from './Paragraph';
import * as SingleChoice from './SingleChoice';
import * as MultiChoice from './MultiChoice';
import * as NumberField from './Number';
import * as ImageField from './Image/Image';
import * as TimeField from './Time';

export const fieldRegistry: FieldRegistry = {
  Address: Address as FieldModule<
    Extract<FormFieldDefinition, { type: 'Address' }>
  >,
  Appointment: Appointment as FieldModule<
    Extract<FormFieldDefinition, { type: 'Appointment' }>
  >,
  DatePicker: DatePicker as FieldModule<
    Extract<FormFieldDefinition, { type: 'DatePicker' }>
  >,
  Default: DefaultField as FieldModule<FormFieldDefinition>,
  Dropdown: Dropdown as FieldModule<
    Extract<FormFieldDefinition, { type: 'Dropdown' }>
  >,
  Email: Email as FieldModule<
    Extract<FormFieldDefinition, { type: 'Email' }>
  >,
  FillInTheBlank: FillInTheBlank as FieldModule<
    Extract<FormFieldDefinition, { type: 'FillInTheBlank' }>
  >,
  FullName: FullName as FieldModule<
    Extract<FormFieldDefinition, { type: 'FullName' }>
  >,
  Heading: Heading as FieldModule<
    Extract<FormFieldDefinition, { type: 'Heading' }>
  >,
  Image: ImageField as FieldModule<
    Extract<FormFieldDefinition, { type: 'Image' }>
  >,
  LongText: LongText as FieldModule<
    Extract<FormFieldDefinition, { type: 'LongText' }>
  >,
  MultiChoice: MultiChoice as FieldModule<
    Extract<FormFieldDefinition, { type: 'MultiChoice' }>
  >,
  Number: NumberField as FieldModule<
    Extract<FormFieldDefinition, { type: 'Number' }>
  >,
  Paragraph: Paragraph as FieldModule<
    Extract<FormFieldDefinition, { type: 'Paragraph' }>
  >,
  Phone: Phone as FieldModule<
    Extract<FormFieldDefinition, { type: 'Phone' }>
  >,
  ShortText: ShortText as FieldModule<
    Extract<FormFieldDefinition, { type: 'ShortText' }>
  >,
  Signature: Signature as FieldModule<
    Extract<FormFieldDefinition, { type: 'Signature' }>
  >,
  SingleChoice: SingleChoice as FieldModule<
    Extract<FormFieldDefinition, { type: 'SingleChoice' }>
  >,
  SubmitButton: SubmitButton as FieldModule<
    Extract<FormFieldDefinition, { type: 'SubmitButton' }>
  >,
  Time: TimeField as FieldModule<
    Extract<FormFieldDefinition, { type: 'Time' }>
  >,
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
      return {
        ...base,
        type,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        allowMultiple: false,
      } as FormFieldDefinition;

    case 'SingleChoice':
      return {
        ...base,
        type,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      } as FormFieldDefinition;

    case 'MultiChoice':
      return {
        ...base,
        type,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        orientation: 'vertical',
        shuffleOptions: false,
      } as FormFieldDefinition;

    case 'DatePicker':
      return { ...base, type };

    case 'Heading':
      return {
        id,
        label,
        type,
        level: 'h2',
        subheading: '',
        alignment: 'left',
        fontSize: '2xl',
        fontWeight: 'semibold',
        textColor: 'gray-900',
        margin: 'my-1',
      } as FormFieldDefinition;

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
