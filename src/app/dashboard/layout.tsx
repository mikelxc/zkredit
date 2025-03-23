'use client';

import { ReactNode } from 'react';
import { AppProviders } from '@/lib/providers/app-providers';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <DashboardLayout>{children}</DashboardLayout>
    </AppProviders>
  );
}
