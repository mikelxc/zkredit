'use client';

import { ReactNode, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import Navbar from './navbar';
import TestnetBadge from '../testnet-badge';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // Use useEffect for redirects instead of during render
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/auth');
    }
  }, [ready, authenticated, router]);

  // Show loading state while checking authentication
  if (!ready || (ready && !authenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="fixed top-16 right-4 z-50">
        <TestnetBadge />
      </div>
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
