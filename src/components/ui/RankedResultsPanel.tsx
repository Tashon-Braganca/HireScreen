"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";
import { motion, AnimatePresence } from "framer-motion";
import type { RankedCandidate } from "@/types";
import {
    Trophy,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Eye,
    Download,
    Sparkles,
    Search,
    Loader2,
    FileDown,
} from "lucide-react";
import { exportToPDF } from "@/lib/pdf/export";

interface RankedResultsPanelProps {
    candidates: RankedCandidate[];
    selectedIds: Set<string>;
    onToggleSelect: (documentId: string) => void;
    onViewResume: (documentId: string) => void;
    onExport: () => void;
    onQueryClick: (query: string) => void;
    isLoading?: boolean;
    activeQuery?: string;
    jobTitle?: string;
}

function getScoreColor(score: number) {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-500 bg-slate-50 border-slate-200";
}

function getScoreBarColor(score: number) {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-slate-400";
}

function CandidateCard({
    candidate,
    isSelected,
    onToggleSelect,
    onViewResume,
    index,
}: {
    candidate: RankedCandidate;
    isSelected: boolean;
    onToggleSelect: () => void;
    onViewResume: () => void;
    index: number;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className={cn(
                "group rounded-2xl border transition-all duration-200 overflow-hidden",
                isSelected
                    ? "border-emerald-300 bg-emerald-50/40 shadow-sm shadow-emerald-100"
                    : "border-slate-150 bg-white hover:border-slate-300 hover:shadow-sm"
            )}
        >
            {/* Main Row */}
            <div className="p-4 flex items-start gap-3">
                {/* Rank Badge */}
                <div
                    className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
                        candidate.rank <= 3
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm shadow-orange-200"
                            : "bg-slate-100 text-slate-600"
                    )}
                >
                    {candidate.rank}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                            {candidate.name}
                        </h4>
                        <div
                            className={cn(
                                "px-2 py-0.5 rounded-full text-[11px] font-bold border",
                                getScoreColor(candidate.score)
                            )}
                        >
                            {candidate.score}%
                        </div>
                    </div>

                    {/* Score bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${candidate.score}%` }}
                            transition={{ delay: index * 0.06 + 0.2, duration: 0.5 }}
                            className={cn("h-full rounded-full", getScoreBarColor(candidate.score))}
                        />
                    </div>

                    {/* Top 3 match reasons (always visible) */}
                    <div className="space-y-1">
                        {candidate.matchReasons.slice(0, expanded ? undefined : 3).map((r, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                                <span className="text-slate-300 mt-0.5 flex-shrink-0">├</span>
                                <span className="flex-1">{r.reason}</span>
                                {r.page && (
                                    <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
                                        p.{r.page}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Expand / Collapse */}
                    {candidate.matchReasons.length > 3 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-1.5 text-[11px] text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-0.5"
                        >
                            {expanded ? (
                                <>
                                    <ChevronUp size={12} /> Show less
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={12} /> +{candidate.matchReasons.length - 3} more
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                        onClick={onToggleSelect}
                        className={cn(
                            "p-1.5 rounded-lg transition-all text-xs",
                            isSelected
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                        )}
                        title={isSelected ? "Deselect" : "Select for shortlist"}
                    >
                        <CheckCircle2 size={14} />
                    </button>
                    <button
                        onClick={onViewResume}
                        className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        title="View resume"
                    >
                        <Eye size={14} />
                    </button>
                </div>
            </div>

            {/* Source file */}
            <div className="px-4 pb-3">
                <span className="text-[10px] text-slate-400 font-mono truncate block">
                    📄 {candidate.filename}
                </span>
            </div>
        </motion.div>
    );
}

export function RankedResultsPanel({
    candidates,
    selectedIds,
    onToggleSelect,
    onViewResume,
    onExport,
    onQueryClick,
    isLoading,
    activeQuery,
    jobTitle,
}: RankedResultsPanelProps) {
    const [isExporting, setIsExporting] = useState(false);
    const selectedCount = selectedIds.size;

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            // If candidates are selected, export those. Otherwise export top 10.
            const candidatesToExport = selectedCount > 0
                ? candidates.filter(c => selectedIds.has(c.documentId))
                : candidates.slice(0, 10);

            exportToPDF(jobTitle || "Job", candidatesToExport);
        } finally {
            setIsExporting(false);
        }
    };

    // Example queries based on job title
    const suggestedQueries = [
        `Who has 5+ years experience relevant to ${jobTitle || "this role"}?`,
        "Who worked at a well-known company or funded startup?",
        "Rank candidates by overall fit and list their strongest skills",
    ];

    // Empty state - no query asked yet
    if (!isLoading && candidates.length === 0 && !activeQuery) {
        return (
            <BentoCard className="h-full flex flex-col items-center justify-center text-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4 max-w-sm"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <Search size={28} className="text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            Ask a question to rank candidates
                        </h3>
                        <p className="text-sm text-slate-500">
                            Try one of these to see ranked results with citations
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-2">
                        {suggestedQueries.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => onQueryClick(q)}
                                className="text-left text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group"
                            >
                                <span className="text-indigo-400 group-hover:text-indigo-500 mr-2">→</span>
                                {q}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </BentoCard>
        );
    }

    return (
        <BentoCard className="h-full flex flex-col p-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-200">
                        <Trophy size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Ranked Results</h3>
                        <p className="text-[11px] text-slate-500">
                            {isLoading
                                ? "Analyzing resumes..."
                                : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} found`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <button
                            onClick={onExport}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Download size={12} />
                            CSV / Copy
                        </button>
                    )}
                    {(candidates.length > 0 || selectedCount > 0) && (
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
                            Export PDF
                        </button>
                    )}
                </div>
            </div>

            {/* Active query */}
            {activeQuery && (
                <div className="px-4 py-2.5 bg-indigo-50/50 border-b border-indigo-100/50">
                    <div className="flex items-center gap-2 text-xs text-indigo-600">
                        <Sparkles size={12} />
                        <span className="font-medium truncate">&ldquo;{activeQuery}&rdquo;</span>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex-1 p-4 space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-slate-100 p-4 animate-pulse"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                                    <div className="h-1.5 bg-slate-100 rounded w-full" />
                                    <div className="h-2 bg-slate-100 rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-4">
                        <Loader2 size={14} className="animate-spin" />
                        Ranking candidates...
                    </div>
                </div>
            )}

            {/* No results for query */}
            {!isLoading && candidates.length === 0 && activeQuery && (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <div>
                        <div className="text-3xl mb-3">🤔</div>
                        <h4 className="text-sm font-bold text-slate-700 mb-1">
                            No strong matches found
                        </h4>
                        <p className="text-xs text-slate-500 max-w-xs">
                            Try broadening your query or upload more resumes.
                        </p>
                    </div>
                </div>
            )}

            {/* Results list */}
            {!isLoading && candidates.length > 0 && (
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <AnimatePresence>
                        {candidates.map((candidate, i) => (
                            <CandidateCard
                                key={candidate.documentId + candidate.rank}
                                candidate={candidate}
                                isSelected={selectedIds.has(candidate.documentId)}
                                onToggleSelect={() => onToggleSelect(candidate.documentId)}
                                onViewResume={() => onViewResume(candidate.documentId)}
                                index={i}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </BentoCard>
    );
}
