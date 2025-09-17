import getClientConnectUsdContract from "@/contract/usdtContract";
import { useEffect, useState } from "react";
import { GetContractReturnType, PublicActions, WalletClient } from "viem";
import { foundry } from "viem/chains";
// Import Contract type if available

const useUSDTokenContract = (walletClient: WalletClient & PublicActions) => {
  const [usdTokenContract, setTokenContract] =
    useState<GetContractReturnType>();
  const [usdtBalance, setUsdtBalance] = useState<bigint | null>(null);
  const [usdtOwner, setUsdtOwner] = useState<string | null>(null);
  useEffect(() => {
    console.log("walletClient", walletClient);
    if (!walletClient) return;
    const contract = getClientConnectUsdContract(walletClient);
    setTokenContract(contract);
  }, [walletClient]);

  const getBalanceOff = async (address: `0x${string}`) => {
    const balance = await usdTokenContract?.read.balanceOf([address]);
    return balance;
  };
  const getMyTokenBalance = async () => {
    const address = await walletClient.getAddresses();
    if (address.length === 0) return 0;
    const balance = await usdTokenContract?.read.balanceOf([address[0]]);
    return balance;
  };

  const mintUSDT = async (amount: bigint) => {
    if (!usdTokenContract) return;
    const address = await walletClient.getAddresses();
    console.log("---->", address);
    const { request } = await walletClient.simulateContract({
      abi: usdTokenContract.abi,
      address: process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "mint",
      chain: foundry,
      account: address[0],
      args: [address[0], amount * BigInt(10) ** BigInt(18)],
    });
    const hash = await walletClient.writeContract(request);
    const receipt = await walletClient.waitForTransactionReceipt({
      hash,
    });
    console.log("receipt", receipt);
    if (receipt.status !== "success") {
      throw new Error("Transaction failed");
    }
    const balance = await usdTokenContract.read.balanceOf([address[0]]);
    console.log({
      balance,
    });
    setUsdtBalance(balance);
    return hash;
  };
  const handleApprove = async (
    spender: `0x${string}`,
    tokenAmount: bigint,
    pricePerToken: bigint
  ) => {
    if (!usdTokenContract) return;
    const address = await walletClient.getAddresses();

    const { request } = await walletClient.simulateContract({
      abi: usdTokenContract.abi,
      address: usdTokenContract.address,
      functionName: "approve",
      chain: foundry,
      account: address[0],
      args: [
        `${spender}`,
        tokenAmount * pricePerToken * BigInt(10) ** BigInt(18),
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

  const usdtAllowance = async (
    owner: `0x${string}`,
    spender: `0x${string}`
  ) => {
    if (!usdTokenContract) return;
    const allowance = await usdTokenContract.read.allowance([owner, spender]);
    return allowance;
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!usdTokenContract) return;
      const address = await walletClient.getAddresses();
      if (address.length === 0) return;
      const balance = await usdTokenContract.read.balanceOf([address[0]]);
      setUsdtOwner("owner");
      setUsdtBalance(balance);
    };
    fetchBalance();
  }, [usdTokenContract, walletClient]);

  return {
    usdtBalance,
    usdTokenContract,
    mintUSDT,
    getBalanceOff,
    getMyTokenBalance,
    usdtOwner,
    handleApprove,
    usdtAllowance,
  };
  // Your hook logic here
};

export default useUSDTokenContract;
