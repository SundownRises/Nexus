"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ADDRESSES, ABIS } from "./constants";
import { Activity, Shield, TrendingUp } from "lucide-react";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import ActionCard from "../components/ActionCard";
import ActivityLog from "../components/ActivityLog";
import HowItWorks from "../components/HowItWorks";
import RiskControls from "../components/RiskControls";
import StrategyCard from "../components/StrategyCard";
import { useToast } from "../components/ToastProvider";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [vaultBalance, setVaultBalance] = useState("0");
  const [userBalance, setUserBalance] = useState("0");
  const [agentStatus, setAgentStatus] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { showToast } = useToast();

  // Strategy State
  const [strategies, setStrategies] = useState([
    {
      id: "quickswap",
      name: "QuickSwap Yield",
      apy: "12.5%",
      risk: "Low" as const,
      description: "Provides liquidity to QuickSwap USDC/ETH pools to earn trading fees. Auto-compounds rewards daily.",
      enabled: true,
    },
    {
      id: "arbitrage",
      name: "Cross-DEX Arbitrage",
      apy: "Variable",
      risk: "Medium" as const,
      description: "Monitors price discrepancies between QuickSwap and SushiSwap. Executes atomic swaps when spread > 1%.",
      enabled: true,
    },
    {
      id: "aave",
      name: "Aave Health Monitor",
      apy: "Safety",
      risk: "Low" as const,
      description: "Monitors your Aave V3 health factor. Automatically deposits collateral from Vault if HF drops below 1.1.",
      enabled: true,
    },
  ]);

  const handleStrategyToggle = (id: string) => {
    setStrategies(prev => prev.map(s => {
      if (s.id === id) {
        const newState = !s.enabled;
        showToast(`${s.name} ${newState ? "Enabled" : "Disabled"}`, newState ? "success" : "info");
        return { ...s, enabled: newState };
      }
      return s;
    }));
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });

        // Network Switching Logic
        const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
        const targetChainId = "0x7a69"; // 31337

        if (chainId !== targetChainId) {
          try {
            await (window as any).ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: targetChainId }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await (window as any).ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: targetChainId,
                      chainName: "Nexus Localhost",
                      rpcUrls: ["http://127.0.0.1:8545"],
                      nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18,
                      },
                    },
                  ],
                });
              } catch (addError) {
                console.error("Failed to add network:", addError);
                showToast("Failed to add network", "error");
                return;
              }
            } else {
              console.error("Failed to switch network:", switchError);
              showToast("Failed to switch network", "error");
              return;
            }
          }
        }

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        setProvider(provider);
        showToast("Wallet connected successfully!", "success");
      } catch (error) {
        console.error(error);
        showToast("Failed to connect wallet", "error");
      }
    } else {
      showToast("Please install MetaMask!", "error");
    }
  };

  const fetchData = async () => {
    if (!provider || !account) return;
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(ADDRESSES.TOKEN, ABIS.TOKEN, signer);
      const executionContract = new ethers.Contract(ADDRESSES.EXECUTION, ABIS.EXECUTION, signer);

      // Get Balances
      const vBalance = await tokenContract.balanceOf(ADDRESSES.VAULT);
      setVaultBalance(ethers.formatUnits(vBalance, 18));

      const uBalance = await tokenContract.balanceOf(account);
      setUserBalance(ethers.formatUnits(uBalance, 18));

      // Get Agent Status (Hardcoded agent address from deploy script)
      const agentAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      const status = await executionContract.whitelistedAgents(agentAddress);
      setAgentStatus(status);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (provider && account) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [provider, account]);

  const handleDeposit = async () => {
    if (!depositAmount || !provider) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(ADDRESSES.TOKEN, ABIS.TOKEN, signer);
      const vaultContract = new ethers.Contract(ADDRESSES.VAULT, ABIS.VAULT, signer);
      const amount = ethers.parseUnits(depositAmount, 18);

      // Approve
      addLog("Approving tokens...");
      showToast("Approving tokens...", "info");
      const tx1 = await tokenContract.approve(ADDRESSES.VAULT, amount);
      await tx1.wait();
      addLog("Approval confirmed.");
      showToast("Approval confirmed!", "success");

      // Deposit
      addLog("Depositing into Vault...");
      showToast("Depositing into Vault...", "info");
      const tx2 = await vaultContract.deposit(ADDRESSES.TOKEN, amount);
      await tx2.wait();
      addLog("Deposit successful!");
      showToast("Deposit successful!", "success");

      setDepositAmount("");
      fetchData();
    } catch (error: any) {
      console.error(error);
      const msg = error.reason || error.message || "Transaction failed";
      addLog(`Error: ${msg.slice(0, 50)}...`);
      showToast("Transaction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async () => {
    if (!provider || !account) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(ADDRESSES.TOKEN, ABIS.TOKEN, signer);
      addLog("Minting 1000 USDC...");
      showToast("Minting 1000 USDC...", "info");
      const tx = await tokenContract.mint(account, ethers.parseUnits("1000", 18));
      await tx.wait();
      addLog("Minted 1000 USDC!");
      showToast("Minted 1000 USDC successfully!", "success");
      fetchData();
    } catch (error: any) {
      console.error(error);
      addLog("Mint failed.");
      showToast("Mint failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev]);
  };

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-purple-500/30">
      <Header
        account={account}
        loading={loading}
        onConnect={connectWallet}
        onMint={handleMint}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40 tracking-tight">
            Autonomous DeFi Intelligence
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Deploy capital into an AI-managed vault. Our off-chain agents monitor market conditions 24/7
            and execute strategies with cryptographic verification.
          </p>
        </div>

        <HowItWorks />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Stats & Agent */}
          <div className="space-y-8">
            <StatsCard
              title="Agent Status"
              icon={Activity}
              iconColor="text-green-500"
              iconBg="bg-green-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${agentStatus ? 'bg-green-500' : 'bg-red-500'}`} />
                  {agentStatus && <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />}
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  {agentStatus ? "Active & Monitoring" : "Inactive"}
                </span>
              </div>
              <div className="h-px bg-glass-border my-6" />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Target Strategy</p>
                  <p className="text-lg font-medium">QuickSwap Yield</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Trigger Condition</p>
                  <p className="text-lg font-medium font-mono">APY &gt; 15%</p>
                </div>
              </div>
            </StatsCard>

            <StatsCard
              title="Vault Overview"
              icon={Shield}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
            >
              <p className="text-4xl font-bold tracking-tight">
                ${Number(vaultBalance).toFixed(2)}
                <span className="text-xl text-zinc-500 font-normal ml-2">USDC</span>
              </p>
            </StatsCard>

            {/* Active Strategies */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-primary" />
                Active Strategies
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {strategies.map(strategy => (
                  <StrategyCard
                    key={strategy.id}
                    {...strategy}
                    onToggle={handleStrategyToggle}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-8">
            <ActionCard
              depositAmount={depositAmount}
              userBalance={userBalance}
              loading={loading}
              account={account}
              setDepositAmount={setDepositAmount}
              onDeposit={handleDeposit}
            />
            <RiskControls />
            <ActivityLog logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
}
