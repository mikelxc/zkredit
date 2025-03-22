'use client';

import { ReactNode } from 'react';
import { PrivyAuthProvider } from './privy-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PrivyAuthProvider>
      {children}
    </PrivyAuthProvider>
  );
}
