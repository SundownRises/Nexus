"use client";
import { Wallet, Zap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
    account: string | null;
    loading: boolean;
    onConnect: () => void;
    onMint: () => void;
}

export default function Header({ account, loading, onConnect, onMint }: HeaderProps) {
    return (
        <header className="border-b border-glass-border backdrop-blur-md sticky top-0 z-50 bg-background/50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                        Nexus
                    </span>
                </div>
                <div className="flex gap-4 items-center">
                    <ThemeToggle />
                    {account && (
                        <button
                            onClick={onMint}
                            disabled={loading}
                            className="glass-button px-4 py-2 text-foreground rounded-full text-sm font-medium hover:bg-accent-primary/10 transition-all disabled:opacity-50"
                        >
                            Mint 1000 USDC
                        </button>
                    )}
                    <button
                        onClick={onConnect}
                        className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all active:scale-95 shadow-lg"
                    >
                        <Wallet className="w-4 h-4" />
                        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
                    </button>
                </div>
            </div>
        </header>
    );
}
