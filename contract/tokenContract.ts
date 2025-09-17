import { getContract, WalletClient } from "viem";
import usdTokenABI from "./abi/usdtToken";

const getClientConnectTokenContract = (client: WalletClient) => {
  const address = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  console.log({
    address,
  });
  return getContract({
    abi: usdTokenABI,
    address: address as `0x${string}`,
    client: {
      wallet: client,
    },
  });
};

export default getClientConnectTokenContract;
