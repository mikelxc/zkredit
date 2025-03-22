'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { ReactNode } from 'react';

// Replace with your actual Privy App ID
const PRIVY_APP_ID = 'cltest-tokenbase';

export function PrivyAuthProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        appearance: {
          theme: 'light',
          accentColor: '#0052FF',
          logo: '/images/tokenbase-logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <PrivyWagmiConnector>{children}</PrivyWagmiConnector>
    </PrivyProvider>
  );
}
