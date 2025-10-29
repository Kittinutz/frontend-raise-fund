import { useWallet } from "@/contexts/WalletProvider";
import { fetchBalanceOfNFTs } from "@/services/web3/NFTContractService";
import { useEffect, useState } from "react";
// Import Contract type if available

const useFundingTokenContract = () => {
  const { currentAddress } = useWallet();
  const [nftBalance, setNftsBalances] = useState<bigint | number>(0);
  useEffect(() => {
    const initialFetch = async () => {
      try {
        if (!currentAddress) return;
        const nfts = await fetchBalanceOfNFTs(currentAddress as `0x${string}`);
        setNftsBalances(nfts);
      } catch (error) {
        console.error("Error fetching funding token data:", error);
      }
    };
    initialFetch();
  }, [currentAddress]);
  return {
    nftBalance,
  };
  // Your hook logic here
};

export default useFundingTokenContract;
