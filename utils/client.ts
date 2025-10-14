import { createPublicClient, createWalletClient, custom, http } from "viem";
import { foundry } from "viem/chains";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

// Create public client (always available)
export const publicClient = createPublicClient({
  chain: process.env.PRODUCTION == "true" ? foundry : foundry,
  transport: http(),
});

// Create wallet client only when window.ethereum is available
export const createWalletClientInstance = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  
  return createWalletClient({
    chain: process.env.PRODUCTION == "true" ? foundry : foundry,
    transport: custom(window.ethereum),
  });
};
