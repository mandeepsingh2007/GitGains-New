require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC, SEPOLIA_RPC_URL } = process.env;

if (!MNEMONIC || !SEPOLIA_RPC_URL) {
  throw new Error("⚠️  Missing MNEMONIC or SEPOLIA_RPC_URL in .env file");
}

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: SEPOLIA_RPC_URL,
          pollingInterval: 10000, // ↓ Add polling interval to reduce request spam (10s)
        }),
      network_id: 11155111,     // Sepolia chain ID
      gas: 5500000,             // Gas limit
      confirmations: 2,         // Wait for 2 confirmations
      timeoutBlocks: 300,       // Increased timeout blocks
      skipDryRun: true,         // Skip dry run before migrations
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
    },
  },
};
