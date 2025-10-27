"use client";
import { use, useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { investmentRounds, userInvestments } from "@/lib/mockData";
import {
  Wallet,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle2,
  Eye,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletProvider";
import useFundingContract from "@/hooks/useFundingContract";
import {
  InvestmentRound,
  InvestmentRoundNFT,
  statusMapping,
} from "@/types/fundingContract";
import { formatEther } from "viem";
import dayjs from "dayjs";
import { format } from "path";
import { ro } from "react-day-picker/locale";

export default function InvestorDashboard() {
  const { isConnected } = useWallet();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestment, setSelectedInvestment] =
    useState<InvestmentRound | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const itemsPerPage = 5;
  const {
    investorDashboard,
    investorRounds,
    investorNftIds,
    investorNftDetail,
  } = useFundingContract();

  // Check if investment is claimable (6 months after round creation)
  const isClaimable = useCallback((round: InvestmentRound) => {
    const roundCloseDateInvestment = dayjs(
      Number(round.closeDateInvestment) * 1000
    );
    const sixMonthsLater = roundCloseDateInvestment.add(180, "day");
    const currentDate = dayjs();
    return currentDate.isAfter(sixMonthsLater);
  }, []);

  // Pagination logic
  const totalPages = 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const tokenOwned = useMemo(
    () => investorDashboard?.totalTokensOwned || 0,
    [investorDashboard]
  );
  const totalInvestedAmount = useMemo(
    () =>
      Number(
        formatEther(investorDashboard?.totalInvestedAmount ?? BigInt(0))
      ).toLocaleString() || 0,
    [investorDashboard]
  );
  const totalDividendsEarned = useMemo(
    () =>
      Number(
        formatEther(investorDashboard?.totalDividendEarned ?? BigInt(0))
      ).toLocaleString() || 0,
    [investorDashboard]
  );

  const handleViewDetail = (roundId: bigint) => {
    const round = investorRounds.find((r) => r.roundId === roundId);
    if (round) {
      setSelectedInvestment(round);
      setDetailDialogOpen(true);
    }
  };

  const selectedInvestmentAmount = useMemo(() => {
    if (selectedInvestment === null) return "0";
    return (
      (investorNftIds[Number(selectedInvestment.roundId)]?.length ?? 0) *
      Number(formatEther(selectedInvestment.tokenPrice))
    ).toLocaleString();
  }, [selectedInvestment, investorNftIds]);

  const getInvestorNftDetail = useCallback(
    (round: InvestmentRound | null): InvestmentRoundNFT[] => {
      if (round === null) return [];

      return investorNftDetail[Number(round.roundId)] ?? [];
    },
    [investorNftDetail]
  );

  const getClaimedStatusNFTInRound = useCallback(
    (round: InvestmentRound | null) => {
      if (round === null) return false;
      const nfts = getInvestorNftDetail(round);
      return nfts.every((nft) => nft.rewardClaimed === true);
    },
    [getInvestorNftDetail]
  );

  const getRedeemedStatusNFTInRound = useCallback(
    (round: InvestmentRound | null) => {
      if (round === null) return false;
      const nfts = getInvestorNftDetail(round);
      return nfts.every((nft) => nft.redeemed === true);
    },
    [getInvestorNftDetail]
  );

  const getNumberOfTokenOwnedInRound = useCallback(
    (round: InvestmentRound | null) => {
      if (round === null) return 0;
      return getInvestorNftDetail(round)?.length || 0;
    },
    [getInvestorNftDetail]
  );

  const calculationEarnDividends = useCallback(
    (round: InvestmentRound | null) => {
      const selectedRoundTokenOwned = getNumberOfTokenOwnedInRound(round);
      if (round === null) return "0";
      const now = dayjs();

      const percentage = Number(round.rewardPercentage);

      const closeDateInvestment = dayjs(
        Number(round.closeDateInvestment) * 1000
      );

      const diff = now.diff(closeDateInvestment, "days");
      console.log("--->", { diff, selectedRoundTokenOwned });

      if (now.isBefore(closeDateInvestment)) {
        return "0";
      }

      if (diff >= 365) {
        return (
          selectedRoundTokenOwned *
          Number(formatEther(round.tokenPrice)) *
          (percentage / 100)
        ).toLocaleString();
      } else {
        const perDatePercentage = percentage / 365 / 100;
        return (
          selectedRoundTokenOwned *
          Number(formatEther(round.tokenPrice)) *
          perDatePercentage *
          diff
        ).toLocaleString("en-US", { maximumFractionDigits: 2 });
      }
    },
    [getNumberOfTokenOwnedInRound]
  );

  const earnedDividends = useMemo(() => {
    return calculationEarnDividends(selectedInvestment);
  }, [calculationEarnDividends, selectedInvestment]);

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

        {!isConnected ? (
          <Card className="border-2 border-primary/20 max-w-2xl mx-auto mt-16">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Please connect your wallet to view your personal investment
                portfolio, dividend earnings, and active rounds.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Click the &ldquo;Connect Wallet&ldquo; button in the header to
                get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Portfolio Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-2 border-primary/20 hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Total Tokens Owned
                    </CardTitle>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-primary">{tokenOwned}</p>
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
                    ${totalInvestedAmount}
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
                    ${totalDividendsEarned}
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
                    {investorRounds.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Rounds</p>
                </CardContent>
              </Card>
            </div>

            {/* My Investments Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Investments</CardTitle>
                <CardDescription>
                  Overview of all your investment rounds with claim status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {investorRounds.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Round</TableHead>
                            <TableHead>Tokens Owned</TableHead>
                            <TableHead>Investment Amount</TableHead>
                            <TableHead>Dividends Earn</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Claimable</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {investorRounds.map(
                            (round: InvestmentRound, index) => {
                              if (!round) return null;

                              const canClaim = isClaimable(round);
                              const nfts = investorNftIds[index];
                              const numberOfNft = nfts.length;
                              return (
                                <TableRow
                                  key={round.roundId}
                                  className="hover:bg-gray-50"
                                >
                                  <TableCell>{round.roundName}</TableCell>
                                  <TableCell>{numberOfNft}</TableCell>
                                  <TableCell>
                                    $
                                    {(
                                      Number(formatEther(round.tokenPrice)) *
                                      numberOfNft
                                    ).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    $ {calculationEarnDividends(round)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        round.isActive == true
                                          ? "bg-green-100 text-green-700 border border-green-200"
                                          : "bg-blue-100 text-blue-700 border border-blue-200"
                                      }
                                    >
                                      {statusMapping[round.status]}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {canClaim ? (
                                      <Badge className="bg-green-100 text-green-700 border border-green-200">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Yes
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                                        <Clock className="mr-1 h-3 w-3" />
                                        No
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleViewDetail(round.roundId)
                                      }
                                    >
                                      <Eye className="mr-1 h-4 w-4" />
                                      View Detail
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(1, prev - 1)
                                  )
                                }
                                className={
                                  currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>

                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                  )
                                }
                                className={
                                  currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No investments yet.</p>
                    <Button variant="outline">Browse Investment Rounds</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Investment Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Investment Details</DialogTitle>
            <DialogDescription>
              Detailed information about your investment
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-6">
              {/* Round Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">
                  Round Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Round Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedInvestment.roundName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <Badge
                      className={
                        selectedInvestment.isActive == true
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : selectedInvestment.isActive == false
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }
                    >
                      {statusMapping[selectedInvestment.status]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        Number(selectedInvestment.closeDateInvestment) * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reward Percentage</p>
                    <p className="font-medium text-gray-900">
                      {selectedInvestment.rewardPercentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        Number(selectedInvestment.endDateInvestment) * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Summary */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-3 text-gray-900">
                  Your Investment
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Tokens Owned</p>
                    <p className="text-2xl font-bold text-primary">
                      {getNumberOfTokenOwnedInRound(selectedInvestment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Investment Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ${selectedInvestmentAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dividends Earned</p>
                    <p className="text-lg font-semibold text-accent">
                      ${earnedDividends}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Investment Status</p>
                    <Badge
                      className={
                        selectedInvestment.isActive === true
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }
                    >
                      {selectedInvestmentAmount ? "Invested" : "No Investment"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Claim Reward Section */}
              <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                <h4 className="font-semibold mb-3 text-gray-900">
                  Reward Claim Status
                </h4>
                {(() => {
                  const canClaim = isClaimable(selectedInvestment);
                  const round = selectedInvestment;
                  const roundCreationDate = dayjs(
                    Number(round?.closeDateInvestment) * 1000
                  );
                  const sixMonthsLater = dayjs(roundCreationDate).add(
                    180,
                    "days"
                  );
                  const currentDate = dayjs();
                  const diff =
                    sixMonthsLater.diff(currentDate, "days") > 180
                      ? 180
                      : sixMonthsLater.diff(currentDate, "days");
                  const daysUntilClaimable = Math.max(0, diff);

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Claimable:</span>
                        {canClaim ? (
                          <Badge className="bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Yes - Ready to claim
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-700 border border-orange-200">
                            <Clock className="mr-1 h-3 w-3" />
                            Available in {daysUntilClaimable} days
                          </Badge>
                        )}
                      </div>
                      {!canClaim && (
                        <p className="text-xs text-gray-600">
                          Rewards can be claimed 6 months after round creation (
                          {sixMonthsLater.format("DD/MM/YYYY")}).
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailDialogOpen(false)}
            >
              Close
            </Button>
            {selectedInvestment && isClaimable(selectedInvestment) && (
              <Button
                // onClick={() => handleClaimReward(selectedInvestment.roundId)}
                className="bg-accent hover:bg-accent/90"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Claim Reward
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
