"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ADDRESSES, ABIS } from "./constants";
import { Wallet, ArrowRight, Activity, Shield, Zap } from "lucide-react";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [vaultBalance, setVaultBalance] = useState("0");
  const [userBalance, setUserBalance] = useState("0");
  const [agentStatus, setAgentStatus] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        setProvider(provider);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchData = async () => {
    if (!provider || !account) return;
    try {
      const signer = await provider.getSigner();
      const vaultContract = new ethers.Contract(ADDRESSES.VAULT, ABIS.VAULT, signer);
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
      const tx1 = await tokenContract.approve(ADDRESSES.VAULT, amount);
      await tx1.wait();
      addLog("Approval confirmed.");

      // Deposit
      addLog("Depositing into Vault...");
      const tx2 = await vaultContract.deposit(ADDRESSES.TOKEN, amount);
      await tx2.wait();
      addLog("Deposit successful!");

      setDepositAmount("");
      fetchData();
    } catch (error: any) {
      console.error(error);
      // Extract readable error message if possible
      const msg = error.reason || error.message || "Transaction failed";
      addLog(`Error: ${msg.slice(0, 50)}...`);
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
      const tx = await tokenContract.mint(account, ethers.parseUnits("1000", 18));
      await tx.wait();
      addLog("Minted 1000 USDC!");
      fetchData();
    } catch (error: any) {
      console.error(error);
      addLog("Mint failed.");
    } finally {
      setLoading(false);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Nexus</span>
          </div>
          <div className="flex gap-4">
            {account && (
              <button
                onClick={handleMint}
                disabled={loading}
                className="px-4 py-2 bg-zinc-800 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-all"
              >
                Mint 1000 USDC
              </button>
            )}
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Stats & Agent */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500/10 rounded-2xl">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-zinc-400">Agent Status</h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agentStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-2xl font-bold text-white">{agentStatus ? "Active & Monitoring" : "Inactive"}</span>
                  </div>
                </div>
              </div>
              <div className="h-px bg-white/5 my-6" />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Target Strategy</p>
                  <p className="text-lg font-medium text-white">QuickSwap Yield</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Trigger Condition</p>
                  <p className="text-lg font-medium text-white">APY &gt; 15%</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-zinc-400">Vault Overview</h2>
                  <p className="text-3xl font-bold text-white">${Number(vaultBalance).toFixed(2)} <span className="text-lg text-zinc-500 font-normal">USDC</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Amount (USDC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="0.00"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                      Balance: {Number(userBalance).toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={loading || !account}
                  className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : "Deposit to Vault"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>

              {logs.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-medium text-zinc-500 mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {logs.slice(0, 3).map((log, i) => (
                      <div key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
