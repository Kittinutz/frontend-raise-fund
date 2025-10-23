import getClientConnectUsdContract from "@/contract/usdtContract";
import { publicClient } from "@/utils/client";

const contractcoInstance = getClientConnectUsdContract(publicClient);
export const fetchAllowance = async ({
  owner,
  spender,
}: {
  spender: `0x${string}`;
  owner: `0x${string}`;
}) => {
  try {
    const allowance = await contractcoInstance.read.allowance([owner, spender]);
    console.log({
      allowance,
    });
    return allowance;
  } catch (error) {
    console.error("Error fetching allowance:", error);
  }
};
