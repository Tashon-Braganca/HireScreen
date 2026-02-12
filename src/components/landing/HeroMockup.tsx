"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, FileText } from "lucide-react";

const candidates = [
    { initials: "JD", name: "John Doe", role: "Ex-Google · Senior Dev", score: 95 },
    { initials: "AS", name: "Alice Smith", role: "Full Stack Eng", score: 91 },
    { initials: "MK", name: "Mike K.", role: "Frontend Dev", score: 87 },
];

const searchQueries = [
    '"Find candidates with 3+ yrs Next.js..."',
    '"Who has startup experience in SF?"',
    '"React + TypeScript senior engineers"',
    '"ML experience with Python + AWS"',
];

export function HeroMockup() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [queryIndex, setQueryIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % candidates.length);
            setQueryIndex((prev) => (prev + 1) % searchQueries.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm-custom rounded-xl p-6 max-w-md mx-auto relative z-10 top-4">
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 bg-[var(--panel)] rounded-lg flex items-center justify-center text-[var(--muted)] border border-[var(--border)]">
                    <FileText size={20} />
                </div>
                <div>
                    <div className="font-semibold text-[var(--text)] text-sm">Senior React Developer</div>
                    <div className="text-xs text-[var(--muted)]">24 Candidates · 8 Matches</div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {candidates.map((c, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all duration-500",
                            i === activeIndex
                                ? "bg-[var(--accent-light)] border-[var(--accent)]/30 scale-[1.02]"
                                : "bg-[var(--panel)] border-[var(--border)] opacity-60"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors duration-500",
                            i === activeIndex ? "bg-[var(--accent)] text-white" : "bg-[var(--border)] text-[var(--muted)]"
                        )}>
                            {c.initials}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-[var(--text)]">{c.name}</div>
                            <div className="text-[10px] text-[var(--muted)]">{c.role}</div>
                        </div>
                        <div className={cn(
                            "text-sm font-bold px-2 py-0.5 rounded transition-colors duration-500",
                            i === activeIndex ? "text-[var(--accent)]" : "text-[var(--muted)]"
                        )}>
                            {c.score}%
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-[var(--muted)] bg-[var(--panel)] p-3 rounded border border-[var(--border)]">
                <Search size={14} />
                <span className="opacity-70 transition-opacity duration-500" key={queryIndex}>
                    {searchQueries[queryIndex]}
                </span>
            </div>
        </div>
    );
}
