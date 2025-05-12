import React from 'react';
import type { AnyFieldApi } from '@tanstack/react-form';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { meta } = field.state;
  if (meta.isValidating) return <div className="text-xs">Validating…</div>;
  if (meta.isTouched && meta.errors.length) {
    return <div className="text-xs text-red-500">{meta.errors.join(', ')}</div>;
  }
  return null;
} 