'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnyFieldApi } from '@tanstack/react-form';
import { SignatureFieldDefinition, ValidatorFn } from '@/components/form-builder/types';
import { stylePropsToTw } from '@/utils/tw';
import { useEditableText } from '../../hooks/useEditableText';
import { usePropertyChanger } from '../../hooks/usePropertyChanger';

// ----------------- helpers ------------------

/** Utility to reset a canvas element */
const clearCanvasUtil = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// ----------------- component ----------------

interface SignaturePreviewProps {
  fieldDef: SignatureFieldDefinition;
  fieldApi?: AnyFieldApi;
  isPreviewMode?: boolean;
}

export const Preview: React.FC<SignaturePreviewProps> = ({ fieldDef, fieldApi, isPreviewMode }) => {
  const change = usePropertyChanger(fieldDef);
  const { ref: labelRef, handleBlur: saveLabel } = useEditableText<HTMLLabelElement>(
    fieldDef.label,
    (newText) => change('label', newText),
  );

  const editable = !isPreviewMode;

  // Tailwind + inline style from style props
  const { className: twText, style: twInline } = stylePropsToTw(fieldDef);

  // Refs & state for drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Helper exposed to both UI button and internally
  const clearCanvas = () => {
    clearCanvasUtil(canvasRef.current);
    if (fieldApi) fieldApi.handleChange('');
  };

  // Drawing + event listeners (only when fieldApi exists → runtime mode)
  useEffect(() => {
    if (!fieldApi) return; // palette preview – skip listeners

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply dynamic drawing styles
    ctx.lineWidth = fieldDef.strokeWidth ?? 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = fieldDef.strokeColor ?? '#000000';

    const getCoords = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDrawing = (e: PointerEvent) => {
      setIsDrawing(true);
      ctx.beginPath();
      const { x, y } = getCoords(e);
      ctx.moveTo(x, y);
    };

    const draw = (e: PointerEvent) => {
      if (!isDrawing) return;
      const { x, y } = getCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const finishDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      ctx.closePath();

      // Persist value to form – honour export format
      const format = fieldDef.exportFormat ?? 'png';
      const dataURL = canvas.toDataURL(`image/${format}`);
      fieldApi.handleChange(dataURL);
    };

    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    window.addEventListener('pointerup', finishDrawing);

    return () => {
      canvas.removeEventListener('pointerdown', startDrawing);
      canvas.removeEventListener('pointermove', draw);
      window.removeEventListener('pointerup', finishDrawing);
    };
  }, [fieldApi, fieldDef.strokeColor, fieldDef.strokeWidth, fieldDef.exportFormat, isDrawing]);

  // Derived classes + styles for wrapper
  const wrapperClasses = `${fieldDef.margin || 'my-2'} ${fieldDef.padding || ''} ${twText}`;

  const canvasHeight = fieldDef.canvasHeight ?? 160;

  // Build an id token without dots for browser safety
  const runtimeId = fieldApi ? fieldApi.name.replace(/\./g, '') : undefined;

  return (
    <div className={wrapperClasses} style={twInline}>
      {/* Editable label */}
      <label
        ref={labelRef}
        htmlFor={runtimeId}
        className={`block mb-1 font-medium ${twText} ${editable ? 'cursor-text outline-none' : ''}`}
        style={twInline}
        contentEditable={editable}
        suppressContentEditableWarning
        onBlur={editable ? saveLabel : undefined}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        height={canvasHeight}
        className={`border border-gray-300 rounded-md w-full touch-none ${fieldApi ? 'cursor-crosshair' : 'bg-gray-50'}`}
        style={{
          ...(!fieldApi && fieldDef.backgroundColor ? { backgroundColor: fieldDef.backgroundColor } : {}),
        }}
      />

      {/* Clear button (runtime only) */}
      {fieldApi && (
        <button
          type="button"
          onClick={clearCanvas}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
};

// ------------------- Validators / schema helpers -----------------

export const getValidators = (
  fieldDef: SignatureFieldDefinition,
): { onChange?: ValidatorFn } => {
  if (fieldDef.validatorsConfig?.required) {
    return {
      onChange: ({ value }) => {
        if (!value) return `${fieldDef.label} is required.`;
        return undefined;
      },
    };
  }
  return {};
};

export const mapToSchemaType = (): string => 'signature';
