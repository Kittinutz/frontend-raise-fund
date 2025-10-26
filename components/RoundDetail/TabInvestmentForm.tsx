"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, CheckCircle2, Coins, Info } from "lucide-react";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { useWallet } from "@/contexts/WalletProvider";
import { InvestmentRound, Status } from "@/types/fundingContract";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatEther } from "viem";
import useUSDTokenContract from "@/hooks/useUSDTokenContract";
import { fetchAllowance } from "@/services/web3/usdtService";
import useFundingContract from "@/hooks/useFundingContract";

export default function TabInvestmentForm({
  roundDetail,
  updateRoundDetail = () => {},
}: {
  roundDetail: InvestmentRound | undefined;
  updateRoundDetail?: (roundId: bigint) => void;
}) {
  const [tokenAmount, setTokenAmount] = useState("0");
  const [isInvesting, setIsInvesting] = useState(false);
  const { isConnected, connectWallet, currentAddress, walletClient } =
    useWallet();
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleApprove } = useUSDTokenContract(walletClient!);
  const { investRounds, investorNftIds } = useFundingContract();
  const [allowance, setAllowance] = useState<bigint | undefined>();
  const isAuthorized = false;
  const currentInvestorTokenInRound = useMemo(() => {
    return (investorNftIds[Number(roundDetail?.roundId)] ?? []).length;
  }, [investorNftIds, roundDetail?.roundId]);

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "OPEN":
  //       return "bg-green-500";
  //     case "CLOSED":
  //       return "bg-gray-500";
  //     case "DIVIDED_PAID":
  //       return "bg-primary";
  //     case "COMPLETED":
  //       return "bg-green-500";
  //     case "WITHDRAW_FUND":
  //       return "bg-yellow-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };
  const calculatedUSDT =
    parseFloat(tokenAmount || "0") *
    Number(formatEther(roundDetail!.tokenPrice));

  const tokenRemaining =
    Number(roundDetail!.totalTokenOpenInvestment) -
    Number(roundDetail!.tokensSold);

  const handleAuthorize = useCallback(async () => {
    const recipient = await handleApprove(
      process.env.NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS as `0x${string}`,
      tokenAmount ? BigInt(tokenAmount) : 0n,
      BigInt(formatEther(roundDetail!.tokenPrice))
    );
    console.log({
      recipient,
    });
    const allowance = await fetchAllowance({
      spender: process.env
        .NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS as `0x${string}`,
      owner: currentAddress as `0x${string}`,
    });

    setAllowance(allowance);
    toast.success(
      "USDT authorization successful! You can now confirm your investment."
    );
  }, [currentAddress, handleApprove, roundDetail, tokenAmount]);

  const handleInvest = async () => {
    try {
      setIsInvesting(true);
      await investRounds(roundDetail!.roundId, BigInt(tokenAmount));
      setTokenAmount("0");
      setAllowance(undefined);
      await updateRoundDetail(roundDetail!.roundId);
      toast.success(
        `Successfully invested ${tokenAmount} tokens (${calculatedUSDT.toLocaleString()} USDT)!`
      );
    } catch (error) {
      toast.error("Investment failed. Please try again.");
      console.error("Investment error:", error);
    } finally {
      setIsInvesting(false);
    }
  };

  const isAllowed = useMemo(() => {
    return allowance == BigInt(tokenAmount) * BigInt(roundDetail!.tokenPrice);
  }, [allowance, roundDetail, tokenAmount]);
  const tokenLimit = 80;

  // Calculate remaining tokens the user can purchase
  const remainingTokensForUser = useMemo(() => {
    return Math.max(0, tokenLimit - currentInvestorTokenInRound);
  }, [currentInvestorTokenInRound, tokenLimit]);

  // Check if user has reached maximum token limit
  const hasReachedMaxTokens = useMemo(() => {
    return currentInvestorTokenInRound >= tokenLimit;
  }, [currentInvestorTokenInRound, tokenLimit]);

  const handlerWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const currentInput = inputRef.current;
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
    };

    if (currentInput) {
      currentInput.addEventListener("wheel", wheelHandler, { passive: false });
    }

    return () => {
      if (currentInput) {
        currentInput.removeEventListener("wheel", wheelHandler);
      }
    };
  }, []);

  if (!roundDetail) {
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
            <Button>Back to Rounds</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TabsContent value="invest">
      {isConnected ? (
        <Card className="border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Make an Investment</CardTitle>
            <CardDescription>
              Purchase tokens for this investment round. Each token represents
              one cow and earns dividends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {roundDetail.status !== Status.OPEN && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  This round is currently {roundDetail.status} and not accepting
                  new investments.
                </AlertDescription>
              </Alert>
            )}

            {/* Maximum Token Limit Reached Alert */}
            {hasReachedMaxTokens && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <div className="space-y-1">
                    <p className="font-semibold">Maximum Token Limit Reached</p>
                    <p>
                      You already hold {currentInvestorTokenInRound} NFT tokens
                      for this round. The maximum limit is {tokenLimit} tokens
                      per wallet per round.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Remaining Tokens Info */}
            {!hasReachedMaxTokens && remainingTokensForUser < tokenLimit && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-1">
                    <p className="font-semibold">Token Limit Information</p>
                    <p>
                      You currently hold {currentInvestorTokenInRound} NFT
                      tokens for this round. You can purchase up to{" "}
                      {remainingTokensForUser} more tokens (maximum {tokenLimit}{" "}
                      tokens per wallet).
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {/* Number of Tokens Input */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label
                    htmlFor="tokens"
                    className="text-base font-semibold text-gray-900"
                  >
                    Number of Tokens to Invest
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                          <Info className="h-3 w-3 text-gray-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Each token represents ownership of one cow and makes
                          you eligible for dividend payments. You will receive
                          an NFT for each token purchased.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="relative">
                  <Input
                    id="tokens"
                    type="number"
                    min="1"
                    max={hasReachedMaxTokens ? 0 : remainingTokensForUser}
                    ref={inputRef}
                    onWheel={handlerWheel}
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    disabled={
                      roundDetail.status !== Status.OPEN || hasReachedMaxTokens
                    }
                    placeholder={
                      hasReachedMaxTokens
                        ? "Maximum tokens reached"
                        : "Enter number of tokens to invest"
                    }
                    className="text-lg h-14 rounded-xl border-gray-300 focus:ring-primary focus:border-primary pr-32 text-gray-900
                    [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none
                    
                    "
                  />
                  {tokenAmount && parseFloat(tokenAmount) > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary">
                      = ${calculatedUSDT.toLocaleString()} USDT
                    </div>
                  )}
                </div>

                {/* Token Limit Validation Message */}
                {tokenAmount &&
                  parseFloat(tokenAmount) > remainingTokensForUser &&
                  !hasReachedMaxTokens && (
                    <p className="text-sm text-orange-600 mt-1">
                      Amount exceeds your remaining token limit. You can
                      purchase up to {remainingTokensForUser} more tokens.
                    </p>
                  )}

                {/* Helper Text */}
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="font-medium">1 Token = 1 Cow</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Minimum: <span className="font-medium">1 Token</span>,
                    Maximum:{" "}
                    <span className="font-medium">{tokenLimit} Tokens</span>
                  </p>
                </div>

                {/* Validation Error */}
                {tokenAmount &&
                  (parseFloat(tokenAmount) < 1 ||
                    parseFloat(tokenAmount) > tokenLimit) && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {parseFloat(tokenAmount) < 1
                        ? "Please enter at least 1 token"
                        : `Maximum available tokens: ${tokenLimit}`}
                    </p>
                  )}
              </div>

              {/* Investment Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Investment Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Token Price:</span>
                    <span className="text-lg font-medium text-gray-900">
                      $
                      {Number(
                        formatEther(roundDetail.tokenPrice)
                      ).toLocaleString()}{" "}
                      USDT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Quantity:</span>
                    <span className="text-lg font-medium text-gray-900">
                      {tokenAmount || "0"} Token(s)
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">
                      Total Required:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${calculatedUSDT.toLocaleString()} USDT
                    </span>
                  </div>
                </div>
              </div>

              {/* NFT Issuance Notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      NFT Issuance
                    </p>
                    <p className="text-sm text-blue-800">
                      You will receive an NFT for each token purchased once the
                      transaction is complete. These NFTs represent your
                      ownership and dividend rights.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {isAllowed ? (
                  <Button
                    onClick={handleInvest}
                    disabled={
                      roundDetail.status !== Status.OPEN ||
                      hasReachedMaxTokens ||
                      !tokenAmount ||
                      parseFloat(tokenAmount) <= 0 ||
                      parseFloat(tokenAmount) > tokenRemaining ||
                      parseFloat(tokenAmount) > remainingTokensForUser
                    }
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {hasReachedMaxTokens
                      ? "Maximum Tokens Reached"
                      : isInvesting
                      ? "Processing..."
                      : "Confirm Investment"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleAuthorize}
                    disabled={
                      roundDetail.status !== Status.OPEN ||
                      hasReachedMaxTokens ||
                      isAuthorized ||
                      !tokenAmount ||
                      parseFloat(tokenAmount) <= 0 ||
                      parseFloat(tokenAmount) > tokenRemaining ||
                      parseFloat(tokenAmount) > remainingTokensForUser
                    }
                    variant={isAuthorized ? "outline" : "default"}
                    className="w-full h-12 text-base rounded-xl"
                  >
                    {isAuthorized ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        USDT Authorized
                      </>
                    ) : (
                      "Approve USDT for Investment"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Make an Investment</CardTitle>
            <CardDescription>
              Purchase tokens for this investment round. Each token represents
              one cow and earns dividends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Coins className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connect Your Wallet to Invest
                </h3>
                <p className="text-gray-500 mb-4">
                  Please connect your wallet to start investing in this round.
                  You&apos;ll need a connected wallet to purchase tokens and
                  receive your NFTs.
                </p>
                <Button
                  onClick={connectWallet}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg"
                >
                  Connect Wallet
                </Button>
              </div>
              <div className="text-sm text-gray-400 pt-2">
                <p>
                  Investments are currently paused for this round. Please check
                  back later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
