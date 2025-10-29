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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "EmergencyRoundWithdrawal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "EmergencyWithdrawal",
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
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum IFundRaisingStorage.Status",
        name: "status",
        type: "uint8",
      },
    ],
    name: "StatusUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "roundIds",
        type: "uint256[]",
      },
      {
        internalType: "bool[]",
        name: "activeStates",
        type: "bool[]",
      },
    ],
    name: "batchSetRoundActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "roundIds",
        type: "uint256[]",
      },
      {
        internalType: "enum IFundRaisingStorage.Status[]",
        name: "statuses",
        type: "uint8[]",
      },
    ],
    name: "batchUpdateStatus",
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
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "emergencyWithdrawAllFromRound",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "emergencyWithdrawFromRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAdminStats",
    outputs: [
      {
        internalType: "uint256",
        name: "totalRounds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalUSDTRaised",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "contractBalance",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "usdtTokenAddress",
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
    name: "getRoundFinancialSummary",
    outputs: [
      {
        internalType: "uint256",
        name: "totalInvestment",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardPool",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "remainingBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalNFTs",
        type: "uint256",
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
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        internalType: "enum IFundRaisingStorage.Status",
        name: "status",
        type: "uint8",
      },
    ],
    name: "updateStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
