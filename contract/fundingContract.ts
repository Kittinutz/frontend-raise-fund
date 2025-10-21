import { getContract, WalletClient } from "viem";
import fundingContractABI from "./abi/fundingContract";

const getClientConnectCrownFundingContract = (walletClient: WalletClient) => {
  console.log("account", walletClient.account);
  const address = process.env.NEXT_PUBLIC_FUNDRAISING_CONTRACT_ADDRESS;
  return getContract({
    abi: fundingContractABI,
    client: walletClient,
    address: address as `0x${string}`,
  });
};

export default getClientConnectCrownFundingContract;
