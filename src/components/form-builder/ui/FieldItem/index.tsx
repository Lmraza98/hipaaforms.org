import React from 'react';
import type { FormFieldDefinition } from '../../types';
import type { FieldItemProps } from './types';
import { SubmitButtonItem } from './SubmitButtonItem';
import { InputFieldItem } from './InputFieldItem';

export function FieldItem<T extends FormFieldDefinition>(props: FieldItemProps<T>) {
  return props.fieldDef.type === 'SubmitButton'
    ? <SubmitButtonItem {...props} />
    : <InputFieldItem {...props} />;
}

export const MemoizedFieldItem = React.memo(FieldItem) as typeof FieldItem;

export * from './types';
export * from './FieldInfo';
export * from './useFlashOutline';
export * from './usePreviewProps';
export * from './getContainerClasses'; 