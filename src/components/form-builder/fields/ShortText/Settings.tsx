'use client';
import React from 'react';
import { ShortTextFieldDefinition } from '@/components/form-builder/types';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';
import CoreSettings from '../../ui/CoreSettings';
import StyleSettings from '../../ui/StyleSettings';
import ValidationSettings from './ValidationSettings';

export const Settings: React.FC<{ fieldDef: ShortTextFieldDefinition }> = ({ fieldDef }) => {
  const change = usePropertyChanger(fieldDef);

  return (
    <div className="space-y-4">
      <CoreSettings fieldDef={fieldDef} onChange={change} />
      <ValidationSettings fieldDef={fieldDef} onChange={change} />
      <StyleSettings fieldDef={fieldDef} onChange={change} />
    </div>
  );
};
