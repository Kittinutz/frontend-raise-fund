import { formatEther } from "viem";

/**
 * Format token amounts for display with proper decimal places and units
 */
export const formatTokenAmount = (amount: bigint): string => {
  const etherAmount = formatEther(amount);
  const numericAmount = parseFloat(etherAmount);

  // Format with commas and limit decimal places
  if (numericAmount >= 1000000) {
    return (numericAmount / 1000000).toFixed(2) + "M";
  } else if (numericAmount >= 1000) {
    return (numericAmount / 1000).toFixed(2) + "K";
  } else if (numericAmount === 0) {
    return "0";
  } else if (numericAmount < 1) {
    return numericAmount.toFixed(4);
  } else {
    return numericAmount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
};

/**
 * Format price amounts with dollar sign for display
 */
export const formatPrice = (amount: bigint): string => {
  return `$${formatTokenAmount(amount)}`;
};

/**
 * Format percentage values for display
 */
export const formatPercentage = (percentage: bigint | number): string => {
  return `${percentage.toString()}%`;
};

/**
 * Format date for display
 */
export const formatDate = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (sold: bigint, total: bigint): number => {
  if (total === BigInt(0)) return 0;
  return Number((sold * BigInt(100)) / total);
};

/**
 * Get round status based on current time and round dates
 */
export const getRoundStatus = (round: {
  isActive: boolean;
  investEndDate: bigint;
  roundEndDate: bigint;
}): string => {
  const now = Date.now() / 1000;
  const investEndTime = Number(round.investEndDate);
  const roundEndTime = Number(round.roundEndDate);

  if (!round.isActive) return "Closed";
  if (now > roundEndTime) return "Ended";
  if (now > investEndTime) return "Investment Period Ended";
  return "Active";
};

/**
 * Get status color classes for badges
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Investment Period Ended":
      return "bg-yellow-100 text-yellow-800";
    case "Ended":
      return "bg-red-100 text-red-800";
    case "Closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
