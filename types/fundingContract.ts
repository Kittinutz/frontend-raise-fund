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
export enum Status {
  OPEN,
  CLOSED,
  COMPLETED,
  WITHDRAW_FUND,
  DIVIDEND_PAID,
}
export const statusMapping = {
  0: "OPEN",
  1: "CLOSED",
  2: "COMPLETED",
  3: "WITHDRAW_FUND",
  4: "DIVIDEND_PAID",
};
export interface InterfaceRoundDetailPaginated {
  offset: number;
  limit: number;
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
  status: Status;
}
