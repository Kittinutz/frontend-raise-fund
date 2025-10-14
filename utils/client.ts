import { createPublicClient, createWalletClient, custom, http } from "viem";
import { foundry } from "viem/chains";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

export const walletClient = createWalletClient({
  chain: process.env.PRODUCTION == "true" ? foundry : foundry,
  transport: custom(window.ethereum!),
});

export const publicClient = createPublicClient({
  chain: process.env.PRODUCTION == "true" ? foundry : foundry,
  transport: http(),
});
