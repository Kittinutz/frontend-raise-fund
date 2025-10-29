import { getNFTContract } from "@/contract/contracts";
import { InvestmentRound, InvestmentRoundNFT } from "@/types/fundingContract";
import { publicClient } from "@/utils/client";

const contractInstance = getNFTContract(publicClient);
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

export const fetchBalanceOfNFTs = async (
  ownerAddress: `0x${string}`
): Promise<bigint> => {
  try {
    const balance = await contractInstance.read.balanceOf([ownerAddress]);
    return balance;
  } catch (error) {
    console.error("Error fetching NFT balance:", error);
    return BigInt(0);
  }
};

export const fetchNftsTokenInRound = async (
  ownerAddress: `0x${string}`,
  roundId: bigint
): Promise<InvestmentRoundNFT[]> => {
  try {
    const nfts = await contractInstance.read.getUserNFTsByRound([
      ownerAddress,
      roundId,
    ]);
    return nfts as unknown as InvestmentRoundNFT[];
  } catch (error) {
    console.error("Error fetching NFTs in round:", error);
    return [];
  }
};
