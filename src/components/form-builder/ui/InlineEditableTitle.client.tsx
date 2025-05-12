'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { useFormBuilderContext } from '../context';

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
    initialDescription,
    initialVersion
}: InlineEditableTitleProps) {
    const [displayName, setDisplayName] = useState(initialName || "Untitled Form");
    const [currentValue, setCurrentValue] = useState(initialName || "Untitled Form");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setIsEditingDescription] = useState(initialDescription || '');

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const editableDivRef = useRef<HTMLDivElement>(null);
    const { setFormName } = useFormBuilderContext();

    const updateFormMutation = trpc.form.update.useMutation({
        onSuccess: ({ name: updatedName }) => {
            if (updatedName) {
                setFormName(updatedName);
                setDisplayName(updatedName); 
                setCurrentValue(updatedName); 
                if (editableDivRef.current && editableDivRef.current.innerText !== updatedName) {
                    editableDivRef.current.innerText = updatedName; // Ensure DOM reflects saved name
                }
                router.refresh();
            }
        },
        onError: (err) => {
            setError(err.message || 'Failed to save changes.');
            // Revert current value to last saved name (displayName)
            setCurrentValue(displayName);
            if (editableDivRef.current && editableDivRef.current.innerText !== displayName) {
                 editableDivRef.current.innerText = displayName; // Ensure DOM reflects reverted name
            }
            setFormName(displayName); 
        }
    });

    useEffect(() => { 
        const nameToUse = initialName || "Untitled Form";
        setDisplayName(nameToUse);
        setCurrentValue(nameToUse); 
        if (editableDivRef.current && editableDivRef.current.innerText !== nameToUse) {
            editableDivRef.current.innerText = nameToUse;
        }
    }, [initialName]);

    const handleSave = useCallback(async () => {
        const trimmedValue = currentValue.trim();
        
        if (trimmedValue === displayName || trimmedValue === '') {
            const valueToSet = trimmedValue === '' ? displayName : trimmedValue;
            setCurrentValue(valueToSet); 
            if (editableDivRef.current && editableDivRef.current.innerText !== valueToSet) {
                editableDivRef.current.innerText = valueToSet;
            }
            if (trimmedValue === '') { 
                setFormName(displayName); // If cleared, context should also use original displayName
            } else {
                 setFormName(valueToSet); // If unchanged but not empty, context is fine
            }
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            await updateFormMutation.mutateAsync({
                id: formId,
                name: trimmedValue,
                description: initialDescription || '',
                version: initialVersion,
            });
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setIsSaving(false);
        }
    }, [currentValue, displayName, formId, initialDescription, initialVersion, updateFormMutation, setFormName]);

    const handleBlur = () => {
        handleSave();
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
            editableDivRef.current?.blur();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setCurrentValue(displayName); 
            if (editableDivRef.current && editableDivRef.current.innerText !== displayName) {
                editableDivRef.current.innerText = displayName; // Ensure DOM reflects reverted name on Escape
            }
            setFormName(displayName); 
            editableDivRef.current?.blur();
        }
    };

    const handleDivInput = (e: React.FormEvent<HTMLDivElement>) => {
        setCurrentValue(e.currentTarget.innerText);
        // Also update form context live if desired, or wait for blur/save
        // setFormName(e.currentTarget.innerText); // Optional: live update context
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-3 p-1">
            <h1
                ref={editableDivRef}
                contentEditable={!isSaving}
                suppressContentEditableWarning={true}
                onInput={handleDivInput}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="p-1 -m-1 text-2xl font-semibold text-gray-900 outline-none min-w-[100px] break-all border-b border-blue-600 cursor-text text-center"
                style={{ WebkitUserModify: !isSaving ? 'read-write-plaintext-only' : 'read-only' }} 
            >
                {/* Content is managed by the browser during typing; useEffect sets initial DOM content */}
            </h1>
            {error && <p className="text-sm text-red-600 ml-2">Error: {error}</p>}
        </div>
    );
} 