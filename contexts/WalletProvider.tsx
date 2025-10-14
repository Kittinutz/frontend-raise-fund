"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createWalletClient, custom, publicActions, WalletClient } from "viem";
import { localhost } from "viem/chains";

// Add a type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  walletClient: WalletClient | null;
  currentAddress: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  setCurrentAddress: (address: string | undefined) => void;
}

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: WalletProviderProps) {
  const [currentAddress, setCurrentAddress] = useState<string | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  // Initialize wallet client
  const initializeWalletClient = useCallback(() => {
    if (typeof window === "undefined" || !window.ethereum) return null;

    try {
      const client = createWalletClient({
        chain: localhost,
        transport: custom(window.ethereum!),
      }).extend(publicActions);

      setWalletClient(client);
      return client;
    } catch (err) {
      console.error("Failed to initialize wallet client:", err);
      setError("Failed to initialize wallet");
      return null;
    }
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError(
        "No wallet found. Please install MetaMask or another Ethereum wallet."
      );
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setCurrentAddress(accounts[0]);

        // Initialize wallet client if not already done
        if (!walletClient) {
          initializeWalletClient();
        }

        // Store connection state in localStorage
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", accounts[0]);
      }
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [walletClient, initializeWalletClient]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(async () => {
    try {
      if (window.ethereum) {
        // Try to revoke permissions (may not work in all wallets)
        try {
          await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
        } catch (revokeError) {
          // If revoke fails, just clear the local state
          console.warn("Could not revoke permissions:", revokeError);
        }
      }

      // Clear local state
      setCurrentAddress(undefined);
      setWalletClient(null);
      setError(null);

      // Clear localStorage
      localStorage.removeItem("walletConnected");
      localStorage.removeItem("walletAddress");
    } catch (err: any) {
      console.error("Failed to disconnect wallet:", err);
      setError(err.message || "Failed to disconnect wallet");
    }
  }, []);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window === "undefined" || !window.ethereum) return;

      try {
        // Check if we have a stored connection
        const wasConnected = localStorage.getItem("walletConnected");
        const storedAddress = localStorage.getItem("walletAddress");

        if (wasConnected && storedAddress) {
          // Check if the wallet is still connected
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (
            accounts &&
            accounts.length > 0 &&
            accounts[0] === storedAddress
          ) {
            setCurrentAddress(accounts[0]);
            initializeWalletClient();
          } else {
            // Clear stale data
            localStorage.removeItem("walletConnected");
            localStorage.removeItem("walletAddress");
          }
        }
      } catch (err) {
        console.error("Failed to check existing connection:", err);
        // Clear potentially stale data
        localStorage.removeItem("walletConnected");
        localStorage.removeItem("walletAddress");
      }
    };

    checkExistingConnection();
  }, [initializeWalletClient]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnectWallet();
      } else if (accounts[0] !== currentAddress) {
        // User switched accounts
        setCurrentAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      // Reload the page when chain changes
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    // Add event listeners
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [currentAddress, disconnectWallet]);

  // Re-initialize wallet client when address changes
  useEffect(() => {
    if (currentAddress && !walletClient) {
      initializeWalletClient();
    }
  }, [currentAddress, walletClient, initializeWalletClient]);

  const value: WalletContextType = {
    walletClient,
    currentAddress,
    isConnected: !!currentAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    setCurrentAddress,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// Export the context for advanced usage
export { WalletContext };
