import { memo } from 'react';

interface SubNavProps {
  isPreviewMode: boolean;
  onBuild: () => void;
  onTogglePreview: () => void;
  onPublish: () => void;
}

export const SubNav = memo(({
  isPreviewMode,
  onBuild,
  onTogglePreview,
  onPublish,
}: SubNavProps) => {
  const buttons: Array<{
    label: string;
    active: boolean;
    onClick: () => void;
  }> = [
    { label: 'Build', active: !isPreviewMode, onClick: onBuild },
    { label: isPreviewMode ? 'Previewing' : 'Preview', active: isPreviewMode, onClick: onTogglePreview },
    { label: 'Publish', active: false, onClick: onPublish },
  ];

  return (
    <div className="bg-white border-t border-b border-gray-200">
      <div className="container mx-auto flex justify-center py-2 space-x-2 sm:space-x-4">
        {buttons.map(({ label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={[
              'px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition',
              active
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});

SubNav.displayName = 'SubNav'; 