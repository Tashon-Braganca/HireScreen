"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, UploadCloud, CheckCircle2, Loader2, XCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoCard, BentoHeader } from "./BentoCard";
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
}

export function ResumeList({ files, onUpload, onDelete, isUploading }: ResumeListProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    disabled: isUploading
  });

  return (
    <BentoCard className="h-full flex flex-col min-h-[400px]">
      <BentoHeader 
        title="Candidate Resumes" 
        subtitle={`${files.length} documents uploaded`}
      />

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 mb-6 group relative overflow-hidden",
          isDragActive 
            ? "border-indigo-500 bg-indigo-50/50" 
            : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className={cn(
            "p-3 rounded-full transition-colors duration-200",
            isDragActive ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-500 group-hover:shadow-md"
          )}>
            <UploadCloud size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700">
              {isDragActive ? "Drop files here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-slate-400 font-medium">PDF files only, up to 10MB</p>
          </div>
        </div>
        
        {/* Animated background stripes for active state */}
        {isDragActive && (
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(99,102,241,0.1)_25%,transparent_25%,transparent_50%,rgba(99,102,241,0.1)_50%,rgba(99,102,241,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[move_1s_linear_infinite]" />
        )}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
        <AnimatePresence initial={false} mode="popLayout">
          {files.map((file) => (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                <FileText size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  {file.status === "uploading" && (
                     <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1">
                       <Loader2 size={10} className="animate-spin" /> Uploading...
                     </span>
                  )}
                  {file.status === "processing" && (
                     <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                       <Loader2 size={10} className="animate-spin" /> Processing...
                     </span>
                  )}
                  {file.status === "error" && (
                     <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                       Error
                     </span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {file.status === "ready" && (
                  <div className="text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                )}
                {file.status === "error" && (
                   <div className="text-red-500">
                    <XCircle size={18} />
                  </div>
                )}
                {(file.status === "processing" || file.status === "uploading") && (
                   <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                )}
              </div>

              {onDelete && (
                <button 
                  onClick={() => onDelete(file.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-center">
            <p className="text-sm">No resumes uploaded yet.</p>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
