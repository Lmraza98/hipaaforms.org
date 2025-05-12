import React, { useCallback } from 'react';
import { useFlashOutline } from './useFlashOutline';
import { getContainerClasses } from './getContainerClasses';
import { usePreviewProps } from './usePreviewProps';
import type { FieldItemProps } from './types';
import type { FormFieldDefinition } from '../../types';

export function SubmitButtonItem<T extends FormFieldDefinition>({
  fieldDef, selectedFieldDef, handleFieldClick,
  onPropertyChange, formName, setFormName, isPreviewMode = false, justAdded = false, removeField
}: FieldItemProps<T>) {
  const onClick = useCallback(() => {
    if (!fieldDef.isSystemGenerated && !isPreviewMode) {
      handleFieldClick(fieldDef);
    }
  }, [fieldDef, handleFieldClick, isPreviewMode]);

  const showOutline = useFlashOutline(justAdded);

  const previewProps = usePreviewProps({
    fieldDef, formName, setFormName, onPropertyChange, isPreviewMode
  });

  return (
    <div onClick={onClick} className={getContainerClasses({
      isSystem: fieldDef.isSystemGenerated ?? false,
      isSelected: selectedFieldDef?.id === fieldDef.id,
      isPreviewMode, showOutline
    })}>
      <div className="p-4 rounded-lg bg-white mb-3">
        <label className="block mb-1.5 font-medium text-gray-700 text-sm">
          {fieldDef.label || `${fieldDef.type} Field`}
        </label>
        <previewProps.Component {...previewProps.props} />
        {!fieldDef.isSystemGenerated && !isPreviewMode && removeField && (
          <button 
            onClick={e => { e.stopPropagation(); removeField(fieldDef.id) }} 
            className="text-red-500 hover:text-red-700 text-xs"
            title="Remove field"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export const MemoizedSubmitButtonItem = React.memo(SubmitButtonItem) as typeof SubmitButtonItem; 