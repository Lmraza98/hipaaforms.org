import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { FillInTheBlankFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { useEditableText } from '../../hooks/useEditableText';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { stylePropsToTw } from '@/utils/tw';

/**
 * Split helper – returns the marker to use (defaults to "___").
 */
const getMarker = (fieldDef: FillInTheBlankFieldDefinition) => fieldDef.blankMarker || '___';

type PreviewProps = {
  fieldDef: FillInTheBlankFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
};

export const Preview: React.FC<PreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const marker = getMarker(fieldDef);
  const parts = fieldDef.label.split(marker);
  const blanks = parts.length - 1;

  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLParagraphElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseInputClasses =
    'border-b border-gray-400 mx-1 outline-none text-sm px-1 py-0.5 focus:ring-1 focus:ring-blue-500';

  const editable = !isPreviewMode;

  const renderInput = (idx: number) => {
    if (!fieldApi) {
      return (
        <input
          key={`blank-${idx}`}
          type="text"
          name={`${fieldDef.id}Blank${idx}`}
          id={`${fieldDef.id}Blank${idx}`}
          defaultValue=""
          readOnly
          autoComplete="off"
          className={`${baseInputClasses} ${twText}`}
          style={twInline}
        />
      );
    }

    const valueRaw = fieldApi.state.value;
    const value = blanks === 1 ? (valueRaw as string) ?? '' : (valueRaw as Record<string, string> | undefined)?.[idx] ?? '';

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const nextVal = e.target.value;
      if (blanks === 1) {
        fieldApi.handleChange(nextVal);
      } else {
        const currentObj = (fieldApi.state.value && typeof fieldApi.state.value === 'object' ? fieldApi.state.value : {}) as Record<string, string>;
        fieldApi.handleChange({ ...currentObj, [idx]: nextVal });
      }
    };

    return (
      <input
        key={`blank-${idx}`}
        type="text"
        name={`${fieldApi.name}Blank${idx}`}
        id={`${fieldApi.name}Blank${idx}`}
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onBlur={fieldApi.handleBlur}
        className={`${baseInputClasses} ${twText}`}
        style={twInline}
      />
    );
  };

  return (
    <p
      ref={labelRef}
      className={twText}
      style={twInline}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={editable ? saveLabel : undefined}
    >
      {parts.flatMap((part, idx) => {
        const elements: React.ReactNode[] = [part];
        if (idx < blanks) elements.push(renderInput(idx));
        return elements;
      })}
    </p>
  );
};

// ---------------- Validators --------------------
export const getValidators = (
  fieldDef: FillInTheBlankFieldDefinition,
): { onChange?: ValidatorFn } => {
  const required = fieldDef.validatorsConfig?.required;
  const key = fieldDef.answers;
  const cs = fieldDef.caseSensitive ?? false;

  if (!required && !key) return {};

  const cmp = (a: string, b: string) => (cs ? a === b : a.toLowerCase() === b.toLowerCase());

  return {
    onChange: ({ value }) => {
      // Determine number of blanks
      const blanks = Array.isArray(key) ? key.length : typeof value === 'object' ? Object.keys(value as object).length : 1;
      const vals = blanks === 1 ? [value as string] : Object.values(value as Record<string, string>);

      if (required && vals.some((v) => !v?.trim())) {
        return `${fieldDef.label} is required.`;
      }

      if (key) {
        for (let i = 0; i < key.length; i++) {
          if (!cmp(vals[i] ?? '', key[i])) return 'One or more answers are incorrect.';
        }
      }
      return undefined;
    },
  };
};

export const mapToSchemaType = (): string => 'fillInTheBlank';
