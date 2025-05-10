'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface ClientSessionProviderProps {
  children: ReactNode;
  // session?: any; // Optional: if you plan to pass an initial session from server components
}

export default function ClientSessionProvider({ children }: ClientSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
} 