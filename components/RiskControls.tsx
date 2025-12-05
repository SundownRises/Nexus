"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";
import { useToast } from "./ToastProvider";

export default function RiskControls() {
    const [maxAllocation, setMaxAllocation] = useState("20");
    const [maxSlippage, setMaxSlippage] = useState("0.5");
    const { showToast } = useToast();

    const handleSave = () => {
        // In a real app, this would write to the smart contract
        showToast("Risk parameters updated on-chain!", "success");
    };

    return (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Risk Controls</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-2">
                        Max Vault Allocation (%)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={maxAllocation}
                            onChange={(e) => setMaxAllocation(e.target.value)}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <span className="text-lg font-bold w-12 text-right">{maxAllocation}%</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-2">
                        Max Slippage Tolerance (%)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            step="0.1"
                            value={maxSlippage}
                            onChange={(e) => setMaxSlippage(e.target.value)}
                            className="bg-black/20 border border-glass-border rounded-lg px-4 py-2 w-full text-foreground focus:outline-none focus:border-orange-500/50"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all active:scale-95"
                >
                    <Save className="w-4 h-4" />
                    Update Parameters
                </button>
            </div>
        </div>
    );
}
