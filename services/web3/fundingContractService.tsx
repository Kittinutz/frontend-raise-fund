import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import { publicClient } from "@/utils/client";
import {
  InterfaceRoundDetailPaginated,
  InvestmentRound,
  SortDirection,
  SortField,
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
  offset = BigInt(0),
  limit = BigInt(0),
  sortField = SortField.CREATED_AT,
  sortDirection = SortDirection.DESC,
}: InterfaceRoundDetailPaginated) => {
  try {
    const roundList = await contractInstance.read.getAllRoundsDetailedPaginated(
      [offset, limit, sortField, sortDirection]
    );
    return roundList;
  } catch (error) {
    console.error("Error fetching rounds:", error);
    return [];
  }
};

export const fetchCurrentRoundId = async () => {
  try {
    const currentRoundId = await contractInstance.read.currentRoundId();
    return currentRoundId;
  } catch (error) {
    console.error("Error fetching rounds:", error);
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
