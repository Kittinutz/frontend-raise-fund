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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { transactions, investmentRounds } from "../lib/mockData";
import { Filter, Receipt, ExternalLink, Calendar, Coins } from "lucide-react";

interface TransactionHistoryPageProps {
  onNavigate: (page: string, nftId?: string) => void;
}

export function TransactionHistoryPage({
  onNavigate,
}: TransactionHistoryPageProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRound, setFilterRound] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  );

  const filteredTransactions = transactions.filter((txn) => {
    if (filterStatus !== "all" && txn.status !== filterStatus) return false;
    if (filterRound !== "all" && txn.roundId !== filterRound) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Pending":
        return "bg-accent";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const selectedTxnData = transactions.find(
    (t) => t.id === selectedTransaction
  );
  const selectedRound = selectedTxnData
    ? investmentRounds.find((r) => r.id === selectedTxnData.roundId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Transaction History</h1>
          <p className="text-lg text-gray-600">
            View all your investment transactions and received NFTs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Total Transactions</CardTitle>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-primary">{transactions.length}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Completed</CardTitle>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Coins className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-green-700">
                {transactions.filter((t) => t.status === "Completed").length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Total Spent</CardTitle>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-accent">
                $
                {transactions
                  .filter((t) => t.status === "Completed")
                  .reduce((sum, t) => sum + t.usdtAmount, 0)
                  .toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle>Filter Transactions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Round</Label>
                <Select value={filterRound} onValueChange={setFilterRound}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rounds</SelectItem>
                    {investmentRounds.map((round) => (
                      <SelectItem key={round.id} value={round.id}>
                        {round.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterRound("all");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transaction(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Round</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>USDT Amount</TableHead>
                      <TableHead>NFTs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => {
                      const round = investmentRounds.find(
                        (r) => r.id === txn.roundId
                      );
                      return (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono">{txn.id}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>
                                {new Date(
                                  txn.purchaseDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-gray-500">
                                {txn.purchaseTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{round?.name || "N/A"}</TableCell>
                          <TableCell>{txn.tokenAmount}</TableCell>
                          <TableCell>
                            ${txn.usdtAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {txn.nftIds.length > 0 ? (
                              <Button
                                size="sm"
                                variant="link"
                                onClick={() =>
                                  onNavigate("nft-detail", txn.nftIds[0])
                                }
                                className="p-0 h-auto text-primary"
                              >
                                {txn.nftIds.length} NFT(s)
                              </Button>
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(txn.status)}>
                              {txn.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTransaction(txn.id)}
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
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No transactions found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={() => setSelectedTransaction(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTxnData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="font-mono">{selectedTxnData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge className={getStatusColor(selectedTxnData.status)}>
                    {selectedTxnData.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Purchase Date</p>
                  <p>
                    {new Date(
                      selectedTxnData.purchaseDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Purchase Time</p>
                  <p>{selectedTxnData.purchaseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Round</p>
                  <p>{selectedRound?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Token Amount</p>
                  <p className="text-primary">
                    {selectedTxnData.tokenAmount} tokens
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">USDT Amount</p>
                  <p className="text-primary">
                    ${selectedTxnData.usdtAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">NFTs Received</p>
                  <p className="text-primary">
                    {selectedTxnData.nftIds.length} NFT(s)
                  </p>
                </div>
              </div>

              {selectedTxnData.nftIds.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Received NFTs</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTxnData.nftIds.slice(0, 5).map((nftId) => (
                      <Button
                        key={nftId}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTransaction(null);
                          onNavigate("nft-detail", nftId);
                        }}
                        className="font-mono"
                      >
                        {nftId}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    ))}
                    {selectedTxnData.nftIds.length > 5 && (
                      <span className="text-sm text-gray-500 self-center">
                        +{selectedTxnData.nftIds.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    window.open("https://etherscan.io/", "_blank");
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
