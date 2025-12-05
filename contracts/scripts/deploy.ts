import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";
import path from "path";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy AgentRegistry
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    const agentRegistry = await AgentRegistry.deploy();
    await agentRegistry.waitForDeployment();
    const agentRegistryAddress = await agentRegistry.getAddress();
    console.log("AgentRegistry deployed to:", agentRegistryAddress);

    // Deploy Execution
    const Execution = await ethers.getContractFactory("Execution");
    const execution = await Execution.deploy();
    await execution.waitForDeployment();
    const executionAddress = await execution.getAddress();
    console.log("Execution deployed to:", executionAddress);

    // Whitelist Agent (Hardhat Account #1)
    const agentAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    await execution.setAgentStatus(agentAddress, true);
    console.log("Whitelisted agent:", agentAddress);

    // Deploy Vault
    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(executionAddress);
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    console.log("Vault deployed to:", vaultAddress);

    // Deploy Mock Token (for testing)
    const MockToken = await ethers.getContractFactory("MockERC20");
    const token = await MockToken.deploy("Mock USDC", "mUSDC");
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("MockToken deployed to:", tokenAddress);

    // Deploy PriceConsumer (Oracle)
    const PriceConsumer = await ethers.getContractFactory("PriceConsumer");
    const priceConsumer = await PriceConsumer.deploy();
    await priceConsumer.waitForDeployment();
    const priceConsumerAddress = await priceConsumer.getAddress();
    console.log("PriceConsumer deployed to:", priceConsumerAddress);

    // Save addresses to agent config
    const configPath = path.join(process.cwd(), "../agent/config.json");
    const config = {
        agentRegistry: agentRegistryAddress,
        execution: executionAddress,
        vault: vaultAddress,
        token: tokenAddress,
        priceConsumer: priceConsumerAddress,
        rpcUrl: "http://127.0.0.1:8545"
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("Config saved to:", configPath);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
