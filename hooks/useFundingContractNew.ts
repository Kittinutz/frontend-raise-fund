import { useWallet } from "@/contexts/WalletProvider";
import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { publicClient } from "@/utils/client";

interface InvestmentRound {
  roundId: bigint;
  roundName: string;
  tokenPrice: bigint;
  rewardPercentage: bigint;
  totalTokenOpenInvestment: bigint;
  tokensSold: bigint;
  closeDateInvestment: bigint;
  endDateInvestment: bigint;
  isActive: boolean;
  exists: boolean;
  createdAt: bigint;
}

interface FundingContractHook {
  // Data
  contract: ReturnType<typeof getClientConnectCrownFundingContract> | null;
  totalRounds: bigint | null;
  rounds: InvestmentRound[];

  // Loading states
  isLoading: boolean;
  isTransacting: boolean;

  // Error handling
  error: string | null;

  // Read functions
  getInvestmentRound: (roundId: bigint) => Promise<InvestmentRound>;
  getTotalRoundsCreated: () => Promise<bigint>;
  refreshRounds: () => Promise<void>;

  // Write functions
  createInvestmentRound: (params: CreateRoundParams) => Promise<string>;
  investInRound: (roundId: bigint, tokenAmount: bigint) => Promise<string>;
}

interface CreateRoundParams {
  roundName: string;
  tokenPrice: bigint;
  rewardPercentage: bigint;
  totalTokenOpenInvestment: bigint;
  closeDateInvestment: bigint;
  endDateInvestment: bigint;
}

const useFundingContract = (): FundingContractHook => {
  const { walletClient, isConnected, currentAddress } = useWallet();

  // Data states
  const [totalRounds, setTotalRounds] = useState<bigint | null>(null);
  const [rounds, setRounds] = useState<InvestmentRound[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Memoized contract instance
  const contract = useMemo(() => {
    if (!walletClient) return null;
    try {
      return getClientConnectCrownFundingContract(walletClient);
    } catch (err) {
      console.error("Failed to initialize contract:", err);
      setError("Failed to initialize contract");
      return null;
    }
  }, [walletClient]);

  // Get total rounds created
  const getTotalRoundsCreated = useCallback(async (): Promise<bigint> => {
    if (!contract || !contract.read) {
      throw new Error("Contract not initialized");
    }

    try {
      setError(null);
      const total = await contract.read.totalRoundsCreated();
      console.log("Total rounds fetched:", total);
      return total as bigint;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get total rounds";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [contract]);

  // Get investment round info
  const getInvestmentRound = useCallback(
    async (roundId: bigint): Promise<InvestmentRound> => {
      if (!contract || !contract.read) {
        throw new Error("Contract not initialized");
      }

      try {
        setError(null);
        const result = await contract.read.getInvestmentRound([roundId]);
        console.log("Round info fetched:", result);

        // The result is a tuple/struct, we need to destructure it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roundData = result as any; // Cast to any first to avoid type issues
        const [
          roundIdResult,
          roundName,
          tokenPrice,
          rewardPercentage,
          totalTokenOpenInvestment,
          tokensSold,
          closeDateInvestment,
          endDateInvestment,
          isActive,
          exists,
          createdAt,
        ] = roundData;

        return {
          roundId: roundIdResult,
          roundName,
          tokenPrice,
          rewardPercentage,
          totalTokenOpenInvestment,
          tokensSold,
          closeDateInvestment,
          endDateInvestment,
          isActive,
          exists,
          createdAt,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get round info";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [contract]
  );

  // Refresh all rounds data
  const refreshRounds = useCallback(async () => {
    if (!contract || !contract.read) {
      console.warn("Contract not available for refresh");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get total rounds
      const total = await getTotalRoundsCreated();
      setTotalRounds(total);

      // Fetch all rounds if total > 0
      if (total > BigInt(0)) {
        const roundPromises: Promise<InvestmentRound>[] = [];

        // Create promises for all rounds (assuming round IDs start from 1)
        for (let i = BigInt(1); i <= total; i++) {
          roundPromises.push(getInvestmentRound(i));
        }

        const allRounds = await Promise.all(roundPromises);
        setRounds(allRounds.filter((round) => round.exists)); // Filter out non-existent rounds
      } else {
        setRounds([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh rounds";
      console.error("Refresh rounds error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [contract, getTotalRoundsCreated, getInvestmentRound]);

  // Create investment round
  const createInvestmentRound = useCallback(
    async (params: CreateRoundParams): Promise<string> => {
      if (!walletClient || !contract || !currentAddress) {
        throw new Error("Wallet not connected or contract not initialized");
      }

      setIsTransacting(true);
      setError(null);

      try {
        const { request } = await publicClient.simulateContract({
          abi: contract.abi,
          address: contract.address as `0x${string}`,
          functionName: "createInvestmentRound",
          account: currentAddress as `0x${string}`,
          args: [
            params.roundName,
            params.tokenPrice,
            params.rewardPercentage,
            paramstotalToken,
            params.closeDateInvestment,
            params.endDateInvestment,
          ],
        });

        const hash = await walletClient.writeContract(request);

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });

        console.log("Create round receipt:", receipt);

        if (receipt.status !== "success") {
          throw new Error("Transaction failed");
        }

        // Refresh rounds after successful creation
        await refreshRounds();

        return hash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create round";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsTransacting(false);
      }
    },
    [walletClient, contract, currentAddress, refreshRounds]
  );

  // Invest in round
  const investInRound = useCallback(
    async (roundId: bigint, tokenAmount: bigint): Promise<string> => {
      if (!walletClient || !contract || !currentAddress) {
        throw new Error("Wallet not connected or contract not initialized");
      }

      setIsTransacting(true);
      setError(null);

      try {
        const { request } = await publicClient.simulateContract({
          abi: contract.abi,
          address: contract.address as `0x${string}`,
          functionName: "investInRound", // You may need to verify this function name in your ABI
          account: currentAddress as `0x${string}`,
          args: [roundId, tokenAmount],
        });

        const hash = await walletClient.writeContract(request);

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });

        console.log("Invest receipt:", receipt);

        if (receipt.status !== "success") {
          throw new Error("Transaction failed");
        }

        // Refresh rounds after successful investment
        await refreshRounds();

        return hash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to invest in round";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsTransacting(false);
      }
    },
    [walletClient, contract, currentAddress, refreshRounds]
  );

  // Auto-refresh rounds when contract becomes available
  useEffect(() => {
    if (contract && isConnected) {
      refreshRounds();
    }
  }, [contract, isConnected, refreshRounds]);

  return {
    // Data
    contract,
    totalRounds,
    rounds,

    // Loading states
    isLoading,
    isTransacting,

    // Error handling
    error,

    // Read functions
    getInvestmentRound,
    getTotalRoundsCreated,
    refreshRounds,

    // Write functions
    createInvestmentRound,
    investInRound,
  };
};

export default useFundingContract;
