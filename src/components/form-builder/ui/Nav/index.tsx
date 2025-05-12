'use client';

import { memo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useFormBuilderContext } from '../../context';
import { TopBar } from './TopBar';
import { SubNav } from './SubNav';

interface FormBuilderNavProps {
  formId: string;
  initialName: string;
  initialDescription: string;
  initialVersion: number;
}

export const FormBuilderNav = memo((props: FormBuilderNavProps) => {
  const { data: session } = useSession();
  const { isPreviewMode, setIsPreviewMode } = useFormBuilderContext();

  const handleAddCollaborators = useCallback(() => {
    console.log('Add Collaborators clicked');
  }, []);

  const handleBuild = useCallback(() => {
    setIsPreviewMode(false);
    console.log('Build clicked');
  }, [setIsPreviewMode]);

  const handleTogglePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode, setIsPreviewMode]);

  const handlePublish = useCallback(() => {
    console.log('Publish clicked');
  }, []);

  return (
    <div className="sticky inset-x-0 top-0 z-40 bg-white shadow-sm">
      <TopBar
        {...props}
        sessionUser={session?.user}
        onCollaboratorsClick={handleAddCollaborators}
      />
      <SubNav
        isPreviewMode={isPreviewMode}
        onBuild={handleBuild}
        onTogglePreview={handleTogglePreview}
        onPublish={handlePublish}
      />
    </div>
  );
});

FormBuilderNav.displayName = 'FormBuilderNav'; 