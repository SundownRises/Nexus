interface ActivityLogProps {
    logs: string[];
}

export default function ActivityLog({ logs }: ActivityLogProps) {
    if (logs.length === 0) return null;

    return (
        <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {logs.map((log, i) => (
                    <div key={i} className="text-sm text-zinc-300 flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <span className="font-mono">{log}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
