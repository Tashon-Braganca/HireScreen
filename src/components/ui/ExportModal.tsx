"use client";

import React, { useState } from "react";
import type { RankedCandidate } from "@/types";
import { X, FileSpreadsheet, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ExportModalProps {
    candidates: RankedCandidate[];
    isOpen: boolean;
    onClose: () => void;
}

function generateCSV(candidates: RankedCandidate[]): string {
    const header = "Rank,Name,Score (%),Match Reasons,Source File";
    const rows = candidates.map((c) => {
        const reasons = c.matchReasons
            .map((r) => `${r.reason}${r.page ? ` [p.${r.page}]` : ""}`)
            .join("; ");
        // Escape double quotes in fields
        const escapedName = c.name.replace(/"/g, '""');
        const escapedReasons = reasons.replace(/"/g, '""');
        const escapedFilename = c.filename.replace(/"/g, '""');
        return `${c.rank},"${escapedName}",${c.score},"${escapedReasons}","${escapedFilename}"`;
    });
    return [header, ...rows].join("\n");
}

export function ExportModal({ candidates, isOpen, onClose }: ExportModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCSVDownload = () => {
        const csv = generateCSV(candidates);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hirescreen_shortlist_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("CSV downloaded!");
        onClose();
    };

    const handleCopyToClipboard = async () => {
        const text = candidates
            .map(
                (c, i) =>
                    `${i + 1}. ${c.name} (${c.score}%)\n   ${c.matchReasons.map((r) => `• ${r.reason}${r.page ? ` [p.${r.page}]` : ""}`).join("\n   ")}\n   Source: ${c.filename}`
            )
            .join("\n\n");

        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Export Shortlist
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} selected
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Export Options */}
                            <div className="p-5 space-y-3">
                                <button
                                    onClick={handleCSVDownload}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                                        <FileSpreadsheet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Download as CSV
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Open in Excel, Google Sheets, or any spreadsheet app
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={handleCopyToClipboard}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {copied ? "Copied!" : "Copy to Clipboard"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Paste into emails, Slack, or documents
                                        </p>
                                    </div>
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="px-5 pb-5">
                                <p className="text-[10px] text-slate-400 font-medium mb-2 uppercase tracking-wider">
                                    Preview
                                </p>
                                <div className="bg-slate-50 rounded-lg p-3 max-h-40 overflow-y-auto text-xs font-mono text-slate-600 space-y-1">
                                    {candidates.slice(0, 5).map((c) => (
                                        <div key={c.documentId}>
                                            {c.rank}. {c.name} — {c.score}%
                                        </div>
                                    ))}
                                    {candidates.length > 5 && (
                                        <div className="text-slate-400">
                                            ...and {candidates.length - 5} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
