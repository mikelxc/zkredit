'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  User,
  Asset,
  CreditLine,
  AgentConfig,
  SmartAccount,
  LockedBalance,
  ZkProof
} from '../types';
import { generateMockUserProfile } from '../utils/mock-data';

interface UserContextType {
  user: User | null;
  assets: Asset[];
  creditLine: CreditLine | null;
  agentConfigs: AgentConfig[];
  smartAccounts: SmartAccount[];
  lockedBalances: LockedBalance[];
  zkProofs: ZkProof[];
  isLoading: boolean;
  refreshUserData: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  assets: [],
  creditLine: null,
  agentConfigs: [],
  smartAccounts: [],
  lockedBalances: [],
  zkProofs: [],
  isLoading: true,
  refreshUserData: () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: privyUser, authenticated, ready } = usePrivy();
  const [userData, setUserData] = useState<UserContextType>({
    user: null,
    assets: [],
    creditLine: null,
    agentConfigs: [],
    smartAccounts: [],
    lockedBalances: [],
    zkProofs: [],
    isLoading: true,
    refreshUserData: () => { },
  });



  // Load user data when authentication state changes
  useEffect(() => {
    if (ready) {
      // Function to load user data (in this case, generate mock data)
      const loadUserData = () => {
        if (authenticated && privyUser) {
          // In a real app, this would be an API call to fetch user data
          const mockProfile = generateMockUserProfile(
            privyUser.id,
            privyUser.email?.address
          );

          setUserData({
            user: mockProfile.user,
            assets: mockProfile.assets,
            creditLine: mockProfile.creditLine,
            agentConfigs: mockProfile.agentConfigs,
            smartAccounts: mockProfile.smartAccounts,
            lockedBalances: mockProfile.lockedBalances,
            zkProofs: mockProfile.zkProofs,
            isLoading: false,
            refreshUserData: loadUserData,
          });
        } else {
          setUserData({
            user: null,
            assets: [],
            creditLine: null,
            agentConfigs: [],
            smartAccounts: [],
            lockedBalances: [],
            zkProofs: [],
            isLoading: false,
            refreshUserData: loadUserData,
          });
        }
      };
      loadUserData();
    }
  }, [ready, authenticated, privyUser]);

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
