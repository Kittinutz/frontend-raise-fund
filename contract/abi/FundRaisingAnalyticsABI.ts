export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "_coreContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxSize",
        type: "uint256",
      },
    ],
    name: "ArrayTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "CalculationOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "EmergencyPaused",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "RateLimitError",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "TokenNotExists",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedContract",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "EmergencyPauseActivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "functionName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "arraySize",
        type: "uint256",
      },
    ],
    name: "LargeQueryDetected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "attempts",
        type: "uint256",
      },
    ],
    name: "RateLimitExceeded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "SuspiciousActivity",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_CALLS_PER_WINDOW",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_ROUNDS_PER_QUERY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_ROUND_ID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_TOKENS_PER_QUERY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RATE_LIMIT_WINDOW",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
    ],
    name: "addWhitelistedContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "coreContract",
    outputs: [
      {
        internalType: "contract FundRaisingCore",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyUnpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "getAllTokensOwnedBy",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
    ],
    name: "getDividendEarning",
    outputs: [
      {
        internalType: "uint256",
        name: "dividendEarned",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "dividendPending",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGasUsageStats",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "getInvestmentRound",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "roundName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "tokenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rewardPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalTokenOpenInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokensSold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeDateInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endDateInvestment",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct FundRaisingAnalytics.InvestmentRound",
        name: "round",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "enableClaimReward",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "getInvestorRounds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "roundIds",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "getInvestorRoundsDetail",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "roundName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "tokenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rewardPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalTokenOpenInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokensSold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeDateInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endDateInvestment",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "enum FundRaisingCore.Status",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct FundRaisingCore.InvestmentRound[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "getInvestorSummary",
    outputs: [
      {
        internalType: "uint256",
        name: "totalTokensOwned",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "nftTokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "totalInvestment",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "dividendsEarned",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getRateLimitInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "lastCall",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "callsInWindow",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "getRoundTokenIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRoundsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "totalRounds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "activeRounds",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getRoundsCountPaginated",
    outputs: [
      {
        internalType: "uint256",
        name: "totalRounds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "activeRounds",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "hasMore",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "roundIds",
        type: "uint256[]",
      },
    ],
    name: "getRoundsDetail",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "roundName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "tokenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rewardPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalTokenOpenInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokensSold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeDateInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endDateInvestment",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "enum FundRaisingCore.Status",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct FundRaisingCore.InvestmentRound[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "getWalletTokensDetail",
    outputs: [
      {
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rewardPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalTokenOpenInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "purchaseTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeDateInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endDateInvestment",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "originalBuyer",
            type: "address",
          },
          {
            internalType: "bool",
            name: "redeemed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "rewardClaimed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "transferLocked",
            type: "bool",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType: "struct DZNFT.InvestmentData[]",
        name: "nftsDetail",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "isClaimRewardEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddr",
        type: "address",
      },
    ],
    name: "removeWhitelistedContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "whitelistedContracts",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
