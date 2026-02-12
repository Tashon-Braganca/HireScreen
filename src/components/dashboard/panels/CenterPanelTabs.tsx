"use client";

import React from "react";
import { useJobContext } from "../JobContext";
import { cn } from "@/lib/utils";
import { X, FileText } from "lucide-react";

export function CenterPanelTabs() {
    const { activeTab, setActiveTab, closeResumeTab, openResumeTabs, documents } = useJobContext();

    // Get display name for a resume tab
    const getTabName = (docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (doc) {
            return doc.candidate_name || doc.filename.replace(/\.pdf$/i, "");
        }
        return "Resume";
    };

    return (
        <div className="flex items-center border-b border-border bg-panel px-1 pt-1.5 gap-0.5 overflow-x-auto no-scrollbar">
            {/* Ranked Results — always visible */}
            <button
                onClick={() => setActiveTab("ranked")}
                className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-t border-t border-l border-r border-transparent transition-colors flex-shrink-0",
                    activeTab === "ranked"
                        ? "bg-bg text-ink border-border"
                        : "text-muted hover:text-ink hover:bg-paper/50"
                )}
            >
                Ranked Results
            </button>

            {/* Compare — always visible */}
            <button
                onClick={() => setActiveTab("compare")}
                className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-t border-t border-l border-r border-transparent transition-colors flex-shrink-0",
                    activeTab === "compare"
                        ? "bg-bg text-ink border-border"
                        : "text-muted hover:text-ink hover:bg-paper/50"
                )}
            >
                Compare
            </button>

            {/* Dynamic PDF tabs */}
            {openResumeTabs.map((docId) => {
                const tabId = `pdf-${docId}`;
                const isActive = activeTab === tabId;

                return (
                    <div
                        key={docId}
                        onClick={() => setActiveTab(tabId)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t border-t border-l border-r border-transparent transition-colors cursor-pointer flex-shrink-0 max-w-[160px]",
                            isActive
                                ? "bg-bg text-ink border-border"
                                : "text-muted hover:text-ink hover:bg-paper/50"
                        )}
                    >
                        <FileText size={11} className="flex-shrink-0" />
                        <span className="truncate">{getTabName(docId)}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeResumeTab(docId);
                            }}
                            className="text-muted hover:text-ink flex-shrink-0 ml-0.5"
                        >
                            <X size={11} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
