import { useChainId, useReadContract, useAccount, useWriteContract } from 'wagmi';
import { contractAddresses } from '../config/contracts';
import { parseEther, formatEther } from 'viem';

import registryAbi from "../../../contracts/deployments/abis/ZKreditRegistry.json";
import coreAbi from "../../../contracts/deployments/abis/ZKreditCore.json";
// import validatorAbi from "../../../contracts/deployments/abis/DefaultValidator.json";


// Define types for depositor info
type DepositorInfo = {
  validator: `0x${string}`;
  isActive: boolean;
  data: `0x${string}`;
};

export function useZKreditContracts() {
  const chainId = useChainId();
  const { address } = useAccount();
  // Use string key to avoid TypeScript index error
  const addresses = contractAddresses[chainId as keyof typeof contractAddresses] || contractAddresses[11155111];

  // Read contract states
  const { data: depositorInfo, refetch: refetchDepositorInfo } = useReadContract({
    address: addresses.ZKreditRegistry as `0x${string}`,
    abi: registryAbi,
    functionName: 'getDepositorInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: DepositorInfo | undefined, refetch: () => void };

  const { data: isDepositorActive, refetch: refetchIsActive } = useReadContract({
    address: addresses.ZKreditRegistry as `0x${string}`,
    abi: registryAbi,
    functionName: 'isDepositorActive',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: boolean | undefined, refetch: () => void };

  const { data: nativeBalance, refetch: refetchNativeBalance } = useReadContract({
    address: addresses.ZKreditCore as `0x${string}`,
    abi: coreAbi,
    functionName: 'balanceOf',
    args: address ? [address, '0x0000000000000000000000000000000000000000'] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: bigint | undefined, refetch: () => void };

  // Write contract functions
  const { writeContractAsync: depositNative, isPending: isDepositNativePending } = useWriteContract();
  // const { writeContractAsync: depositERC20, isPending: isDepositERC20Pending } = useWriteContract();
  const { writeContractAsync: withdrawNative, isPending: isWithdrawNativePending } = useWriteContract();
  // const { writeContractAsync: withdrawERC20, isPending: isWithdrawERC20Pending } = useWriteContract();

  // Helper functions
  const handleDepositNative = async (amount: string) => {
    if (!address) return;
    
    try {
      await depositNative({
        address: addresses.ZKreditCore as `0x${string}`,
        abi: coreAbi,
        functionName: 'depositNative',
        args: [address],
        value: parseEther(amount),
      });
      
      refetchNativeBalance();
    } catch (error) {
      console.error('Error depositing native tokens:', error);
      throw error;
    }
  };

  const handleWithdrawNative = async (amount: string, recipient: `0x${string}`, validationData: `0x${string}`) => {
    if (!address) return;
    
    try {
      await withdrawNative({
        address: addresses.ZKreditCore as `0x${string}`,
        abi: coreAbi,
        functionName: 'withdrawNative',
        args: [address, parseEther(amount), recipient, validationData],
      });
      
      refetchNativeBalance();
    } catch (error) {
      console.error('Error withdrawing native tokens:', error);
      throw error;
    }
  };

  // Format balances
  const formattedNativeBalance = nativeBalance ? formatEther(nativeBalance) : '0';

  return {
    // Contract addresses
    addresses,
    
    // Read states
    depositorInfo,
    isDepositorActive,
    nativeBalance: formattedNativeBalance,
    
    // Write functions
    handleDepositNative,
    handleWithdrawNative,
    
    // Loading states
    isDepositNativePending,
    isWithdrawNativePending,
    
    // Refetch functions
    refetchNativeBalance,
    refetchDepositorInfo,
    refetchIsActive,
  };
}
