import { useWallet } from "@/contexts/WalletProvider";
import getClientConnectUsdContract from "@/contract/usdtContract";
import { publicClient } from "@/utils/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GetContractReturnType, PublicActions, WalletClient } from "viem";
import { foundry } from "viem/chains";
// Import Contract type if available

/**
 * Custom hook for interacting with USDT token contract
 *
 * Features:
 * - Automatic balance updates after each transaction
 * - Loading and error state management
 * - Comprehensive error handling
 * - Periodic balance refresh option
 *
 * @param walletClient - Viem wallet client
 * @param currentAddress - Current connected wallet address
 *
 * @returns Object containing:
 * - State: usdtBalance, isLoading, error
 * - Actions: mintUSDT, handleApprove (auto-refresh balance)
 * - Utilities: getBalanceOf, updateMyTokenBalance, refreshBalanceAfterAction
 */
const useUSDTokenContract = (walletClient: WalletClient) => {
  const [usdtBalance, setUsdtBalance] = useState<bigint | null>(null);
  const [usdtOwner, setUsdtOwner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const usdTokenContract = useMemo(() => {
    if (!walletClient) return null;
    return getClientConnectUsdContract(walletClient);
  }, [walletClient]);

  const publicUsdtContract = useMemo(() => {
    return getClientConnectUsdContract(publicClient!);
  }, []);

  const getBalanceOf = useCallback(
    async (address: `0x${string}`) => {
      if (!usdTokenContract && address) return null;
      try {
        const balance = await publicUsdtContract.read.balanceOf([address]);
        return balance as bigint;
      } catch (error) {
        console.error("Error fetching balance:", error);
        return null;
      }
    },
    [publicUsdtContract.read, usdTokenContract]
  );

  const getMyTokenBalance = async () => {
    try {
      const address = await walletClient.getAddresses();
      if (address.length === 0) return null;
      return await getBalanceOf(address[0]);
    } catch (error) {
      console.error("Error getting my token balance:", error);
      return null;
    }
  };

  const updateMyTokenBalance = useCallback(async () => {
    if (!usdTokenContract || !walletClient) return null;
    try {
      const address = await walletClient.getAddresses();
      if (address.length === 0) return null;
      const balance = await getBalanceOf(address[0]);
      setUsdtBalance(balance);
      console.log("Balance updated:", balance);
      return balance;
    } catch (error) {
      console.error("Error updating balance:", error);
      return null;
    }
  }, [usdTokenContract, walletClient, getBalanceOf]);

  // Auto-refresh balance after transactions
  const refreshBalanceAfterAction = useCallback(async () => {
    await updateMyTokenBalance();
  }, [updateMyTokenBalance]);

  // Periodic balance refresh (optional)
  const startPeriodicRefresh = useCallback(
    (intervalMs: number = 30000) => {
      const interval = setInterval(async () => {
        if (usdTokenContract && walletClient) {
          await updateMyTokenBalance();
        }
      }, intervalMs);
      return () => clearInterval(interval);
    },
    [usdTokenContract, walletClient, updateMyTokenBalance]
  );

  const clearBalance = () => {
    setUsdtBalance(null);
  };
  const mintUSDT = async (amount: bigint) => {
    if (!usdTokenContract) return;
    setIsLoading(true);
    setError(null);

    try {
      const address = await walletClient.getAddresses();
      console.log("---->", address);
      const { request } = await walletClient.simulateContract({
        abi: usdTokenContract.abi,
        address: process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "mint",
        chain: foundry,
        account: address[0],
        args: [address[0], amount * BigInt(10) ** BigInt(18)],
      });
      const hash = await walletClient.writeContract(request);
      const receipt = await walletClient.waitForTransactionReceipt({
        hash,
      });
      console.log("receipt", receipt);
      if (receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      // Auto-refresh balance after successful mint
      await refreshBalanceAfterAction();

      return hash;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error minting USDT";
      console.error("Error minting USDT:", error);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleApprove = async (
    spender: `0x${string}`,
    tokenAmount: bigint,
    pricePerToken: bigint
  ) => {
    if (!usdTokenContract) return;
    setIsLoading(true);
    setError(null);

    try {
      const address = await walletClient.getAddresses();

      const { request } = await walletClient.simulateContract({
        abi: usdTokenContract.abi,
        address: usdTokenContract.address,
        functionName: "approve",
        chain: foundry,
        account: address[0],
        args: [
          `${spender}`,
          tokenAmount * pricePerToken * BigInt(10) ** BigInt(18),
        ],
      });

      const hash = await walletClient.writeContract(request);
      const receipt = await walletClient.waitForTransactionReceipt({
        hash,
      });

      console.log("receipt", receipt);
      if (receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      // Auto-refresh balance after successful approval
      await refreshBalanceAfterAction();

      return hash;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error approving USDT";
      console.error("Error approving USDT:", error);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const usdtAllowance = async (
    owner: `0x${string}`,
    spender: `0x${string}`
  ) => {
    if (!usdTokenContract) return null;
    try {
      const allowance = await publicUsdtContract.read.allowance([
        owner,
        spender,
      ]);
      return allowance as bigint;
    } catch (error) {
      console.error("Error fetching allowance:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCurrentWalletUSDTBalance = async () => {
      console.log(!usdTokenContract);
      if (!usdTokenContract) return;
      try {
        const address = await walletClient.getAddresses();
        if (address.length === 0) return;
        const balance = await getBalanceOf(address[0]);
        setUsdtOwner("owner");
        setUsdtBalance(balance);
      } catch (error) {
        console.error("Error fetching initial balance:", error);
      }
    };
    fetchCurrentWalletUSDTBalance();
    console.log("here");
  }, [usdTokenContract, walletClient, getBalanceOf]);

  return {
    // State
    usdtBalance,
    usdtOwner,
    isLoading,
    error,

    // Contract instance
    usdTokenContract,

    // Actions that modify state and auto-refresh balance
    mintUSDT,
    handleApprove,

    // Read-only functions
    getBalanceOf,
    getMyTokenBalance,
    usdtAllowance,

    // Manual refresh functions
    updateMyTokenBalance,
    refreshBalanceAfterAction,
    startPeriodicRefresh,
    clearBalance,
  };
  // Your hook logic here
};

export default useUSDTokenContract;
