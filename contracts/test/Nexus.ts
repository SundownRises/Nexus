import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Nexus Protocol", function () {
    async function deployFixture() {
        const [owner, user, agent, otherAccount] = await ethers.getSigners();

        // Deploy AgentRegistry
        const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
        const agentRegistry = await AgentRegistry.deploy();

        // Deploy Execution
        const Execution = await ethers.getContractFactory("Execution");
        const execution = await Execution.deploy();

        // Deploy Vault
        const Vault = await ethers.getContractFactory("Vault");
        const vault = await Vault.deploy(await execution.getAddress());

        // Deploy Mock Token
        const MockToken = await ethers.getContractFactory("MockERC20"); // We need to create this
        const token = await MockToken.deploy("Mock USDC", "mUSDC");

        return { agentRegistry, execution, vault, token, owner, user, agent, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { vault, owner } = await loadFixture(deployFixture);
            expect(await vault.owner()).to.equal(owner.address);
        });
    });

    describe("Vault & Execution", function () {
        it("Should allow user to deposit funds", async function () {
            const { vault, token, user } = await loadFixture(deployFixture);

            // Mint tokens to user
            await token.mint(user.address, ethers.parseUnits("1000", 18));

            // Approve vault
            await token.connect(user).approve(await vault.getAddress(), ethers.parseUnits("1000", 18));

            // Deposit
            await vault.connect(user).deposit(await token.getAddress(), ethers.parseUnits("500", 18));

            expect(await token.balanceOf(await vault.getAddress())).to.equal(ethers.parseUnits("500", 18));
        });

        it("Should allow whitelisted agent to execute strategy", async function () {
            const { vault, execution, token, user, agent, otherAccount, owner } = await loadFixture(deployFixture);

            // Setup: User deposits 1000
            await token.mint(user.address, ethers.parseUnits("1000", 18));
            await token.connect(user).approve(await vault.getAddress(), ethers.parseUnits("1000", 18));
            await vault.connect(user).deposit(await token.getAddress(), ethers.parseUnits("1000", 18));

            // Whitelist agent
            await execution.connect(owner).setAgentStatus(agent.address, true);

            // Prepare data: Vault transfers 100 tokens to otherAccount
            // We are encoding the function call `transfer(address,uint256)` on the Token contract
            const transferData = token.interface.encodeFunctionData("transfer", [
                otherAccount.address,
                ethers.parseUnits("100", 18)
            ]);

            // Agent triggers execution
            // execution.executeStrategy(vault, target, data)
            // target is the token contract (we are calling transfer on it)
            await execution.connect(agent).executeStrategy(
                await vault.getAddress(),
                await token.getAddress(),
                transferData
            );

            // Verify balances
            expect(await token.balanceOf(otherAccount.address)).to.equal(ethers.parseUnits("100", 18));
            expect(await token.balanceOf(await vault.getAddress())).to.equal(ethers.parseUnits("900", 18));
        });

        it("Should fail if non-agent tries to execute", async function () {
            const { vault, execution, token, user, otherAccount } = await loadFixture(deployFixture);

            const transferData = token.interface.encodeFunctionData("transfer", [
                otherAccount.address,
                ethers.parseUnits("100", 18)
            ]);

            await expect(
                execution.connect(user).executeStrategy(
                    await vault.getAddress(),
                    await token.getAddress(),
                    transferData
                )
            ).to.be.revertedWith("Caller is not a whitelisted agent");
        });
    });
});
