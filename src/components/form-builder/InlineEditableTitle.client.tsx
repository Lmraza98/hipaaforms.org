'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Placeholder for a server action to update form details
// You'll need to create this server action e.g., in 'app/actions.ts'
// import { updateFormNameAndDescription } from '@/app/actions'; 

interface InlineEditableTitleProps {
    formId: string;
    initialName: string;
    initialDescription: string | null;
    initialVersion: number;
    // It's good practice to pass userRole if edits are permission-based
    // For now, assuming edits are allowed if the component is rendered.
    // userRole: string; 
}

export default function InlineEditableTitle({
    formId,
    initialName,
    initialDescription
}: InlineEditableTitleProps) {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription || '');

    const [isEditingName, setIsEditingName] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ _, setIsEditingDescription] = useState(false);
    
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    useEffect(() => {
        setDescription(initialDescription || '');
    }, [initialDescription]);

    const handleSave = useCallback(async (field: 'name' | 'description', value: string) => {
        if ((field === 'name' && value === initialName) || (field === 'description' && value === (initialDescription || ''))) {
            setIsEditingName(false);
            setIsEditingDescription(false);
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            // --- SERVER ACTION CALL ---
            // Replace with your actual server action
            // const result = await updateFormNameAndDescription({ formId, name: field === 'name' ? value : name, description: field === 'description' ? value : description });
            // if (result.error) throw new Error(result.error);
            
            // SIMULATED SERVER ACTION FOR NOW
            await new Promise(resolve => setTimeout(resolve, 700)); 
            console.log(`Simulated save for ${field}: ${value} (Form ID: ${formId})`);
            // --- END SERVER ACTION CALL ---

            if (field === 'name') initialName = value; // Update baseline for next edit
            if (field === 'description') initialDescription = value; // Update baseline for next edit
            
            setIsEditingName(false);
            setIsEditingDescription(false);
            router.refresh(); // Refresh server components & re-fetch data
        } catch (err) {
            console.error("Failed to save:", err);
            setError(err instanceof Error ? err.message : 'Failed to save changes.');
            // Optionally revert changes on error
            if (field === 'name') setName(initialName);
            if (field === 'description') setDescription(initialDescription || '');
        } finally {
            setIsSaving(false);
        }
    }, [formId, name, description, initialName, initialDescription, router]);


    const handleNameBlur = () => {
        if (name.trim() === '') {
            setName(initialName); // Revert if empty
            setIsEditingName(false);
            return;
        }
        handleSave('name', name);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-3 p-1">
            <div className="flex items-center group mb-1 sm:mb-0">
                {isEditingName ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleNameBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleNameBlur();
                            }
                            if (e.key === 'Escape') {
                                setName(initialName);
                                setIsEditingName(false);
                            }
                        }}
                        className="text-lg font-semibold border-b-2 border-blue-500 outline-none focus:border-blue-600 transition-colors"
                        autoFocus
                        disabled={isSaving}
                    />
                ) : (
                    <h1
                        className="text-lg font-semibold  group-hover:text-blue-600 cursor-pointer"
                        onClick={() => !isSaving && setIsEditingName(true)}
                        title="Click to edit form name"
                    >
                        {name || "Untitled Form"}
                    </h1>
                )}
                {!isEditingName && (
                    <button 
                        onClick={() => !isSaving && setIsEditingName(true)} 
                        className="ml-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        aria-label="Edit form name"
                        disabled={isSaving}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
                        </svg>
                    </button>
                )}
            </div>
            {error && <p className="text-sm text-red-600 ml-2">Error: {error}</p>}
        </div>
    );
} 