'use client';

import React from 'react';
import { useEffect } from 'react';

export default function FormBuilderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Form builder error:', error);
  }, [error]);

  const errorMessage = error.message === 'FORBIDDEN' 
    ? 'You do not have permission to view or edit this form.'
    : 'An error occurred while loading the form builder. Please try again.';

  return (
    <div className="p-8 mx-auto max-w-2xl text-center">
      <h1 className="text-2xl font-bold mb-4">Error</h1>
      <p className="mb-6">{errorMessage}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
} 