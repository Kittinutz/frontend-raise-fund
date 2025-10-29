import { getContract, PublicClient, WalletClient } from "viem";
import usdTokenABI from "./abi/USDTtokenABI";

const getClientConnectUsdContract = (client: WalletClient | PublicClient) => {
  const address = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS;
  return getContract({
    abi: usdTokenABI,
    client,
    address: address as `0x${string}`,
  });
};

export default getClientConnectUsdContract;
