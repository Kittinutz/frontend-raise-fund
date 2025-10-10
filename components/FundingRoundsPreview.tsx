"use client";
import useFundingContract from "@/hooks/useFundingContract";
import useWallet from "@/hooks/useWallet";
import { formatEther } from "viem";
import { useEffect, useState } from "react";
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

export default function FundingRoundsPreview() {
  const { walletClient, currentAddress } = useWallet();
  const [isLoading, setIsLoading] = useState(true);

  const { roundLists } = useFundingContract({
    walletClient: walletClient!,
    currentAddress: currentAddress!,
  });

  useEffect(() => {
    // Set loading to false after a timeout to allow for wallet connection
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatTokenAmount = (amount: bigint) => {
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

  // Show only the first 3 rounds for preview
  const previewRounds = roundLists.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!walletClient || !currentAddress || roundLists.length === 0) {
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
            Connect Wallet to View Rounds
          </h3>
          <p className="text-gray-500 mb-6">
            Connect your wallet to explore our current funding opportunities and
            start investing.
          </p>
          <Link href="/rounds">
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Learn More About Rounds
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {previewRounds.map((round) => {
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
                  <Link href="/dapp">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      Invest Now
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
