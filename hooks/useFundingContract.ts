import {
  fetchTotalRounds,
  fetchAllRoundsDetailPaginated,
  fetchRoundByID,
  fetchUserDashboardData,
  fetchInvestorInvestmentDetail,
} from "@/services/web3/FundRaisingContractService";
import { useWallet } from "@/contexts/WalletProvider";
import {
  InvestmentRound,
  InvestmentRoundNFT,
  InvestorDashboard,
} from "@/types/fundingContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { foundry } from "viem/chains";
import { publicClient } from "@/utils/client";
import {
  getClaimFundContract,
  getCoreFundRaisingContract,
} from "@/contract/contracts";

const useFundingContract = () => {
  const { walletClient, currentAddress } = useWallet();
  const [roundList, setRoundList] = useState<InvestmentRound[]>([]);
  const [selectedRound, setSelectedRound] = useState<InvestmentRound | null>(
    null
  );
  const [currentBlocktime, setCurrentBlocktime] = useState<bigint | null>(null);
  const [selectedRoundId, setSelectedRoundId] = useState<bigint | null>(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 5,
    currentPage: 1,
  });

  const [totalRounds, setTotalRounds] = useState<bigint | null>(null);
  const [investorDashboard, setInvestorDashboard] =
    useState<InvestorDashboard | null>(null);
  const [investorRounds, setInvestorRounds] = useState<InvestmentRound[]>([]);
  const [investorRoundIds, setInvestorRoundIds] = useState<bigint[]>([]);

  const [investorNftDetail, setInvestorNftDetail] = useState<
    Record<string, InvestmentRoundNFT[]>
  >({});
  const [investorIsClaimableRounds, setInvestorIsClaimableRounds] = useState<
    boolean[]
  >([]);
  const fundRaisingCoreContract = useMemo(() => {
    if (!walletClient) return null;
    return getCoreFundRaisingContract(walletClient);
  }, [walletClient]);

  const fundRaisingClaimContract = useMemo(() => {
    if (!walletClient) return null;
    return getClaimFundContract(walletClient);
  }, [walletClient]);

  const handleClaimReward = useCallback(
    async (roundId: bigint) => {
      if (!currentAddress) {
        console.error("No wallet address available");
        return;
      }
      const hash = await fundRaisingClaimContract?.write.claimRewardRound(
        [BigInt(roundId)],
        {
          account: currentAddress as `0x${string}`,
          chain: foundry,
        }
      );
      if (hash) {
        await publicClient.waitForTransactionReceipt({ hash });
        const dashboardData = await fetchUserDashboardData(
          currentAddress as `0x${string}`
        );
        setInvestorDashboard(dashboardData || null);
      }
      // Optionally, refresh user data after claiming reward
    },
    [currentAddress, fundRaisingClaimContract]
  );
  const investRounds = useCallback(
    async (roundId: bigint, amount: bigint) => {
      if (!currentAddress) {
        console.error("No wallet address available");
        return;
      }

      try {
        const hash = await fundRaisingCoreContract?.write.investInRound(
          [roundId, amount],
          {
            account: currentAddress as `0x${string}`,
            chain: foundry,
          }
        );
        if (hash) {
          await publicClient.waitForTransactionReceipt({ hash });
        }

        const roundListData = await fetchAllRoundsDetailPaginated({
          offset: pagination.offset,
          limit: pagination.limit,
        });
        console.log({
          roundListData,
        });
      } catch (e) {
        console.error("Error investing in round:", e);
      }
    },
    [fundRaisingCoreContract, currentAddress, pagination]
  );
  useEffect(() => {
    const fetchBlockTime = async () => {
      const blockTime = await publicClient.getBlock();
      const intervale = setInterval(async () => {
        const blockTime = await publicClient.getBlock();
        if (blockTime.timestamp) {
          setCurrentBlocktime(BigInt(blockTime.timestamp));
        }
      }, 1000 * 60);
      if (blockTime.timestamp) {
        setCurrentBlocktime(BigInt(blockTime.timestamp));
      }
      return () => clearInterval(intervale);
    };
    fetchBlockTime();
  }, []);

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
    async function initialFetchInvestorDashboard() {
      if (currentAddress) {
        const dashboardData = await fetchUserDashboardData(
          currentAddress as `0x${string}`
        );
        setInvestorDashboard(dashboardData || null);

        const { roundIds, roundDetail, nfts, nftDetail, isEnableClaimReward } =
          await fetchInvestorInvestmentDetail(currentAddress as `0x${string}`);
        setInvestorRoundIds(roundIds);
        setInvestorRounds(roundDetail);
        setInvestorNftDetail(nftDetail);
      }
    }
    initialFetchInvestorDashboard();
  }, [currentAddress]);

  useEffect(() => {
    async function initialize() {
      const rounds = await fetchTotalRounds();
      const roundListData = await fetchAllRoundsDetailPaginated({
        offset: pagination.offset,
        limit: pagination.limit,
      });

      setRoundList(roundListData ?? []);
      setTotalRounds(rounds || null);
    }
    initialize();
  }, [pagination.limit, pagination.offset]);
  return {
    totalRounds,
    roundList,
    investRounds,
    selectedRound,
    fundingContractAddress: fundRaisingCoreContract?.address || null,
    setSelectedRoundId,
    setPagination,
    pagination,
    investorDashboard,
    investorRounds,
    investorRoundIds,
    investorNftDetail,
    investorIsClaimableRounds,
    currentBlocktime,
    handleClaimReward,
  };
};

export default useFundingContract;
