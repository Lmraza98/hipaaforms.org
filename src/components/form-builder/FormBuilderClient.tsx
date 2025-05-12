'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from '@tanstack/react-form';
import type { FormFieldDefinition, FormValues } from './types';
import { Palette } from './ui/Palette';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { FieldCanvas } from './ui/FieldCanvas';
import { useFormBuilderContext } from './context';
import { SideDrawer } from '@/components/SideDrawer';

const DEFAULT_INITIAL_FIELDS: FormFieldDefinition[] = [
  { id: 'default_name_field', type: 'ShortText', label: 'Your Name', placeholder: 'Enter your full name' },
];

// Define constants for width calculations
const PALETTE_SM_WIDTH = 288; // sm:w-72 (18rem = 288px)
const PROPERTIES_SM_WIDTH = 320; // sm:w-80 (20rem = 320px)
const FIELD_CANVAS_FIXED_WIDTH = 800; // sm:w-[800px]
const REQUIRED_GAP_AROUND_CANVAS_PX = 16; // p-4 corresponds to 1rem = 16px

const MIN_VIEWPORT_FOR_DUAL_DRAWERS =
  PALETTE_SM_WIDTH +
  PROPERTIES_SM_WIDTH +
  FIELD_CANVAS_FIXED_WIDTH +
  (2 * REQUIRED_GAP_AROUND_CANVAS_PX); // 288 + 320 + 800 + (2 * 16) = 1440px

export default function FormBuilderClient() {
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isPropertiesOpen, setPropertiesOpen] = useState(false);
  const { fields, selectedFieldDef, isPreviewMode } = useFormBuilderContext();

  const paletteWrapperRef = useRef<HTMLDivElement>(null);
  const propertiesWrapperRef = useRef<HTMLDivElement>(null);

  const [allowBothDrawersOpen, setAllowBothDrawersOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= MIN_VIEWPORT_FOR_DUAL_DRAWERS : true
  );

  useEffect(() => {
    const handleResize = () => {
      const canAllowBoth = window.innerWidth >= MIN_VIEWPORT_FOR_DUAL_DRAWERS;
      if (allowBothDrawersOpen !== canAllowBoth) {
        setAllowBothDrawersOpen(canAllowBoth);
      }

      // If transitioning to not allowing both, and both are open, close one.
      if (!canAllowBoth && isPaletteOpen && isPropertiesOpen) {
        setPropertiesOpen(false); // Close properties panel by default in this scenario
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [isPaletteOpen, isPropertiesOpen, allowBothDrawersOpen]);

  const form = useForm({
    defaultValues: (fields.length ? fields : DEFAULT_INITIAL_FIELDS)
      .reduce<FormValues>((acc, f) => ({ ...acc, [f.id]: '' }), {}),
    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value);
      alert('Form submitted for testing!');
    },
  });

  useEffect(() => {
    const updatedValues = fields.reduce<FormValues>((acc, field) => {
      acc[field.id] = form.getFieldValue(field.id) ?? '';
      return acc;
    }, {});
    form.reset({ defaultValues: updatedValues });
  }, [fields, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <div className="relative h-full w-full bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center p-4 overflow-auto">
        <form
          onSubmit={handleSubmit}
          onReset={() => form.reset()}
          className="flex h-full w-full items-start justify-center"
        >
          <FieldCanvas 
            paletteWrapperRef={paletteWrapperRef}
            propertiesWrapperRef={propertiesWrapperRef}
            form={form}
          />
        </form>
      </div>

      {!isPreviewMode && (
        <div ref={paletteWrapperRef} className={`fixed top-[120px] left-0 h-[calc(100vh-120px)] ${isPaletteOpen ? 'z-20' : 'z-10'}`}>
          <SideDrawer
            isOpen={isPaletteOpen}
            onOpen={() => {
              setPaletteOpen(true);
              if (!allowBothDrawersOpen) {
                setPropertiesOpen(false);
              }
            }}
            onClose={() => setPaletteOpen(false)}
            openLabel="Add Element +"
            position="left"
            widthClass="w-full sm:w-72"
          >
            <Palette />
          </SideDrawer>
        </div>
      )}

      {!isPreviewMode && selectedFieldDef && (
        <div ref={propertiesWrapperRef} className={`fixed top-[120px] right-0 h-[calc(100vh-120px)] ${isPropertiesOpen ? 'z-20' : 'z-10'}`}>
          <SideDrawer
            isOpen={isPropertiesOpen}
            onOpen={() => {
              setPropertiesOpen(true);
              if (!allowBothDrawersOpen) {
                setPaletteOpen(false);
              }
            }}
            onClose={() => setPropertiesOpen(false)}
            openLabel="Edit Properties"
            position="right"
            widthClass="w-full sm:w-80"
          >
            <PropertiesPanel />
          </SideDrawer>
        </div>
      )}
    </div>
  );
}