"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Loader2,
  XCircle,
  Trash2,
  Plus,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "processing" | "ready" | "error" | "failed";
  error_message?: string;
  progress?: number;
}

interface ResumeListProps {
  files: UploadedFile[];
  onUpload: (files: File[]) => void;
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
  isUploading?: boolean;
  shortlistedIds?: Set<string>;
  onToggleShortlist?: (id: string) => void;
  onViewResume: (id: string) => void;
}

export function ResumeList({
  files,
  onUpload,
  onDelete,
  onRetry,
  isUploading,
  shortlistedIds,
  onToggleShortlist,
}: ResumeListProps) {
  const [showUploadZone, setShowUploadZone] = useState(files.length === 0);
  const [filter, setFilter] = useState<"all" | "shortlisted">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
      setShowUploadZone(false);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    disabled: isUploading,
  });

  const readyCount = files.filter((f) => f.status === "ready").length;
  const processingCount = files.filter(
    (f) => f.status === "processing" || f.status === "uploading"
  ).length;

  const filteredFiles =
    filter === "shortlisted" && shortlistedIds
      ? files.filter((f) => shortlistedIds.has(f.id))
      : files;

  const statusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 size={14} className="text-[#15803D]" />;
      case "error":
      case "failed":
        return <XCircle size={14} className="text-[#B91C1C]" />;
      default:
        return <Loader2 size={14} className="text-accent animate-spin" />;
    }
  };

  const handleDeleteClick = (id: string) => {
    if (confirmDeleteId === id) {
      setConfirmDeleteId(null);
      setDeletingId(id);
      onDelete?.(id);
    } else {
      setConfirmDeleteId(id);
    }
  };

  return (
    <div className="panel h-full flex flex-col min-h-0 overflow-hidden">
      <div className="p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-ink">Resumes</h3>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{readyCount}/{files.length} ready</span>
            {processingCount > 0 && (
              <span className="flex items-center gap-1 text-accent">
                <Loader2 size={10} className="animate-spin" />
                {processingCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex-1 flex items-center border border-border rounded p-0.5">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "flex-1 text-xs font-medium py-1 rounded-sm transition-colors",
                filter === "all"
                  ? "bg-paper text-ink"
                  : "text-muted hover:text-ink"
              )}
            >
              All ({files.length})
            </button>
            <button
              onClick={() => setFilter("shortlisted")}
              className={cn(
                "flex-1 text-xs font-medium py-1 rounded-sm transition-colors",
                filter === "shortlisted"
                  ? "bg-paper text-ink"
                  : "text-muted hover:text-ink"
              )}
            >
              Starred{shortlistedIds ? ` (${shortlistedIds.size})` : ""}
            </button>
          </div>

          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className={cn(
              "p-1.5 rounded transition-colors flex-shrink-0 border",
              showUploadZone
                ? "border-accent bg-accent-bg text-accent"
                : "border-border text-muted hover:text-accent hover:border-accent"
            )}
          >
            {showUploadZone ? <ChevronUp size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showUploadZone && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden flex-shrink-0"
          >
            <div className="p-3 pt-2">
              <div
                {...getRootProps()}
                className={cn(
                  "border border-dashed rounded p-4 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-accent bg-accent-bg"
                    : "border-border hover:border-accent hover:bg-paper",
                  isUploading && "pointer-events-none opacity-50"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "p-2 rounded transition-colors",
                      isDragActive
                        ? "text-accent"
                        : "text-muted"
                    )}
                  >
                    <UploadCloud size={18} />
                  </div>
                  <p className="text-xs font-medium text-ink">
                    {isDragActive ? "Drop here" : "Drop PDFs or click"}
                  </p>
                  <p className="text-[10px] text-muted">Max 10MB each</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        <AnimatePresence initial={false} mode="popLayout">
          {filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                "group flex flex-col p-2 rounded border transition-colors",
                file.status === "failed"
                  ? "border-[#B91C1C]/30 bg-[#FEF2F2]"
                  : shortlistedIds?.has(file.id)
                    ? "border-accent/30 bg-accent-bg"
                    : "border-border/50 bg-panel hover:border-border"
              )}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleShortlist?.(file.id); }}
                  className={cn(
                    "w-4 h-4 flex items-center justify-center rounded hover:bg-black/5 transition-colors",
                    shortlistedIds?.has(file.id) ? "text-yellow-500" : "text-muted/30 hover:text-yellow-500"
                  )}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={shortlistedIds?.has(file.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                </button>

                <div className="w-7 h-7 rounded bg-[#FEF2F2] flex items-center justify-center text-[#B91C1C]/60 flex-shrink-0">
                  <FileText size={14} />
                </div>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {/* Handle view resume? */ }}>
                  <p className="text-xs font-medium text-ink truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted font-mono">
                      {file.size < 1024 * 100
                        ? `${(file.size / 1024).toFixed(0)} KB`
                        : `${(file.size / 1024 / 1024).toFixed(1)} MB`}
                    </span>
                    {file.status === "uploading" && (
                      <span className="text-[10px] text-accent font-medium">
                        Uploading...
                      </span>
                    )}
                    {file.status === "processing" && (
                      <span className="text-[10px] text-accent font-medium">
                        Processing...
                      </span>
                    )}
                    {file.status === "failed" && (
                      <span className="text-[10px] text-[#B91C1C] font-medium">
                        Processing failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {statusIcon(file.status)}
                  {onDelete && (
                    <button
                      onClick={() => handleDeleteClick(file.id)}
                      disabled={deletingId === file.id}
                      className={cn(
                        "p-1 rounded transition-all",
                        confirmDeleteId === file.id
                          ? "text-white bg-[#B91C1C] hover:bg-[#991B1B]"
                          : deletingId === file.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 text-muted hover:text-[#B91C1C] hover:bg-[#FEF2F2]"
                      )}
                      title={confirmDeleteId === file.id ? "Click again to confirm" : "Delete"}
                    >
                      {deletingId === file.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : confirmDeleteId === file.id ? (
                        <AlertTriangle size={12} />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {file.status === "failed" && file.error_message && (
                <div className="mt-2 pt-2 border-t border-[#B91C1C]/20">
                  <p className="text-[10px] text-[#B91C1C]">{file.error_message}</p>
                  {onRetry && (
                    <button
                      onClick={() => onRetry(file.id)}
                      className="mt-1.5 text-[10px] font-medium text-accent hover:underline"
                    >
                      Retry upload
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted text-center">
            <p className="text-xs">
              {filter === "shortlisted"
                ? "No starred candidates yet"
                : "No resumes uploaded"}
            </p>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
