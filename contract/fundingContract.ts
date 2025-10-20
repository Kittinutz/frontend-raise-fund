import {
  getContract,
  GetContractReturnType,
  PublicActions,
  PublicClient,
  WalletClient,
} from "viem";
import fundingContractABI from "./abi/fundingContract";
import { publicClient } from "@/utils/client";
import { foundry } from "viem/chains";

const getClientConnectCrownFundingContract = (walletClient: WalletClient) => {
  console.log("account", walletClient.account);
  const address = process.env.NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS;
  return getContract({
    abi: fundingContractABI,
    client: {
      wallet: walletClient,
      public: publicClient,
      account: walletClient.account,
    },
    address: address as `0x${string}`,
  });
};

export default getClientConnectCrownFundingContract;
