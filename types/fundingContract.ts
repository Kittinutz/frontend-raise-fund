export enum SortField {
  ID,
  NAME,
  CREATED_AT,
  CLOSE_DATE,
  TOTAL_RAISED,
  TOKENS_SOLD,
  REWARD_PERCENTAGE,
}
export enum SortDirection {
  ASC,
  DESC,
}
export interface InterfaceRoundDetailPaginated {
  offset: bigint;
  limit: bigint;
  sortField: SortField;
  sortDirection: SortDirection;
}
export interface InvestmentRound {
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
