import {
  getContract,
  GetContractReturnType,
  PublicActions,
  PublicClient,
  WalletClient,
} from "viem";
import fundingContractABI from "./abi/fundingContract";

type FundingContract = GetContractReturnType<
  typeof fundingContractABI,
  PublicClient
>;

const getClientConnectCrownFundingContract = (
  client: WalletClient
): FundingContract => {
  const address = process.env.NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS;
  return getContract({
    abi: fundingContractABI,
    client,
    address: address as `0x${string}`,
  });
};

export default getClientConnectCrownFundingContract;
