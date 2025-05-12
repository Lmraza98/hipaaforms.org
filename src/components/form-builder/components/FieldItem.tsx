'use client';
import React from 'react';
import { AnyFieldApi, Field } from '@tanstack/react-form';
import { getFieldModule } from '@/components/form-builder/fields';
import { useFieldValidators } from '../hooks/useFieldValidators';
import { FormValues, FormFieldDefinition, TypedFormApi } from '@/components/form-builder/types';

interface FieldInfoProps {
  field: AnyFieldApi;
}

function FieldInfo({ field }: FieldInfoProps) {
  return (
    <div className="text-xs text-red-500 mt-1 h-4">
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p>{field.state.meta.errors.join(', ')}</p>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </div>
  );
}

interface FieldItemProps<T extends FormFieldDefinition> {
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

const FieldItemComponent = <T extends FormFieldDefinition>({ 
  fieldDef, 
  selectedFieldDef, 
  form,
  handleFieldClick, 
  removeField,
  formName,
  setFormName,
  onPropertyChange,
  isPreviewMode,
  justAdded,
}: FieldItemProps<T>) => {
  const { Preview } = getFieldModule(fieldDef.type);
  const fieldValidators = useFieldValidators(fieldDef);

  const isSystemTitleHeading = fieldDef.isSystemGenerated && fieldDef.type === 'Heading';

  // Blue outline state for just added
  const [showOutline, setShowOutline] = React.useState(justAdded);
  React.useEffect(() => {
    if (justAdded) {
      setShowOutline(true);
      const timeout = setTimeout(() => setShowOutline(false), 700); // 700ms matches fadeUp duration
      return () => clearTimeout(timeout);
    }
  }, [justAdded]);

  if (fieldDef.type === 'SubmitButton') {
    const propsForPreview = {
      fieldDef,
      ...(isSystemTitleHeading && { formName, setFormName }),
      onPropertyChange: (property: keyof T, value: T[keyof T]) => 
        onPropertyChange(property, value),
      isPreviewMode,
    };
    return (
      <div 
        onClick={() => !isSystemTitleHeading && !isPreviewMode && handleFieldClick(fieldDef)}
        className={`
          ${!isSystemTitleHeading && !isPreviewMode ? 'cursor-pointer' : 'cursor-default'} 
          ${selectedFieldDef?.id === fieldDef.id && !isSystemTitleHeading && !isPreviewMode ? 'rounded-lg' : ''}
        `}
      >
        <div className={`p-4 rounded-lg bg-white mb-3 ${isPreviewMode ? 'border-transparent' : ''}`}>
          <label className="block mb-1.5 font-medium text-gray-700 text-sm">
            {fieldDef.label || `${fieldDef.type} Field`}
          </label>
          <Preview {...propsForPreview} />
          <div className="flex justify-between items-center mt-2">
            <small className="text-gray-500 text-xs">Type: {fieldDef.type}</small>
            {!isSystemTitleHeading && !isPreviewMode && removeField && (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeField(fieldDef.id); }}
                className="text-red-500 hover:text-red-700 text-xs"
                title="Remove field"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Field
      form={form}
      name={fieldDef.id as keyof FormValues}
      validators={fieldValidators}
    >
      {(fieldApi: AnyFieldApi) => {
        const propsForPreview = {
          fieldDef,
          fieldApi,
          ...(isSystemTitleHeading && { formName, setFormName }),
          onPropertyChange: (property: keyof T, value: T[keyof T]) => {
            onPropertyChange(property, value);
          },
          isPreviewMode,
        };

        const baseClasses = "p-4 rounded-lg bg-white mb-3";
        const selectedClasses = selectedFieldDef?.id === fieldDef.id && !isSystemTitleHeading && !isPreviewMode ? "ring-2 ring-blue-500" : "";
        const justAddedClasses = showOutline ? "ring-2 ring-blue-500" : "";
        return (
          <div
            onClick={() => !isSystemTitleHeading && !isPreviewMode && handleFieldClick(fieldDef)}
            className={`
              ${!isSystemTitleHeading && !isPreviewMode ? 'cursor-pointer' : 'cursor-default'} 
              ${selectedClasses} 
              ${justAddedClasses}
            `}
          >
            <div className={`${baseClasses} ${isPreviewMode ? 'border-transparent' : ''}`}>
              <Preview {...propsForPreview} /> 
              <FieldInfo field={fieldApi} />
            </div>
          </div>
        );
      }}
    </Field>
  );
};

export const FieldItem = React.memo(FieldItemComponent) as typeof FieldItemComponent; 