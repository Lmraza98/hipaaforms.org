import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';

import {
  FormFieldDefinition,
  BaseFieldDefinition,
  ShortTextFieldDefinition,
} from '@/app/forms/[formId]/builder/types';

import * as ShortText from './ShortText';
import * as Email from './Email';
import * as Heading from './Heading';
import * as SubmitButton from './SubmitButton';
import * as Dropdown from './Dropdown';
// …import other field modules as you create them…
import * as DefaultField from './DefaultPreview';

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

type FieldType = FormFieldDefinition['type'];

// 2) define a registry type
//    – keys are each FieldType (optional, so you can add modules over time)
//    – plus a mandatory Default entry
type FieldRegistry = {
  [T in FieldType]?: FieldModule<Extract<FormFieldDefinition, { type: T }>>;
} & {
  Default: FieldModule<FormFieldDefinition>;
};

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
