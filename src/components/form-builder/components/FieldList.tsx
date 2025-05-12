import React from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import { TypedFieldItem } from './TypedFieldItem';
import { DropPlaceholder } from './DropPlaceholder';
import type { FormFieldDefinition, FormValues, TypedFormApi } from '../types';
import { fadeUp } from './animations';

interface FieldListProps {
  fields: FormFieldDefinition[];
  prevIds: string[];
  dragOverIndex: number | null;
  onReorder: (newOrder: FormFieldDefinition[]) => void;
  fieldItemProps: {
    form: TypedFormApi<FormValues>;
    handleFieldClick: (fieldDef: FormFieldDefinition) => void;
    removeField: (id: string) => void;
    isPreviewMode: boolean;
    selectedFieldDef: FormFieldDefinition | null;
  };
}

export const FieldList = React.memo(({ 
  fields, 
  prevIds, 
  dragOverIndex,
  onReorder,
  fieldItemProps 
}: FieldListProps) => (
  <Reorder.Group axis="y" values={fields} onReorder={onReorder} className="space-y-0">
    <AnimatePresence initial={false}>
      {fields.map((fieldDef, index) => {
        const justAdded = !prevIds.includes(fieldDef.id);
        return (
          <React.Fragment key={fieldDef.id}>
            {dragOverIndex === index && <DropPlaceholder position="between" />}
            <Reorder.Item
              value={fieldDef}
              layout
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="relative mb-4 field-item"
            >
              <TypedFieldItem
                fieldDef={fieldDef}
                justAdded={justAdded}
                {...fieldItemProps}
              />
              {!fieldDef.isSystemGenerated && !fieldItemProps.isPreviewMode && (
                <div className="flex flex-col absolute top-1/2 right-1 md:right-[-10px] transform -translate-y-1/2">
                  <button
                    type="button"
                    onClick={() => fieldItemProps.handleFieldClick(fieldDef)}
                    className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fieldItemProps.removeField(fieldDef.id); }}
                    className="text-red-500 hover:text-red-700 text-xs"
                    title="Remove field"
                  >
                    Remove
                  </button>
                </div>
              )}
            </Reorder.Item>
          </React.Fragment>
        );
      })}
    </AnimatePresence>
  </Reorder.Group>
));

FieldList.displayName = 'FieldList'; 