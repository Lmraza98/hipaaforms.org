import { memo } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Logo } from '../../../Logo';
import InlineEditableTitle from '../InlineEditableTitle.client';
import type { User } from 'next-auth';

interface TopBarProps {
  formId: string;
  initialName: string;
  initialDescription: string;
  initialVersion: number;
  sessionUser?: User;
  onCollaboratorsClick: () => void;
}

export const TopBar = memo(({
  formId,
  initialName,
  initialDescription,
  initialVersion,
  sessionUser,
  onCollaboratorsClick,
}: TopBarProps) => (
  <div className="container mx-auto flex items-center justify-between h-16">
    <Logo />

    <div className="absolute left-1/2 -translate-x-1/2 flex-1 flex justify-center min-w-0 px-4">
      <InlineEditableTitle
        formId={formId}
        initialName={initialName}
        initialDescription={initialDescription}
        initialVersion={initialVersion}
      />
    </div>

    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={onCollaboratorsClick}
        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="hidden sm:inline">Add Collaborators</span>
      </button>

      {sessionUser && (
        <Link href="/account" className="text-gray-700 hover:text-gray-900">
          <UserCircleIcon className="h-8 w-8" />
        </Link>
      )}
    </div>
  </div>
));

TopBar.displayName = 'TopBar'; 