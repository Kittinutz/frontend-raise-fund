import { useWallet } from "@/contexts/WalletProvider";
import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { foundry } from "viem/chains";

interface RoundInfo {
  roundId: bigint;
  pricePerToken: bigint;
  rewardPercentage: bigint;
  investEndDate: bigint;
  roundEndDate: bigint;
  totalTokens: bigint;
  tokensSold: bigint;
  isActive: boolean;
  rewardDeposit: bigint;
}

interface FundingContractHook {
  // Data
  contract: ReturnType<typeof getClientConnectCrownFundingContract> | null;
  numberOfRound: bigint[];
  roundLists: RoundInfo[];
  
  // Loading states
  isLoading: boolean;
  isTransacting: boolean;
  
  // Error handling
  error: string | null;
  
  // Read functions
  getRoundInfo: (roundId: bigint) => Promise<RoundInfo>;
  getRoundListArr: (active: boolean) => Promise<bigint[]>;
  refreshRounds: () => Promise<void>;
  
  // Write functions
  createRound: (params: CreateRoundParams) => Promise<string>;
  investRound: (roundId: bigint, tokenAmount: bigint) => Promise<string>;
  ownerWithdrawRound: (roundId: bigint) => Promise<string>;
}

interface CreateRoundParams {
  pricePerToken: bigint;
  rewardPercentage: bigint;
  totalTokens: bigint;
  investEndDate: bigint;
  roundEndDate: bigint;
}

const useFundingContract = (): FundingContractHook => {
  const { walletClient, isConnected } = useWallet();
  
  // Data states
  const [numberOfRound, setNumberOfRound] = useState<bigint[]>([]);
  const [roundLists, setRoundList] = useState<RoundInfo[]>([]);
  
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

  // Get round list array
  const getRoundListArr = useCallback(
    async (active: boolean): Promise<bigint[]> => {
      if (!contract || !contract.read) {
        throw new Error("Contract not initialized");
      }
      
      try {
        setError(null);
        const roundList = await contract.read.getRoundList([active]);
        console.log("Round list fetched:", roundList);
        return roundList as bigint[];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to get round list";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [contract]
  );

  // Get round info
  const getRoundInfo = useCallback(
    async (roundId: bigint): Promise<RoundInfo> => {
      if (!contract || !contract.read) {
        throw new Error("Contract not initialized");
      }

      try {
        setError(null);
        const result = await contract.read.getRoundInfo([roundId]);
        const [
          roundIdResult,
          pricePerToken,
          rewardPercentage,
          investEndDate,
          roundEndDate,
          totalTokens,
          tokensSold,
          isActive,
          rewardDeposit,
        ] = result as [
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          boolean,
          bigint
        ];

        return {
          roundId: roundIdResult,
          pricePerToken,
          rewardPercentage,
          investEndDate,
          roundEndDate,
          totalTokens,
          tokensSold,
          isActive,
          rewardDeposit,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to get round info";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [contract]
  );

  const ownerWithdrawRound = async (roundId: bigint) => {
    const address = await walletClient.getAddresses();
    if (address.length === 0) return;
    const { request } = await walletClient.simulateContract({
      abi: contract.abi,
      address: contract.address as `0x${string}`,
      functionName: "ownerWithdrawRound",
      account: address[0],
      chain: foundry,
      args: [roundId],
    });
    const hash = await walletClient.writeContract(request);
    const receipt = await walletClient.waitForTransactionReceipt({
      hash,
    });
    console.log("receipt", receipt);
    if (receipt.status !== "success") {
      throw new Error("Transaction failed");
    }
    return hash;
  };

  const createRound = async ({
    pricePerToken,
    rewardPercentage,
    totalTokens,
    investEndDate,
    roundEndDate,
  }: {
    pricePerToken: bigint;
    rewardPercentage: bigint;
    totalTokens: bigint;
    investEndDate: bigint;
    roundEndDate: bigint;
  }) => {
    const address = await walletClient.getAddresses();
    if (address.length === 0) return;
    const { request } = await walletClient.simulateContract({
      abi: contract.abi,
      address: process.env
        .NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "createRound",
      account: address[0],
      chain: foundry,
      args: [
        BigInt(pricePerToken) * BigInt(10) ** BigInt(18),
        totalTokens,
        rewardPercentage,
        investEndDate,
        roundEndDate,
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
    return hash;
  };

  useEffect(() => {
    async function fetchNumberOfRound() {
      const number = await getRoundListArr(false);
      return setNumberOfRound(number);
    }
    fetchNumberOfRound();
  }, [getRoundListArr]);
  useEffect(() => {
    async function fetchRoundListDetail() {
      const detailPromise = [];
      if (!numberOfRound?.length) return;
      for (let i = 0; i < numberOfRound.length; i++) {
        const promisePayload = contract.read.getRoundInfo([
          numberOfRound[i],
        ]) as Promise<
          [
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            boolean,
            bigint
          ]
        >;
        detailPromise.push(promisePayload);
      }
      const roundDetailsList = await Promise.all(detailPromise);
      const resultRoundDetailList = roundDetailsList.map((v) => {
        const [
          roundId,
          pricePerToken,
          rewardPercentage,
          investEndDate,
          roundEndDate,
          totalTokens,
          tokensSold,
          isActive,
          rewardDeposit,
        ] = v;
        return {
          roundId,
          pricePerToken,
          rewardPercentage,
          investEndDate,
          roundEndDate,
          totalTokens,
          tokensSold,
          isActive,
          rewardDeposit,
        };
      });
      setRoundList(resultRoundDetailList);
    }
    fetchRoundListDetail();
  }, [contract.read, numberOfRound]);

  const investRound = async (roundId: bigint, tokenAmount: bigint) => {
    console.log("invest Round");
    const address = await walletClient.getAddresses();
    if (address.length === 0) return;
    const { request } = await walletClient.simulateContract({
      abi: contract.abi,
      address: contract.address as `0x${string}`,
      functionName: "investRound",
      account: address[0],
      chain: foundry,
      args: [roundId, tokenAmount],
    });
    const hash = await walletClient.writeContract(request);
    const receipt = await walletClient.waitForTransactionReceipt({
      hash,
    });
    console.log("receipt", receipt);
    if (receipt.status !== "success") {
      throw new Error("Transaction failed");
    }
    return hash;
  };

  return {
    contract,
    getRoundInfo,
    getRoundListArr,
    createRound,
    numberOfRound,
    roundLists,
    investRound,
    ownerWithdrawRound,
  };
  // Your hook logic here
};

export default useFundingContract;
