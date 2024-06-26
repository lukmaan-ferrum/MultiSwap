require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
const { ethers } = require("ethers");
require('dotenv').config()

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    // hardhat: {
    //   forking: {
    //     url: "https://bsc.meowrpc.com",
    //   }
    // },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY0],
    },
    sepolia: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [process.env.PRIVATE_KEY0]
    },
    mumbai: {
      url: `https://polygon-mumbai-pokt.nodies.app`,
      accounts: [process.env.PRIVATE_KEY0]
    },
    polygon: {
      url: `https://polygon-rpc.com`,
      accounts: [process.env.PRIVATE_KEY0]
    },
    binance: {
      url: "https://nd-049-483-298.p2pify.com/819ef21ecdd17a29a2ed1e856c7980ec",
      accounts: [process.env.PRIVATE_KEY0]
    },
    kava: {
      url: 'https://evm2.kava.io',
      accounts: [process.env.PRIVATE_KEY0]
    },
    AvalancheMainnet: {
      url: 'https://nd-118-315-546.p2pify.com/048dd2e7493f4804ffed70b2acfffe8b/ext/bc/C/rpc',
      accounts: [process.env.PRIVATE_KEY0]
    },
    optimismMainnet: {
      url: 'https://optimism-mainnet.core.chainstack.com/7cb5109bd1c125224315d9b753cc0e45',
      accounts: [process.env.PRIVATE_KEY0]
    },
    ethereum: {
      url: 'https://nd-611-696-948.p2pify.com/8a54d0bc389e645253087fd1a6c5fe3a',
      accounts: [process.env.PRIVATE_KEY0]
    },
    arbitrum: {
      url: 'https://nd-829-997-700.p2pify.com/790712c620e64556719c7c9f19ef56e3',
      accounts: [process.env.PRIVATE_KEY0]
    },
    scroll: {
      url: 'https://scroll-mainnet.core.chainstack.com/26406aa9a6209c7577a5ab1ff15243cd',
      accounts: [process.env.PRIVATE_KEY0]
    },
    zksync: {
      url: 'https://nd-559-202-193.p2pify.com/43eb159adcbe7f31f7f192309025670e',
      accounts: [process.env.PRIVATE_KEY0]
    },
    base: {
      url: 'https://base-mainnet.core.chainstack.com/e7aa01c976c532ebf8e2480a27f18278',
      accounts: [process.env.PRIVATE_KEY0]
    }
  },
  etherscan: {
    // apiKey: process.env.ARBITRUM_API_KEY,
    apiKey: process.env.BINANCE_API_KEY,
    // apiKey: process.env.MUMBAI_API_KEY,
    // apiKey: process.env.AVALANCHE_API_KEY,
    // apiKey: process.env.OPTIMISM_API_KEY,
  },
};