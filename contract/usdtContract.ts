import { getContract, WalletClient } from "viem";
import usdTokenABI from "./abi/usdtToken";

const getClientConnectUsdContract = (client: WalletClient) => {
  const address = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS;
  return getContract({
    abi: usdTokenABI,
    client,
    address: address as `0x${string}`,
  });
};

export default getClientConnectUsdContract;
