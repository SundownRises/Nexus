import { ArrowRight } from "lucide-react";

interface ActionCardProps {
    depositAmount: string;
    userBalance: string;
    loading: boolean;
    account: string | null;
    setDepositAmount: (value: string) => void;
    onDeposit: () => void;
}

export default function ActionCard({
    depositAmount,
    userBalance,
    loading,
    account,
    setDepositAmount,
    onDeposit,
}: ActionCardProps) {
    return (
        <div className="p-8 rounded-3xl glass-panel shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <h2 className="text-2xl font-bold mb-6 relative z-10">Deposit Funds</h2>
            <div className="space-y-6 relative z-10">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Amount (USDC)</label>
                    <div className="relative group">
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            placeholder="0.00"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                            Balance: {Number(userBalance).toFixed(2)}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onDeposit}
                    disabled={loading || !account}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                >
                    {loading ? "Processing..." : "Deposit to Vault"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
