export interface InvestmentRound {
  id: string;
  name: string;
  dividendPercentage: number;
  dividendOption: "3% every 6 months" | "6% at year end";
  status: "Open" | "Closed" | "Dividends Paid";
  totalInvestment: number;
  tokensSold: number;
  tokensRemaining: number;
  totalTokens: number;
  tokenPrice: number;
  roundEndDate: string;
  investmentEndDate: string;
  startDate: string;
}

export interface Cow {
  tagNumber: string;
  status: "Live" | "Processed";
  cowId: string;
  weight: number;
}

export interface InvestmentDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export interface DividendPayment {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
  type: "Semi-Annual" | "Annual";
}

export interface UserInvestment {
  roundId: string;
  tokensOwned: number;
  investmentAmount: number;
  dividendsEarned: number;
  status: string;
}

export interface Transaction {
  id: string;
  tokenAmount: number;
  roundId: string;
  purchaseDate: string;
  purchaseTime: string;
  status: "Completed" | "Pending" | "Cancelled";
  nftIds: string[];
  usdtAmount: number;
}

export interface NFT {
  tokenId: string;
  roundId: string;
  tokePrice: number;
  rewardPercentage: number;
  totalTokenOpenInvestment: number;
  purchaseTimestamp: string;
  closeDateInvestment: string;
  endDateInvestment: string;
  originalBuyer: string;
  redeemed: boolean;
  rewardClaimed: boolean;
  transferLocked: boolean;
  metadata: string;
  imageUrl: string;
}

export const investmentRounds: InvestmentRound[] = [
  {
    id: "1",
    name: "Round 1 - 2025",
    dividendPercentage: 3,
    dividendOption: "3% every 6 months",
    status: "Open",
    totalInvestment: 450000,
    tokensSold: 225,
    tokensRemaining: 75,
    totalTokens: 300,
    tokenPrice: 2000,
    roundEndDate: "2025-11-15",
    investmentEndDate: "2026-11-15",
    startDate: "2025-10-15",
  },
  {
    id: "2",
    name: "Round 2 - 2024",
    dividendPercentage: 6,
    dividendOption: "6% at year end",
    status: "Closed",
    totalInvestment: 600000,
    tokensSold: 300,
    tokensRemaining: 0,
    totalTokens: 300,
    tokenPrice: 2000,
    roundEndDate: "2024-11-30",
    investmentEndDate: "2025-11-30",
    startDate: "2024-10-01",
  },
  {
    id: "3",
    name: "Round 1 - 2024",
    dividendPercentage: 3,
    dividendOption: "3% every 6 months",
    status: "Dividends Paid",
    totalInvestment: 600000,
    tokensSold: 300,
    tokensRemaining: 0,
    totalTokens: 300,
    tokenPrice: 2000,
    roundEndDate: "2024-05-31",
    investmentEndDate: "2025-05-31",
    startDate: "2024-04-01",
  },
];

export const cowsByRound: Record<string, Cow[]> = {
  "1": [
    { tagNumber: "COW-2025-001", status: "Live", cowId: "C001", weight: 550 },
    { tagNumber: "COW-2025-002", status: "Live", cowId: "C002", weight: 575 },
    { tagNumber: "COW-2025-003", status: "Live", cowId: "C003", weight: 520 },
    { tagNumber: "COW-2025-004", status: "Live", cowId: "C004", weight: 600 },
    { tagNumber: "COW-2025-005", status: "Live", cowId: "C005", weight: 580 },
  ],
  "2": [
    { tagNumber: "COW-2024-101", status: "Live", cowId: "C101", weight: 560 },
    { tagNumber: "COW-2024-102", status: "Live", cowId: "C102", weight: 590 },
    { tagNumber: "COW-2024-103", status: "Live", cowId: "C103", weight: 545 },
    { tagNumber: "COW-2024-104", status: "Live", cowId: "C104", weight: 610 },
    {
      tagNumber: "COW-2024-105",
      status: "Processed",
      cowId: "C105",
      weight: 625,
    },
  ],
  "3": [
    {
      tagNumber: "COW-2024-201",
      status: "Processed",
      cowId: "C201",
      weight: 565,
    },
    {
      tagNumber: "COW-2024-202",
      status: "Processed",
      cowId: "C202",
      weight: 595,
    },
    {
      tagNumber: "COW-2024-203",
      status: "Processed",
      cowId: "C203",
      weight: 550,
    },
    {
      tagNumber: "COW-2024-204",
      status: "Processed",
      cowId: "C204",
      weight: 605,
    },
  ],
};

