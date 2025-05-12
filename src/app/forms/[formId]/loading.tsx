import React from 'react';

export default function FormBuilderLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Loading form builder...</p>
      </div>
    </div>
  );
} 