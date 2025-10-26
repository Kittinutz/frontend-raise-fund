import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import { publicClient } from "@/utils/client";
import {
  InterfaceRoundDetailPaginated,
  InvestmentRound,
  InvestorDashboard,
} from "@/types/fundingContract";
const contractInstance = getClientConnectCrownFundingContract(publicClient);
export const fetchTotalRounds = async () => {
  try {
    return await contractInstance.read.totalRoundsCreated();
  } catch (error) {
    console.error("Error fetching total rounds:", error);
  }
};

export const fetchAllRoundsDetailPaginated = async ({
  offset = 0,
  limit = 0,
}: InterfaceRoundDetailPaginated) => {
  try {
    const [totalRounds] = await contractInstance.read.getRoundsCount();
    const totalCount = Number(totalRounds); // Convert BigInt to number

    if (totalCount === 0) return [];

    // Calculate pagination bounds for reverse order
    const start = Math.max(totalCount - 1 - Number(offset), 0);
    const actualLimit = limit ? Math.min(Number(limit), start + 1) : start + 1;
    const end = Math.max(start - actualLimit + 1, 0);

    const rounds = [];
    for (let i = start; i >= end; i--) {
      const round = await contractInstance.read.investmentRounds([BigInt(i)]);
      rounds.push({
        roundId: round[0],
        roundName: round[1],
        tokenPrice: round[2],
        rewardPercentage: round[3],
        totalTokenOpenInvestment: round[4],
        tokensSold: round[5],
        closeDateInvestment: round[6],
        endDateInvestment: round[7],
        isActive: round[8],
        exists: round[9],
        createdAt: round[10],
        status: round[11],
      });
    }

    return rounds;
  } catch (error) {
    console.error("Error fetching rounds:", error);
    return [];
  }
};

export const fetchCurrentRoundId = async () => {
  try {
    const currentRoundId = await contractInstance.read.totalRoundsCreated();
    return currentRoundId;
  } catch (error) {
    console.error("Error fetching current round ID:", error);
    return undefined;
  }
};

export const fetchRoundByID = async (
  roundId: bigint
): Promise<InvestmentRound | undefined> => {
  try {
    const roundDetail = await contractInstance.read.getInvestmentRound([
      roundId,
    ]);
    return roundDetail;
  } catch (e) {
    console.error("Error fetchRoundByID", e);
  }
};

export const fetchUserDashboardData = async (
  userAddress: `0x${string}`
): Promise<InvestorDashboard | undefined> => {
  try {
    const dashboardData = await contractInstance.read.getInvestorDetail([
      userAddress,
    ]);
    const transformedDashboardData: InvestorDashboard = {
      totalTokensOwned: dashboardData[0],
      nftTokenIds: dashboardData[1] as bigint[],
      totalInvestedAmount: dashboardData[2],
      totalDividendEarned: dashboardData[3],
      activeRounds: dashboardData[4] as bigint[],
    };
    return transformedDashboardData;
  } catch (e) {
    console.error("Error fetchUserDashboardData", e);
    return undefined;
  }
};

export const fetchUserInvestedRounds = async (
  userAddress: `0x${string}`
): Promise<[bigint[], InvestmentRound[], bigint[][]] | undefined> => {
  try {
    const [roundIds, roundDetail, nfts] =
      await contractInstance.read.getInvestorRounds([userAddress]);
    return [
      roundIds as bigint[],
      roundDetail as InvestmentRound[],
      nfts as bigint[][],
    ];
  } catch (e) {
    console.error("Error fetchUserInvestedRounds", e);
    return undefined;
  }
};