export const documentsByRound: Record<string, InvestmentDocument[]> = {
  "1": [
    {
      id: "doc-1",
      name: "Round 1 Investment Agreement",
      type: "PDF",
      uploadDate: "2025-10-15",
      size: "2.4 MB",
    },
    {
      id: "doc-2",
      name: "Cattle Purchase Contract",
      type: "PDF",
      uploadDate: "2025-10-15",
      size: "1.8 MB",
    },
    {
      id: "doc-3",
      name: "Insurance Certificate",
      type: "PDF",
      uploadDate: "2025-10-20",
      size: "856 KB",
    },
  ],
  "2": [
    {
      id: "doc-4",
      name: "Round 2 Investment Agreement",
      type: "PDF",
      uploadDate: "2024-10-01",
      size: "2.2 MB",
    },
    {
      id: "doc-5",
      name: "Cattle Health Report",
      type: "PDF",
      uploadDate: "2024-11-15",
      size: "1.2 MB",
    },
  ],
  "3": [
    {
      id: "doc-6",
      name: "Round 1 Investment Agreement",
      type: "PDF",
      uploadDate: "2024-04-01",
      size: "2.1 MB",
    },
    {
      id: "doc-7",
      name: "Final Settlement Report",
      type: "PDF",
      uploadDate: "2025-05-31",
      size: "3.4 MB",
    },
  ],
};

export const dividendsByRound: Record<string, DividendPayment[]> = {
  "1": [
    {
      id: "div-1",
      date: "2026-04-15",
      amount: 13500,
      status: "Pending",
      type: "Semi-Annual",
    },
    {
      id: "div-2",
      date: "2026-10-15",
      amount: 13500,
      status: "Pending",
      type: "Semi-Annual",
    },
  ],
  "2": [
    {
      id: "div-3",
      date: "2025-11-30",
      amount: 36000,
      status: "Pending",
      type: "Annual",
    },
  ],
  "3": [
    {
      id: "div-4",
      date: "2024-10-31",
      amount: 18000,
      status: "Paid",
      type: "Semi-Annual",
    },
    {
      id: "div-5",
      date: "2025-04-30",
      amount: 18000,
      status: "Paid",
      type: "Semi-Annual",
    },
  ],
};

export const userInvestments: UserInvestment[] = [
  {
    roundId: "1",
    tokensOwned: 10,
    investmentAmount: 20000,
    dividendsEarned: 0,
    status: "Active",
  },
  {
    roundId: "2",
    tokensOwned: 5,
    investmentAmount: 10000,
    dividendsEarned: 0,
    status: "Active",
  },
  {
    roundId: "3",
    tokensOwned: 8,
    investmentAmount: 16000,
    dividendsEarned: 1920,
    status: "Completed",
  },
];

