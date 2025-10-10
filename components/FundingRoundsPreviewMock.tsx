"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface RoundInfo {
  roundId: bigint;
  pricePerToken: bigint;
  rewardPercentage: bigint;
  investEndDate: bigint;
  roundEndDate: bigint;
  totalTokens: bigint;
  tokensSold: bigint;
  isActive: boolean;
  rewardDeposit: bigint;
}

// Mock data for testing - same as in FundingRoundsMock but limited to 3 items
const mockRoundsData: RoundInfo[] = [
  {
    roundId: BigInt(1),
    pricePerToken: BigInt("1000000000000000000"), // 1 USDT in wei
    rewardPercentage: BigInt(8),
    investEndDate: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days from now
    roundEndDate: BigInt(Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60), // 90 days from now
    totalTokens: BigInt("1000000000000000000000"), // 1000 tokens in wei
    tokensSold: BigInt("750000000000000000000"), // 750 tokens sold in wei
    isActive: true,
    rewardDeposit: BigInt("80000000000000000000"), // 80 tokens reward
  },
  {
    roundId: BigInt(2),
    pricePerToken: BigInt("1200000000000000000"), // 1.2 USDT in wei
    rewardPercentage: BigInt(10),
    investEndDate: BigInt(Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60), // 45 days from now
    roundEndDate: BigInt(Math.floor(Date.now() / 1000) + 120 * 24 * 60 * 60), // 120 days from now
    totalTokens: BigInt("500000000000000000000"), // 500 tokens in wei
    tokensSold: BigInt("125000000000000000000"), // 125 tokens sold in wei
    isActive: true,
    rewardDeposit: BigInt("50000000000000000000"), // 50 tokens reward
  },
  {
    roundId: BigInt(4),
    pricePerToken: BigInt("1500000000000000000"), // 1.5 USDT in wei
    rewardPercentage: BigInt(12),
    investEndDate: BigInt(Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60), // 60 days from now
    roundEndDate: BigInt(Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60), // 180 days from now
    totalTokens: BigInt("800000000000000000000"), // 800 tokens in wei
    tokensSold: BigInt("0"), // No tokens sold yet
    isActive: true,
    rewardDeposit: BigInt("96000000000000000000"), // 96 tokens reward
  },
];

export default function FundingRoundsPreviewMock() {
  const [isLoading, setIsLoading] = useState(true);
  const [roundLists, setRoundLists] = useState<RoundInfo[]>([]);

  // Simulate loading and data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setRoundLists(mockRoundsData);
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  const formatTokenAmount = (amount: bigint) => {
    const etherAmount = Number(amount) / 1e18; // Convert from wei to ether

    if (etherAmount >= 1000000) {
      return (etherAmount / 1000000).toFixed(2) + "M";
    } else if (etherAmount >= 1000) {
      return (etherAmount / 1000).toFixed(2) + "K";
    } else if (etherAmount === 0) {
      return "0";
    } else if (etherAmount < 1) {
      return etherAmount.toFixed(4);
    } else {
      return etherAmount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const getProgressPercentage = (tokensSold: bigint, totalTokens: bigint) => {
    if (totalTokens === BigInt(0)) return 0;
    return Number((tokensSold * BigInt(100)) / totalTokens);
  };

  const getRoundStatus = (round: RoundInfo) => {
    const now = Date.now() / 1000;
    const investEndTime = Number(round.investEndDate);
    const roundEndTime = Number(round.roundEndDate);

    if (!round.isActive) return "Closed";
    if (now > roundEndTime) return "Ended";
    if (now > investEndTime) return "Investment Period Ended";
    return "Active";
  };

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (roundLists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Loading Mock Rounds...
          </h3>
          <p className="text-gray-500 mb-6">
            Please wait while we load the sample funding opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roundLists.map((round) => {
        const status = getRoundStatus(round);
        const progress = getProgressPercentage(
          round.tokensSold,
          round.totalTokens
        );

        return (
          <div
            key={round.roundId.toString()}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Round #{round.roundId.toString()}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Price per Token</span>
                    <span className="font-medium">
                      ${formatTokenAmount(round.pricePerToken)} USDT
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">APY</span>
                    <span className="font-medium text-green-600">
                      {round.rewardPercentage.toString()}%
                    </span>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Ends:</span>
                    <span className="font-medium">
                      {formatDate(round.investEndDate)}
                    </span>
                  </div>
                </div>
              </div>

              {status === "Active" && (
                <div className="mt-6">
                  <Link href="/mock-rounds">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      View Details
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
