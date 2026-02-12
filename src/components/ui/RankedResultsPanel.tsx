"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { RankedCandidate, Document } from "@/types";
import {
    ChevronDown,
    ChevronUp,
    Download,
    Search,
    Loader2,
    FileDown,
    Mail,
    Phone,
    Star,
    ExternalLink,
    FileText,
} from "lucide-react";
import { exportToPDF } from "@/lib/pdf/export";

interface RankedResultsPanelProps {
    candidates: RankedCandidate[];
    selectedIds: Set<string>; // filtered/shortlisted
    onToggleSelect: (documentId: string) => void;
    compareIds: Set<string>;
    onToggleCompare: (documentId: string) => void;
    onViewResume: (documentId: string) => void;
    onExport: () => void;
    onQueryClick: (query: string) => void;
    isLoading?: boolean;
    activeQuery?: string;
    jobTitle?: string;
    documents?: Document[];
}

function getScoreTier(score: number): string {
    if (score >= 85) return "Strong";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Weak";
}

function CandidateCard({
    candidate,
    isSelected,
    onToggleSelect,
    isCompared,
    onToggleCompare,
    onViewResume,
    index,
    contactEmail,
    contactPhone,
}: {
    candidate: RankedCandidate;
    isSelected: boolean;
    onToggleSelect: () => void;
    isCompared: boolean;
    onToggleCompare: () => void;
    onViewResume: () => void;
    index: number;
    contactEmail?: string | null;
    contactPhone?: string | null;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
            className={cn(
                "group border rounded transition-colors relative",
                isSelected
                    ? "border-accent/40 bg-accent-bg"
                    : "border-border bg-panel hover:border-border"
            )}
        >
            {/* Compare Checkbox */}
            <div className="absolute top-3 right-3 z-10">
                <input
                    type="checkbox"
                    checked={isCompared}
                    onChange={onToggleCompare}
                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent cursor-pointer accent-accent"
                    title="Select to compare"
                />
            </div>

            {/* Main Row */}
            <div className="px-4 py-3 flex items-start gap-3">
                {/* Rank Badge — monochrome */}
                <div
                    className={cn(
                        "w-7 h-7 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 border",
                        candidate.rank <= 3
                            ? "border-ink bg-ink text-white"
                            : "border-border bg-paper text-muted"
                    )}
                >
                    {candidate.rank}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-ink truncate">
                            {candidate.name}
                        </h4>
                        <span
                            className={cn(
                                "px-2 py-0.5 rounded text-[11px] font-semibold border flex-shrink-0",
                                candidate.score >= 70
                                    ? "border-ink/20 bg-ink/5 text-ink"
                                    : "border-border bg-paper text-muted"
                            )}
                        >
                            {candidate.score}% {getScoreTier(candidate.score)}
                        </span>
                    </div>

                    {/* Score bar — subtle */}
                    <div className="w-full h-1 bg-border rounded-full mb-2.5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${candidate.score}%` }}
                            transition={{ delay: index * 0.04 + 0.15, duration: 0.4 }}
                            className="h-full rounded-full bg-accent"
                        />
                    </div>

                    {/* Match reasons — 2-3 bullets */}
                    <div className="space-y-1">
                        {candidate.matchReasons
                            .slice(0, expanded ? undefined : 3)
                            .map((r, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-1.5 text-xs text-muted"
                                >
                                    <span className="text-border mt-px flex-shrink-0">
                                        &bull;
                                    </span>
                                    <span className="flex-1 leading-snug">{r.reason}</span>
                                </div>
                            ))}
                    </div>

                    {/* Citation chips */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {candidate.matchReasons
                            .filter((r) => r.page || r.filename)
                            .slice(0, expanded ? undefined : 2)
                            .map((r, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-[10px] text-muted bg-paper border border-border px-1.5 py-0.5 rounded font-mono"
                                >
                                    <FileText size={9} />
                                    {r.filename
                                        ? r.filename.replace(/\.pdf$/i, "").slice(0, 15)
                                        : "doc"}
                                    {r.page && ` p${r.page}`}
                                </span>
                            ))}
                    </div>

                    {/* Expand / Collapse */}
                    {candidate.matchReasons.length > 3 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-1.5 text-xs text-accent hover:text-accent-light font-medium flex items-center gap-0.5"
                        >
                            {expanded ? (
                                <>
                                    <ChevronUp size={12} /> Show less
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={12} /> +
                                    {candidate.matchReasons.length - 3} more
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0 pt-0.5">
                    <button
                        onClick={onToggleSelect}
                        className={cn(
                            "p-1.5 rounded transition-colors",
                            isSelected
                                ? "bg-accent text-white"
                                : "text-muted hover:text-accent hover:bg-accent-bg border border-border"
                        )}
                        title={isSelected ? "Remove from shortlist" : "Add to shortlist"}
                    >
                        <Star size={14} fill={isSelected ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={onViewResume}
                        className="p-1.5 rounded text-muted hover:text-ink hover:bg-paper border border-border transition-colors"
                        title="View resume"
                    >
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>

            {/* Contact row */}
            {(contactEmail || contactPhone) && (
                <div className="px-4 pb-2.5 flex items-center gap-3 text-[10px] text-muted">
                    {contactEmail && (
                        <span className="flex items-center gap-1 truncate">
                            <Mail size={10} className="flex-shrink-0" />
                            {contactEmail}
                        </span>
                    )}
                    {contactPhone && (
                        <span className="flex items-center gap-1">
                            <Phone size={10} className="flex-shrink-0" />
                            {contactPhone}
                        </span>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export function RankedResultsPanel({
    candidates,
    selectedIds,
    onToggleSelect,
    compareIds,
    onToggleCompare,
    onViewResume,
    onExport,
    onQueryClick,
    isLoading,
    activeQuery,
    jobTitle,
    documents = [],
}: RankedResultsPanelProps) {
    const [isExporting, setIsExporting] = useState(false);
    const selectedCount = selectedIds.size;

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const candidatesToExport =
                selectedCount > 0
                    ? candidates.filter((c) => selectedIds.has(c.documentId))
                    : candidates.slice(0, 10);

            exportToPDF(jobTitle || "Job", candidatesToExport);
        } finally {
            setIsExporting(false);
        }
    };

    // Suggested queries
    const suggestedQueries = [
        `Who has 5+ years experience relevant to ${jobTitle || "this role"}?`,
        "Who worked at a well-known company or funded startup?",
        "Rank candidates by overall fit and list their strongest skills",
    ];

    // Empty state — no query yet
    if (!isLoading && candidates.length === 0 && !activeQuery) {
        return (
            <div className="panel h-full flex flex-col items-center justify-center text-center p-8">
                <div className="flex flex-col items-center gap-4 max-w-sm">
                    <div className="w-14 h-14 rounded-lg border border-border flex items-center justify-center text-muted">
                        <Search size={24} />
                    </div>
                    <div>
                        <h3 className="font-display text-lg text-ink mb-1">
                            Ask a question to rank candidates
                        </h3>
                        <p className="text-sm text-muted">
                            Try one of these to see ranked results with citations
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-2">
                        {suggestedQueries.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => onQueryClick(q)}
                                className="text-left text-sm px-4 py-3 rounded border border-border bg-panel text-muted hover:bg-paper hover:text-ink hover:border-accent/40 transition-colors"
                            >
                                <span className="text-accent mr-2">&rarr;</span>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="panel h-full flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
                <div>
                    <h3 className="text-sm font-semibold text-ink">Ranked Results</h3>
                    <p className="text-xs text-muted">
                        {isLoading
                            ? "Analyzing resumes..."
                            : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} found`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <button
                            onClick={onExport}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded text-ink hover:bg-paper transition-colors"
                        >
                            <Download size={12} />
                            CSV ({selectedCount})
                        </button>
                    )}
                    {(candidates.length > 0 || selectedCount > 0) && (
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-ink text-white rounded hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            {isExporting ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <FileDown size={12} />
                            )}
                            Export PDF
                        </button>
                    )}
                </div>
            </div>

            {/* Active query banner */}
            {activeQuery && (
                <div className="px-4 py-2.5 bg-accent-bg border-b border-accent/20 flex-shrink-0">
                    <div className="flex items-center gap-2 text-xs text-accent">
                        <Search size={12} />
                        <span className="font-medium truncate">
                            &ldquo;{activeQuery}&rdquo;
                        </span>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex-1 p-4 space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded border border-border p-4 animate-pulse"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded bg-border" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-border rounded w-1/3" />
                                    <div className="h-1 bg-border/60 rounded w-full" />
                                    <div className="h-2 bg-border/40 rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted py-4">
                        <Loader2 size={14} className="animate-spin text-accent" />
                        Ranking candidates...
                    </div>
                </div>
            )}

            {/* No results */}
            {!isLoading && candidates.length === 0 && activeQuery && (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <div>
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg border border-border flex items-center justify-center text-muted">
                            <Search size={20} />
                        </div>
                        <h4 className="text-sm font-semibold text-ink mb-1">
                            No strong matches found
                        </h4>
                        <p className="text-xs text-muted max-w-xs">
                            Try broadening your query or upload more resumes.
                        </p>
                    </div>
                </div>
            )}

            {/* Results list */}
            {!isLoading && candidates.length > 0 && (
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <AnimatePresence>
                        {candidates.map((candidate, i) => {
                            const doc = documents.find(
                                (d) => d.id === candidate.documentId
                            );
                            return (
                                <CandidateCard
                                    key={candidate.documentId + candidate.rank}
                                    candidate={candidate}
                                    isSelected={selectedIds.has(candidate.documentId)}
                                    onToggleSelect={() =>
                                        onToggleSelect(candidate.documentId)
                                    }
                                    isCompared={compareIds.has(candidate.documentId)}
                                    onToggleCompare={() => onToggleCompare(candidate.documentId)}
                                    onViewResume={() => onViewResume(candidate.documentId)}
                                    index={i}
                                    contactEmail={doc?.candidate_email}
                                    contactPhone={doc?.candidate_phone}
                                />
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
