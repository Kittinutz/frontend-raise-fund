import getClientConnectNFTContract from "@/contract/nftContract";
import { InvestmentRound, InvestmentRoundNFT } from "@/types/fundingContract";
import { publicClient } from "@/utils/client";

const contractInstance = getClientConnectNFTContract(publicClient);
export const fetchNFtInfo = async (
  tokenId: bigint
): Promise<InvestmentRound | undefined> => {
  try {
    const nftInfo = await contractInstance.read.getInvestmentData([tokenId]);
    return nftInfo as unknown as InvestmentRound;
  } catch (error) {
    console.error("Error fetching NFT info:", error);
  }
};

export const fetchNftOwnedByRoundId = async (
  ownerAddress: `0x${string}`,
  roundId: bigint
): Promise<InvestmentRoundNFT[]> => {
  try {
    const nftRounds = await contractInstance.read.getTokenFromWalletByRoundId([
      ownerAddress,
      roundId,
    ]);
    return nftRounds as unknown as InvestmentRoundNFT[];
  } catch (error) {
    console.error("Error fetching NFT rounds by owner:", error);
    return [];
  }
};
