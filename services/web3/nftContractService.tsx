import getClientConnectNFTContract from "@/contract/nftContract";
import { InvestmentRound } from "@/types/fundingContract";
import { publicClient } from "@/utils/client";

const contractInstance = getClientConnectNFTContract(publicClient);
export const fetchNFtInfo = async (
  tokenId: bigint
): Promise<InvestmentRound | undefined> => {
  try {
    const nftInfo = await contractInstance.read.getInvestmentData([tokenId]);
    return nftInfo as InvestmentRound;
  } catch (error) {
    console.error("Error fetching NFT info:", error);
  }
};
