"use client";

import React, { useState } from "react";
import type { RankedCandidate } from "@/types";
import { X, FileSpreadsheet, Copy, Check, Archive, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { getResumeUrl } from "@/app/actions/documents";

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
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState("");

    const handleExcelDownload = () => {
        const data = candidates.map((c) => ({
            Rank: c.rank,
            Name: c.name,
            "Score (%)": c.score,
            "Match Reasons": c.matchReasons.map((r) => r.reason).join("; "),
            "Filename": c.filename
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Shortlist");
        XLSX.writeFile(wb, `candidrank_report_${new Date().toISOString().split("T")[0]}.xlsx`);

        toast.success("Excel report downloaded!");
        onClose();
    };

    const handleZipDownload = async () => {
        setIsExporting(true);
        setExportProgress("Preparing files...");

        try {
            const zip = new JSZip();

            // 1. Add Excel Report
            const data = candidates.map((c) => ({
                Rank: c.rank,
                Name: c.name,
                "Score (%)": c.score,
                "Match Reasons": c.matchReasons.map((r) => r.reason).join("; "),
                "Filename": c.filename
            }));
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Shortlist");
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            zip.file("candidate_report.xlsx", excelBuffer);

            // 2. Add Resumes folder
            const resumesFolder = zip.folder("resumes");

            for (let i = 0; i < candidates.length; i++) {
                const c = candidates[i];
                setExportProgress(`Fetching ${c.filename} (${i + 1}/${candidates.length})...`);

                const res = await getResumeUrl(c.documentId);
                if (res.success && res.url) {
                    const response = await fetch(res.url);
                    const blob = await response.blob();
                    resumesFolder?.file(c.filename, blob);
                }
            }

            setExportProgress("Generating ZIP...");
            const content = await zip.generateAsync({ type: "blob" });

            const url = URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = `candidrank_folder_${new Date().toISOString().split("T")[0]}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("Folder export complete!");
            onClose();
        } catch {
            toast.error("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
            setExportProgress("");
        }
    };

    const handleCSVDownload = () => {
        const csv = generateCSV(candidates);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `candidrank_shortlist_${new Date().toISOString().split("T")[0]}.csv`;
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
                                    onClick={handleExcelDownload}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/10 transition-all group text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                                        <FileSpreadsheet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Excel Report (.xlsx)
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Formatted spreadsheet with full match details
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={handleZipDownload}
                                    disabled={isExporting}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all group text-left disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                        {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Archive size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">
                                            Export Folder (ZIP)
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {isExporting ? exportProgress : "Excel report + all original PDF resumes"}
                                        </p>
                                    </div>
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleCSVDownload}
                                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-600 transition-all"
                                    >
                                        <FileSpreadsheet size={16} />
                                        <span className="text-xs font-semibold">CSV</span>
                                    </button>
                                    <button
                                        onClick={handleCopyToClipboard}
                                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-600 transition-all"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        <span className="text-xs font-semibold">{copied ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
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