export const transactions: Transaction[] = [
  {
    id: "TXN-2025-001",
    tokenAmount: 10,
    roundId: "1",
    purchaseDate: "2025-10-20",
    purchaseTime: "14:30:00",
    status: "Completed",
    nftIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "NFT-010"],
    usdtAmount: 20000,
  },
  {
    id: "TXN-2024-102",
    tokenAmount: 5,
    roundId: "2",
    purchaseDate: "2024-11-05",
    purchaseTime: "09:15:00",
    status: "Completed",
    nftIds: ["NFT-011", "NFT-012", "NFT-013", "NFT-014", "NFT-015"],
    usdtAmount: 10000,
  },
  {
    id: "TXN-2024-045",
    tokenAmount: 8,
    roundId: "3",
    purchaseDate: "2024-04-15",
    purchaseTime: "16:45:00",
    status: "Completed",
    nftIds: [
      "NFT-016",
      "NFT-017",
      "NFT-018",
      "NFT-019",
      "NFT-020",
      "NFT-021",
      "NFT-022",
      "NFT-023",
    ],
    usdtAmount: 16000,
  },
  {
    id: "TXN-2025-012",
    tokenAmount: 3,
    roundId: "1",
    purchaseDate: "2025-10-25",
    purchaseTime: "11:20:00",
    status: "Pending",
    nftIds: [],
    usdtAmount: 6000,
  },
];

export const nfts: NFT[] = [
  {
    tokenId: "1",
    roundId: "1",
    tokePrice: 2000,
    rewardPercentage: 3,
    totalTokenOpenInvestment: 300,
    purchaseTimestamp: "2025-10-20T14:30:00Z",
    closeDateInvestment: "2025-11-15",
    endDateInvestment: "2026-11-15",
    originalBuyer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    redeemed: false,
    rewardClaimed: false,
    transferLocked: false,
    metadata: "QmX7K9ZhYPxT2fH3vN8qR1mW4sB6dL9cE5jG2uA1pV8wQ3",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
  },
  {
    tokenId: "2",
    roundId: "1",
    tokePrice: 2000,
    rewardPercentage: 3,
    totalTokenOpenInvestment: 300,
    purchaseTimestamp: "2025-10-20T14:30:00Z",
    closeDateInvestment: "2025-11-15",
    endDateInvestment: "2026-11-15",
    originalBuyer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    redeemed: false,
    rewardClaimed: false,
    transferLocked: false,
    metadata: "QmY8L0aZiYqXu3gO9rS2nX5tC7eM0kF6hH3vB2qW9xR4",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
  },
  {
    tokenId: "NFT-011",
    roundId: "2",
    tokePrice: 2000,
    rewardPercentage: 6,
    totalTokenOpenInvestment: 300,
    purchaseTimestamp: "2024-11-05T09:15:00Z",
    closeDateInvestment: "2024-11-30",
    endDateInvestment: "2025-11-30",
    originalBuyer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    redeemed: false,
    rewardClaimed: false,
    transferLocked: false,
    metadata: "QmZ9M1bZjZrYv4hP0sT3oY6uD8fN1lG7iI4wC3rX0yS5",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
  },
  {
    tokenId: "NFT-016",
    roundId: "3",
    tokePrice: 2000,
    rewardPercentage: 3,
    totalTokenOpenInvestment: 300,
    purchaseTimestamp: "2024-04-15T16:45:00Z",
    closeDateInvestment: "2024-05-31",
    endDateInvestment: "2025-05-31",
    originalBuyer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    redeemed: true,
    rewardClaimed: true,
    transferLocked: true,
    metadata: "QmA0N2cZkAsWw5iQ1tU4pZ7vE9mO2nH8jJ5xD4sY1zT6",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
  },
  {
    tokenId: "NFT-017",
    roundId: "3",
    tokePrice: 2000,
    rewardPercentage: 3,
    totalTokenOpenInvestment: 300,
    purchaseTimestamp: "2024-04-15T16:45:00Z",
    closeDateInvestment: "2024-05-31",
    endDateInvestment: "2025-05-31",
    originalBuyer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    redeemed: true,
    rewardClaimed: true,
    transferLocked: true,
    metadata: "QmB1O3dAlBtXx6jR2uV5qA8wF0oP3oI9kK6yE5tZ2aU7",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
  },
];
