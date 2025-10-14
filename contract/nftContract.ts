import { getContract, WalletClient } from "viem";
import nftTokenABI from "./abi/usdtToken";

const getClientConnectTokenContract = (client: WalletClient) => {
  const address = process.env.NEXT_PUBLIC_DZNFT_CONTRACT_ADDRESS;
  console.log({
    address,
  });
  return getContract({
    abi: nftTokenABI,
    address: address as `0x${string}`,
    client: {
      wallet: client,
    },
  });
};

export default getClientConnectTokenContract;
