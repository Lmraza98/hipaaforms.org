import React from 'react';
import Link from 'next/link';

export default function FormBuilderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 mx-auto max-w-2xl text-center h-full">
      <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
      <p className="mb-6">The form you are looking for does not exist or has been deleted.</p>
      <Link 
        href="/forms" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Return to Forms
      </Link>
    </div>
  );
} 