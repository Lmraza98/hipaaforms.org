'use client';
import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { AddressFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import { useEditableText } from '../../hooks/useEditableText';
import { stylePropsToTw } from '@/utils/tw';

/**
 * Address parts used when layout === 'split'
 */
export type AddressPart = 'street' | 'city' | 'state' | 'zip';

/* ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------*/
const getInputProps = (
  fieldDef: AddressFieldDefinition,
  fieldApi?: AnyFieldApi,
  part?: AddressPart,
) => {
  // PREVIEW mode (no fieldApi)
  if (!fieldApi) {
    const baseId = fieldDef.id;
    const idSuffix = part ? part.charAt(0).toUpperCase() + part.slice(1) : '';

    return {
      id: `${baseId}${idSuffix}`,
      name: `${baseId}${idSuffix}`,
      placeholder: (() => {
        if (!part) return fieldDef.placeholder || 'Street, City, State ZIP';
        switch (part) {
          case 'street':
            return fieldDef.streetPlaceholder || 'Street Address';
          case 'city':
            return fieldDef.cityPlaceholder || 'City';
          case 'state':
            return fieldDef.statePlaceholder || 'State';
          case 'zip':
            return fieldDef.zipPlaceholder || 'ZIP Code';
        }
      })(),
      defaultValue: '',
    } as const;
  }

  // RUNTIME mode (with fieldApi)
  const currentValue = fieldApi.state.value as
    | string
    | Record<AddressPart, string | undefined>
    | undefined;

  const value = part
    ? (currentValue && typeof currentValue === 'object' ? currentValue[part] ?? '' : '')
    : (currentValue as string) ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;

    if (part) {
      const base =
        currentValue && typeof currentValue === 'object' ? currentValue : ({} as Record<string, unknown>);
      fieldApi.handleChange({ ...base, [part]: nextVal });
    } else {
      fieldApi.handleChange(nextVal);
    }
  };

  return {
    id: part ? `${fieldApi.name}${part.charAt(0).toUpperCase() + part.slice(1)}` : fieldApi.name,
    name: part ? `${fieldApi.name}${part.charAt(0).toUpperCase() + part.slice(1)}` : fieldApi.name,
    value,
    onBlur: fieldApi.handleBlur,
    onChange: handleChange,
  } as const;
};

/* ------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------*/
interface AddressPreviewProps {
  fieldDef: AddressFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<AddressPreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const editable = !isPreviewMode;

  // Style props → classes / inline styles
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const baseInputClasses =
    'block px-3 py-2 rounded text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900';

  const widthClass = fieldDef.width ?? 'w-full';

  const layout: NonNullable<AddressFieldDefinition['addressLayout']> = fieldDef.addressLayout ?? 'single';

  // Helper to render input with dynamic props
  const renderInput = (
    placeholder: string,
    props: ReturnType<typeof getInputProps>,
    autoComplete: string,
    extraClassName = '',
  ) => (
    <input
      type="text"
      {...props}
      className={`${baseInputClasses} ${twText} ${widthClass} ${extraClassName}`}
      placeholder={placeholder}
      autoComplete={autoComplete}
      style={twInline}
    />
  );

  return (
    <div className={`${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${widthClass}`}>
      {layout === 'single' && (() => {
        const props = getInputProps(fieldDef, fieldApi);
        return (
          <>
            <label
              ref={labelRef}
              htmlFor={props.id}
              className={`block mb-1 font-medium ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
              style={twInline}
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={editable ? saveLabel : undefined}
            />
            {renderInput(fieldDef.placeholder || 'Street, City, State ZIP', props, 'street-address')}
          </>
        );
      })()}

      {layout === 'split' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Street – spans two columns on sm */}
          {(() => {
            const props = getInputProps(fieldDef, fieldApi, 'street');
            return (
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor={props.id} className="sr-only">
                  Street Address
                </label>
                {renderInput(fieldDef.streetPlaceholder || 'Street Address', props, 'address-line1')}
              </div>
            );
          })()}

          {/* City */}
          {(() => {
            const props = getInputProps(fieldDef, fieldApi, 'city');
            return (
              <div>
                <label htmlFor={props.id} className="sr-only">
                  City
                </label>
                {renderInput(fieldDef.cityPlaceholder || 'City', props, 'address-level2')}
              </div>
            );
          })()}

          {/* State */}
          {(() => {
            const props = getInputProps(fieldDef, fieldApi, 'state');
            return (
              <div>
                <label htmlFor={props.id} className="sr-only">
                  State/Region
                </label>
                {renderInput(fieldDef.statePlaceholder || 'State', props, 'address-level1')}
              </div>
            );
          })()}

          {/* ZIP */}
          {(() => {
            const props = getInputProps(fieldDef, fieldApi, 'zip');
            return (
              <div>
                <label htmlFor={props.id} className="sr-only">
                  ZIP Code
                </label>
                {renderInput(fieldDef.zipPlaceholder || 'ZIP Code', props, 'postal-code')}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------
 * Validators & schema helpers
 * ------------------------------------------------------------------*/

export const getValidators = (
  fieldDef: AddressFieldDefinition,
): { onChange?: ValidatorFn } => {
  const { validatorsConfig, zipPattern, customZipRegex, addressLayout } = fieldDef;

  const requiresValidation = validatorsConfig?.required || zipPattern;
  if (!requiresValidation) return {};

  // Regexes
  const usZip = /^\d{5}(?:-\d{4})?$/;
  const caZip = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  let customRegex: RegExp | undefined;
  if (zipPattern === 'custom' && customZipRegex) {
    try {
      customRegex = new RegExp(customZipRegex);
    } catch {
      // eslint-disable-next-line no-console
      console.warn('Invalid custom ZIP regex – ignoring.');
    }
  }

  return {
    onChange: ({ value }) => {
      if (addressLayout === 'split') {
        const obj = (value ?? {}) as Record<AddressPart, string | undefined>;
        if (validatorsConfig?.required) {
          if (!obj.street?.trim() || !obj.city?.trim() || !obj.state?.trim() || !obj.zip?.trim()) {
            return `${fieldDef.label} is required.`;
          }
        }
        // Validate ZIP pattern if applicable
        if (obj.zip) {
          if (zipPattern === 'US' && !usZip.test(obj.zip)) return 'Invalid US ZIP code.';
          if (zipPattern === 'CA' && !caZip.test(obj.zip)) return 'Invalid Canadian postal code.';
          if (zipPattern === 'custom' && customRegex && !customRegex.test(obj.zip)) return 'Invalid ZIP code.';
        }
        return undefined;
      }

      // SINGLE layout – treat value as string
      const str = (value ?? '') as string;
      if (validatorsConfig?.required && !str.trim()) {
        return `${fieldDef.label} is required.`;
      }

      if (zipPattern) {
        // Need to extract ZIP from the string? Simplification: apply regex to entire string.
        if (zipPattern === 'US' && !usZip.test(str)) return 'Invalid US ZIP code.';
        if (zipPattern === 'CA' && !caZip.test(str)) return 'Invalid Canadian postal code.';
        if (zipPattern === 'custom' && customRegex && !customRegex.test(str)) return 'Invalid ZIP code.';
      }
      return undefined;
    },
  };
};

export const mapToSchemaType = (): string => 'address';
