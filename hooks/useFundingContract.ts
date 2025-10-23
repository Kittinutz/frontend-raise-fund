import {
  fetchTotalRounds,
  fetchAllRoundsDetailPaginated,
  fetchRoundByID,
} from "@/services/web3/fundingContractService";
import { useWallet } from "@/contexts/WalletProvider";
import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import {
  InvestmentRound,
  SortDirection,
  SortField,
} from "@/types/fundingContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { foundry } from "viem/chains";
import { publicClient } from "@/utils/client";

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

  const investRounds = useCallback(
    async (roundId: bigint, amount: bigint) => {
      if (!currentAddress) {
        console.error("No wallet address available");
        return;
      }

      try {
        const hash = await contract?.write.investInRound(
          [roundId, BigInt(amount)],
          {
            account: currentAddress as `0x${string}`,
            chain: foundry,
          }
        );
        if (hash) {
          await publicClient.waitForTransactionReceipt({ hash });
        }

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
    [contract, currentAddress, pagination]
  );
  useEffect(() => {
    async function fetchRound() {
      if (selectedRoundId) {
        const round = await fetchRoundByID(selectedRoundId);
        setSelectedRound(round ?? null);
      }
    }
    fetchRound();
  }, [selectedRoundId]);

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
