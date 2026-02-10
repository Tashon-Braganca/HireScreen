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
import { BentoCard } from "./BentoCard";
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

  const filteredFiles =
    filter === "shortlisted" && selectedIds
      ? files.filter((f) => selectedIds.has(f.id))
      : files;

  const statusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "error":
        return <XCircle size={14} className="text-red-500" />;
      default:
        return (
          <Loader2 size={14} className="text-amber-500 animate-spin" />
        );
    }
  };

  return (
    <BentoCard className="h-full flex flex-col min-h-0 p-0 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-bold text-slate-800">
            Candidate Resumes
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            {readyCount}/{files.length} ready
          </span>
        </div>

        {/* Filter toggle + Upload button */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex-1 flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "flex-1 text-[10px] font-bold py-1 rounded-md transition-all",
                filter === "all"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              All ({files.length})
            </button>
            <button
              onClick={() => setFilter("shortlisted")}
              className={cn(
                "flex-1 text-[10px] font-bold py-1 rounded-md transition-all",
                filter === "shortlisted"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              Shortlisted{selectedIds ? ` (${selectedIds.size})` : ""}
            </button>
          </div>

          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className={cn(
              "p-1.5 rounded-lg transition-all flex-shrink-0",
              showUploadZone
                ? "bg-indigo-50 text-indigo-600"
                : "bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
            )}
          >
            {showUploadZone ? (
              <ChevronUp size={14} />
            ) : (
              <Plus size={14} />
            )}
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
                  "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group relative overflow-hidden",
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50",
                  isUploading && "pointer-events-none opacity-50"
                )}
              >
                <input {...getInputProps()} />
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      isDragActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                    )}
                  >
                    <UploadCloud size={18} />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600">
                    {isDragActive ? "Drop here" : "Drop PDFs or click"}
                  </p>
                  <p className="text-[10px] text-slate-400">Max 10MB each</p>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "group flex items-center gap-2 p-2 rounded-lg border transition-all",
                selectedIds?.has(file.id)
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
            >
              <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center text-red-400 flex-shrink-0">
                <FileText size={14} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-700 truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-slate-400 font-medium">
                    {file.size < 1024 * 100
                      ? `${(file.size / 1024).toFixed(0)} KB`
                      : `${(file.size / 1024 / 1024).toFixed(1)} MB`}
                  </span>
                  {file.status === "uploading" && (
                    <span className="text-[9px] text-blue-500 font-medium">
                      Uploading...
                    </span>
                  )}
                  {file.status === "processing" && (
                    <span className="text-[9px] text-amber-500 font-medium">
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
                      "p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all",
                      deletingId === file.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {deletingId === file.id ? <Loader2 size={12} className="animate-spin text-red-500" /> : <Trash2 size={12} />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-center">
            <p className="text-xs">
              {filter === "shortlisted"
                ? "No shortlisted candidates yet"
                : "No resumes uploaded"}
            </p>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
