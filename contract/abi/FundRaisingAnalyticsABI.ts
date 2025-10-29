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
    name: "getInvestorDetail",
    outputs: [
      {
        internalType: "uint256[]",
        name: "roundIds",
        type: "uint256[]",
      },
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
        internalType: "struct FundRaisingAnalytics.InvestmentRound[]",
        name: "rounds",
        type: "tuple[]",
      },
      {
        internalType: "uint256[][]",
        name: "nfts",
        type: "uint256[][]",
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
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserInvestments",
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
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserNFTsInRound",
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
] as const;
