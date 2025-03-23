// User related types
export interface User {
  id: string;
  name?: string;
  email?: string;
  walletAddress?: string;
  createdAt: number;
  updatedAt: number;
  profileImageUrl?: string;
}

// Asset related types
export interface Asset {
  ticker: string;
  name?: string;
  balance: number;
  usdPrice: number;
  source: 'wallet' | 'exchange';
  sourceAddress: string;
  sourceName?: string;
  lastUpdated: number;
}

// Credit line related types
export interface CreditLine {
  id: string;
  totalLimit: number;
  availableCredit: number;
  utilizationRate: number;
  interestRate: number;
  collateralRatio: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: number;
  updatedAt: number;
}

// Transaction related types
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'borrow' | 'repay' | 'transfer';
  amount: number;
  asset: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  fee?: number;
}

// Smart account related types
export interface SmartAccount {
  id: string;
  address: string;
  chain: string;
  type: 'eoa' | 'contract';
  balance: number;
  createdAt: number;
  updatedAt: number;
}

// Locked balance related types
export interface LockedBalance {
  id: string;
  asset: string;
  amount: number;
  lockedUntil: number;
  reason: 'collateral' | 'staking' | 'vesting';
  createdAt: number;
}

// ZK Proof related types
export interface ZkProof {
  id: string;
  type: 'balance' | 'ownership';
  status: 'valid' | 'invalid' | 'pending';
  publicInputs: {
    assetType: string;
    thresholdMet?: boolean;
    timestamp: number;
  };
  createdAt: number;
  expiresAt: number;
  verificationCount: number;
  lastVerified?: number;
}

// AI Agent related types
export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  proofId: string;
  permissions: string[];
  createdAt: number;
  updatedAt: number;
  lastActive?: number;
  config?: Record<string, unknown>;
}

// Proof generation related types
export interface ProofInput {
  asset: Asset;
  threshold?: number;
  timestamp: number;
  userAddress: string;
}

export interface ProofOutput {
  id: string;
  type: 'balance' | 'ownership';
  status: 'valid' | 'invalid' | 'pending';
  publicInputs: {
    assetType: string;
    thresholdMet?: boolean;
    timestamp: number;
  };
  createdAt: number;
  expiresAt: number;
  verificationCount: number;
  lastVerified?: number;
}

// Chart related types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
  }[];
}

// Notification related types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}
