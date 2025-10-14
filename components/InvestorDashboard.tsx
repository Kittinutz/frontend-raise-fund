import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  investmentRounds,
  userInvestments,
  dividendsByRound,
} from "../lib/mockData";
import {
  Wallet,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface InvestorDashboardProps {
  onNavigate: (page: string, roundId?: string) => void;
}

export function InvestorDashboard({ onNavigate }: InvestorDashboardProps) {
  const [availableRewards] = useState(1920); // Mock available rewards

  // Calculate portfolio stats
  const totalTokensOwned = userInvestments.reduce(
    (sum, inv) => sum + inv.tokensOwned,
    0
  );
  const totalInvestmentValue = userInvestments.reduce(
    (sum, inv) => sum + inv.investmentAmount,
    0
  );
  const totalDividendsReceived = userInvestments.reduce(
    (sum, inv) => sum + inv.dividendsEarned,
    0
  );

  // Get active rounds
  const activeInvestments = userInvestments.filter((inv) => {
    const round = investmentRounds.find((r) => r.id === inv.roundId);
    return round?.status === "Open" || round?.status === "Closed";
  });

  // Find next dividend payment date
  const getNextDividendDate = () => {
    const allDividends = Object.values(dividendsByRound)
      .flat()
      .filter((d) => d.status === "Pending")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return allDividends.length > 0 ? allDividends[0].date : null;
  };

  const nextDividendDate = getNextDividendDate();

  const handleWithdraw = () => {
    if (availableRewards <= 0) {
      toast.error("No rewards available to withdraw");
      return;
    }
    toast.success(
      `Successfully withdrew $${availableRewards.toLocaleString()} in rewards!`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Investor Dashboard</h1>
          <p className="text-lg text-gray-600">
            Track your investments and earnings
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/20 hover:border-primary/30 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Total Tokens Owned</CardTitle>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-primary">{totalTokensOwned}</p>
              <p className="text-xs text-gray-500 mt-1">Tokens</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 hover:border-green-200 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Total Investment</CardTitle>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-green-700">
                ${totalInvestmentValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">USDT</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/30 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Dividends Earned</CardTitle>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-accent">
                ${totalDividendsReceived.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total received</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-200 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Active Rounds</CardTitle>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-purple-700">
                {activeInvestments.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Rounds</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Withdraw Rewards Card */}
          <Card className="lg:col-span-1 border-2 border-accent/30">
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
              <CardDescription>Withdraw your earned dividends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/10 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Available to Withdraw
                </p>
                <p className="text-4xl text-accent mb-4">
                  ${availableRewards.toLocaleString()}
                </p>
                <Button
                  onClick={handleWithdraw}
                  disabled={availableRewards <= 0}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw Rewards
                </Button>
              </div>

              {nextDividendDate && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Next Dividend</AlertTitle>
                  <AlertDescription>
                    Expected on{" "}
                    {new Date(nextDividendDate).toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Current Investment Round */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Investment Round</CardTitle>
              <CardDescription>
                Status of the active investment round
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const currentRound = investmentRounds.find(
                  (r) => r.status === "Open"
                );
                if (!currentRound) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <p>No active investment rounds at the moment.</p>
                      <Button
                        onClick={() => onNavigate("rounds")}
                        className="mt-4"
                        variant="outline"
                      >
                        View All Rounds
                      </Button>
                    </div>
                  );
                }

                const progressPercentage =
                  (currentRound.tokensSold / currentRound.totalTokens) * 100;

                return (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg mb-1">{currentRound.name}</h3>
                        <p className="text-sm text-gray-600">
                          {currentRound.dividendPercentage}% •{" "}
                          {currentRound.dividendOption}
                        </p>
                      </div>
                      <Badge className="bg-green-500">Open</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tokens Sold</p>
                        <p className="text-lg text-primary">
                          {currentRound.tokensSold}/{currentRound.totalTokens}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className="text-lg text-primary">
                          {currentRound.tokensRemaining}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Round Ends</p>
                        <p className="text-sm text-primary">
                          {new Date(
                            currentRound.roundEndDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <Button
                      onClick={() =>
                        onNavigate("round-detail", currentRound.id)
                      }
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Invest in This Round
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>

        {/* My Investments Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Investments</CardTitle>
            <CardDescription>
              Overview of all your investment rounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userInvestments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Round</TableHead>
                      <TableHead>Tokens Owned</TableHead>
                      <TableHead>Investment Amount</TableHead>
                      <TableHead>Dividends Earned</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userInvestments.map((investment) => {
                      const round = investmentRounds.find(
                        (r) => r.id === investment.roundId
                      );
                      if (!round) return null;

                      return (
                        <TableRow key={investment.roundId}>
                          <TableCell>{round.name}</TableCell>
                          <TableCell>{investment.tokensOwned}</TableCell>
                          <TableCell>
                            ${investment.investmentAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${investment.dividendsEarned.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                investment.status === "Active"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }
                            >
                              {investment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onNavigate("round-detail", round.id)
                              }
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">You haven't made any investments yet.</p>
                <Button
                  onClick={() => onNavigate("rounds")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse Investment Rounds
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid sm:grid-cols-4 gap-4">
          <Button
            onClick={() => onNavigate("rounds")}
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
          >
            <Calendar className="h-6 w-6 text-primary" />
            <span>View All Rounds</span>
          </Button>
          <Button
            onClick={() => onNavigate("transactions")}
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>My Transactions</span>
          </Button>
          <Button
            onClick={handleWithdraw}
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
            disabled={availableRewards <= 0}
          >
            <DollarSign className="h-6 w-6 text-accent" />
            <span>Withdraw Rewards</span>
          </Button>
          <Button
            onClick={() => {
              const openRound = investmentRounds.find(
                (r) => r.status === "Open"
              );
              if (openRound) {
                onNavigate("round-detail", openRound.id);
              } else {
                onNavigate("rounds");
              }
            }}
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
          >
            <TrendingUp className="h-6 w-6 text-green-700" />
            <span>Invest Now</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
