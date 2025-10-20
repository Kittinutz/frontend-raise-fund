import { useWallet } from "@/contexts/WalletProvider";
import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import {
  InterfaceRoundDetailPaginated,
  InvestmentRound,
  SortDirection,
  SortField,
} from "@/types/fundingContract";
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

const useFundingContract = () => {
  const { walletClient, currentAddress } = useWallet();
  const [roundList, setRoundList] = useState<InvestmentRound[]>([]);
  const [selectedRound, setSelectedRound] = useState<InvestmentRound | null>(
    null
  );
  const [selectedRoundId, setSelectedRoundId] = useState<bigint | null>(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 1,
    currentPage: 1,
    sortField: SortField.CREATED_AT,
    sortDirection: SortDirection.DESC,
  });

  const [totalRounds, setTotalRounds] = useState<bigint | null>(null);

  const contract = useMemo(() => {
    if (!walletClient) return null;
    return getClientConnectCrownFundingContract(walletClient);
  }, [walletClient]);

  const fetchTotalRounds = useCallback(async () => {
    try {
      return await contract?.read.totalRoundsCreated();
    } catch (error) {
      console.error("Error fetching total rounds:", error);
    }
  }, [contract]);

  const fetchAllRoundsDetailPaginated = useCallback(
    async ({
      offset = BigInt(0),
      limit = BigInt(0),
      sortField = SortField.CREATED_AT,
      sortDirection = SortDirection.DESC,
    }: InterfaceRoundDetailPaginated) => {
      try {
        if (!contract) return [];
        const roundList = await contract.read.getAllRoundsDetailedPaginated([
          offset,
          limit,
          sortField,
          sortDirection,
        ]);
        return roundList;
      } catch (error) {
        console.error("Error fetching rounds:", error);
        return [];
      }
    },
    [contract]
  );

  const fetchRoundById = useCallback(
    async (roundId: bigint) => {
      try {
        if (!contract) return null;
        const roundDetail = await contract.read.getInvestmentRound([roundId]);
        return roundDetail;
      } catch (error) {
        console.error("Error fetching round by ID:", error);
        return null;
      }
    },
    [contract]
  );
  const investRounds = useCallback(
    async (roundIds: bigint, amount: number) => {
      console.log("investRounds", roundIds, amount);

      if (!currentAddress) {
        console.error("No wallet address available");
        return;
      }

      try {
        await contract?.write.investInRound([roundIds, BigInt(amount)], {
          account: currentAddress as `0x${string}`,
          chain: foundry,
        });
        const [roundListData] = await fetchAllRoundsDetailPaginated({
          offset: BigInt(pagination.offset),
          limit: BigInt(pagination.limit),
          sortField: pagination.sortField,
          sortDirection: pagination.sortDirection,
        });
        setRoundList([...(roundListData ?? [])]);
      } catch (e) {
        console.error("Error investing in round:", e);
      }
    },
    [contract, currentAddress, pagination, fetchAllRoundsDetailPaginated]
  );
  useEffect(() => {
    async function fetchRound() {
      if (selectedRoundId) {
        const round = await fetchRoundById(selectedRoundId);
        setSelectedRound(round);
      }
    }
    fetchRound();
  }, [fetchRoundById, selectedRoundId]);

  useEffect(() => {
    async function initialize() {
      const rounds = await fetchTotalRounds();
      const [roundListData] = await fetchAllRoundsDetailPaginated({
        offset: BigInt(pagination.offset),
        limit: BigInt(1),
        sortField: pagination.sortField,
        sortDirection: pagination.sortDirection,
      });
      setRoundList([...(roundListData ?? [])]);
      setTotalRounds(rounds || null);
    }
    initialize();
  }, [
    fetchAllRoundsDetailPaginated,
    fetchTotalRounds,
    pagination.limit,
    pagination.offset,
    pagination.sortDirection,
    pagination.sortField,
  ]);
  return {
    totalRounds,
    roundList,
    investRounds,
    selectedRound,
    fundingContractAddress: contract?.address || null,
    setSelectedRoundId,
    setPagination,
  };
};

export default useFundingContract;
