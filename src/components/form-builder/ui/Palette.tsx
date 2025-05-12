'use client';

import React from 'react';
import type { FormFieldDefinition } from '../types';
import { useFormBuilderContext } from '../context';

export const Palette = () => { 
  const { addField } = useFormBuilderContext();

  const onDragStart = (event: React.DragEvent<Element>, fieldType: FormFieldDefinition['type'], label: string) => {
    event.dataTransfer.setData('application/form-field-type', fieldType);
    event.dataTransfer.setData('application/form-field-label', label);
    event.dataTransfer.effectAllowed = 'move';
    // Add a class to the dragged element for styling
    const draggedElement = event.currentTarget as HTMLElement;
    draggedElement.classList.add('dragging');
  };

  const onDragEnd = (event: React.DragEvent<Element>) => {
    // Remove the dragging class
    const draggedElement = event.currentTarget as HTMLElement;
    draggedElement.classList.remove('dragging');
  };

  const handleFieldClick = (fieldType: FormFieldDefinition['type'], label: string) => {
    addField(fieldType, label);
  };

  const fieldTypes: { type: FormFieldDefinition['type']; label: string; icon: string }[] = [
    { type: 'Heading', label: 'Heading', icon: ' H' }, 
    { type: 'FullName', label: 'Full Name', icon: '👤' },
    { type: 'Email', label: 'Email', icon: '✉️' },
    { type: 'Address', label: 'Address', icon: '🏠' },
    { type: 'Phone', label: 'Phone', icon: '📞' },
    { type: 'DatePicker', label: 'Date Picker', icon: '📅' },
    { type: 'Appointment', label: 'Appointment', icon: '🗓️' },
    { type: 'Signature', label: 'Signature', icon: '✍️' },
    { type: 'FillInTheBlank', label: 'Fill in the Blank', icon: '...' },
    { type: 'ShortText', label: 'Short Text', icon: 'āb' },
    { type: 'LongText', label: 'Long Text', icon: '¶' },
    { type: 'Paragraph', label: 'Paragraph', icon: '📄' },
    { type: 'Dropdown', label: 'Dropdown', icon: '🔽' },
    { type: 'SingleChoice', label: 'Single-Choice', icon: '🔘' },
    { type: 'MultiChoice', label: 'Multi-Choice', icon: '✅' },
    { type: 'Number', label: 'Number', icon: '#️⃣' },
    { type: 'Image', label: 'Image', icon: '🖼️' },
    { type: 'Time', label: 'Time', icon: '🕒' },
    { type: 'SubmitButton', label: 'Submit Button', icon: '🚀' },
  ];

  return (
    <aside className="p-1 md:p-0">
      <div className="mb-3 font-semibold text-gray-700 hidden md:block">Field Types</div>
      <div className="grid grid-cols-2 gap-2">
        {fieldTypes.map(field => (
          <div
            key={field.type}
            onDragStart={(event) => onDragStart(event, field.type, field.label)}
            onDragEnd={onDragEnd}
            onClick={() => handleFieldClick(field.type, field.label)}
            draggable
            className="border border-gray-300 p-2.5 rounded-md bg-white hover:bg-gray-50 cursor-grab text-gray-700 text-center shadow-sm transition-colors flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1" role="img" aria-label={field.label}>{field.icon}</span>
            <span className="text-xs text-center">{field.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}; 