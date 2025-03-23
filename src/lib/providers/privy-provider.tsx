'use client';

import { PrivyProvider, PrivyClientConfig } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { wagmiConfig } from '../config/wagmi-config';

// Replace with your actual Privy App ID
const PRIVY_APP_ID = 'cm8fgqcjr0119qqhsgob0rge3';

// Privy config
const privyConfig: PrivyClientConfig = {
  loginMethods: ['email', 'wallet', 'google', 'twitter'],
  appearance: {
    theme: 'light',
    accentColor: '#0052FF', // This is already in the correct format for a hex color
    logo: '/images/tokenbase-logo.png',
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
};

export function PrivyAuthProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <QueryProvider>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryProvider>
    </PrivyProvider>
  );
}
