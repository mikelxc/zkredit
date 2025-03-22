// User types
export interface User {
  id: string;
  email: string;
  privyId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

// Asset types
export interface Asset {
  id: string;
  userId: string;
  assetType: string;
  ticker: string;
  balance: number;
  lockedBalance: number;
  updatedAt: string;
}

// Credit Line types
export interface CreditLine {
  id: string;
  userId: string;
  totalLimit: number;
  usedAmount: number;
  interestRate: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

// Agent Configuration types
export interface AgentConfig {
  id: string;
  userId: string;
  agentName: string;
  spendingLimitPerTx: number;
  dailyLimit: number;
  allowedChains: string[];
  status: 'active' | 'paused' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Smart Contract Account types
export interface SmartAccount {
  id: string;
  userId: string;
  address: string;
  chainId: string;
  createdAt: string;
}

// Locked Balance types
export interface LockedBalance {
  id: string;
  userId: string;
  assetId: string;
  amount: number;
  purpose: 'Agent Operations' | 'Credit Backing' | 'Direct Transactions';
  targetChain: string;
  expiresAt: string;
  createdAt: string;
}

// ZK Proof types
export interface ZkProof {
  id: string;
  userId: string;
  proofType: 'Asset Claim' | 'Credit Line' | 'Agent Authority';
  proofData: string;
  assetId: string;
  amount: number;
  targetChain: string;
  status: 'active' | 'expired' | 'revoked';
  expiresAt: string;
  createdAt: string;
}

// Chain types
export interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Supported chains
export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: '1',
    name: 'Ethereum',
    icon: '/images/chains/ethereum.svg',
    color: '#627EEA'
  },
  {
    id: '137',
    name: 'Polygon',
    icon: '/images/chains/polygon.svg',
    color: '#8247E5'
  },
  {
    id: '8453',
    name: 'Base',
    icon: '/images/chains/base.svg',
    color: '#0052FF'
  },
  {
    id: '10',
    name: 'Optimism',
    icon: '/images/chains/optimism.svg',
    color: '#FF0420'
  },
  {
    id: '42161',
    name: 'Arbitrum',
    icon: '/images/chains/arbitrum.svg',
    color: '#28A0F0'
  }
];
