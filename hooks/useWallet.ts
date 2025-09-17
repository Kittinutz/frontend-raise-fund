import { useEffect, useState } from "react";
import { createWalletClient, custom, publicActions, WalletClient } from "viem";
import { localhost } from "viem/chains";

// Add a type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const useWallet = () => {
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  useEffect(() => {
    if (window.ethereum) {
      // You can add any initialization logic here if needed
      console.log("Ethereum provider found");
      const wallet = createWalletClient({
        chain: localhost,
        transport: custom(window.ethereum!),
      }).extend(publicActions);
      setWalletClient(wallet);
    }
    // You can add any side effects or event listeners related to the wallet here
  }, []);

  return {
    walletClient,
  };
};

export default useWallet;
