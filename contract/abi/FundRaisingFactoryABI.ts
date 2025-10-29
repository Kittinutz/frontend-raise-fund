export default [
  {
    inputs: [],
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
        internalType: "address",
        name: "coreContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "DeploymentStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "coreContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "analyticsContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "adminContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dzNFT",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "usdtToken",
        type: "address",
      },
    ],
    name: "FundRaisingDeployed",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allDeployments",
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
        name: "dzNFT",
        type: "address",
      },
      {
        internalType: "address",
        name: "usdtToken",
        type: "address",
      },
    ],
    name: "deployFundRaising",
    outputs: [
      {
        internalType: "address",
        name: "coreContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "analyticsContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "adminContract",
        type: "address",
      },
    ],
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
    name: "deployments",
    outputs: [
      {
        internalType: "address",
        name: "coreContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "analyticsContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "adminContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deployedAt",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveDeploymentsCount",
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
        name: "coreContract",
        type: "address",
      },
    ],
    name: "getDeploymentInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "coreContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "analyticsContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "adminContract",
            type: "address",
          },
          {
            internalType: "address",
            name: "deployer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deployedAt",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct FundRaisingFactory.DeploymentInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeploymentStats",
    outputs: [
      {
        internalType: "uint256",
        name: "totalDeployments",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "activeDeployments",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deploymentsFunded",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "recentDeployments",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "deployer",
        type: "address",
      },
    ],
    name: "getDeploymentsByDeployer",
    outputs: [
      {
        internalType: "address[]",
        name: "coreContracts",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalDeployments",
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
        name: "coreContract",
        type: "address",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "setDeploymentStatus",
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
] as const;
