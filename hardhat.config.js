require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: "https://polygon-rpc.com",
      },
      chainId: 137,
    }
  }
};

