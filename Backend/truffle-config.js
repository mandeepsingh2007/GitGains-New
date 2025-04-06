require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

module.exports = {
  networks: {
    mumbai: {
      provider: () =>
        new HDWalletProvider(
          PRIVATE_KEY,
          `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    polygon: {
      provider: () =>
        new HDWalletProvider(
          PRIVATE_KEY,
          `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
        ),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false,
    },
  },
  compilers: {
    solc: {
      version: "0.8.28", // Match Solidity version
    },
  },
};
