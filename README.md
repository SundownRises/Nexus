c# Nexus: AI-Powered On-Chain Agent Protocol

Nexus is a decentralized protocol that enables **AI Agents** to autonomously manage on-chain assets. It allows users to deposit funds into a non-custodial Vault, which are then managed by whitelisted "Strategist" agents based on off-chain data and logic.

![Nexus UI](https://via.placeholder.com/800x400?text=Nexus+Protocol+Dashboard)

## 🚀 Features

*   **Non-Custodial Vaults**: Users retain ownership of their funds while granting execution permissions to specific agents.
*   **AI "Strategist" Agents**: Off-chain Python agents that monitor market conditions (e.g., DEX APY) and trigger on-chain transactions.
*   **Secure Execution Layer**: An on-chain `Execution` contract that verifies agent permissions before interacting with the Vault.
*   **Modern Dashboard**: A Next.js frontend for seamless user interaction (Wallet connection, Deposits, Real-time monitoring).

## 🛠 Tech Stack

*   **Smart Contracts**: Solidity, Hardhat, OpenZeppelin (Polygon Network).
*   **Agent**: Python, Web3.py (Off-chain logic).
*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Ethers.js v6.

## 📂 Project Structure

```bash
nexus/
├── agent/              # Python AI Agent script
│   ├── agent_zero.py   # Main agent logic (monitors APY)
│   └── config.json     # Deployed contract addresses
├── app/                # Next.js Frontend
│   ├── page.tsx        # Main dashboard UI
│   └── constants.ts    # Contract ABIs and Addresses
├── contracts/          # Hardhat Project
│   ├── contracts/      # Solidity Smart Contracts (Vault, Execution, Registry)
│   └── scripts/        # Deployment scripts
└── start_nexus.ps1     # One-click startup script (Windows)
```

## 🏁 Getting Started

### Prerequisites

*   **Node.js** (v18+)
*   **Python** (v3.10+)
*   **MetaMask** (Browser Extension)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/nexus.git
    cd nexus
    ```

2.  Install Dependencies:
    ```bash
    # Frontend
    npm install

    # Contracts
    cd contracts
    npm install
    cd ..

    # Agent
    cd agent
    pip install -r requirements.txt
    cd ..
    ```

## ⚡ Quick Start (Windows)

We have provided a PowerShell script to spin up the entire environment (Blockchain Node, Agent, and Frontend) in one go.

1.  Run the startup script:
    ```powershell
    .\start_nexus.ps1
    ```
    *This will open 3 separate terminal windows.*

2.  **Configure MetaMask**:
    *   Add a new network: **Localhost 8545**
    *   RPC URL: `http://127.0.0.1:8545`
    *   Chain ID: `31337`
    *   Currency Symbol: `ETH`
    *   Import a test account using a private key from the "Hardhat Node" terminal window (e.g., Account #2).

3.  **Open the App**:
    *   Go to `http://localhost:3000`

## 📖 Usage Guide

1.  **Get Funds**:
    *   Click the **"Mint 1000 USDC"** button in the top right to get test tokens.
2.  **Deposit**:
    *   Enter an amount (e.g., `100`) in the "Deposit Funds" section.
    *   Click **"Deposit to Vault"**. This approves the Vault and deposits the tokens.
3.  **Watch the Agent**:
    *   The Agent script (running in the background) monitors the "QuickSwap APY".
    *   If the simulated APY crosses **15%**, the Agent will automatically trigger a transaction.
    *   You will see the **"Agent Status"** on the dashboard and logs in the "Recent Activity" section.

## 📜 Smart Contracts

*   **`AgentRegistry.sol`**: Factory contract for deploying/registering new Strategist NFTs.
*   **`Vault.sol`**: Holds user funds. `deposit()` / `withdraw()`. Only allows the `Execution` contract to call `executeTransaction()`.
*   **`Execution.sol`**: Whitelists agents and routes their transaction requests to the appropriate Vault.

## 📄 License

MIT
