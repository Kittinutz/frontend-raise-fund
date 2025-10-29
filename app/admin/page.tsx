"use client";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  investmentRounds,
  dividendsByRound,
  nfts,
  transactions,
} from "@/lib/mockData";
import {
  TrendingUp,
  DollarSign,
  Users,
  Wallet,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  Shield,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletProvider";
import dayjs from "dayjs";

interface AdminDashboardProps {
  onNavigate: (page: string, roundId?: string) => void;
  isAdmin: boolean;
  walletConnected: boolean;
}

export default function AdminDashboard({ isAdmin }: AdminDashboardProps) {
  const { isOwnerFundingContract, isConnected } = useWallet();
  const [selectedRoundForWithdraw, setSelectedRoundForWithdraw] = useState<
    string | null
  >(null);
  const [selectedRoundForReward, setSelectedRoundForReward] = useState<
    string | null
  >(null);
  const [createRoundDialogOpen, setCreateRoundDialogOpen] = useState(false);
  const [rewardStep, setRewardStep] = useState<"approve" | "add-fund">(
    "approve"
  );

  const now = useMemo(() => {
    return dayjs();
  }, []);

  // Form states for creating new round
  const [newRound, setNewRound] = useState({
    roundName: "",
    tokenPrice: "",
    rewardPercentage: "",
    totalTokenOpenInvestment: "",
    closeDateInvestment: "",
    endDateInvestment: "",
  });

  // Reward distribution form
  const [rewardAmount, setRewardAmount] = useState("");

  // Calculate statistics
  const totalTradingVolume = investmentRounds.reduce(
    (sum, round) => sum + round.totalInvestment,
    0
  );

  const totalTokensSold = investmentRounds.reduce(
    (sum, round) => sum + round.tokensSold,
    0
  );

  const totalDividendsDistributed = Object.values(dividendsByRound)
    .flat()
    .filter((div) => div.status === "Paid")
    .reduce((sum, div) => sum + div.amount, 0);

  const pendingDividends = Object.values(dividendsByRound)
    .flat()
    .filter((div) => div.status === "Pending")
    .reduce((sum, div) => sum + div.amount, 0);

  const activeInvestors = 45;

  // Chart data
  const volumeChartData = investmentRounds.map((round) => ({
    name: round.name,
    volume: round.totalInvestment,
    tokens: round.tokensSold,
  }));

  const dividendChartData = investmentRounds.map((round) => {
    const roundDividends = dividendsByRound[round.id] || [];
    const paid = roundDividends
      .filter((d) => d.status === "Paid")
      .reduce((sum, d) => sum + d.amount, 0);
    const pending = roundDividends
      .filter((d) => d.status === "Pending")
      .reduce((sum, d) => sum + d.amount, 0);

    return {
      name: round.name,
      paid,
      pending,
    };
  });

  const statusDistribution = [
    {
      name: "Open",
      value: investmentRounds.filter((r) => r.status === "Open").length,
      color: "#83c340",
    },
    {
      name: "Closed",
      value: investmentRounds.filter((r) => r.status === "Closed").length,
      color: "#f59e0b",
    },
    {
      name: "Completed",
      value: investmentRounds.filter((r) => r.status === "Dividends Paid")
        .length,
      color: "#10b981",
    },
  ];

  // Admin Functions
  const handleWithdrawFunds = (roundId: string) => {
    const round = investmentRounds.find((r) => r.id === roundId);
    if (!round) return;

    toast.success(
      `Withdrawing $${round.totalInvestment.toLocaleString()} from ${
        round.name
      }`,
      {
        description: "Transaction submitted to blockchain",
      }
    );
    setSelectedRoundForWithdraw(null);
  };

  const handleApproveReward = () => {
    if (!selectedRoundForReward || !rewardAmount) {
      toast.error("Please enter reward amount");
      return;
    }

    toast.success("Reward approval submitted", {
      description: "Waiting for blockchain confirmation",
    });
    setRewardStep("add-fund");
  };

  const handleAddFund = () => {
    if (!selectedRoundForReward || !rewardAmount) return;

    const round = investmentRounds.find((r) => r.id === selectedRoundForReward);
    toast.success(
      `Distributing $${parseInt(rewardAmount).toLocaleString()} to ${
        round?.name
      }`,
      {
        description: "Dividends will be distributed to token holders",
      }
    );
    setSelectedRoundForReward(null);
    setRewardAmount("");
    setRewardStep("approve");
  };

  const handleCreateRound = () => {
    const {
      roundName,
      tokenPrice,
      rewardPercentage,
      totalTokenOpenInvestment,
      closeDateInvestment,
      endDateInvestment,
    } = newRound;

    if (
      !roundName ||
      !tokenPrice ||
      !rewardPercentage ||
      !totalTokenOpenInvestment ||
      !closeDateInvestment ||
      !endDateInvestment
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success(`Creating new round: ${roundName}`, {
      description: "Transaction submitted to blockchain",
    });

    // Reset form
    setNewRound({
      roundName: "",
      tokenPrice: "",
      rewardPercentage: "",
      totalTokenOpenInvestment: "",
      closeDateInvestment: "",
      endDateInvestment: "",
    });
    setCreateRoundDialogOpen(false);
  };

  // Show access denied if not admin
  if (!isOwnerFundingContract || !isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-2 border-red-200 max-w-2xl mx-auto mt-16">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl mb-4">Admin Access Required</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {!isConnected
                  ? "Please connect your wallet to access the admin dashboard."
                  : "Your wallet does not have admin privileges. Only authorized admin wallets can access this area."}
              </p>
              {!isConnected && (
                <p className="text-sm text-gray-500 mb-6">
                  Click the "Connect Wallet" button in the header to get
                  started.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">Admin Dashboard</h1>
              <p className="text-lg text-gray-600">
                Comprehensive overview and management functions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-sm">
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Admin Access
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-sm">
                <Activity className="mr-1.5 h-3.5 w-3.5" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funds">Fund Management</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="create">Create Round</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Total Trading Volume
                    </CardTitle>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-primary mb-1">
                    ${totalTradingVolume.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+12.5% from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Dividends Distributed
                    </CardTitle>
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-accent mb-1">
                    ${totalDividendsDistributed.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${pendingDividends.toLocaleString()} pending
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 hover:border-green-200 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Active Investors</CardTitle>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-green-700 mb-1">
                    {activeInvestors}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+8 new this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 hover:border-purple-200 transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Total Tokens Sold</CardTitle>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-purple-700 mb-1">
                    {totalTokensSold}
                  </p>
                  <p className="text-xs text-gray-500">
                    Avg $
                    {(totalTradingVolume / totalTokensSold).toLocaleString()}{" "}
                    per token
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Combined Chart */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle>
                    Trading Volume & Dividend Distribution by Round
                  </CardTitle>
                </div>
                <CardDescription>
                  Investment volume with dividend payout status per round (no
                  cross-round rewards)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={investmentRounds.map((round) => {
                        const dividends = dividendsByRound[round.id] || [];
                        const paidDividends = dividends
                          .filter((d) => d.status === "Paid")
                          .reduce((sum, d) => sum + d.amount, 0);
                        const pendingDividends = dividends
                          .filter((d) => d.status === "Pending")
                          .reduce((sum, d) => sum + d.amount, 0);

                        return {
                          name: round.name.replace("Round ", "R"),
                          volume: round.totalInvestment,
                          paid: paidDividends,
                          pending: pendingDividends,
                        };
                      })}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) =>
                          `${value.toLocaleString()}`
                        }
                      />
                      <Legend />
                      <Bar
                        dataKey="volume"
                        fill="#a8d373"
                        radius={[8, 8, 0, 0]}
                        name="Trading Volume"
                      />
                      <Bar
                        dataKey="paid"
                        fill="#6ee7b7"
                        radius={[8, 8, 0, 0]}
                        name="Dividends Paid"
                      />
                      <Bar
                        dataKey="pending"
                        fill="#fcd34d"
                        radius={[8, 8, 0, 0]}
                        name="Dividends Pending"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fund Management Tab */}
          <TabsContent value="funds" className="space-y-6">
            {/* Fund Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm">Total Funds Locked</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-primary">
                    ${totalTradingVolume.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all rounds
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Available to Withdraw
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-green-600">
                    ${(totalTradingVolume * 0.95).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    From closed rounds
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Reserved for Dividends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-accent">
                    ${pendingDividends.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pending distribution
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Fund Details by Round</CardTitle>
                <CardDescription>
                  View and manage funds for each investment round
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Round Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Funds</TableHead>
                        <TableHead>Tokens Sold</TableHead>
                        <TableHead>Available to Withdraw</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investmentRounds.map((round) => {
                        const availableToWithdraw =
                          round.totalInvestment * 0.95; // Mock calculation

                        return (
                          <TableRow key={round.id} className="hover:bg-gray-50">
                            <TableCell>{round.name}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  round.status === "Open"
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : round.status === "Closed"
                                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                                    : "bg-blue-100 text-blue-700 border border-blue-200"
                                }
                              >
                                {round.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-primary">
                              ${round.totalInvestment.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {round.tokensSold}/{round.totalTokens}
                            </TableCell>
                            <TableCell className="text-green-600">
                              ${availableToWithdraw.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() =>
                                  setSelectedRoundForWithdraw(round.id)
                                }
                                disabled={round.status === "Open"}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Withdraw
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Distribute Rewards (Dividends)</CardTitle>
                <CardDescription>
                  Approve and add funds to distribute dividends to token holders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Round Name</TableHead>
                        <TableHead>Dividend Rate</TableHead>
                        <TableHead>Total Tokens</TableHead>
                        <TableHead>Pending Dividends</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investmentRounds.map((round) => {
                        const roundDividends = dividendsByRound[round.id] || [];
                        const pendingAmount = roundDividends
                          .filter((d) => d.status === "Pending")
                          .reduce((sum, d) => sum + d.amount, 0);

                        return (
                          <TableRow key={round.id} className="hover:bg-gray-50">
                            <TableCell>{round.name}</TableCell>
                            <TableCell>{round.dividendPercentage}%</TableCell>
                            <TableCell>{round.tokensSold}</TableCell>
                            <TableCell className="text-orange-600">
                              ${pendingAmount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  round.status === "Open"
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : round.status === "Closed"
                                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                                    : "bg-blue-100 text-blue-700 border border-blue-200"
                                }
                              >
                                {round.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRoundForReward(round.id);
                                  setRewardStep("approve");
                                }}
                                className="bg-accent hover:bg-accent/90"
                              >
                                Distribute
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Round Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Create New Investment Round</CardTitle>
                <CardDescription>
                  Fill in all required fields to create a new investment round
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="roundName">Round Name *</Label>
                    <Input
                      id="roundName"
                      placeholder="e.g., Round 1 - 2026"
                      value={newRound.roundName}
                      onChange={(e) =>
                        setNewRound({ ...newRound, roundName: e.target.value })
                      }
                      className="h-12 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tokenPrice">Token Price (USDT) *</Label>
                    <Input
                      id="tokenPrice"
                      type="number"
                      placeholder="e.g., 2000"
                      value={newRound.tokenPrice}
                      onChange={(e) =>
                        setNewRound({ ...newRound, tokenPrice: e.target.value })
                      }
                      className="h-12 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rewardPercentage">
                      Reward Percentage (%) *
                    </Label>
                    <Input
                      id="rewardPercentage"
                      type="number"
                      placeholder="e.g., 3 or 6"
                      value={newRound.rewardPercentage}
                      onChange={(e) =>
                        setNewRound({
                          ...newRound,
                          rewardPercentage: e.target.value,
                        })
                      }
                      className="h-12 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalTokens">
                      Total Tokens Available *
                    </Label>
                    <Input
                      id="totalTokens"
                      type="number"
                      placeholder="e.g., 300"
                      value={newRound.totalTokenOpenInvestment}
                      onChange={(e) =>
                        setNewRound({
                          ...newRound,
                          totalTokenOpenInvestment: e.target.value,
                        })
                      }
                      className="h-12 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closeDate">Round Close Date *</Label>
                    <Input
                      id="closeDate"
                      type="date"
                      value={newRound.closeDateInvestment}
                      onChange={(e) =>
                        setNewRound({
                          ...newRound,
                          closeDateInvestment: e.target.value,
                        })
                      }
                      className="h-12 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Investment End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newRound.endDateInvestment}
                      onChange={(e) =>
                        setNewRound({
                          ...newRound,
                          endDateInvestment: e.target.value,
                        })
                      }
                      className="h-12 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="flex items-center gap-2 mb-2 text-gray-800">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      Round Summary
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <p>
                        <strong>Round:</strong>{" "}
                        {newRound.roundName || "Not set"}
                      </p>
                      <p>
                        <strong>Token Price:</strong> $
                        {newRound.tokenPrice || "0"} USDT
                      </p>
                      <p>
                        <strong>Dividend:</strong>{" "}
                        {newRound.rewardPercentage || "0"}%
                      </p>
                      <p>
                        <strong>Total Tokens:</strong>{" "}
                        {newRound.totalTokenOpenInvestment || "0"}
                      </p>
                      <p>
                        <strong>Close Date:</strong>{" "}
                        {newRound.closeDateInvestment
                          ? new Date(
                              newRound.closeDateInvestment
                            ).toLocaleDateString()
                          : "Not set"}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {newRound.endDateInvestment
                          ? new Date(
                              newRound.endDateInvestment
                            ).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateRound}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Investment Round
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Withdraw Fund Dialog */}
        {selectedRoundForWithdraw && (
          <Dialog
            open={!!selectedRoundForWithdraw}
            onOpenChange={() => setSelectedRoundForWithdraw(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
                <DialogDescription>
                  Confirm withdrawal for{" "}
                  {
                    investmentRounds.find(
                      (r) => r.id === selectedRoundForWithdraw
                    )?.name
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Available to Withdraw
                  </p>
                  <p className="text-3xl text-primary">
                    $
                    {(
                      (investmentRounds.find(
                        (r) => r.id === selectedRoundForWithdraw
                      )?.totalInvestment || 0) * 0.95
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="border border-orange-200 bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Note:</strong> 5% of funds are reserved for dividend
                    distribution and platform fees.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRoundForWithdraw(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleWithdrawFunds(selectedRoundForWithdraw)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Confirm Withdrawal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Reward Distribution Dialog */}
        {selectedRoundForReward && (
          <Dialog
            open={!!selectedRoundForReward}
            onOpenChange={() => {
              setSelectedRoundForReward(null);
              setRewardStep("approve");
              setRewardAmount("");
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {rewardStep === "approve"
                    ? "Step 1: Approve Reward"
                    : "Step 2: Add Fund"}
                </DialogTitle>
                <DialogDescription>
                  Distribute dividends for{" "}
                  {
                    investmentRounds.find(
                      (r) => r.id === selectedRoundForReward
                    )?.name
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {rewardStep === "approve" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rewardAmount">Reward Amount (USDT)</Label>
                      <Input
                        id="rewardAmount"
                        type="number"
                        placeholder="Enter total dividend amount"
                        value={rewardAmount}
                        onChange={(e) => setRewardAmount(e.target.value)}
                      />
                    </div>
                    <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Tokens Sold:</strong>{" "}
                        {
                          investmentRounds.find(
                            (r) => r.id === selectedRoundForReward
                          )?.tokensSold
                        }
                      </p>
                      {rewardAmount && (
                        <p className="text-sm text-gray-700 mt-1">
                          <strong>Per Token:</strong> $
                          {(
                            parseInt(rewardAmount) /
                            (investmentRounds.find(
                              (r) => r.id === selectedRoundForReward
                            )?.tokensSold || 1)
                          ).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-600">
                      <CheckCircle2 className="h-6 w-6" />
                      <span>Approval confirmed</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl text-accent">
                        ${parseInt(rewardAmount).toLocaleString()} USDT
                      </p>
                    </div>
                    <div className="border border-orange-200 bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>Note:</strong> This will distribute dividends to
                        all token holders for this round.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRoundForReward(null);
                    setRewardStep("approve");
                    setRewardAmount("");
                  }}
                >
                  Cancel
                </Button>
                {rewardStep === "approve" ? (
                  <Button
                    onClick={handleApproveReward}
                    disabled={!rewardAmount}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Approve Reward
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddFund}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Add Fund & Distribute
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
