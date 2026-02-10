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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "processing" | "ready" | "error";
  progress?: number;
}

interface ResumeListProps {
  files: UploadedFile[];
  onUpload: (files: File[]) => void;
  onDelete?: (id: string) => void;
  isUploading?: boolean;
  selectedIds?: Set<string>;
}

export function ResumeList({
  files,
  onUpload,
  onDelete,
  isUploading,
  selectedIds,
}: ResumeListProps) {
  const [showUploadZone, setShowUploadZone] = useState(files.length === 0);
  const [filter, setFilter] = useState<"all" | "shortlisted">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    filter === "shortlisted" && selectedIds
      ? files.filter((f) => selectedIds.has(f.id))
      : files;

  const statusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 size={14} className="text-[#15803D]" />;
      case "error":
        return <XCircle size={14} className="text-[#B91C1C]" />;
      default:
        return <Loader2 size={14} className="text-accent animate-spin" />;
    }
  };

  return (
    <div className="panel h-full flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
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

        {/* Filter toggle + Upload button */}
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
              Starred{selectedIds ? ` (${selectedIds.size})` : ""}
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

      {/* Collapsible Upload Zone */}
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

      {/* File List */}
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
                "group flex items-center gap-2 p-2 rounded border transition-colors",
                selectedIds?.has(file.id)
                  ? "border-accent/30 bg-accent-bg"
                  : "border-border/50 bg-panel hover:border-border"
              )}
            >
              <div className="w-7 h-7 rounded bg-[#FEF2F2] flex items-center justify-center text-[#B91C1C]/60 flex-shrink-0">
                <FileText size={14} />
              </div>

              <div className="flex-1 min-w-0">
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
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {statusIcon(file.status)}
                {onDelete && (
                  <button
                    onClick={async () => {
                      if (deletingId) return;
                      setDeletingId(file.id);
                      try {
                        await onDelete(file.id);
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                    disabled={deletingId === file.id}
                    className={cn(
                      "p-1 text-muted hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded transition-all",
                      deletingId === file.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {deletingId === file.id ? (
                      <Loader2 size={12} className="animate-spin text-[#B91C1C]" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                )}
              </div>
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
    </div>
  );
}
