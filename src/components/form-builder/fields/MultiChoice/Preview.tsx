'use client';
import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { MultiChoiceFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { stylePropsToTw } from '@/utils/tw';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';

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
  fieldDef: MultiChoiceFieldDefinition;
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

  // Ensure options have { value, label }
  const normalizedOptions = React.useMemo(
    () =>
      (fieldDef.options ?? []).map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt,
      ),
    [fieldDef.options],
  );

  // Shuffle if requested (stable per render)
  const options = React.useMemo(
    () => (fieldDef.shuffleOptions ? shuffle(normalizedOptions) : normalizedOptions),
    [fieldDef.shuffleOptions, normalizedOptions],
  );

  const selected: string[] = fieldApi?.state.value ?? [];

  // Toggle helper respecting min/max selections at runtime (best-effort UX guard)
  const toggle = (val: string) => {
    if (!fieldApi) return;
    const currentlySelected = selected.includes(val);
    const next = currentlySelected ? selected.filter((v) => v !== val) : [...selected, val];

    // Guard maxSelections when adding
    if (!currentlySelected && fieldDef.maxSelections !== undefined && next.length > fieldDef.maxSelections) {
      return; // ignore selection beyond max
    }
    // Guard minSelections when removing
    if (currentlySelected && fieldDef.minSelections !== undefined && next.length < fieldDef.minSelections) {
      return; // prevent dropping below min
    }

    fieldApi.handleChange(next);
  };

  const wrapperLayout =
    fieldDef.orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-1';

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''}`}>
      {/* Editable label */}
      <label
        ref={labelRef}
        className={`block mb-1 font-medium ${twClass} ${editable ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={editable ? saveLabel : undefined}
      />

      {/* Checkboxes */}
      <div className={`${wrapperLayout} ${twClass}`} style={twInline}>
        {options.map((o) => {
          const id = `${fieldApi ? fieldApi.name : fieldDef.id}_${o.value}`;
          const checked = selected.includes(o.value);
          return (
            <label key={o.value} htmlFor={id} className="inline-flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                id={id}
                name={fieldApi ? fieldApi.name : fieldDef.id + '[]'}
                value={o.value}
                checked={checked}
                disabled={!fieldApi}
                onChange={() => toggle(o.value)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              {o.label ?? o.value}
            </label>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- Validators & schema helpers ------------------

export const getValidators = (
  fieldDef: MultiChoiceFieldDefinition,
): { onChange?: ValidatorFn } => {
  const req = fieldDef.validatorsConfig?.required;
  const min = fieldDef.minSelections;
  const max = fieldDef.maxSelections;

  if (!req && min === undefined && max === undefined) return {};

  return {
    onChange: ({ value }) => {
      const arr = Array.isArray(value) ? value : [];
      if (req && arr.length === 0) {
        return `${fieldDef.label} is required.`;
      }
      if (min !== undefined && arr.length < min) {
        return `Select at least ${min}.`;
      }
      if (max !== undefined && arr.length > max) {
        return `Select at most ${max}.`;
      }
      return undefined;
    },
  };
};

export const mapToSchemaType = (): string => 'checkboxes'; 