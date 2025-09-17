import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PublicActions, WalletClient } from "viem";
import { foundry } from "viem/chains";
interface RoundInfo {
  roundId: bigint;
  pricePerToken: bigint;
  rewardPercentage: bigint;
  investEndDate: bigint;
  roundEndDate: bigint;
  totalTokens: bigint;
  tokensSold: bigint;
  isActive: boolean;
  rewardDeposit: bigint;
}

const useFundingContract = (walletClient: WalletClient & PublicActions) => {
  const [numberOfRound, setNumberOfRound] = useState<bigint[]>([]);
  const [roundLists, setRoundList] = useState<RoundInfo[]>([]);
  const contract = useMemo(
    () => getClientConnectCrownFundingContract(walletClient),
    [walletClient]
  );

  const getRoundListArr = useCallback(
    async (active: boolean) => {
      console.log("--->", contract.read);
      const roundList = await contract?.read?.getRoundList([active]);
      console.log({
        roundList,
      });
      return roundList;
    },
    [contract]
  );

  const getRoundInfo = async (roundId: bigint) => {
    const [
      roundIdResult,
      pricePerToken,
      rewardPercentage,
      investEndDate,
      roundEndDate,
      totalTokens,
      tokensSold,
      isActive,
      rewardDeposit,
    ] = (await contract.read.getRoundInfo([roundId])) as [
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      boolean,
      bigint
    ];

    const roundInfo = {
      roundId: roundIdResult,
      pricePerToken,
      rewardPercentage,
      investEndDate,
      roundEndDate,
      totalTokens,
      tokensSold,
      isActive,
      rewardDeposit,
    };

    return roundInfo;
  };
  const createRound = async ({
    pricePerToken,
    rewardPercentage,
    totalTokens,
    investEndDate,
    roundEndDate,
  }: {
    pricePerToken: bigint;
    rewardPercentage: bigint;
    totalTokens: bigint;
    investEndDate: bigint;
    roundEndDate: bigint;
  }) => {
    const address = await walletClient.getAddresses();
    if (address.length === 0) return;
    const { request } = await walletClient.simulateContract({
      abi: contract.abi,
      address: process.env
        .NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "createRound",
      account: address[0],
      chain: foundry,
      args: [
        BigInt(pricePerToken) * BigInt(10) ** BigInt(18),
        totalTokens,
        rewardPercentage,
        investEndDate,
        roundEndDate,
      ],
    });
    const hash = await walletClient.writeContract(request);
    const receipt = await walletClient.waitForTransactionReceipt({
      hash,
    });
    console.log("receipt", receipt);
    if (receipt.status !== "success") {
      throw new Error("Transaction failed");
    }
    return hash;
  };

  useEffect(() => {
    async function fetchNumberOfRound() {
      const number = await getRoundListArr(false);
      return setNumberOfRound(number);
    }
    fetchNumberOfRound();
  }, [getRoundListArr]);
  useEffect(() => {
    async function fetchRoundListDetail() {
      const detailPromise = [];
      for (let i = 0; i < numberOfRound.length; i++) {
        const promisePayload = contract.read.getRoundInfo([
          numberOfRound[i],
        ]) as Promise<
          [
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            boolean,
            bigint
          ]
        >;
        detailPromise.push(promisePayload);
      }
      const roundDetailsList = await Promise.all(detailPromise);
      const resultRoundDetailList = roundDetailsList.map((v) => {
        const [
          roundId,
          pricePerToken,
          rewardPercentage,
          investEndDate,
          roundEndDate,
          totalTokens,
          tokensSold,
          isActive,
          rewardDeposit,
        ] = v;
        return {
          roundId,
          pricePerToken,
          rewardPercentage,
          investEndDate,
          roundEndDate,
          totalTokens,
          tokensSold,
          isActive,
          rewardDeposit,
        };
      });
      setRoundList(resultRoundDetailList);
    }
    fetchRoundListDetail();
  }, [contract.read, numberOfRound]);

  const investRound = async (roundId: bigint, tokenAmount: bigint) => {
    console.log("invest Round");
    const address = await walletClient.getAddresses();
    if (address.length === 0) return;
    const { request } = await walletClient.simulateContract({
      abi: contract.abi,
      address: contract.address as `0x${string}`,
      functionName: "investRound",
      account: address[0],
      chain: foundry,
      args: [roundId, tokenAmount],
    });
    const hash = await walletClient.writeContract(request);
    const receipt = await walletClient.waitForTransactionReceipt({
      hash,
    });
    console.log("receipt", receipt);
    if (receipt.status !== "success") {
      throw new Error("Transaction failed");
    }
    return hash;
  };

  return {
    contract,
    getRoundInfo,
    getRoundListArr,
    createRound,
    numberOfRound,
    roundLists,
    investRound,
  };
  // Your hook logic here
};

export default useFundingContract;
