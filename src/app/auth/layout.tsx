'use client';

import { ReactNode } from 'react';
import { AppProviders } from '@/lib/providers/app-providers';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}
