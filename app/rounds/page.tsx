"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Coins, DollarSign } from "lucide-react";
import useFundingContract from "@/hooks/useFundingContract";
import useUSDTokenContract from "@/hooks/useUSDTokenContract";
import { investmentRounds } from "@/lib/mockData";
import { etherUnits, formatEther, parseEther } from "viem";
import Link from "next/link";

export default function RoundListPage({ owner }: { owner: React.ReactNode }) {
  const { totalRounds, roundList, fundingContractAddress, investRounds } =
    useFundingContract();
  const { handleApprove } = useUSDTokenContract();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-500";
      case "Closed":
        return "bg-gray-500";
      case "Dividends Paid":
        return "bg-primary";
      default:
        return "bg-gray-500";
    }
  };
  console.log("roundList", roundList);
  const handleInvestment =
    (roundId: bigint, roundTokenPrice: bigint) => async () => {
      await handleApprove(
        fundingContractAddress as `0x${string}`,
        10n,
        roundTokenPrice
      );
      await investRounds(roundId, 10n);
    };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl mb-4">Investment Rounds</h1>
          <p className="text-lg text-gray-600">
            Browse all investment rounds and track their progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Total Rounds</CardTitle>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-primary">{totalRounds}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Active Rounds</CardTitle>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-green-700">
                {roundList.filter((r) => r.isActive === true).length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Total Investment</CardTitle>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-accent">
                $
                {roundList
                  .reduce(
                    (sum, r) =>
                      sum + +formatEther(r.tokenPrice) * Number(r.tokensSold),
                    0
                  )
                  .toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Rounds List */}
        <div className="space-y-6">
          {roundList.map((round) => {
            const progressPercentage =
              (Number(round.tokensSold) /
                Number(round.totalTokenOpenInvestment)) *
              100;

            return (
              <Card
                key={round.roundId.toString()}
                className="border-2 hover:border-primary/30 transition-all hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {round.roundName}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(
                            Number(round.createdAt)
                          ).toLocaleDateString()}{" "}
                          -
                          {new Date(
                            Number(round.endDateInvestment)
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={getStatusColor(
                        round.isActive ? "Open" : "Closed"
                      )}
                    >
                      {round.isActive ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Dividend Rate
                      </p>
                      <p className="text-xl text-primary">
                        {round.rewardPercentage}%
                      </p>
                      <p className="text-xs text-gray-500">3% every 6 months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Investment
                      </p>
                      <p className="text-xl text-primary">
                        $
                        {formatEther(
                          round.tokensSold * round.tokenPrice
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tokens Sold</p>
                      <p className="text-xl text-primary">
                        {round.tokensSold} / {round.totalTokenOpenInvestment}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Remaining</p>
                      <p className="text-xl text-primary">
                        {round.totalTokenOpenInvestment - round.tokensSold}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Investment Ends
                      </p>
                      <p className="text-sm text-primary">
                        {new Date(
                          Number(round.endDateInvestment)
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Action Button */}
                  <Link href={`/rounds/${round.roundId.toString()}`}>
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                      View Round Detail
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
