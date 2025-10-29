import { getContract, PublicClient, WalletClient } from "viem";
import DZNFTABI from "./abi/DZNFTABI";
import FundRaisingCoreABI from "./abi/FundRaisingCoreABI";
import FundRaisingAnalyticsABI from "./abi/FundRaisingAnalyticsABI";
import FundRaisingAdminABI from "./abi/FundRaisingAdminABI";
import FundRaisingClaimABI from "./abi/FundRaisingClaimABI";

export const getNFTContract = (client: WalletClient | PublicClient) => {
  const address = process.env.NEXT_PUBLIC_DZNFT_CONTRACT_ADDRESS;

  return getContract({
    abi: DZNFTABI,
    address: address as `0x${string}`,
    client: client,
  });
};

export const getCoreFundRaisingContract = (
  client: WalletClient | PublicClient
) => {
  const address = process.env.NEXT_PUBLIC_FUND_RAISING_CORE;
  return getContract({
    abi: FundRaisingCoreABI,
    address: address as `0x${string}`,
    client: client,
  });
};

export const getAnalyticsContract = (client: WalletClient | PublicClient) => {
  const address = process.env.NEXT_PUBLIC_FUND_RAISING_ANALYTICS;
  return getContract({
    abi: FundRaisingAnalyticsABI,
    address: address as `0x${string}`,
    client: client,
  });
};

export const getAdminContract = (client: WalletClient | PublicClient) => {
  const address = process.env.NEXT_PUBLIC_FUND_RAISING_ADMIN;
  return getContract({
    abi: FundRaisingAdminABI,
    address: address as `0x${string}`,
    client: client,
  });
};

export const getClaimFundContract = (client: WalletClient | PublicClient) => {
  const address = process.env.NEXT_PUBLIC_FUND_RAISING_CLAIMS;
  return getContract({
    abi: FundRaisingClaimABI,
    address: address as `0x${string}`,
    client: client,
  });
};
