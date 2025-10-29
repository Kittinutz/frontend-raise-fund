"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabInvestmentForm from "./TabInvestmentForm";
import {
  cowsByRound,
  dividendsByRound,
  documentsByRound,
} from "@/lib/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Download,
  Table,
  TrendingUp,
} from "lucide-react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { InvestmentRound } from "@/types/fundingContract";
import { formatEther } from "viem";
import { Progress } from "../ui/progress";
import { fetchRoundByID } from "@/services/web3/FundRaisingContractService";
import { Separator } from "../ui/separator";
import useFundingContract from "@/hooks/useFundingContract";

export default function RoundDetailInvestment({
  initialRoundDetail,
}: {
  initialRoundDetail:
    | (InvestmentRound & { isEnableClaimReward: boolean | undefined })
    | undefined;
}) {
  const [roundDetail, setRoundDetail] = useState<
    (InvestmentRound & { isEnableClaimReward: boolean | undefined }) | undefined
  >(initialRoundDetail);
  const { investorNftIds } = useFundingContract();

  const cows = cowsByRound[0] || [];
  const documents = documentsByRound[0] || [];
  const dividends = dividendsByRound[0] || [];

  const getCowStatusColor = (status: string) => {
    return status === "Live" ? "bg-green-500" : "bg-gray-500";
  };

  const getDividendStatusColor = (status: string) => {
    return status === "Paid" ? "bg-green-500" : "bg-yellow-500";
  };

  const totalInvestment = Number(
    formatEther(
      (roundDetail?.tokenPrice ?? BigInt(0)) *
        (roundDetail?.tokensSold ?? BigInt(0))
    )
  ).toLocaleString();
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
  const updateRoundDetail = async (roundId: bigint) => {
    const roundUpdate = await fetchRoundByID(roundId);
    setRoundDetail(roundUpdate);
  };

  const tokenRemaining = Number(
    (roundDetail?.totalTokenOpenInvestment ?? BigInt(0)) -
      (roundDetail?.tokensSold ?? BigInt(0))
  ).toLocaleString();

  const investPercentage = Math.floor(
    (Number(roundDetail?.tokensSold) /
      Number(roundDetail?.totalTokenOpenInvestment)) *
      100
  );
  return (
    <>
      <Card className="mb-8 border-2 border-card-header/20">
        <CardHeader className="bg-gradient-to-r from-card-header to-card-header/95 text-card-header-foreground rounded-t-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl mb-2 text-card-header-foreground">
                {roundDetail?.roundName}
              </CardTitle>
              {/* <CardDescription className="text-card-header-foreground/80">
                  Investment Round Details
                </CardDescription> */}
            </div>
            <Badge
              className={getStatusColor(
                roundDetail?.isActive ? "Open" : "Closed"
              )}
            >
              {roundDetail?.isActive ? "Open" : "Closed"}
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
                {roundDetail?.rewardPercentage}%
              </p>
              <p className="text-xs text-gray-500">3% every 6 months</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-600">Total Investment</p>
              </div>
              <p className="text-2xl text-primary">
                ${totalInvestment.toLocaleString()}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-600">Tokens</p>
              </div>
              <p className="text-2xl text-primary">
                {roundDetail?.tokensSold} /{" "}
                {roundDetail?.totalTokenOpenInvestment}
              </p>
              <p className="text-xs text-gray-500">
                {tokenRemaining} remaining
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-600">Round Ends</p>
              </div>
              <p className="text-sm text-primary">
                {new Date(
                  Number(roundDetail?.endDateInvestment) * 1000
                ).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                Investment ends:{" "}
                {new Date(
                  Number(roundDetail?.closeDateInvestment) * 1000
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tokens Sold</span>
              <span className="text-gray-900">{investPercentage}%</span>
            </div>
            <Progress value={investPercentage} className="h-3" />
          </div>
          {investorNftIds[Number(roundDetail?.roundId)] &&
            investorNftIds[Number(roundDetail?.roundId)].length > 0 && (
              <>
                {" "}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Button
                    disabled={!roundDetail?.isEnableClaimReward}
                    variant="secondary"
                    className="w-full h-12 text-base rounded-xl bg-accent hover:bg-accent/90 text-white disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Claim Reward
                  </Button>
                </div>
              </>
            )}
        </CardContent>
      </Card>
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
        <TabInvestmentForm
          roundDetail={roundDetail}
          updateRoundDetail={updateRoundDetail}
        />

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
                Download related documents and reports for this investment round
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
                        onClick={() => toast.info(`Downloading ${doc.name}...`)}
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
    </>
  );
}
