"use client";
// import useFundingContract from "@/hooks/useFundingContract";
import useWallet from "@/hooks/useWallet";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

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

export default function FundingRounds() {
  const { walletClient, currentAddress } = useWallet();
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for testing - replace with contract data when ready
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
      roundId: BigInt(3),
      pricePerToken: BigInt("800000000000000000"), // 0.8 USDT in wei
      rewardPercentage: BigInt(6),
      investEndDate: BigInt(Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60), // 10 days ago (ended)
      roundEndDate: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // 30 days from now
      totalTokens: BigInt("2000000000000000000000"), // 2000 tokens in wei
      tokensSold: BigInt("2000000000000000000000"), // Fully sold
      isActive: false,
      rewardDeposit: BigInt("120000000000000000000"), // 120 tokens reward
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
    {
      roundId: BigInt(5),
      pricePerToken: BigInt("900000000000000000"), // 0.9 USDT in wei
      rewardPercentage: BigInt(7),
      investEndDate: BigInt(Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60), // 15 days from now
      roundEndDate: BigInt(Math.floor(Date.now() / 1000) + 75 * 24 * 60 * 60), // 75 days from now
      totalTokens: BigInt("1500000000000000000000"), // 1500 tokens in wei
      tokensSold: BigInt("450000000000000000000"), // 450 tokens sold in wei
      isActive: true,
      rewardDeposit: BigInt("105000000000000000000"), // 105 tokens reward
    },
  ];

  // Use mock data instead of contract data
  const roundLists = mockRoundsData;

  // Comment out the contract hook for now
  // const { roundLists } = useFundingContract({
  //   walletClient: walletClient!,
  //   currentAddress: currentAddress!,
  // });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

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

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // Optional: Show wallet connection prompt but still display mock data
  const showWalletPrompt = !walletClient || !currentAddress;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Funding Rounds {showWalletPrompt ? "(Mock Data)" : ""}
        </h2>
        <p className="text-gray-600">
          Explore our current and past funding rounds backed by Thailand&apos;s
          largest halal abattoir operations.
        </p>
        {showWalletPrompt && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Demo Mode:</strong> Connect your wallet to access real
                  funding rounds. Currently showing sample data for
                  demonstration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {roundLists.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Rounds Available
            </h3>
            <p className="text-gray-500">
              There are currently no funding rounds available. Check back later.
            </p>
          </div>
        </div>
      ) : (
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
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          {formatTokenAmount(round.tokensSold)} tokens sold
                        </span>
                        <span>
                          {formatTokenAmount(round.totalTokens)} total tokens
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">
                          Price per Token
                        </span>
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

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investment Ends:</span>
                        <span className="font-medium">
                          {formatDate(round.investEndDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Round Ends:</span>
                        <span className="font-medium">
                          {formatDate(round.roundEndDate)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Reward Pool:
                        </span>
                        <span className="font-medium text-green-600">
                          {formatTokenAmount(round.rewardDeposit)} Tokens
                        </span>
                      </div>
                    </div>
                  </div>

                  {status === "Active" && (
                    <div className="mt-6">
                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        onClick={() =>
                          alert(
                            `Mock: Invest in Round ${
                              round.roundId
                            }\nPrice: $${formatTokenAmount(
                              round.pricePerToken
                            )} USDT\nAPY: ${round.rewardPercentage}%`
                          )
                        }
                      >
                        Invest in Round (Demo)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
