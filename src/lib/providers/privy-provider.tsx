'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { ReactNode } from 'react';
import { sepolia, baseSepolia } from 'wagmi/chains';

// Replace with your actual Privy App ID
const PRIVY_APP_ID = 'cm8fgqcjr0119qqhsgob0rge3';

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
      <PrivyWagmiConnector
        wagmiChainsConfig={{
          chains: [sepolia, baseSepolia],
          defaultChainId: sepolia.id,
        }}
      >
        {children}
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}
