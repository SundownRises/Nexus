import { Banknote, Bot, Cpu } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: Banknote,
            title: "1. Capital Injection",
            desc: "Deposit USDC into your personal Vault. Your funds are held securely on-chain, accessible only by you and the whitelisted execution contract.",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            icon: Bot,
            title: "2. AI Surveillance",
            desc: "Our off-chain Agent Zero continuously monitors DeFi markets for high-yield opportunities (APY > 15%) using real-time data feeds.",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            icon: Cpu,
            title: "3. Autonomous Execution",
            desc: "When a strategy is found, the Agent cryptographically signs a transaction. The Execution contract verifies the signature and moves your funds instantly.",
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
    ];

    return (
        <section className="mb-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                    Nexus bridges the gap between secure on-chain custody and intelligent off-chain decision making.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, i) => (
                    <div key={i} className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <step.icon className={`w-7 h-7 ${step.color}`} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
