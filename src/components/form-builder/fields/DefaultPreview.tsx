import React from 'react';
import { FormFieldDefinition } from '../types';

export const Preview: React.FC<{
  fieldDef: FormFieldDefinition;
}> = ({ fieldDef }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <p className="text-sm text-gray-500">Preview for {fieldDef.type} not implemented yet.</p>
    </div>
  );
};

export const Settings: React.FC<{
  fieldDef: FormFieldDefinition;
}> = ({ fieldDef }) => {
  return <p className="text-xs text-gray-500">Settings for {fieldDef.type} not implemented yet.</p>;
}; 