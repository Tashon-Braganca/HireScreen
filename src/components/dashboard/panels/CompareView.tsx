"use client";

import React, { useState } from "react";
import { useJobContext } from "../JobContext";
import { cn } from "@/lib/utils";
import { Bookmark, FileText, StickyNote, BarChart3, Layers, X, AlertTriangle, Github, Globe, LayoutGrid, Table } from "lucide-react";

type CompareSubTab = "summary" | "criteria" | "evidence" | "notes";
type ViewMode = "cards" | "table";

export function CompareView() {
    const { compareIds, rankedCandidates, clearCompare, evidenceBookmarks, toggleBookmark } = useJobContext();
    const [subTab, setSubTab] = useState<CompareSubTab>("summary");
    const [viewMode, setViewMode] = useState<ViewMode>("cards");

    const selectedCandidates = rankedCandidates.filter(c => compareIds.has(c.documentId));

    if (selectedCandidates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted p-8 text-center">
                <div className="w-14 h-14 rounded-lg border border-border flex items-center justify-center mb-4">
                    <Layers size={24} />
                </div>
                <p className="text-sm font-medium text-ink mb-1">Select candidates to compare</p>
                <p className="text-xs">Check the box on candidate cards to add them here.</p>
            </div>
        );
    }

    const subTabs: { key: CompareSubTab; label: string; icon: React.ElementType }[] = [
        { key: "summary", label: "Summary", icon: BarChart3 },
        { key: "criteria", label: "Criteria", icon: Layers },
        { key: "evidence", label: "Evidence", icon: FileText },
        { key: "notes", label: "Notes", icon: StickyNote },
    ];

    function extractLinks(matchReasons: Array<{ reason: string }>): { github?: string; portfolio?: string } {
        const result: { github?: string; portfolio?: string } = {};
        const text = matchReasons.map(r => r.reason).join(" ");
        const githubMatch = text.match(/github\.com\/[^\s,\)]+/i);
        const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s,\)]*)?/gi);
        if (githubMatch) result.github = githubMatch[0];
        if (portfolioMatch) {
            const filtered = portfolioMatch.filter(url => !url.includes('github.com'));
            if (filtered.length > 0) result.portfolio = filtered[0];
        }
        return result;
    }

    function getScoreColor(score: number): string {
        if (score > 80) return "text-green-600";
        if (score >= 60) return "text-amber-600";
        return "text-red-600";
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="px-4 pt-3 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-ink">
                        Compare ({selectedCandidates.length})
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded border border-border overflow-hidden">
                            <button
                                onClick={() => setViewMode("cards")}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-medium flex items-center gap-1 transition-colors",
                                    viewMode === "cards"
                                        ? "bg-accent text-white"
                                        : "bg-paper text-muted hover:text-ink"
                                )}
                            >
                                <LayoutGrid size={10} />
                                Cards
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-medium flex items-center gap-1 transition-colors",
                                    viewMode === "table"
                                        ? "bg-accent text-white"
                                        : "bg-paper text-muted hover:text-ink"
                                )}
                            >
                                <Table size={10} />
                                Table
                            </button>
                        </div>
                        <button
                            onClick={clearCompare}
                            className="text-[10px] font-medium text-muted hover:text-ink transition-colors flex items-center gap-1"
                        >
                            <X size={10} />
                            Clear
                        </button>
                    </div>
                </div>
                <div className="flex gap-1 border-b border-border pb-0.5">
                    {subTabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setSubTab(t.key)}
                            className={cn(
                                "px-3 py-1.5 text-[11px] font-medium rounded-t border-b-2 transition-colors flex items-center gap-1.5",
                                subTab === t.key
                                    ? "border-accent text-accent"
                                    : "border-transparent text-muted hover:text-ink"
                            )}
                        >
                            <t.icon size={12} />
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {subTab === "summary" && viewMode === "cards" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedCandidates.map(c => {
                            const links = extractLinks(c.matchReasons);
                            return (
                                <div key={c.documentId} className="border border-border rounded-lg p-4 bg-panel animate-stagger-in">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={cn(
                                            "w-7 h-7 rounded flex items-center justify-center text-xs font-bold",
                                            c.rank <= 3 ? "bg-ink text-white" : "bg-border text-muted"
                                        )}>
                                            {c.rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-ink text-sm truncate">{c.name}</h3>
                                            <div className="text-[10px] text-muted">{c.score}%</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-border rounded-full mb-3 overflow-hidden">
                                        <div className="h-full bg-accent rounded-full animate-progress-fill" style={{ width: `${c.score}%` }} />
                                    </div>
                                    <div className="space-y-1.5 mb-3">
                                        <p className="text-[10px] font-medium text-muted uppercase tracking-wider">Strengths</p>
                                        {c.matchReasons.slice(0, 4).map((r, i) => (
                                            <div key={i} className="flex items-start gap-1.5 text-xs text-muted">
                                                <span className="text-accent mt-px flex-shrink-0">&bull;</span>
                                                <span className="leading-snug">{r.reason}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {c.redFlags && c.redFlags.length > 0 && (
                                        <div className="space-y-1.5 mb-3">
                                            <p className="text-[10px] font-medium text-red-600 uppercase tracking-wider flex items-center gap-1">
                                                <AlertTriangle size={10} />
                                                Red Flags
                                            </p>
                                            {c.redFlags.map((r, i) => (
                                                <div key={i} className="flex items-start gap-1.5 text-xs text-red-600/80">
                                                    <span className="mt-px flex-shrink-0">&bull;</span>
                                                    <span className="leading-snug">{r.reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {(links.github || links.portfolio) && (
                                        <div className="flex gap-2 pt-2 border-t border-border">
                                            {links.github && (
                                                <a href={`https://${links.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-muted hover:text-ink">
                                                    <Github size={10} />
                                                    GitHub
                                                </a>
                                            )}
                                            {links.portfolio && (
                                                <a href={`https://${links.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-muted hover:text-ink">
                                                    <Globe size={10} />
                                                    Portfolio
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {subTab === "summary" && viewMode === "table" && (
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-3 py-2 border border-border text-left font-medium text-muted w-28">Criteria</th>
                                {selectedCandidates.map(c => (
                                    <th key={c.documentId} className="px-3 py-2 border border-border text-center font-semibold text-ink align-top">
                                        {c.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-paper">
                                <td className="px-3 py-2 border border-border font-medium text-muted">Score</td>
                                {selectedCandidates.map(c => (
                                    <td key={c.documentId} className={cn("px-3 py-2 border border-border text-center font-bold", getScoreColor(c.score))}>
                                        {c.score}%
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-panel">
                                <td className="px-3 py-2 border border-border font-medium text-muted">Top Strength</td>
                                {selectedCandidates.map(c => (
                                    <td key={c.documentId} className="px-3 py-2 border border-border text-ink align-top">
                                        {c.matchReasons[0]?.reason ?? "—"}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-paper">
                                <td className="px-3 py-2 border border-border font-medium text-muted">2nd Strength</td>
                                {selectedCandidates.map(c => (
                                    <td key={c.documentId} className="px-3 py-2 border border-border text-ink align-top">
                                        {c.matchReasons[1]?.reason ?? "—"}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-panel">
                                <td className="px-3 py-2 border border-border font-medium text-muted">3rd Strength</td>
                                {selectedCandidates.map(c => (
                                    <td key={c.documentId} className="px-3 py-2 border border-border text-ink align-top">
                                        {c.matchReasons[2]?.reason ?? "—"}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-paper">
                                <td className="px-3 py-2 border border-border font-medium text-muted">Red Flag</td>
                                {selectedCandidates.map(c => (
                                    <td key={c.documentId} className="px-3 py-2 border border-border text-red-600/80 align-top">
                                        {c.redFlags?.[0]?.reason ?? "—"}
                                    </td>
                                ))}
                            </tr>
                            <tr className="bg-panel">
                                <td className="px-3 py-2 border border-border font-medium text-muted">Source File</td>
                                {selectedCandidates.map(c => (
                                    <td key={c.documentId} className="px-3 py-2 border border-border text-muted align-top">
                                        {c.filename}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                )}

                {subTab === "criteria" && (
                    <div className="space-y-4">
                        <p className="text-xs text-muted mb-3">Side-by-side strengths comparison</p>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-2 font-semibold text-muted">Criteria</th>
                                    {selectedCandidates.map(c => (
                                        <th key={c.documentId} className="text-center py-2 px-2 font-semibold text-ink">
                                            {c.name.split(" ")[0]}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 px-2 text-muted">Score</td>
                                    {selectedCandidates.map(c => (
                                        <td key={c.documentId} className="py-2 px-2 text-center font-semibold text-ink">
                                            {c.score}%
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 px-2 text-muted">Rank</td>
                                    {selectedCandidates.map(c => (
                                        <td key={c.documentId} className="py-2 px-2 text-center font-semibold text-ink">
                                            #{c.rank}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 px-2 text-muted">Evidence</td>
                                    {selectedCandidates.map(c => (
                                        <td key={c.documentId} className="py-2 px-2 text-center text-muted">
                                            {c.matchReasons.length} points
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-2 px-2 text-muted">Red Flags</td>
                                    {selectedCandidates.map(c => (
                                        <td key={c.documentId} className="py-2 px-2 text-center text-muted">
                                            {c.redFlags?.length || 0}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {subTab === "evidence" && (
                    <div className="space-y-4">
                        {selectedCandidates.map(c => {
                            const bookmarks = evidenceBookmarks[c.documentId] || [];
                            return (
                                <div key={c.documentId} className="border border-border rounded-lg p-4 bg-panel">
                                    <h3 className="font-semibold text-ink text-sm mb-3">{c.name}</h3>
                                    <div className="space-y-2">
                                        {c.matchReasons.map((r, i) => {
                                            const evidenceKey = `${i}-${r.reason.slice(0, 20)}`;
                                            const isBookmarked = bookmarks.includes(evidenceKey);
                                            return (
                                                <div key={i} className="flex items-start gap-2 text-xs">
                                                    <button
                                                        onClick={() => toggleBookmark(c.documentId, evidenceKey)}
                                                        className={cn(
                                                            "mt-0.5 flex-shrink-0 transition-colors",
                                                            isBookmarked
                                                                ? "text-accent"
                                                                : "text-border hover:text-muted"
                                                        )}
                                                        title={isBookmarked ? "Remove bookmark" : "Bookmark this evidence"}
                                                    >
                                                        <Bookmark size={12} fill={isBookmarked ? "currentColor" : "none"} />
                                                    </button>
                                                    <span className="flex-1 text-muted leading-snug">
                                                        {r.reason}
                                                        {r.page && (
                                                            <span className="ml-1 text-[10px] text-border font-mono">p.{r.page}</span>
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {subTab === "notes" && (
                    <div className="space-y-4">
                        {selectedCandidates.map(c => (
                            <div key={c.documentId} className="border border-border rounded-lg p-4 bg-panel">
                                <h3 className="font-semibold text-ink text-sm mb-2">{c.name}</h3>
                                <textarea
                                    placeholder="Add notes about this candidate..."
                                    className="w-full text-xs text-muted bg-paper border border-border rounded p-3 resize-none h-24 focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
