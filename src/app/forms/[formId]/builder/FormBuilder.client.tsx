'use client';
import React, { useState, useEffect } from 'react';
import { FormApi, useForm } from '@tanstack/react-form';
import { FieldValidator, getFieldModule } from '@/components/fields/index';
import { useFormBuilder, FormValues } from '@/hooks/useFormBuilder';
import type { FormFieldDefinition } from './types';
import { Palette } from './Palette';
import { PropertiesPanel } from './PropertiesPanel';
import { FieldCanvas } from './FieldCanvas';

const DEFAULT_INITIAL_FIELDS: FormFieldDefinition[] = [
    { id: 'default_name_field', type: 'ShortText', label: 'Your Name', placeholder: 'Enter your full name' },
];

interface FormBuilderClientProps {
    formId: string;
    initialFields?: FormFieldDefinition[];
    initialName: string;
    initialDescription: string;
    currentVersion: number;
    userRole: string;
}

export default function FormBuilderClient({
    formId,
    initialFields: initialFieldsProp,
    initialName,
    initialDescription,
    currentVersion: initialVersionProp,
    userRole,
}: FormBuilderClientProps) {
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

    const form = useForm({
        defaultValues: (initialFieldsProp || DEFAULT_INITIAL_FIELDS)
            .reduce((acc, f) => ({ ...acc, [f.id]: '' }), {} as FormValues),
        onSubmit: async ({ value }: { value: FormValues }) => { 
            console.log('Form submitted with values (test submission):', value);
            alert('Form data submitted for testing! Check the console.');
        },
    });
    
    const { Subscribe } = form;

    const {
        fields,
        formName,
        setFormName,
        formDescription,
        setFormDescription,
        selectedFieldDef,
        setSelectedFieldDef,
        removeField,
        saveForm,
        handlePropertyChange,
        isSaving,
        isCreating,
        dragOverIndex,
        draggedItemId,
        handleDragStartFromList,
        handleDragEndList,
        handleDragOverList,
        handleDropOnList,
    } = useFormBuilder({
        formId,
        initialFieldsData: initialFieldsProp || DEFAULT_INITIAL_FIELDS,
        initialName,
        initialDescription,
        initialVersion: initialVersionProp,
        form: form as FormApi<FormValues, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, unknown>,
    });

    useEffect(() => {
        if (selectedFieldDef) setIsPropertiesOpen(true);
    }, [selectedFieldDef, setIsPropertiesOpen]);

    useEffect(() => {
        const newDefaultValues = fields.reduce((acc, field) => {
            acc[field.id] = form.getFieldValue(field.id) ?? '';
            return acc;
        }, {} as FormValues);
        form.reset({ defaultValues: newDefaultValues });
    }, [fields, form]);

    const handleFieldClick = (fieldDef: FormFieldDefinition) => {
        setSelectedFieldDef(fieldDef);
        setIsPropertiesOpen(true);
    };

    const getFieldValidators = (fieldDef: FormFieldDefinition): { onChange?: FieldValidator<unknown> } => {
        const fieldModule = getFieldModule(fieldDef.type);
        const combinedValidators: { onChange?: FieldValidator<unknown> } = {};

        const canHaveValidators = !['Heading', 'Paragraph', 'Image', 'SubmitButton'].includes(fieldDef.type);

        if (canHaveValidators && 'validatorsConfig' in fieldDef && fieldDef.validatorsConfig?.required) {
            combinedValidators.onChange = (params: { value: unknown }) => {
                if (params.value === undefined || params.value === null || params.value === '') {
                    if (typeof params.value !== 'number' && typeof params.value !== 'boolean') { // Allow 0 and false
                        return `${fieldDef.label || 'Field'} is required.`;
                    }
                }
                return undefined;
            };
        }

        if (fieldModule.getValidators) {
            const moduleSpecificDef = fieldDef as Extract<FormFieldDefinition, { type: typeof fieldDef.type }>;
            const moduleValidators = fieldModule.getValidators(moduleSpecificDef);

            if (moduleValidators?.onChange) {
                const existingOnChange = combinedValidators.onChange;
                if (existingOnChange) {
                    combinedValidators.onChange = async (params: { value: unknown }) => {
                        const requiredError = await existingOnChange(params);
                        if (requiredError) return requiredError;
                        return typeof moduleValidators.onChange === 'function' ? moduleValidators.onChange(params) : undefined;
                    };
                } else {
                    combinedValidators.onChange = moduleValidators.onChange;
                }
            }
        }
        return combinedValidators;
    };

    return (
        <form
            onSubmit={e => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
            onReset={() => form.reset()}
            className="h-screen w-full flex flex-col md:flex-row bg-gray-100"
        >
            {/* Palette Section */}
            <div className={`w-full md:w-72 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 overflow-y-auto transition-all duration-300 ease-in-out ${isPaletteOpen ? 'max-h-screen' : 'max-h-16 md:max-h-full overflow-hidden md:overflow-y-auto'}`}>
                <button
                    className="md:hidden w-full text-left p-2 mb-2 font-semibold text-gray-700 flex justify-between items-center"
                    onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                    type="button"
                >
                    Field Types
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transform transition-transform ${isPaletteOpen ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div className={`${isPaletteOpen ? 'block' : 'hidden'} md:block`}>
                    <Palette />
                </div>
            </div>
            {/* Center Area: Form Header + Field Canvas */}
            <div className="flex-grow h-full flex flex-col overflow-y-auto">
                {/* Form Header Section */}
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <div className="flex-grow mr-4">
                            <input
                                type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                                placeholder="Form Name"
                                className="text-lg sm:text-xl font-semibold text-gray-700 border-b-2 border-transparent focus:border-blue-500 outline-none w-full mb-1"
                                disabled={(userRole !== 'OWNER' && userRole !== 'ADMIN' && userRole !== 'EDITOR') || isSaving || isCreating}
                            />
                            <input
                                type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                                placeholder="Form Description (optional)"
                                className="text-sm text-gray-500 border-b border-transparent focus:border-gray-300 outline-none w-full"
                                disabled={(userRole !== 'OWNER' && userRole !== 'ADMIN' && userRole !== 'EDITOR') || isSaving || isCreating}
                            />
                        </div>
                        {(userRole === 'OWNER' || userRole === 'ADMIN' || userRole === 'EDITOR') && (
                            <button
                                type="button" onClick={saveForm}
                                disabled={isSaving || isCreating}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors disabled:bg-gray-400 text-sm whitespace-nowrap"
                            >
                                {isSaving || isCreating ? 'Saving...' : 'Save Form'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Field Canvas Section - takes remaining space */}
                <FieldCanvas
                    fields={fields}
                    form={form}
                    selectedFieldDef={selectedFieldDef}
                    dragOverIndex={dragOverIndex}
                    handleDragOverList={handleDragOverList}
                    handleDropOnList={handleDropOnList}
                    handleDragStartFromList={handleDragStartFromList}
                    handleDragEndList={handleDragEndList}
                    handleFieldClick={handleFieldClick}
                    removeField={removeField}
                    getFieldValidators={getFieldValidators}
                    draggedItemId={draggedItemId}
                />
            </div>

            {/* Properties Panel Section */}
            <div className={`w-full md:w-80 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-4 overflow-y-auto flex flex-col transition-all duration-300 ease-in-out ${isPropertiesOpen ? 'max-h-screen' : 'max-h-16 md:max-h-full overflow-hidden md:overflow-y-auto'}`}>
                <button
                    className="md:hidden w-full text-left p-2 mb-2 font-semibold text-gray-800 flex justify-between items-center"
                    onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
                    type="button"
                >
                    Properties
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transform transition-transform ${isPropertiesOpen ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div className={`${isPropertiesOpen || !selectedFieldDef ? 'block' : 'hidden'} md:block flex-grow flex flex-col`}>
                    {selectedFieldDef ? (
                        <PropertiesPanel
                            key={selectedFieldDef.id}
                            selectedFieldDef={selectedFieldDef}
                            onPropertyChange={handlePropertyChange}
                        />
                    ) : (
                        <div className="text-center text-gray-500 mt-5 flex-grow flex items-center justify-center">
                            <div>
                                <p>Select a field to see its properties.</p>
                                <p className="text-sm mt-1 md:hidden">Or drag new fields from the &quot;Field Types&quot; panel above.</p>
                            </div>
                        </div>
                    )}
                    {/* Submit button for form DATA (end-user simulation) */}
                    <Subscribe selector={s => [s.canSubmit, s.isSubmitting] as const}>

                        {
                            ([canSubmit, isSubmitting]) => {
                                return (
                                    <div className="mt-auto pt-4">
                                        <button
                                            type="button"
                                            onClick={() => form.handleSubmit()}
                                            disabled={!canSubmit || isSubmitting}
                                            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md cursor-pointer font-medium transition-colors disabled:bg-gray-400"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Form Data (Test)'}
                                        </button>
                                        <button
                                            type="reset"
                                            onClick={() => form.reset()}
                                            className="w-full mt-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 border-none rounded-md cursor-pointer font-medium transition-colors"
                                        >
                                            Reset Form Data
                                        </button>
                                    </div>
                                );
                            }
                        }
                    </Subscribe>
                </div>
            </div>
        </form>
    );
}
