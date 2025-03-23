import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  Asset, 
  CreditLine, 
  AgentConfig, 
  SmartAccount, 
  LockedBalance, 
  ZkProof,
  SUPPORTED_CHAINS
} from '../types/index';

// Mock cryptocurrencies
export const CRYPTOCURRENCIES = [
  { ticker: 'BTC', name: 'Bitcoin', price: 65432.10, change24h: 2.34 },
  { ticker: 'ETH', name: 'Ethereum', price: 3456.78, change24h: 1.23 },
  { ticker: 'SOL', name: 'Solana', price: 143.21, change24h: 5.67 },
  { ticker: 'MATIC', name: 'Polygon', price: 0.87, change24h: -1.45 },
  { ticker: 'AVAX', name: 'Avalanche', price: 34.56, change24h: 3.21 },
  { ticker: 'DOT', name: 'Polkadot', price: 7.89, change24h: -0.76 },
  { ticker: 'LINK', name: 'Chainlink', price: 18.90, change24h: 2.87 },
  { ticker: 'UNI', name: 'Uniswap', price: 8.76, change24h: 1.09 },
  { ticker: 'AAVE', name: 'Aave', price: 92.34, change24h: 0.54 },
  { ticker: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.01 },
];

// Generate a mock user
export function generateMockUser(privyId: string, email?: string): User {
  return {
    id: uuidv4(),
    privyId: privyId,
    email: email || `user-${privyId.substring(0, 8)}@example.com`,
    displayName: `User ${privyId.substring(0, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Generate mock assets for a user
export function generateMockAssets(userId: string): Asset[] {
  return CRYPTOCURRENCIES.map(crypto => {
    const balance = Math.random() * (crypto.ticker === 'BTC' ? 2 : crypto.ticker === 'ETH' ? 20 : 1000);
    const lockedBalance = balance * 0.2; // 20% of balance is locked
    
    return {
      id: uuidv4(),
      userId: userId,
      assetType: 'cryptocurrency',
      ticker: crypto.ticker,
      balance,
      lockedBalance,
      updatedAt: new Date().toISOString()
    };
  });
}

// Generate a mock credit line for a user
export function generateMockCreditLine(userId: string): CreditLine {
  const totalLimit = 50000 + Math.random() * 50000;
  const usedAmount = Math.random() * totalLimit * 0.6;
  
  return {
    id: uuidv4(),
    userId,
    name: 'Primary Credit Line',
    totalLimit,
    usedAmount,
    limit: totalLimit, // Alias for totalLimit for compatibility
    used: usedAmount, // Alias for usedAmount for compatibility
    interestRate: 3 + Math.random() * 5,
    status: 'active',
    collateralAssetIds: [],
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Generate mock agent configurations for a user
export function generateMockAgentConfigs(userId: string): AgentConfig[] {
  const agentTypes = ['DeFi Trader', 'Yield Optimizer', 'NFT Trader', 'Payment Processor'];
  
  return agentTypes.map(type => {
    return {
      id: uuidv4(),
      userId,
      agentName: `${type} ${Math.floor(Math.random() * 1000)}`,
      spendingLimitPerTx: 1000 + Math.random() * 9000,
      dailyLimit: 5000 + Math.random() * 15000,
      allowedChains: SUPPORTED_CHAINS.slice(0, Math.floor(Math.random() * 3) + 1).map(chain => chain.id),
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}

// Generate mock smart contract accounts for a user
export function generateMockSmartAccounts(userId: string): SmartAccount[] {
  return SUPPORTED_CHAINS.slice(0, 3).map(chain => {
    return {
      id: uuidv4(),
      userId,
      address: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      chainId: chain.id,
      createdAt: new Date().toISOString()
    };
  });
}

// Generate mock locked balances for a user
export function generateMockLockedBalances(userId: string, assets: Asset[]): LockedBalance[] {
  const purposes: Array<'Agent Operations' | 'Credit Backing' | 'Direct Transactions'> = [
    'Agent Operations', 'Credit Backing', 'Direct Transactions'
  ];
  
  return assets
    .filter(() => Math.random() > 0.6) // Only create locked balances for some assets
    .map(asset => {
      const purpose = purposes[Math.floor(Math.random() * purposes.length)];
      const amount = asset.balance * (0.1 + Math.random() * 0.4);
      const randomChain = SUPPORTED_CHAINS[Math.floor(Math.random() * SUPPORTED_CHAINS.length)];
      
      // Expiration between 1 day and 30 days from now
      const expiresAt = new Date(Date.now() + (1 + Math.floor(Math.random() * 29)) * 86400000).toISOString();
      
      return {
        id: uuidv4(),
        userId,
        assetId: asset.id,
        amount,
        purpose,
        targetChain: randomChain.id,
        expiresAt,
        createdAt: new Date().toISOString()
      };
    });
}

// Generate mock ZK proofs for a user
export function generateMockZkProofs(userId: string, assets: Asset[]): ZkProof[] {
  const proofTypes: Array<'ownership' | 'balance' | 'credit' | 'Asset Claim' | 'Credit Line' | 'Agent Authority'> = [
    'ownership', 'balance', 'credit', 'Asset Claim', 'Credit Line', 'Agent Authority'
  ];
  
  return assets
    .filter(() => Math.random() > 0.7) // Only create proofs for some assets
    .map(asset => {
      const proofType = proofTypes[Math.floor(Math.random() * proofTypes.length)];
      const randomChain = SUPPORTED_CHAINS[Math.floor(Math.random() * SUPPORTED_CHAINS.length)];
      const amount = asset.balance * (0.1 + Math.random() * 0.9);
      
      // Expiration between 1 day and 7 days from now
      const expiresAt = new Date(Date.now() + (1 + Math.floor(Math.random() * 7)) * 86400000).toISOString();
      
      return {
        id: uuidv4(),
        userId,
        proofType,
        proofData: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        assetId: asset.id,
        assetTicker: asset.ticker,
        amount,
        targetChain: randomChain.id,
        status: Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'expired' : 'revoked',
        expiresAt,
        createdAt: new Date().toISOString()
      };
    });
}

// We're not using transactions in this version

// Generate a complete mock user profile with all related data
export function generateMockUserProfile(privyId: string, email?: string) {
  const user = generateMockUser(privyId, email);
  const assets = generateMockAssets(user.id);
  const creditLine = generateMockCreditLine(user.id);
  const agentConfigs = generateMockAgentConfigs(user.id);
  const smartAccounts = generateMockSmartAccounts(user.id);
  const lockedBalances = generateMockLockedBalances(user.id, assets);
  const zkProofs = generateMockZkProofs(user.id, assets);
  
  return {
    user,
    assets,
    creditLine,
    agentConfigs,
    smartAccounts,
    lockedBalances,
    zkProofs,
  };
}
