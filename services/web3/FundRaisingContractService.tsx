import { publicClient } from "@/utils/client";
import {
  InterfaceRoundDetailPaginated,
  InvestmentRound,
  InvestmentRoundNFT,
  InvestorDashboard,
} from "@/types/fundingContract";
import {
  getAnalyticsContract,
  getCoreFundRaisingContract,
} from "@/contract/contracts";
import { fetchBalanceOfNFTs, fetchNFtInfo } from "./NFTContractService";
const analytic = getAnalyticsContract(publicClient);
const core = getCoreFundRaisingContract(publicClient);

export const fetchTotalRounds = async () => {
  try {
    return await core.read.totalRoundsCreated();
  } catch (error) {
    console.error("Error fetching total rounds:", error);
  }
};

export const fetchAllRoundsDetailPaginated = async ({
  offset = 0,
  limit = 0,
}: InterfaceRoundDetailPaginated) => {
  try {
    const [totalRounds] = await analytic.read.getRoundsCount();
    const totalCount = Number(totalRounds); // Convert BigInt to number

    if (totalCount === 0) return [];

    // Calculate pagination bounds for reverse order
    const start = Math.max(totalCount - 1 - Number(offset), 0);
    const actualLimit = limit ? Math.min(Number(limit), start + 1) : start + 1;
    const end = Math.max(start - actualLimit + 1, 0);

    const rounds = [];
    for (let i = start; i >= end; i--) {
      const round = await core.read.investmentRounds([BigInt(i)]);
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

export const fetchRoundByID = async (
  roundId: bigint
): Promise<
  (InvestmentRound & { isEnableClaimReward: boolean | undefined }) | undefined
> => {
  try {
    const [roundDetail, isEnableClaimReward] =
      await analytic.read.getInvestmentRound([roundId]);
    return { ...roundDetail, isEnableClaimReward };
  } catch (e) {
    console.error("Error fetchRoundByID", e);
    return undefined;
  }
};
export const fetchFundingContractOwner = async () => {
  try {
    const ownerAddress = await core.read.owner();
    return ownerAddress as `0x${string}`;
  } catch (error) {
    console.error("Error fetching contract owner:", error);
    return undefined;
  }
};

export const fetchTotalFundRaising = async () => {
  try {
    const totalFundRaising = await core.read.totalUSDTRaised();
    return totalFundRaising;
  } catch (error) {
    console.error("Error fetching total fund raising:", error);
    return undefined;
  }
};

export const fetchUserDashboardData = async (
  userAddress: `0x${string}`
): Promise<InvestorDashboard | undefined> => {
  try {
    const [roundIds, rounds, nfts] = await analytic.read.getInvestorDetail([
      userAddress,
    ]);
    const nftBalance = await fetchBalanceOfNFTs(userAddress);
    const transformedDashboardData: InvestorDashboard = {
      totalTokensOwned: Number(nftBalance ?? 0),
      nftTokenIds: nfts as bigint[],
      totalInvestedAmount: rounds[2],
      totalDividendEarned: rounds[3],
      activeRounds: rounds[4] as bigint[],
    };
    return transformedDashboardData;
  } catch (e) {
    console.error("Error fetchUserDashboardData", e);
    return undefined;
  }
};

export const fetchUserInvestedRounds = async (
  userAddress: `0x${string}`
): Promise<
  | [bigint[], InvestmentRound[], bigint[][], InvestmentRoundNFT[][], boolean[]]
  | undefined
> => {
  try {
    const nftDetail: InvestmentRound[][] = [];
    const [roundIds, roundDetail, nfts, isEnableClaimReward] =
      await core.read.getInvestorRounds([userAddress]);

    for (let i = 0; i < roundIds.length; i++) {
      const nftDetailPromise = nfts[Number(roundIds[i])].map(
        (tokenId: bigint) => fetchNFtInfo(tokenId)
      );

      const nftDetailsForRound: InvestmentRound[] = (
        await Promise.all(nftDetailPromise)
      ).filter((detail): detail is InvestmentRound => detail !== undefined);

      if (!nftDetail[Number(roundIds[i])]) {
        nftDetail[Number(roundIds[i])] = [];
      }

      nftDetail[Number(roundIds[i])].push(...nftDetailsForRound);
    }
    return [
      roundIds as bigint[],
      roundDetail as InvestmentRound[],
      nfts as bigint[][],
      nftDetail as InvestmentRoundNFT[][],
      isEnableClaimReward as boolean[],
    ];
  } catch (e) {
    console.error("Error fetchUserInvestedRounds", e);
    return undefined;
  }
};
