import { InvestmentRound } from "@/types/fundingContract";
import dayjs from "dayjs";

export const getStatusClaimable = (
  round: InvestmentRound,
  now: dayjs.Dayjs
) => {
  const roundCloseDateInvestment = dayjs(
    Number(round.closeDateInvestment) * 1000
  );
  const sixMonthsLater = roundCloseDateInvestment.add(180, "day");
  return now.isAfter(sixMonthsLater);
};
