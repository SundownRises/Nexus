"use client";
import { Wallet, Zap, TrendingUp } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ADDRESSES, ABIS } from "../app/constants";

import FeedbackModal from "./FeedbackModal";

interface HeaderProps {
    account: string | null;
    loading: boolean;
    onConnect: () => void;
    onMint: () => void;
}

export default function Header({ account, loading, onConnect, onMint }: HeaderProps) {
    const [maticPrice, setMaticPrice] = useState<string | null>(null);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    useEffect(() => {
        const fetchPrice = async () => {
            if (typeof window !== "undefined" && (window as any).ethereum) {
                try {
                    const provider = new ethers.BrowserProvider((window as any).ethereum);
                    // Check if PriceConsumer address exists (it might not if constants aren't regenerated yet)
                    if (ADDRESSES.PRICE_CONSUMER) {
                        const priceConsumer = new ethers.Contract(ADDRESSES.PRICE_CONSUMER, ABIS.PRICE_CONSUMER, provider);
                        const price = await priceConsumer.getLatestPrice();
                        setMaticPrice((Number(price) / 10 ** 8).toFixed(2));
                    }
                } catch (error) {
                    console.error("Error fetching price:", error);
                }
            }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
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
                        {maticPrice && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-accent-primary/10 rounded-full border border-accent-primary/20">
                                <TrendingUp className="w-4 h-4 text-accent-primary" />
                                <span className="text-sm font-medium text-accent-primary">MATIC: ${maticPrice}</span>
                            </div>
                        )}

                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="text-sm text-zinc-500 hover:text-foreground transition-colors hidden sm:block"
                        >
                            Feedback
                        </button>

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
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </>
    );
}
