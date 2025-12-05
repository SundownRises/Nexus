import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    children: React.ReactNode;
}

export default function StatsCard({ title, icon: Icon, iconColor, iconBg, children }: StatsCardProps) {
    return (
        <div className="p-8 rounded-3xl glass-panel relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`p-3 ${iconBg} rounded-2xl`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div>
                    <h2 className="text-lg font-medium text-zinc-400">{title}</h2>
                    {children}
                </div>
            </div>
        </div>
    );
}
