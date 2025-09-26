"use client";
import useFundingContract from "@/hooks/useFundingContract";
import useUSDTokenContract from "@/hooks/useUSDTokenContract";
import useWallet from "@/hooks/useWallet";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { foundry } from "viem/chains";

export default function Home() {
  const [currentFundContractAllowance, setCurrentFundContractAllowance] =
    useState(0);

  const { walletClient, currentAddress, setCurrentAddress } = useWallet();
  const {
    usdtBalance,
    mintUSDT,
    usdtOwner,
    handleApprove,
    usdtAllowance,
    updateMyTokenBalance,
    clearBalance,
  } = useUSDTokenContract({
    walletClient: walletClient!,
    currentAddress: currentAddress!,
  });

  const { createRound, roundLists, investRound, ownerWithdrawRound } =
    useFundingContract({
      walletClient: walletClient!,
      currentAddress: currentAddress!,
    });

  const handleLogout = async () => {
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    setCurrentAddress(undefined);
    clearBalance();
  };

  const handleConnectWallet = async () => {
    try {
      const address = await walletClient?.requestAddresses();
      setCurrentAddress(address ? address[0] : undefined);
      await walletClient?.addChain({ chain: foundry });
      await walletClient?.switchChain({ id: foundry.id });
    } catch (error) {
      // Optionally log or handle the error
      console.error(error);
    }
  };

  const handleSubmitCreateRound = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.target);
    const [pricePerToken, rewardPercentage, totalTokens] =
      e.target as unknown as {
        value: string;
      }[];

    if (!walletClient) return;
    try {
      const txHash = await createRound({
        pricePerToken: BigInt(pricePerToken.value), // pricePerToken in ETH
        totalTokens: BigInt(totalTokens.value), // totalTokens
        rewardPercentage: BigInt(rewardPercentage.value), // rewardPercentage
        // investEndDate: BigInt(Math.floor(Date.now() / 1000) + 60 * 60), // investEndDate (1 hours from now)
        investEndDate: BigInt(Math.floor(Date.now() / 1000) + 60), // investEndDate (1 hours from now)
        roundEndDate: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 2), // roundEndDate (2 hours from now)
      });
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Error creating round:", error);
    }
  };

  //handler investment
  const handleInvestment = async (
    roundId: bigint,
    tokenAmount: bigint,
    pricePerToken: bigint
  ) => {
    await handleApprove(
      process.env.NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS as `0x${string}`,
      tokenAmount,
      pricePerToken
    );
    await investRound(roundId, BigInt(tokenAmount));
    // Now you can call the investment function on the funding contract
  };
  const handleInvestmentWithdraw = async (roundId: bigint) => {
    await ownerWithdrawRound(roundId);
    await updateMyTokenBalance();
    // Now you can call the investment function on the funding contract
  };
  useEffect(() => {
    const fetchAllowance = async () => {
      if (!currentAddress) return;
      const allowance = (await usdtAllowance(
        currentAddress as `0x${string}`,
        process.env.NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS as `0x${string}`
      )) as bigint;
      if (!allowance) return;
      setCurrentFundContractAllowance(
        formatEther(allowance) as unknown as number
      );
    };
    fetchAllowance();
  }, [currentAddress, usdtAllowance]);

  return (
    <div className="container mx-auto max-w-2xl flex-col justify-center items-center">
      <div className="flex flex-col gap-4">
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </button>
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          onClick={handleLogout}
        >
          Logout Wallet
        </button>
        <p>Current Account: {currentAddress}</p>

        <p>USDT Balance: {usdtBalance ? formatEther(usdtBalance) : null}</p>
        <p>USDT Owner: {usdtOwner ? usdtOwner : null}</p>
        <p>Allowance Owner: {formatEther(currentFundContractAllowance)}</p>

        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          onClick={() => mintUSDT(BigInt(100))}
        >
          Mint 100 USDT
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">
        Create Funding Round for owner
      </h1>
      <form onSubmit={handleSubmitCreateRound}>
        <div className="flex flex-col gap-4">
          <input
            className="bg-white text-black px-4 py-2"
            placeholder="Price Per Token"
          />
          <input
            className="bg-white text-black px-4 py-2"
            placeholder="Reward Percentage"
          />
          <input
            className="bg-white text-black px-4 py-2"
            placeholder="Total Tokens"
          />
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            type="submit"
          >
            Create Round Submit
          </button>
        </div>
      </form>
      <div className="my-4">
        <h1 className="text-2xl font-bold mb-4">Round list Round</h1>
        {roundLists.map((round) => (
          <div
            key={round.roundId.toString()}
            className="border border-gray-300 rounded p-4 mb-4"
          >
            <p>Round ID: {round.roundId.toString()}</p>
            <p>Price Per Token: {formatEther(round.pricePerToken)} USDT</p>
            <p>Reward Percentage: {round.rewardPercentage.toString()}%</p>
            <p>
              Invest End Date:{" "}
              {new Date(Number(round.investEndDate) * 1000).toLocaleString()}
            </p>
            <p>
              Round End Date:{" "}
              {new Date(Number(round.roundEndDate) * 1000).toLocaleString()}
            </p>
            <p>Total Tokens: {round.totalTokens.toString()}</p>
            <p>Tokens Sold: {round.tokensSold.toString()}</p>
            <p>Is Active: {round.isActive ? "Yes" : "No"}</p>
            <p>Reward Deposit: {formatEther(round.rewardDeposit)} ETH</p>
            <p>
              Total USDT Raised:
              {formatEther(round.pricePerToken * round.tokensSold)} USD
            </p>
            <div className="flex gap-4 j">
              <button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                onClick={() =>
                  handleInvestment(
                    round.roundId,
                    BigInt(1),
                    round.pricePerToken
                  )
                }
              >
                Investment 1 token
              </button>
              <button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                onClick={() => handleInvestmentWithdraw(round.roundId)}
              >
                Owner Withdraw to Invest
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
