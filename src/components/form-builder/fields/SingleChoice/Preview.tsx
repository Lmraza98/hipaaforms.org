'use client';
import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { SingleChoiceFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

// Fisher–Yates shuffle (immutable)
function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PreviewProps {
  fieldDef: SingleChoiceFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const editable = !isPreviewMode;

  // Style props → TW classes / inline styles
  const { className: twClass, style: twInline } = stylePropsToTw(fieldDef);

  // Normalize options shape for backward compatibility (support string[])
  const normalizedOptions = React.useMemo(
    () =>
      (fieldDef.options ?? []).map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt,
      ),
    [fieldDef.options],
  );

  // Handle option shuffling if enabled (stable between renders)
  const options = React.useMemo(
    () => (fieldDef.shuffleOptions ? shuffle(normalizedOptions) : normalizedOptions),
    [fieldDef.shuffleOptions, normalizedOptions],
  );

  const wrapperLayout = fieldDef.orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-1';

  return (
    <div className={`${wrapperLayout} ${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''}`}>
      {/* Editable label */}
      <label
        ref={labelRef}
        className={`block mb-1 font-medium ${twClass} ${editable ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={editable ? saveLabel : undefined}
      />

      {/* Radio options */}
      <div className={`${twClass}`} style={twInline}>
        {options.map((o) => (
          <label key={o.value} className="inline-flex items-center text-sm text-gray-700">
            <input
              type="radio"
              id={`${fieldApi ? fieldApi.name : fieldDef.id}_${o.value}`}
              name={fieldApi ? fieldApi.name : fieldDef.id}
              value={o.value}
              checked={fieldApi ? fieldApi.state.value === o.value : false}
              disabled={!fieldApi}
              onChange={(e) => fieldApi?.handleChange(e.target.value)}
              autoComplete={fieldDef.autocompleteAttr ?? 'off'}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            {o.label ?? o.value}
          </label>
        ))}
      </div>
    </div>
  );
};

// ---------------- Validators & schema helpers ------------------

export const getValidators = (
  fieldDef: SingleChoiceFieldDefinition,
): { onChange?: ValidatorFn } => {
  return fieldDef.validatorsConfig?.required
    ? {
        onChange: ({ value }) => {
          if (!value) return `${fieldDef.label} is required.`;
          return undefined;
        },
      }
    : {};
};

export const mapToSchemaType = (): string => 'radio';
