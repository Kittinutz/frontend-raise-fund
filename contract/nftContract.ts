import { getContract, PublicClient, WalletClient } from "viem";
import nftTokenABI from "./abi/DZNFTABI";

const getClientConnectNFTContract = (client: WalletClient | PublicClient) => {
  const address = process.env.NEXT_PUBLIC_DZNFT_CONTRACT_ADDRESS;

  return getContract({
    abi: nftTokenABI,
    address: address as `0x${string}`,
    client: client,
  });
};

export default getClientConnectNFTContract;
