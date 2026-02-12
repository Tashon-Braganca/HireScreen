"use client";

import React from "react";
import { useJobContext } from "../JobContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function CenterPanelTabs() {
    const { activeTab, setActiveTab, closeResumeTab } = useJobContext();

    // We can infer open resumes from activeTab or have a separate state.
    // For now, if activeTab is 'pdf-ID', we show a tab for it.
    // Ideally we track *list* of open resumes.
    // But the Plan said "Tab System... Ranked, Compare, Resumes".
    // MVP: Just Ranked, Compare, and *Current* Resume if active.

    return (
        <div className="flex items-center border-b border-border bg-panel px-2 pt-2 gap-1 overflow-x-auto no-scrollbar">
            <button
                onClick={() => setActiveTab("ranked")}
                className={cn(
                    "px-4 py-2 text-xs font-medium rounded-t-lg border-t border-l border-r border-transparent transition-colors",
                    activeTab === "ranked"
                        ? "bg-bg text-ink border-border"
                        : "text-muted hover:text-ink hover:bg-paper/50"
                )}
            >
                Ranked Candidates
            </button>
            <button
                onClick={() => setActiveTab("compare")}
                className={cn(
                    "px-4 py-2 text-xs font-medium rounded-t-lg border-t border-l border-r border-transparent transition-colors",
                    activeTab === "compare"
                        ? "bg-bg text-ink border-border"
                        : "text-muted hover:text-ink hover:bg-paper/50"
                )}
            >
                Compare
            </button>

            {/* Resume Tab (Dynamic) */}
            {activeTab.startsWith("pdf-") && (
                <div
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg border-t border-l border-r border-border bg-bg text-ink"
                    )}
                >
                    <span>Resume Preview</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const id = activeTab.replace("pdf-", "");
                            closeResumeTab(id);
                        }}
                        className="text-muted hover:text-ink"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}
