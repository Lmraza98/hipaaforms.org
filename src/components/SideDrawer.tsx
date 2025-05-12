import clsx from 'clsx';
import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  openLabel: string;
  position: 'left' | 'right';
  widthClass: string;
  children: React.ReactNode;
}

export function SideDrawer({
  isOpen,
  onOpen,
  onClose,
  openLabel,
  position,
  widthClass,
  children,
}: DrawerProps) {
  const isLeft = position === 'left';

  return (
    <div className={clsx("relative h-full flex-shrink-0", !isLeft && "flex justify-end")}>
      {/* open drawer panel */}
      <div
        className={clsx(
          'bg-gray-50 border-gray-200 h-full transition-[width] duration-500 ease-in-out',
          isLeft ? 'border-r' : 'border-l',
          isOpen ? `${widthClass} p-4 overflow-y-auto` : 'w-0 p-0 overflow-hidden'
        )}
      >
        {isOpen && (
          <div className="flex flex-col h-full">
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="text-gray-700 hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        )}
      </div>

      {/* collapsed "open" button, centered vertically */}
      {!isOpen && (
        <div
          className={clsx(
            'flex z-30', // Common base for the container
            // Mobile: fixed bottom, side-dependent based on isLeft
            'fixed bottom-4',
            isLeft ? 'left-4' : 'right-4',
            // Desktop: absolute top, side-dependent, reset mobile fixed positioning
            'sm:absolute sm:top-[20px] sm:bottom-auto',
            isLeft ? 'sm:left-0 sm:right-auto' : 'sm:right-0 sm:left-auto'
          )}
        >
          <button
            onClick={onOpen}
            className={clsx(
              // Common button styles
              'bg-blue-600 text-white shadow-lg transition-colors duration-300 ease-in-out font-semibold flex items-center justify-center',
              // Mobile-specific: Circle, fixed size, no padding (icon will define content size)
              'w-12 h-12 rounded-full p-0', // Slightly smaller: w-12 h-12
              // Desktop-specific: Auto size, padding, specific rounding for half-pill
              'sm:w-auto sm:h-auto sm:px-6 sm:py-3 sm:whitespace-nowrap',
              isLeft ? 'sm:rounded-l-none sm:rounded-r-full' : 'sm:rounded-r-none sm:rounded-l-full'
            )}
            aria-label={openLabel} // Keep aria-label for accessibility
          >
            {/* Mobile: Plus Icon */}
            <span className="sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"> {/* strokeWidth increased for visibility */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            {/* Desktop: Text Label */}
            <span className="hidden sm:block">
              {openLabel}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
