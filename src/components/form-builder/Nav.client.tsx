// components/form-builder/FormBuilderNav.client.tsx
'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import InlineEditableTitle from './InlineEditableTitle.client';
import { useFormBuilderContext } from './context';

export const FormBuilderNav = ({
  formId,
  initialName,
  initialDescription,
  initialVersion,
}: {
  formId: string;
  initialName: string;
  initialDescription: string;
  initialVersion: number;
}) => {
  const { data: session } = useSession();
  const { isPreviewMode, setIsPreviewMode } = useFormBuilderContext();

  return (
    <div className="sticky inset-x-0 top-0 z-40 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="container mx-auto flex items-center justify-between h-16">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" aria-label="HIPAAForms Home" className="flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-indigo-600"
            >
              <path
                d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12h6M12 9v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Center: InlineEditableTitle */}
        <div className="absolute left-1/2 -translate-x-1/2 flex-1 flex justify-center min-w-0 px-4">
          <InlineEditableTitle
            formId={formId}
            initialName={initialName}
            initialDescription={initialDescription}
            initialVersion={initialVersion}
          />
        </div>

        {/* Right: "Add Collaborators" button + UserCircleIcon */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              console.log('Add Collaborators clicked');
            }}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">Add Collaborators</span>
          </button>
          {session?.user && (
            <Link href="/account" className="text-gray-700 hover:text-gray-900">
              <UserCircleIcon className="h-8 w-8" />
            </Link>
          )}
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-white border-t border-b border-gray-200 relative">
        <div className="container mx-auto flex items-center justify-center py-2 space-x-2 sm:space-x-4">
          {/* Build Button */}
          <button
            onClick={() => {
              if (isPreviewMode) setIsPreviewMode(false);
              console.log('Build clicked');
            }}
            className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition 
                        ${!isPreviewMode ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            Build
          </button>

          {/* Preview Toggle Button (replaces Settings) */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition 
                        ${isPreviewMode ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            {isPreviewMode ? 'Previewing' : 'Preview'}
          </button>

          {/* Publish Button */}
          <button
            onClick={() => {
              console.log('Publish clicked');
              // Potentially set isPreviewMode(false) if navigating away or opening a modal
            }}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
