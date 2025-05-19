'use client';
import React, { ChangeEvent } from 'react';
import ColorSelector from './ColorSelector';
import { HeadingFieldDefinition } from '@/components/form-builder/types';

/**
 * Generic subset of style-related props that many field definitions share.
 * When we introduce additional field types extend this type accordingly
 * or make it generic via <T extends StyleProps>.
 */
type StyleProps = {
  fontSize?: string;
  fontWeight?: string;
  textColor?: string;
  alignment?: string;
  margin?: string;
  padding?: string;
};

export interface StyleSettingsProps<T extends StyleProps = HeadingFieldDefinition> {
  fieldDef: T;
  /**
   * Callback used to update the field definition. Mirrors the signature of
   * usePropertyChanger → change(key, value).
   */
  onChange: <K extends keyof T>(key: K, value: T[K]) => void;
}

/**
 * A shared UI component for editing common style-related properties such as
 * fontSize, fontWeight, textColor, alignment, margin and padding. Designed to
 * be reused across different field settings (Heading, Paragraph, Input, etc.).
 */
const StyleSettings = <T extends StyleProps = HeadingFieldDefinition>(
  { fieldDef, onChange }: StyleSettingsProps<T>
) => {
  // Helper to DRY onChange wiring for <select>/<input>
  const handleInput = <K extends keyof T>(key: K) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = (e.target as HTMLInputElement).value as T[K];
    onChange(key, value);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Styling</h4>

      {/* Alignment */}
      <div className="mb-3">
        <label htmlFor="text-alignment" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Text Alignment:
        </label>
        <select
          id="text-alignment"
          value={(fieldDef.alignment as string) || 'left'}
          onChange={handleInput('alignment' as keyof T)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Font Size */}
      <div className="mb-3">
        <label htmlFor="font-size" className="block mb-1.5 font-medium text-gray-700 text-sm">Font Size</label>
        <select
          id="font-size"
          value={(fieldDef.fontSize as string) || '2xl'}
          onChange={handleInput('fontSize' as keyof T)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="xs">Extra-Small (text-xs)</option>
          <option value="sm">Small (text-sm)</option>
          <option value="base">Base (text-base)</option>
          <option value="lg">Large (text-lg)</option>
          <option value="xl">Extra Large (text-xl)</option>
          <option value="2xl">2X Large (text-2xl)</option>
          <option value="3xl">3X Large (text-3xl)</option>
          <option value="4xl">4X Large (text-4xl)</option>
          <option value="5xl">5X Large (text-5xl)</option>
        </select>
      </div>

      {/* Font Weight */}
      <div className="mb-3">
        <label htmlFor="font-weight" className="block mb-1.5 font-medium text-gray-700 text-sm">Font Weight</label>
        <select
          id="font-weight"
          value={(fieldDef.fontWeight as string) || 'semibold'}
          onChange={handleInput('fontWeight' as keyof T)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="thin">Thin (font-thin)</option>
          <option value="extralight">Extra Light (font-extralight)</option>
          <option value="light">Light (font-light)</option>
          <option value="normal">Normal (font-normal)</option>
          <option value="medium">Medium (font-medium)</option>
          <option value="semibold">Semi-bold (font-semibold)</option>
          <option value="bold">Bold (font-bold)</option>
          <option value="extrabold">Extra Bold (font-extrabold)</option>
          <option value="black">Black (font-black)</option>
        </select>
      </div>

      {/* Text Color */}
      <ColorSelector
        className="mb-3"
        label="Text Color"
        value={(fieldDef.textColor as string) || '#1f2937'}
        onChange={(hex) => onChange('textColor' as keyof T, hex as T[keyof T])}
      />

      {/* Margin */}
      <div className="mb-3">
        <label htmlFor="margin" className="block mb-1.5 font-medium text-gray-700 text-sm">Margin</label>
        <select
          id="margin"
          value={(fieldDef.margin as string) || 'my-1'}
          onChange={handleInput('margin' as keyof T)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="m-0">None (m-0)</option>
          <option value="my-1">Small vertical (my-1)</option>
          <option value="my-2">Medium vertical (my-2)</option>
          <option value="my-4">Large vertical (my-4)</option>
          <option value="my-6">XL vertical (my-6)</option>
        </select>
      </div>

      {/* Padding */}
      <div className="mb-3">
        <label htmlFor="padding" className="block mb-1.5 font-medium text-gray-700 text-sm">Padding</label>
        <select
          id="padding"
          value={(fieldDef.padding as string) || ''}
          onChange={handleInput('padding' as keyof T)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="">None</option>
          <option value="py-1">Small vertical (py-1)</option>
          <option value="py-2">Medium vertical (py-2)</option>
          <option value="py-4">Large vertical (py-4)</option>
        </select>
      </div>
    </div>
  );
};

export default StyleSettings; 