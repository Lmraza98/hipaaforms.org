'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import type { FormFieldDefinition, FormValues } from './types';
import { Palette } from './Pallete';
import { PropertiesPanel } from './PropertiesPanel';
import { FieldCanvas } from './FieldCanvas';
import { useFormBuilderContext } from './context';

const DEFAULT_INITIAL_FIELDS: FormFieldDefinition[] = [
    { id: 'default_name_field', type: 'ShortText', label: 'Your Name', placeholder: 'Enter your full name' },
];


export default function FormBuilderClient() {

    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

    const {
        fields,
        // formName,
        selectedFieldDef,
        // setSelectedFieldDef
    } = useFormBuilderContext();

    const form = useForm({
        defaultValues: (fields || DEFAULT_INITIAL_FIELDS)
            .reduce((acc, f) => ({ ...acc, [f.id]: '' }), {} as FormValues),
        onSubmit: async ({ value }: { value: FormValues }) => {
            console.log('Form submitted with values (test submission):', value);
            alert('Form data submitted for testing! Check the console.');
        },
    });

    useEffect(() => {
        const newDefaultValues = fields.reduce((acc, field) => {
            acc[field.id] = form.getFieldValue(field.id) ?? '';
            return acc;
        }, {} as FormValues);
        form.reset({ defaultValues: newDefaultValues });
    }, [fields, form]);

    return (
        <form
            onSubmit={e => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
            onReset={() => form.reset()}
            className="h-screen w-full flex flex-col md:flex-row bg-gray-100"
        >
            {/* ← Palette wrapper */}
            <div className="relative flex-shrink-0">
                <div
                    className={`
        bg-gray-50 border-r border-gray-200
        h-full transition-[width] duration-500 ease-in-out
        ${isPaletteOpen ? 'w-72 overflow-y-auto' : 'w-0 overflow-visible'}
      `}
                >
                    {isPaletteOpen && (
                        <div className="flex flex-col h-full">
                            {/* close button */}
                            <div className="flex justify-end p-2">
                                <button
                                    onClick={() => setIsPaletteOpen(false)}
                                    aria-label="Close palette"
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {/* actual Palette */}
                            <div className="p-4 flex-grow">
                                <Palette />
                            </div>
                        </div>
                    )}
                </div>

                {/* half-pill toggle */}
                {!isPaletteOpen && (
                    <button
                        onClick={() => setIsPaletteOpen(true)}
                        className="
                            absolute left-0 top-1/2
                            transform -translate-y-1/2

                            /* wider than tall */
                            px-6 py-3 
                            whitespace-nowrap

                            /* shape: only right edge is fully rounded */
                            rounded-r-full rounded-l-none

                            bg-blue-600 text-white font-semibold
                            shadow-lg
                            transition-colors duration-300 ease-in-out
                            z-10
                        "
                    >
                        Add Element +
                    </button>
                )}
            </div>
            {/* Center Area: Form Header + Field Canvas */}
            <div className="flex-grow h-full w-full flex flex-col overflow-y-auto justify-center align-middle">
                <div className="flex flex-row overflow-y-auto justify-center align-middle">
                    <FieldCanvas />
                </div>
            </div>

            {/* Properties Panel Section */}
            {/* ← Properties Panel Drawer */}
            <div className="relative flex-shrink-0">
                <div
                    className={`
      bg-gray-50 border-l border-gray-200 h-full
      transition-[width] duration-500 ease-in-out
      ${isPropertiesOpen
                            ? 'w-80 p-4 overflow-y-auto'
                            : 'w-0 p-0 overflow-hidden'}
    `}
                >
                    {isPropertiesOpen && selectedFieldDef && (
                        <div className="flex flex-col h-full">
                            {/* Close "X" at top */}
                            <div className="flex justify-end mb-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPropertiesOpen(false)}
                                    aria-label="Close properties panel"
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Panel Content */}
                            <PropertiesPanel />
                        </div>
                    )}
                </div>

                {/* Button to open properties when closed */}
                {!isPropertiesOpen && selectedFieldDef && (
                    <button
                        type="button"
                        onClick={() => setIsPropertiesOpen(true)}
                        aria-label="Open properties panel"
                        className="
                            absolute right-0 top-1/2
                            transform -translate-y-1/2

                            px-6 py-3 
                            whitespace-nowrap

                            rounded-l-full rounded-r-none

                            bg-blue-600 text-white font-semibold
                            shadow-lg
                            transition-colors duration-300 ease-in-out
                            z-10
                        "
                    >
                        Edit Properties
                    </button>
                )}
            </div>
        </form>
    );
}
