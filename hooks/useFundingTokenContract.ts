import getClientConnectCrownFundingContract from "@/contract/fundingContract";
import getClientConnectTokenContract from "@/contract/tokenContract";
import { useEffect, useState } from "react";
import { GetContractReturnType, PublicActions, WalletClient } from "viem";
// Import Contract type if available

const useFundingTokenContract = (
  walletClient: WalletClient & PublicActions
) => {
  const [tokenContract, setTokenContract] = useState<GetContractReturnType>();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [usdtOwner, setUsdtOwner] = useState<string | null>(null);
  useEffect(() => {
    console.log("walletClient", walletClient);
    if (!walletClient) return;
    const contract = getClientConnectTokenContract(walletClient);
    setTokenContract(contract);
  }, [walletClient]);

  const getBalanceOff = async (address: `0x${string}`) => {
    const balance = await tokenContract?.read.balanceOf([address]);
    return balance;
  };
  const getMyTokenBalance = async () => {
    const address = await walletClient.getAddresses();
    if (address.length === 0) return 0;
    const balance = await tokenContract?.read.balanceOf([address[0]]);
    return balance;
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!tokenContract) return;
      const address = await walletClient.getAddresses();
      if (address.length === 0) return;
      const balance = await tokenContract.read.balanceOf([address[0]]);
      setUsdtOwner("owner");
      setBalance(balance);
    };
    fetchBalance();
  }, [tokenContract, walletClient]);

  return {
    balance,
    tokenContract,
    mintUSDT,
    getBalanceOff,
    getMyTokenBalance,
    usdtOwner,
  };
  // Your hook logic here
};

export default useFundingTokenContract;
