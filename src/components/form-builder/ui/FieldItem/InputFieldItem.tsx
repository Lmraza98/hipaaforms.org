import React, { useCallback } from 'react';
import { Field, AnyFieldApi } from '@tanstack/react-form';
import { useFieldValidators } from '../../hooks/useFieldValidators';
import { FieldInfo } from './FieldInfo';
import { getContainerClasses } from './getContainerClasses';
import { useFlashOutline } from './useFlashOutline';
import { usePreviewProps } from './usePreviewProps';
import type { FieldItemProps } from './types';
import type { FormValues, FormFieldDefinition } from '../../types';

export function InputFieldItem<T extends FormFieldDefinition>({
  fieldDef, form, selectedFieldDef, handleFieldClick,
  onPropertyChange, formName, setFormName, isPreviewMode = false, justAdded = false
}: FieldItemProps<T>) {
  const validators = useFieldValidators(fieldDef);
  const showOutline = useFlashOutline(justAdded);

  const onClick = useCallback(() => {
    if (!fieldDef.isSystemGenerated && !isPreviewMode) {
      handleFieldClick(fieldDef);
    }
  }, [fieldDef, handleFieldClick, isPreviewMode]);

  const previewProps = usePreviewProps({
    fieldDef, formName, setFormName, onPropertyChange, isPreviewMode
  });

  return (
    <Field
      form={form}
      name={fieldDef.id as keyof FormValues}
      validators={validators}
    >
      {(fieldApi: AnyFieldApi) => {
        const updatedPreviewProps = {
          ...previewProps,
          props: {
            ...previewProps.props,
            fieldApi
          }
        };

        return (
          <div onClick={onClick} className={getContainerClasses({
            isSystem: fieldDef.isSystemGenerated ?? false,
            isSelected: selectedFieldDef?.id === fieldDef.id,
            isPreviewMode, showOutline
          })}>
            <div className="p-4 rounded-lg bg-white mb-3">
              <updatedPreviewProps.Component {...updatedPreviewProps.props} />
              <FieldInfo field={fieldApi} />
            </div>
          </div>
        );
      }}
    </Field>
  );
}

export const MemoizedInputFieldItem = React.memo(InputFieldItem) as typeof InputFieldItem; 