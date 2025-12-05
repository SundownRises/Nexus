"use client";
import { useState } from "react";
import { X, MessageSquare, Send } from "lucide-react";
import { useToast } from "./ToastProvider";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [feedback, setFeedback] = useState("");
    const { showToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send data to a backend
        console.log("Feedback submitted:", feedback);
        showToast("Feedback submitted! Thank you.", "success");
        setFeedback("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background border border-glass-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-accent-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Share Feedback</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Your thoughts help us build Nexus.
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what you think..."
                            className="w-full h-32 bg-zinc-900/50 border border-glass-border rounded-xl p-4 text-foreground focus:outline-none focus:border-accent-primary transition-colors resize-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
}
