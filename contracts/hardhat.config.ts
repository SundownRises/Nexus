import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
    },
  },
};

export default config;
