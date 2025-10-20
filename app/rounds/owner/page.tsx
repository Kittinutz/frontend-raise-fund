"use client";
import React from "react";
import useFundingContract from "@/hooks/useFundingContractNew";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const FundingRoundsPage: React.FC = () => {
  const {
    rounds,
    totalRounds,
    isLoading,
    isTransacting,
    error,
    refreshRounds,
    createInvestmentRound,
    investInRound,
  } = useFundingContract();

  const handleCreateRound = async () => {
    try {
      await createInvestmentRound({
        roundName: "Sample Round",
        tokenPrice: BigInt(100), // 100 wei per token
        rewardPercentage: BigInt(10), // 10%
        totalTokenOpenInvestment: BigInt(1000),
        closeDateInvestment: BigInt(Math.floor(Date.now() / 1000) + 86400), // 1 day from now
        endDateInvestment: BigInt(Math.floor(Date.now() / 1000) + 86400 * 7), // 7 days from now
      });
    } catch (err) {
      console.error("Failed to create round:", err);
    }
  };

  const handleInvest = async (roundId: bigint) => {
    try {
      await investInRound(roundId, BigInt(100)); // Invest 100 tokens
    } catch (err) {
      console.error("Failed to invest:", err);
    }
  };

  const formatTokenAmount = (amount: bigint) => {
    return Number(amount).toLocaleString();
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const calculateProgress = (sold: bigint, total: bigint) => {
    if (total === BigInt(0)) return 0;
    return (Number(sold) / Number(total)) * 100;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={refreshRounds} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Funding Rounds</h1>
          {totalRounds !== null && (
            <p className="text-gray-600">
              Total rounds: {totalRounds.toString()}
            </p>
          )}
        </div>
        <div className="space-x-2">
          <Button
            onClick={refreshRounds}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Button onClick={handleCreateRound} disabled={isTransacting}>
            {isTransacting ? "Creating..." : "Create Round"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading rounds...</div>
      ) : rounds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No funding rounds found</p>
          <Button onClick={handleCreateRound} disabled={isTransacting}>
            Create First Round
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rounds.map((round) => {
            const progress = calculateProgress(
              round.tokensSold,
              round.totalTokenOpenInvestment
            );
            const isActive = round.isActive && round.exists;

            return (
              <Card key={round.roundId.toString()} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{round.roundName}</CardTitle>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Round ID: {round.roundId.toString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatTokenAmount(round.tokensSold)} sold</span>
                        <span>
                          {formatTokenAmount(round.totalTokenOpenInvestment)}{" "}
                          total
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Token Price</p>
                        <p className="font-semibold">
                          {formatTokenAmount(round.tokenPrice)} wei
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reward %</p>
                        <p className="font-semibold">
                          {round.rewardPercentage.toString()}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Close Date</p>
                        <p className="font-semibold">
                          {formatDate(round.closeDateInvestment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-semibold">
                          {formatDate(round.endDateInvestment)}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <Button
                        onClick={() => handleInvest(round.roundId)}
                        disabled={isTransacting}
                        className="w-full"
                      >
                        {isTransacting ? "Investing..." : "Invest"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FundingRoundsPage;
