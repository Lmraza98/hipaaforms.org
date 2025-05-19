'use client';
import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { FullNameFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

type NamePart = 'first' | 'last';

/**
 * Build unified input props that work both in palette preview (no `fieldApi`)
 * and at runtime (with `fieldApi`).
 */
const getInputProps = (
  fieldDef: FullNameFieldDefinition,
  fieldApi?: AnyFieldApi,
  part?: NamePart,
) => {
  if (!fieldApi) {
    const baseId = fieldDef.id;
    return {
      id: part ? `${baseId}${part === 'first' ? 'First' : 'Last'}` : baseId,
      name: part ? `${baseId}${part === 'first' ? 'First' : 'Last'}` : baseId,
      placeholder:
        part === 'first'
          ? fieldDef.firstPlaceholder || 'First Name'
          : part === 'last'
          ? fieldDef.lastPlaceholder || 'Last Name'
          : fieldDef.placeholder || 'Full Name',
      defaultValue: '',
    } as const;
  }

  // With fieldApi (form runtime)
  const currentValue = fieldApi.state.value as
    | string
    | { first?: string; last?: string }
    | undefined;

  const value = part
    ? // split mode → extract sub-value
      ((currentValue as { [k in NamePart]?: string })?.[part] ?? '')
    : (currentValue as string) ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;

    if (part) {
      // Update the relevant zone while preserving the other
      const base = (currentValue && typeof currentValue === 'object' ? currentValue : {}) as Record<
        string,
        unknown
      >;
      fieldApi.handleChange({ ...base, [part]: nextVal });
    } else {
      fieldApi.handleChange(nextVal);
    }
  };

  return {
    id: part ? `${fieldApi.name}${part === 'first' ? 'First' : 'Last'}` : fieldApi.name,
    name: part ? `${fieldApi.name}${part === 'first' ? 'First' : 'Last'}` : fieldApi.name,
    value,
    onBlur: fieldApi.handleBlur,
    onChange: handleChange,
  } as const;
};

interface FullNamePreviewProps {
  fieldDef: FullNameFieldDefinition;
  fieldApi?: AnyFieldApi;
  onPropertyChange?: <K extends keyof FullNameFieldDefinition>(k: K, v: FullNameFieldDefinition[K]) => void;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<FullNamePreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const editable = !isPreviewMode;

  // Extract Tailwind classes from style props
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseInputClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900';

  const widthClass = fieldDef.width ?? 'w-full';

  const layout: NonNullable<FullNameFieldDefinition['nameLayout']> = fieldDef.nameLayout ?? 'single';

  const renderSingleInput = (
    placeholder: string,
    props: ReturnType<typeof getInputProps>,
    autoComplete: string,
  ) => (
    <input
      type="text"
      {...props}
      className={`${baseInputClasses} ${twText} ${widthClass}`}
      placeholder={placeholder}
      autoComplete={autoComplete}
      style={twInline}
    />
  );

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      {/* Inputs based on layout */}
      {layout === 'single' &&
        (() => {
          const singleProps = getInputProps(fieldDef, fieldApi);
          const auto = fieldDef.autocomplete ?? fieldDef.autocompleteAttr ?? 'name';
          return (
            <>
              <label
                ref={labelRef}
                htmlFor={singleProps.id}
                className={`block mb-1 font-medium ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
                style={twInline}
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={editable ? saveLabel : undefined}
              />
              {renderSingleInput(
                fieldDef.placeholder || 'Full Name',
                singleProps,
                auto,
              )}
            </>
          );
        })()}

      {layout === 'firstOnly' &&
        (() => {
          const firstProps = getInputProps(fieldDef, fieldApi);
          const auto = fieldDef.autocomplete ?? fieldDef.autocompleteAttr ?? 'given-name';
          return (
            <>
              <label
                ref={labelRef}
                htmlFor={firstProps.id}
                className={`block mb-1 font-medium ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
                style={twInline}
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={editable ? saveLabel : undefined}
              />
              {renderSingleInput(
                fieldDef.firstPlaceholder || 'First Name',
                firstProps,
                auto,
              )}
            </>
          );
        })()}

      {layout === 'split' && (
        <div className="flex flex-col sm:flex-row gap-3">
          {(() => {
            const firstProps = getInputProps(fieldDef, fieldApi, 'first');
            return (
              <div className="flex flex-col flex-1">
                <label htmlFor={firstProps.id} className="sr-only">
                  First Name
                </label>
                {renderSingleInput(
                  fieldDef.firstPlaceholder || 'First Name',
                  firstProps,
                  'given-name',
                )}
              </div>
            );
          })()}
          {(() => {
            const lastProps = getInputProps(fieldDef, fieldApi, 'last');
            return (
              <div className="flex flex-col flex-1">
                <label htmlFor={lastProps.id} className="sr-only">
                  Last Name
                </label>
                {renderSingleInput(
                  fieldDef.lastPlaceholder || 'Last Name',
                  lastProps,
                  'family-name',
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

// ------------------- Validators / schema helpers -----------------

export const getValidators = (
  fieldDef: FullNameFieldDefinition,
): { onChange?: ValidatorFn } => {
  const {
    validatorsConfig,
    minLength,
    maxLength,
    onlyAlphabetic,
    allowMiddleInitial,
    customRegex,
  } = fieldDef;

  const hasRules =
    validatorsConfig?.required ||
    minLength !== undefined ||
    maxLength !== undefined ||
    onlyAlphabetic ||
    customRegex;

  if (!hasRules) return {};

  const validateString = (str: string): string | undefined => {
    if (validatorsConfig?.required && !str.trim()) {
      return `${fieldDef.label} is required.`;
    }

    if (minLength !== undefined && str.length < minLength) {
      return `Must be at least ${minLength} characters.`;
    }

    if (maxLength !== undefined && str.length > maxLength) {
      return `Must be at most ${maxLength} characters.`;
    }

    if (onlyAlphabetic) {
      const alphaPattern = allowMiddleInitial
        ? /^[A-Za-z]+(?:\s+[A-Za-z]\.)?(?:\s+[A-Za-z]+)+$/
        : /^[A-Za-z\s]+$/;
      if (!alphaPattern.test(str)) {
        return 'Only alphabetic characters are allowed.';
      }
    }

    if (customRegex) {
      try {
        const re = new RegExp(customRegex);
        if (!re.test(str)) return 'Does not match required pattern.';
      } catch {
        // invalid regex – ignore validation or treat as pass-through
      }
    }
    return undefined;
  };

  return {
    onChange: ({ value }) => {
      const layout = fieldDef.nameLayout ?? 'single';

      if (layout === 'split') {
        const obj = (value ?? {}) as { first?: string; last?: string };
        const firstErr = validateString(obj.first ?? '');
        if (firstErr) return firstErr;
        const lastErr = validateString(obj.last ?? '');
        return lastErr;
      }

      // single or firstOnly treat value as string
      return validateString((value ?? '') as string);
    },
  };
};

export const mapToSchemaType = (): string => 'fullName';