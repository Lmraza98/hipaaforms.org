'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/marketing/Navigation.client';

interface LayoutControllerProps {
  children: React.ReactNode;
}

export default function LayoutController({ children }: LayoutControllerProps) {
  const pathname = usePathname();

  // Regex to match /forms/[anything]/builder or /forms/[anything]/builder/*
  const isBuilderPage = /^\/forms\/[^/]+\/builder($|\/)/.test(pathname);

  const mainStyle: React.CSSProperties = {
    paddingTop: isBuilderPage ? '0px' : '80px',
  };

  return (
    <>
      {!isBuilderPage && <Navigation />}
      <main style={mainStyle}>
        {children}
      </main>
    </>
  );
} 