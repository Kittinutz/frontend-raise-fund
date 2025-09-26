import { useCallback, useEffect, useMemo, useState } from "react";
import { createWalletClient, custom, publicActions, WalletClient } from "viem";
import { localhost } from "viem/chains";

// Add a type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const useWallet = () => {
  const [currentAddress, setCurrentAddress] = useState<string | undefined>();
  const disconnectWallet = async () => {
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  };

  const walletClient = useMemo(() => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    return createWalletClient({
      chain: localhost,
      transport: custom(window.ethereum!),
    }).extend(publicActions);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await walletClient?.getAddresses();
      setCurrentAddress(address ? address[0] : undefined);
    };
    fetchAddress();
  }, [walletClient]);
  return {
    walletClient,
    disconnectWallet,
    currentAddress,
    setCurrentAddress,
  };
};

export default useWallet;
