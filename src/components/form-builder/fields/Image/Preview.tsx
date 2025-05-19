'use client';
import React from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { ImageFieldDefinition } from '@/components/form-builder/types';
import { stylePropsToTw } from '@/utils/tw';

/**
 * Runtime & palette preview for the Image field.
 * Supports Tailwind-driven presentation tweaks (width / height / border / radius)
 * plus StyleProps-derived typography & alignment classes.
 */
export const Preview: React.FC<{
  fieldDef: ImageFieldDefinition;
  fieldApi?: AnyFieldApi;
}> = ({ fieldDef }) => {
  // Extract Tailwind classes + optional inline colour style
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  const widthClass = fieldDef.width ?? 'w-full';
  const heightClass = fieldDef.height ?? 'h-auto';
  const borderClass = fieldDef.border ?? 'border border-gray-300';
  const radiusClass = fieldDef.borderRadius ?? 'rounded-md';

  return (
    <div
      className={[
        fieldDef.margin || 'my-2',
        fieldDef.padding || '',
        twText,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={fieldDef.src || 'https://via.placeholder.com/200x120?text=Image'}
        alt={fieldDef.alt || 'image'}
        style={{ objectFit: fieldDef.fit ?? 'contain', ...twInline }}
        className={[widthClass, heightClass, borderClass, radiusClass].join(' ')}
      />
    </div>
  );
};

// ---------- Validators & Schema helpers -----------------

export const getValidators = () => ({
  /* Images don't have inherent validators */
});

export const mapToSchemaType = () => 'image'; 