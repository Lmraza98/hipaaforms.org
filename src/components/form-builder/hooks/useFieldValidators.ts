import { useMemo } from 'react';
import { getFieldModule } from '../fields/index';
import type { FormFieldDefinition, FieldValidator } from '../types';

export function useFieldValidators(fieldDef: FormFieldDefinition): { onChange?: FieldValidator<unknown> } {
  return useMemo(() => {
    const fieldModule = getFieldModule(fieldDef.type);
    const combinedValidators: { onChange?: FieldValidator<unknown> } = {};

    const canHaveValidators = !['Heading', 'Paragraph', 'Image', 'SubmitButton'].includes(fieldDef.type);

    if (canHaveValidators && 'validatorsConfig' in fieldDef && fieldDef.validatorsConfig?.required) {
      combinedValidators.onChange = (params: { value: unknown }) => {
        if (params.value === undefined || params.value === null || params.value === '') {
          if (typeof params.value !== 'number' && typeof params.value !== 'boolean') {
            return `${fieldDef.label || 'Field'} is required.`;
          }
        }
        return undefined;
      };
    }

    if (fieldModule.getValidators) {
      const moduleSpecificDef = fieldDef as Extract<FormFieldDefinition, { type: typeof fieldDef.type }>;
      const moduleValidators = fieldModule.getValidators(moduleSpecificDef);

      if (moduleValidators?.onChange) {
        const existingOnChange = combinedValidators.onChange;
        if (existingOnChange) {
          combinedValidators.onChange = async (params: { value: unknown }) => {
            const requiredError = await existingOnChange(params);
            if (requiredError) return requiredError;
            return typeof moduleValidators.onChange === 'function' ? moduleValidators.onChange(params) : undefined;
          };
        } else {
          combinedValidators.onChange = moduleValidators.onChange;
        }
      }
    }
    return combinedValidators;
  }, [fieldDef]);
} 