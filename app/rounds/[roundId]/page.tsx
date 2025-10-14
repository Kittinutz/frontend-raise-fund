"use client";
import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  investmentRounds,
  cowsByRound,
  documentsByRound,
  dividendsByRound,
} from "@/lib/mockData";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Coins,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface RoundDetailPageProps {
  roundId: string;
  onNavigate: (page: string, roundId?: string) => void;
}

export default function RoundDetailPage() {
  const { roundId } = useParams(); // Example round ID, replace with actual prop or state
  const [tokenAmount, setTokenAmount] = useState<string>("1");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const round = investmentRounds.find((r) => r.id === roundId);
  const cows = cowsByRound[roundId] || [];
  const documents = documentsByRound[roundId] || [];
  const dividends = dividendsByRound[roundId] || [];

  if (!round) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Round Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The investment round you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => onNavigate("rounds")}>Back to Rounds</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = (round.tokensSold / round.totalTokens) * 100;
  const calculatedUSDT = parseFloat(tokenAmount || "0") * round.tokenPrice;

  const handleAuthorize = () => {
    setIsAuthorized(true);
    toast.success(
      "USDT authorization successful! You can now confirm your investment."
    );
  };

  const handleInvest = () => {
    if (!isAuthorized) {
      toast.error("Please authorize USDT transaction first");
      return;
    }

    toast.success(
      `Successfully invested ${tokenAmount} tokens (${calculatedUSDT.toLocaleString()} USDT)!`
    );
    setTokenAmount("1");
    setIsAuthorized(false);
  };

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

  const getCowStatusColor = (status: string) => {
    return status === "Live" ? "bg-green-500" : "bg-gray-500";
  };

  const getDividendStatusColor = (status: string) => {
    return status === "Paid" ? "bg-green-500" : "bg-yellow-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("rounds")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Rounds
        </Button>

        {/* Round Header */}
        <Card className="mb-8 border-2 border-card-header/20">
          <CardHeader className="bg-gradient-to-r from-card-header to-card-header/95 text-card-header-foreground rounded-t-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl mb-2 text-card-header-foreground">
                  {round.name}
                </CardTitle>
                <CardDescription className="text-card-header-foreground/80">
                  Investment Round Details
                </CardDescription>
              </div>
              <Badge className={getStatusColor(round.status)}>
                {round.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Dividend Rate</p>
                </div>
                <p className="text-2xl text-primary">
                  {round.dividendPercentage}%
                </p>
                <p className="text-xs text-gray-500">{round.dividendOption}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Total Investment</p>
                </div>
                <p className="text-2xl text-primary">
                  ${round.totalInvestment.toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Tokens</p>
                </div>
                <p className="text-2xl text-primary">
                  {round.tokensSold} / {round.totalTokens}
                </p>
                <p className="text-xs text-gray-500">
                  {round.tokensRemaining} remaining
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Round Ends</p>
                </div>
                <p className="text-sm text-primary">
                  {new Date(round.roundEndDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Investment ends:{" "}
                  {new Date(round.investmentEndDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tokens Sold</span>
                <span className="text-gray-900">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="invest" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="invest">Investment</TabsTrigger>
            <TabsTrigger value="cows">Cows ({cows.length})</TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="dividends">
              Dividends ({dividends.length})
            </TabsTrigger>
          </TabsList>

          {/* Investment Tab */}
          <TabsContent value="invest">
            <Card>
              <CardHeader>
                <CardTitle>Make an Investment</CardTitle>
                <CardDescription>
                  Purchase tokens for this investment round. Each token
                  represents one cow.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {round.status !== "Open" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This round is currently {round.status.toLowerCase()} and
                      not accepting new investments.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tokens">Number of Tokens</Label>
                    <Input
                      id="tokens"
                      type="number"
                      min="1"
                      max={round.tokensRemaining}
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      disabled={round.status !== "Open"}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum available: {round.tokensRemaining} tokens
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Token Price:</span>
                      <span className="text-lg">
                        ${round.tokenPrice.toLocaleString()} USDT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Required:</span>
                      <span className="text-2xl text-primary">
                        ${calculatedUSDT.toLocaleString()} USDT
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleAuthorize}
                      disabled={
                        round.status !== "Open" ||
                        isAuthorized ||
                        !tokenAmount ||
                        parseFloat(tokenAmount) <= 0
                      }
                      variant={isAuthorized ? "outline" : "default"}
                      className="w-full"
                    >
                      {isAuthorized ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          USDT Authorized
                        </>
                      ) : (
                        "Authorize USDT Transaction"
                      )}
                    </Button>

                    <Button
                      onClick={handleInvest}
                      disabled={
                        round.status !== "Open" ||
                        !isAuthorized ||
                        !tokenAmount ||
                        parseFloat(tokenAmount) <= 0
                      }
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Confirm Investment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cows Tab */}
          <TabsContent value="cows">
            <Card>
              <CardHeader>
                <CardTitle>Cows Purchased in This Round</CardTitle>
                <CardDescription>
                  List of all cattle associated with this investment round
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tag Number</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Cow ID</TableHead>
                          <TableHead>Weight (kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cows.map((cow) => (
                          <TableRow key={cow.tagNumber}>
                            <TableCell>{cow.tagNumber}</TableCell>
                            <TableCell>
                              <Badge className={getCowStatusColor(cow.status)}>
                                {cow.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{cow.cowId}</TableCell>
                            <TableCell>{cow.weight}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No cows have been purchased for this round yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Investment Documents</CardTitle>
                <CardDescription>
                  Download related documents and reports for this investment
                  round
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {doc.type} • {doc.size} • Uploaded{" "}
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast.info(`Downloading ${doc.name}...`)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No documents available for this round yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dividends Tab */}
          <TabsContent value="dividends">
            <Card>
              <CardHeader>
                <CardTitle>Dividend Payment Status</CardTitle>
                <CardDescription>
                  Track all dividend payments for this investment round
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dividends.length > 0 ? (
                  <div className="space-y-4">
                    {dividends.map((dividend) => (
                      <div
                        key={dividend.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            {dividend.status === "Paid" ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-accent" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {dividend.type} Dividend
                            </p>
                            <p className="text-sm text-gray-500">
                              Payment Date:{" "}
                              {new Date(dividend.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl text-primary">
                            ${dividend.amount.toLocaleString()}
                          </p>
                          <Badge
                            className={getDividendStatusColor(dividend.status)}
                          >
                            {dividend.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No dividend payments scheduled yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
