import { getContract, PublicClient, WalletClient } from "viem";
import fundingContractABI from "./abi/fundingContract";

const getClientConnectCrownFundingContract = (
  client: WalletClient | PublicClient
) => {
  const address = process.env.NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS;
  return getContract({
    abi: fundingContractABI,
    client: client,
    address: address as `0x${string}`,
  });
};

export default getClientConnectCrownFundingContract;
