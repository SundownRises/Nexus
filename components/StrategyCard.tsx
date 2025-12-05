"use client";

import { TrendingUp, ArrowRight, ChevronDown, ChevronUp, Power } from "lucide-react";
import { useState } from "react";

interface StrategyProps {
    id: string;
    name: string;
    apy: string;
    risk: "Low" | "Medium" | "High";
    description: string;
    enabled: boolean;
    onToggle: (id: string) => void;
}

export default function StrategyCard({ id, name, apy, risk, description, enabled, onToggle }: StrategyProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`glass-panel p-5 rounded-xl border-l-4 transition-all duration-300 ${enabled ? "border-green-500 bg-white/5" : "border-zinc-700 opacity-70 hover:opacity-100"}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-lg text-foreground">{name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${risk === "Low" ? "bg-green-500/20 text-green-400" :
                            risk === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-red-500/20 text-red-400"
                        }`}>
                        {risk} Risk
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-sm text-zinc-500">APY</p>
                    <p className={`text-xl font-bold ${enabled ? "text-green-400" : "text-zinc-500"}`}>{apy}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => onToggle(id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${enabled
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                        }`}
                >
                    <Power className="w-3 h-3" />
                    {enabled ? "Enabled" : "Disabled"}
                </button>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1 transition-colors"
                >
                    {expanded ? "Hide Details" : "Details"}
                    {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-glass-border text-sm text-zinc-400 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p>{description}</p>
                </div>
            )}
        </div>
    );
}
