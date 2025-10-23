import { useWallet } from "@/contexts/WalletProvider";
import getClientConnectTokenContract from "@/contract/nftContract";
import { useEffect, useState } from "react";
import { GetContractReturnType } from "viem";
// Import Contract type if available

const useFundingTokenContract = () => {
  const { walletClient } = useWallet();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [usdtOwner, setUsdtOwner] = useState<string | null>(null);
  const tokenContract = getClientConnectTokenContract(walletClient!);

  const getBalanceOff = async (address: `0x${string}`) => {
    const balance = await tokenContract.read.balanceOf([address]);
    return balance;
  };
  const getMyTokenBalance = async () => {
    const address = await walletClient!.getAddresses();
    if (address.length === 0) return 0;
    const balance = await tokenContract?.read!.balanceOf([address[0]]);
    return balance;
  };

  useEffect(() => {
    const fetchCurrentWalletTokenBalance = async () => {
      if (!tokenContract) return;
      const address = await walletClient!.getAddresses();
      if (address.length === 0) return;
      const balance = await tokenContract.read.balanceOf([address[0]]);
      setUsdtOwner("owner");
      setBalance(balance);
    };
    fetchCurrentWalletTokenBalance();
  }, [tokenContract, walletClient]);

  return {
    balance,
    tokenContract,
    getBalanceOff,
    getMyTokenBalance,
    usdtOwner,
  };
  // Your hook logic here
};

export default useFundingTokenContract;
