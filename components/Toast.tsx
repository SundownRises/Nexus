"use client";

import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
}

export default function Toast({ id, message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger slide-in animation
        requestAnimationFrame(() => setIsVisible(true));

        // Auto-dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300); // Wait for fade-out
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const borders = {
        success: "border-green-500/50",
        error: "border-red-500/50",
        info: "border-blue-500/50",
    };

    return (
        <div
            className={`
        flex items-center gap-3 p-4 rounded-xl glass-panel border-l-4 shadow-lg backdrop-blur-md
        transition-all duration-300 ease-out transform
        ${borders[type]}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
            role="alert"
        >
            {icons[type]}
            <p className="text-sm font-medium text-foreground">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onClose(id), 300);
                }}
                className="ml-auto p-1 hover:bg-white/10 rounded-full transition-colors"
            >
                <X className="w-4 h-4 text-zinc-400" />
            </button>
        </div>
    );
}
