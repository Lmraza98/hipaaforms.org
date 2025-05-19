'use client';
import React, { ChangeEvent } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { AppointmentFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { stylePropsToTw } from '@/utils/tw';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';

// -------------------- helpers -------------------------

/**
 * Build unified props for the underlying <input>. Works for both palette
 * preview (no fieldApi) and live form runtime (with fieldApi).
 */
const getInputProps = (
  fieldDef: AppointmentFieldDefinition,
  fieldApi?: AnyFieldApi,
) => {
  const layout: NonNullable<AppointmentFieldDefinition['appointmentLayout']> =
    fieldDef.appointmentLayout ?? 'datetime';

  const autoComplete = fieldDef.autocompleteAttr ?? 'off';

  // Attributes common to both preview + live modes
  const baseAttrs = {
    autoComplete,
    step: fieldDef.stepMinutes ? fieldDef.stepMinutes * 60 : undefined,
    // Date-specific
    min: layout !== 'timeOnly' ? fieldDef.minDate : fieldDef.minTime,
    max: layout !== 'timeOnly' ? fieldDef.maxDate : fieldDef.maxTime,
  } as const;

  if (!fieldApi) {
    return {
      readOnly: true,
      placeholder: fieldDef.placeholder ?? '',
      value: '',
      ...baseAttrs,
    } as const;
  }

  // Sanitize dots so Chrome autocomplete works
  const baseName = fieldApi.name.replace(/\./g, '');
  let id = baseName;
  if (layout === 'dateOnly') id = `${baseName}Date`;
  else if (layout === 'timeOnly') id = `${baseName}Time`;

  return {
    id,
    name: id,
    value: (fieldApi.state.value as string) || '',
    onBlur: fieldApi.handleBlur,
    onChange: (e: ChangeEvent<HTMLInputElement>) => fieldApi.handleChange(e.target.value),
    ...baseAttrs,
  } as const;
};

// ------------------- component ------------------------

interface AppointmentPreviewProps {
  fieldDef: AppointmentFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<AppointmentPreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseInputClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900';

  const widthClass = fieldDef.width ?? 'w-full';

  const layout: NonNullable<AppointmentFieldDefinition['appointmentLayout']> =
    fieldDef.appointmentLayout ?? 'datetime';

  const inputType =
    layout === 'datetime' ? 'datetime-local' : layout === 'dateOnly' ? 'date' : 'time';

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      <label
        ref={labelRef}
        htmlFor={fieldApi ? fieldApi.name.replace(/\./g, '') : undefined}
        className={`block mb-1 font-medium ${twText} ${!isPreviewMode ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={!isPreviewMode}
        suppressContentEditableWarning
        onBlur={!isPreviewMode ? saveLabel : undefined}
      />

      <input
        type={inputType}
        {...getInputProps(fieldDef, fieldApi)}
        className={`${baseInputClasses} ${twText} ${widthClass}`}
        placeholder={fieldDef.placeholder}
        style={twInline}
      />
    </div>
  );
};

// ------------------- Validators -----------------------

export const getValidators = (
  fieldDef: AppointmentFieldDefinition,
): { onChange?: ValidatorFn } => {
  const hasRules =
    fieldDef.validatorsConfig?.required ||
    fieldDef.minDate ||
    fieldDef.maxDate ||
    fieldDef.minTime ||
    fieldDef.maxTime ||
    fieldDef.stepMinutes;

  if (!hasRules) return {};

  const layout: NonNullable<AppointmentFieldDefinition['appointmentLayout']> =
    fieldDef.appointmentLayout ?? 'datetime';

  return {
    onChange: ({ value }) => {
      const val = (value ?? '') as string;

      // Required
      if (fieldDef.validatorsConfig?.required && val.trim() === '') {
        return `${fieldDef.label} is required.`;
      }

      if (val.trim() === '') return undefined; // nothing else to check

      // Helper – extract date/time parts
      const getDatePart = (v: string) => (layout === 'dateOnly' ? v : v.split('T')[0]);
      const getTimePart = (v: string) =>
        layout === 'timeOnly' ? v : v.split('T')[1]?.slice(0, 5) ?? '';

      // ---- Date min/max ----
      if (layout !== 'timeOnly') {
        const date = getDatePart(val);
        if (fieldDef.minDate && date < fieldDef.minDate) {
          return `Date must be on or after ${fieldDef.minDate}.`;
        }
        if (fieldDef.maxDate && date > fieldDef.maxDate) {
          return `Date must be on or before ${fieldDef.maxDate}.`;
        }
      }

      // ---- Time min/max & step ----
      if (layout !== 'dateOnly') {
        const time = getTimePart(val);
        if (time) {
          if (fieldDef.minTime && time < fieldDef.minTime) {
            return `Time must be after ${fieldDef.minTime}.`;
          }
          if (fieldDef.maxTime && time > fieldDef.maxTime) {
            return `Time must be before ${fieldDef.maxTime}.`;
          }
          if (fieldDef.stepMinutes) {
            const [h, m] = time.split(':').map(Number);
            const minutesSinceMidnight = h * 60 + m;
            if (minutesSinceMidnight % fieldDef.stepMinutes !== 0) {
              return `Time must be in ${fieldDef.stepMinutes}-minute increments.`;
            }
          }
        }
      }

      return undefined;
    },
  };
};

// --------------- Schema helper ------------------------

export const mapToSchemaType = (): string => 'appointment';
