export type ValidatorFunction = (value: unknown) => string | null;

export const required = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required.';
  }
  return null;
};

export const minLength = (min: number) => (value: string): string | null => {
  if (value && value.length < min) {
    return `Must be at least ${min} characters.`;
  }
  return null;
};

export const maxLength = (max: number) => (value: string): string | null => {
  if (value && value.length > max) {
    return `Must be no more than ${max} characters.`;
  }
  return null;
};

export const email = (value: string): string | null => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return 'Invalid email address.';
  }
  return null;
};

// Basic phone number validation (allows digits, spaces, hyphens, parentheses)
export const phone = (value: string): string | null => {
  if (value && !/^[\d\s\-\(\)]+$/i.test(value)) {
    return 'Invalid phone number format.';
  }
  // Further checks like minimum digits could be added
  return null;
};

// Basic date validation (YYYY-MM-DD)
export const date = (value: string): string | null => {
  if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'Invalid date format. Please use YYYY-MM-DD.';
  }
  const d = new Date(value);
  if (value && (isNaN(d.getTime()) || d.toISOString().slice(0,10) !== value)) {
    return 'Invalid date.';
  }
  return null;
};

export const isNumber = (value: unknown): string | null => {
  if (value && isNaN(Number(value))) {
    return 'Must be a number.';
  }
  return null;
};

export const isInteger = (value: unknown): string | null => {
  if (value && (!Number.isInteger(Number(value)))) {
    return 'Must be a whole number.';
  }
  return null;
};

export const isPositive = (value: unknown): string | null => {
  if (value && Number(value) <= 0) {
    return 'Must be a positive number.';
  }
  return null;
};

export const regexValidation = (pattern: RegExp, message: string) => (value: string): string | null => {
  if (value && !pattern.test(value)) {
    return message;
  }
  return null;
};

// Example usage of regexValidation for a US ZIP code
export const zipCodeUS = regexValidation(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format.');

/**
 * Combines multiple validators into a single validation function.
 * Validators are executed in the order they are provided.
 * Returns the first error message encountered, or null if all validators pass.
 */
export const combineValidators = (...validators: ValidatorFunction[]) => (value: unknown): string | null => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return null;
};
