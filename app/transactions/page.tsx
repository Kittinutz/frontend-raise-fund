"use client";
import { useState, useRef, useEffect } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { nfts, investmentRounds } from "@/lib/mockData";
import {
  Wallet,
  Lock,
  Unlock,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronDown,
  TrendingUp,
  Info,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function TransactionHistoryPage() {
  const [filterDividendStatus, setFilterDividendStatus] =
    useState<string>("all");
  const [filterRound, setFilterRound] = useState<string>("all");
  const [walletConnected, setWalletConnected] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRoundDropdownOpen, setIsRoundDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const roundDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        roundDropdownRef.current &&
        !roundDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoundDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTokens = nfts.filter((token) => {
    if (
      filterDividendStatus !== "all" &&
      token.dividendStatus !== filterDividendStatus
    )
      return false;
    if (filterRound !== "all" && token.roundId !== filterRound) return false;
    return true;
  });

  const handleConnectWallet = () => {
    // Mock wallet connection
    toast.success("Wallet connected successfully!");
    setWalletConnected(true);
  };

  const dividendStatusOptions = [
    { value: "all", label: "All Status", color: "text-gray-700" },
    { value: "Paid", label: "Paid", color: "text-green-600" },
    { value: "Unpaid", label: "Unpaid", color: "text-gray-600" },
    { value: "Pending", label: "Pending", color: "text-accent" },
  ];

  const roundOptions = [
    { value: "all", label: "All Rounds" },
    ...investmentRounds.map((round) => ({
      value: round.id,
      label: round.name,
    })),
  ];

  const getDividendStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500";
      case "Unpaid":
        return "bg-gray-400";
      case "Pending":
        return "bg-accent";
      default:
        return "bg-gray-400";
    }
  };

  const getTransferStatusColor = (status: string) => {
    return status === "Locked" ? "bg-red-500" : "bg-green-500";
  };

  const paidTokens = nfts.filter((t) => t.dividendStatus === "Paid").length;
  const unpaidTokens = nfts.filter((t) => t.dividendStatus === "Unpaid").length;
  const totalDividends = nfts
    .filter((t) => t.dividendStatus === "Paid")
    .reduce((sum, t) => sum + (t.dividendAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">
                My Tokens & Dividends
              </h1>
              <p className="text-lg text-gray-600">
                Track your token holdings and dividend payments
              </p>
            </div>
            <Button
              onClick={handleConnectWallet}
              className={`${
                walletConnected
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-card-header hover:bg-card-header/90"
              }`}
              size="lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              {walletConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary/20 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Total Tokens</CardTitle>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-primary">{nfts.length}</p>
              <p className="text-xs text-gray-500 mt-1">NFTs owned</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Dividends Paid</CardTitle>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-green-600">{paidTokens}</p>
              <p className="text-xs text-gray-500 mt-1">Tokens</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Awaiting Payment</CardTitle>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-gray-600">{unpaidTokens}</p>
              <p className="text-xs text-gray-500 mt-1">Tokens</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-white rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Total Earned</CardTitle>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-accent">${totalDividends}</p>
              <p className="text-xs text-gray-500 mt-1">USDT</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2">Important: Token Transfer Rules</h3>
                <p className="text-sm text-gray-600">
                  Once dividends are paid for a token, it becomes{" "}
                  <strong>permanently locked</strong> and cannot be sold or
                  transferred. Only tokens with unpaid dividends remain tradable
                  on the marketplace. This ensures investment security and
                  dividend distribution integrity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <div className="mb-8">
          {/* Filter Heading */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Filter Tokens
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Refine your token view by status and round
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Dividend Status Filter */}
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsRoundDropdownOpen(false);
                }}
                className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-primary/40 transition-all duration-200 cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-700">
                  Dividend Status:{" "}
                  <span
                    className={
                      dividendStatusOptions.find(
                        (opt) => opt.value === filterDividendStatus
                      )?.color || "text-gray-900"
                    }
                  >
                    {
                      dividendStatusOptions.find(
                        (opt) => opt.value === filterDividendStatus
                      )?.label
                    }
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                    isStatusDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {dividendStatusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterDividendStatus(option.value);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-primary/5 flex items-center justify-between ${
                        filterDividendStatus === option.value
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      <span
                        className={
                          filterDividendStatus === option.value
                            ? "font-medium"
                            : ""
                        }
                      >
                        {option.label}
                      </span>
                      {filterDividendStatus === option.value && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Status Button */}
            {filterDividendStatus !== "all" && (
              <button
                onClick={() => setFilterDividendStatus("all")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="text-sm font-medium">Clear Status</span>
              </button>
            )}

            {/* Round Filter */}
            <div className="relative" ref={roundDropdownRef}>
              <button
                onClick={() => {
                  setIsRoundDropdownOpen(!isRoundDropdownOpen);
                  setIsStatusDropdownOpen(false);
                }}
                className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-primary/40 transition-all duration-200 cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-700">
                  Round:{" "}
                  <span className="text-gray-900">
                    {
                      roundOptions.find((opt) => opt.value === filterRound)
                        ?.label
                    }
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                    isRoundDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isRoundDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  {roundOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterRound(option.value);
                        setIsRoundDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-primary/5 flex items-center justify-between ${
                        filterRound === option.value
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      <span
                        className={
                          filterRound === option.value ? "font-medium" : ""
                        }
                      >
                        {option.label}
                      </span>
                      {filterRound === option.value && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear All Filters Button */}
            {(filterDividendStatus !== "all" || filterRound !== "all") && (
              <button
                onClick={() => {
                  setFilterDividendStatus("all");
                  setFilterRound("all");
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="text-sm font-medium">Clear All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Tokens Table */}
        <Card className="bg-white rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle>Token Holdings</CardTitle>
            <CardDescription>
              {filteredTokens.length} token(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTokens.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold">Token ID</TableHead>
                      <TableHead className="font-semibold">Round</TableHead>
                      <TableHead className="font-semibold">
                        Dividend Progress
                      </TableHead>
                      <TableHead className="font-semibold">
                        Dividend Status
                      </TableHead>
                      <TableHead className="font-semibold">
                        Dividend Date
                      </TableHead>
                      <TableHead className="font-semibold">
                        Dividend Amount
                      </TableHead>
                      <TableHead className="font-semibold">
                        Transfer Status
                      </TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTokens.map((token) => {
                      const round = investmentRounds.find(
                        (r) => r.id === token.roundId
                      );
                      const isLocked = token.transferStatus === "Locked";

                      const progressPercentage =
                        (token.dividendProgress /
                          token.totalDividendPercentage) *
                        100;

                      return (
                        <TableRow
                          key={token.tokenId}
                          className={`hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                            isLocked ? "bg-red-50/30" : ""
                          }`}
                        >
                          <TableCell>
                            <button className="font-mono text-primary hover:underline">
                              {token.tokenId}
                            </button>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {round?.name || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  {token.dividendProgress}% /{" "}
                                  {token.totalDividendPercentage}%
                                </span>
                                <span className="font-medium text-gray-900">
                                  {progressPercentage.toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    progressPercentage === 100
                                      ? "bg-green-500"
                                      : progressPercentage > 0
                                      ? "bg-primary"
                                      : "bg-gray-300"
                                  }`}
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={getDividendStatusColor(
                                  token.dividendStatus
                                )}
                              >
                                {token.dividendStatus === "Paid" && (
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                )}
                                {token.dividendStatus === "Pending" && (
                                  <Clock className="mr-1 h-3 w-3" />
                                )}
                                {token.dividendStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {token.dividendDate ? (
                              <span className="text-sm">
                                {new Date(
                                  token.dividendDate
                                ).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Not scheduled
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {token.dividendAmount ? (
                              <span className="text-green-600">
                                ${token.dividendAmount.toLocaleString()} USDT
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge
                                    className={`${getTransferStatusColor(
                                      token.transferStatus
                                    )} flex items-center gap-1`}
                                  >
                                    {token.transferStatus === "Locked" ? (
                                      <Lock className="h-3 w-3" />
                                    ) : (
                                      <Unlock className="h-3 w-3" />
                                    )}
                                    {token.transferStatus}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">
                                    {token.transferStatus === "Locked"
                                      ? "This token is locked because dividends have been paid. It cannot be sold or transferred."
                                      : "This token can be traded on the marketplace until dividends are paid."}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200"
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
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">No tokens found matching your filters.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterDividendStatus("all");
                    setFilterRound("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blockchain Integration Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-card-header/20 bg-white rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Wallet Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Connect your Web3 wallet to manage your tokens directly on the
                blockchain.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    className={walletConnected ? "bg-green-500" : "bg-gray-400"}
                  >
                    {walletConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                {walletConnected && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Address:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      0x742...f0bEb
                    </code>
                  </div>
                )}
              </div>
              {!walletConnected && (
                <Button
                  onClick={handleConnectWallet}
                  className="w-full bg-card-header hover:bg-card-header/90"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect MetaMask
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-white rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                Marketplace Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Trade your tradable tokens on supported NFT marketplaces.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Tradable Tokens:</strong>{" "}
                  <span className="text-primary">
                    {nfts.filter((t) => t.transferStatus === "Tradable").length}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Note: Locked tokens cannot be traded or transferred.
                </p>
              </div>
              <Button
                onClick={() => window.open("https://opensea.io/", "_blank")}
                variant="outline"
                className="w-full hover:bg-accent/10 hover:text-accent hover:border-accent"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Marketplace
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
