'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';

// No props needed since organizationId comes from server context
export default function CreateFormButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const createForm = trpc.form.createBlank.useMutation({
    onSuccess: (data) => {
      startTransition(() => {
        router.push(`/forms/${data.id}/builder`);
      });
    },
  });

  const handleCreateForm = () => {
    createForm.mutate({
      name: "Untitled Form",
    });
  };

  return (
    <button
      onClick={handleCreateForm}
      disabled={isPending || createForm.isPending}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {isPending || createForm.isPending ? "Creating..." : "Create New Form"}
    </button>
  );
} 