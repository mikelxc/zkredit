'use client';

import { ReactNode } from 'react';
import { PrivyAuthProvider } from './privy-provider';
import { UserProvider } from './user-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
      <PrivyAuthProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </PrivyAuthProvider>
  );
}
