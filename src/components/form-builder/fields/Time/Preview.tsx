import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { TimeFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

/** Build props that work both in palette preview (no fieldApi) and runtime */
const getInputProps = (fieldDef: TimeFieldDefinition, fieldApi?: AnyFieldApi) => {
  if (!fieldApi) {
    // In the palette we just render a read-only input with placeholder/value
    return {
      id: fieldDef.id,
      name: fieldDef.id,
      defaultValue: '',
      readOnly: true,
    } as const;
  }

  return {
    id: fieldApi.name,
    name: fieldApi.name,
    value: fieldApi.state.value ?? '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => fieldApi.handleChange(e.target.value),
  } as const;
};

interface PreviewProps {
  fieldDef: TimeFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (txt) => change('label', txt),
  );

  const editable = !isPreviewMode;

  const widthClass = fieldDef.width ?? 'w-full';

  // Derive Tailwind classes from style props (text color, weight, etc.)
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseInputClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700';

  const inputProps = getInputProps(fieldDef, fieldApi);

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      <label
        ref={labelRef}
        htmlFor={inputProps.id}
        className={`block mb-1 font-medium ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={editable ? saveLabel : undefined}
      />

      <input
        type="time"
        {...inputProps}
        className={`${baseInputClasses} ${widthClass}`}
        placeholder={fieldDef.placeholder}
        autoComplete={fieldDef.autocompleteAttr ?? 'off'}
        min={fieldDef.minTime}
        max={fieldDef.maxTime}
        step={(fieldDef.stepMinutes ?? 1) * 60}
      />
    </div>
  );
};

// ------------------- Validators & schema mapping -------------------------
export const getValidators = (fieldDef: TimeFieldDefinition): { onChange?: ValidatorFn } => {
  const req = fieldDef.validatorsConfig?.required;
  const { minTime, maxTime } = fieldDef;

  if (!req && !minTime && !maxTime) return {};

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  return {
    onChange: ({ value }) => {
      const val = value as string | undefined;
      if (req && !val) return `${fieldDef.label} is required.`;
      if (!val) return undefined;

      if (minTime && toMinutes(val) < toMinutes(minTime)) {
        return `Time must be after ${minTime}.`;
      }
      if (maxTime && toMinutes(val) > toMinutes(maxTime)) {
        return `Time must be before ${maxTime}.`;
      }
      return undefined;
    },
  };
};

export const mapToSchemaType = (): string => 'time';
