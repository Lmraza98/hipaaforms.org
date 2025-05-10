'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc'; // VERIFY THIS PATH: Your tRPC client setup
// import { Button } from '@/components/ui/button'; // Using standard button for now

interface CreateFormButtonProps {
  // TODO: Determine how to get the organizationId. 
  // This could be from user's current session/context, or a prop.
  // For now, let's assume it might be passed as a prop or fetched.
  defaultOrganizationId?: string; 
}

export default function CreateFormButton({ defaultOrganizationId }: CreateFormButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Default tRPC hook usage, types for data and err are usually inferred.
  const createFormMutation = trpc.form.createBlank.useMutation({
    onSuccess: (data) => { 
      router.push(`/forms/${data.id}/builder`);
    },
    onError: (err) => { 
      setError(err.message || "Could not create form. Please try again.");
      console.error("Error creating form:", err);
    },
  });

  const handleCreateForm = () => {
    setError(null);
    // TODO: Replace this with actual organization ID selection logic if needed.
    // For now, using a placeholder or the default prop.
    const organizationIdToUse = defaultOrganizationId; 

    if (!organizationIdToUse) {
      setError("Organization ID is missing. Cannot create form.");
      // In a real app, you might have a modal to select an org or disable the button.
      console.error("CreateFormButton: Organization ID is missing.");
      return;
    }

    startTransition(() => {
      createFormMutation.mutate({
        // name: "Untitled Form", // Name defaults in the mutation if not provided
        organizationId: organizationIdToUse,
      });
    });
  };

  return (
    <div>
      <button 
        onClick={handleCreateForm} 
        disabled={isPending || createFormMutation.isPending}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }} // Basic styling
      >
        {isPending || createFormMutation.isPending ? 'Creating Form...' : 'Create New Form'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>Error: {error}</p>}
    </div>
  );
} 