import { InvestmentRound, InvestmentRoundNFT } from "@/types/fundingContract";
import { useCallback, useMemo, useState } from "react";
import { formatEther } from "viem";
import useFundingContract from "./useFundingContract";
import { getStatusClaimable } from "@/lib/roundCalculation";
import dayjs from "dayjs";
import { useWallet } from "@/contexts/WalletProvider";

const useDashboard = () => {
  const { isConnected } = useWallet();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestment, setSelectedInvestment] =
    useState<InvestmentRound | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const itemsPerPage = 5;
  const {
    investorDashboard,
    investorRounds,
    investorNftDetail,
    currentBlocktime,
    handleClaimReward,
  } = useFundingContract();

  const now = useMemo(() => {
    return dayjs(
      currentBlocktime ? Number(currentBlocktime) * 1000 : Date.now()
    );
  }, [currentBlocktime]);
  console.log("now", now);
  // Check if investment is claimable (6 months after round creation)
  const isClaimable = useCallback(
    (round: InvestmentRound) => {
      return getStatusClaimable(round, now);
    },
    [now]
  );

  // Pagination logic
  const totalPages = 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const tokenOwned = useMemo(
    () => investorDashboard?.totalTokensOwned || 0,
    [investorDashboard]
  );
  const totalInvestedAmount = useMemo(
    () =>
      Number(
        formatEther(investorDashboard?.totalInvestedAmount ?? BigInt(0))
      ).toLocaleString() || 0,
    [investorDashboard]
  );
  const totalDividendsEarned = useMemo(
    () =>
      Number(
        formatEther(investorDashboard?.totalDividendEarned ?? BigInt(0))
      ).toLocaleString() || 0,
    [investorDashboard]
  );

  const handleViewDetail = (roundId: bigint) => {
    const round = investorRounds.find((r) => r.roundId === roundId);
    if (round) {
      setSelectedInvestment(round);
      setDetailDialogOpen(true);
    }
  };

  const selectedInvestmentAmount = useMemo(() => {
    if (selectedInvestment === null) return "0";
    return (
      (investorNftDetail[Number(selectedInvestment.roundId)]?.length ?? 0) *
      Number(formatEther(selectedInvestment.tokenPrice))
    ).toLocaleString();
  }, [selectedInvestment, investorNftDetail]);

  const getInvestorNftDetail = useCallback(
    (round: InvestmentRound | null): InvestmentRoundNFT[] => {
      if (round === null) return [];

      return investorNftDetail[Number(round.roundId)] ?? [];
    },
    [investorNftDetail]
  );
  // TODO: Check if all NFTs are claimed
  const getClaimedStatusNFTInRound = useCallback(
    (round: InvestmentRound | null) => {
      if (round === null) return false;
      const nfts = getInvestorNftDetail(round);
      return nfts.every((nft) => nft.rewardClaimed === true);
    },
    [getInvestorNftDetail]
  );
  // TODO: Check if all NFTs are Redeemed
  const getRedeemedStatusNFTInRound = useCallback(
    (round: InvestmentRound | null) => {
      if (round === null) return false;
      const nfts = getInvestorNftDetail(round);
      return nfts.every((nft) => nft.redeemed === true);
    },
    [getInvestorNftDetail]
  );

  const getNumberOfTokenOwnedInRound = useCallback(
    (round: InvestmentRound | null) => {
      if (round === null) return 0;
      return getInvestorNftDetail(round)?.length || 0;
    },
    [getInvestorNftDetail]
  );

  const calculationEarnDividends = useCallback(
    (round: InvestmentRound | null) => {
      const selectedRoundTokenOwned = getNumberOfTokenOwnedInRound(round);
      if (round === null) return "0";

      const percentage = Number(round.rewardPercentage);

      const closeDateInvestment = dayjs(
        Number(round.closeDateInvestment) * 1000
      );

      const diff = now.diff(closeDateInvestment, "days");

      if (now.isBefore(closeDateInvestment)) {
        return "0";
      }

      if (diff >= 365) {
        return (
          selectedRoundTokenOwned *
          Number(formatEther(round.tokenPrice)) *
          (percentage / 100)
        ).toLocaleString();
      } else {
        const perDatePercentage = percentage / 365 / 100;
        return (
          selectedRoundTokenOwned *
          Number(formatEther(round.tokenPrice)) *
          perDatePercentage *
          diff
        ).toLocaleString("en-US", { maximumFractionDigits: 2 });
      }
    },
    [getNumberOfTokenOwnedInRound, now]
  );

  const earnedDividends = useMemo(() => {
    return calculationEarnDividends(selectedInvestment);
  }, [calculationEarnDividends, selectedInvestment]);
  return {
    isConnected,
    currentPage,
    setCurrentPage,
    selectedInvestment,
    setSelectedInvestment,
    detailDialogOpen,
    setDetailDialogOpen,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    tokenOwned,
    totalInvestedAmount,
    totalDividendsEarned,
    handleViewDetail,
    selectedInvestmentAmount,
    getInvestorNftDetail,
    getClaimedStatusNFTInRound,
    getRedeemedStatusNFTInRound,
    getNumberOfTokenOwnedInRound,
    earnedDividends,
    handleClaimReward,
    isClaimable,
    investorRounds,
    investorNftDetail,
    calculationEarnDividends,
    now,
  };
};

export default useDashboard;
