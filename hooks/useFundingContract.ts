import {
  fetchTotalRounds,
  fetchAllRoundsDetailPaginated,
  fetchRoundByID,
  fetchUserDashboardData,
  fetchUserInvestedRounds,
} from "@/services/web3/FundRaisingContractService";
import { useWallet } from "@/contexts/WalletProvider";
import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import {
  InvestmentRound,
  InvestmentRoundNFT,
  InvestorDashboard,
} from "@/types/fundingContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { foundry } from "viem/chains";
import { publicClient } from "@/utils/client";
import { fetchOwnerContract } from "@/services/web3/NFTContractService";

const useFundingContract = () => {
  const { walletClient, currentAddress } = useWallet();
  const [roundList, setRoundList] = useState<InvestmentRound[]>([]);
  const [selectedRound, setSelectedRound] = useState<InvestmentRound | null>(
    null
  );

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
  const [investorNftIds, setInvestorNftIds] = useState<bigint[][]>([]);
  const [investorNftDetail, setInvestorNftDetail] = useState<
    InvestmentRoundNFT[][]
  >([]);
  const [investorIsClaimableRounds, setInvestorIsClaimableRounds] = useState<
    boolean[]
  >([]);
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
        const hash = await contract?.write.investInRound([roundId, amount], {
          account: currentAddress as `0x${string}`,
          chain: foundry,
        });
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
    async function fetchInvestorDashboard() {
      if (currentAddress) {
        const dashboardData = await fetchUserDashboardData(
          currentAddress as `0x${string}`
        );
        setInvestorDashboard(dashboardData || null);

        const [roundIds, rounds, nfts, nftDetail, isEnableClaimReward] =
          (await fetchUserInvestedRounds(currentAddress as `0x${string}`)) || [
            [],
            [],
            [[]],
            [[]],
            [],
          ];
        setInvestorRoundIds(roundIds);
        setInvestorRounds(rounds);
        setInvestorNftIds(nfts);
        setInvestorNftDetail(nftDetail);
        setInvestorIsClaimableRounds(isEnableClaimReward);
      }
    }
    fetchInvestorDashboard();
  }, [currentAddress]);

  useEffect(() => {
    async function initialize() {
      const rounds = await fetchTotalRounds();
      const roundListData = await fetchAllRoundsDetailPaginated({
        offset: pagination.offset,
        limit: pagination.limit,
      });
      console.log({
        roundListData,
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
    fundingContractAddress: contract?.address || null,
    setSelectedRoundId,
    setPagination,
    pagination,
    investorDashboard,
    investorRounds,
    investorRoundIds,
    investorNftIds,
    investorNftDetail,
    investorIsClaimableRounds,
  };
};

export default useFundingContract;
