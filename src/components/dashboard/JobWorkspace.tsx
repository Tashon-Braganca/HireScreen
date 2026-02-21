"use client";

import React, { useCallback } from "react";
import { Job, Document } from "@/types";
import { ResizableColumns } from "@/components/ui/ResizableColumns";
import { JobProvider, useJobContext } from "@/components/dashboard/JobContext";
import { LeftPanelClient } from "@/components/dashboard/panels/LeftPanelClient";
import { CenterPanel } from "@/components/dashboard/panels/CenterPanel";
import { RightPanel } from "@/components/dashboard/panels/RightPanel";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface JobWorkspaceProps {
  job: Job;
  documents: Document[];
}

function EmptyState({ onUpload }: { onUpload: (files: File[]) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col h-[calc(100vh-theme(spacing.14))] overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="font-display text-xl text-ink">{/* job title */}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <p className="text-xs font-medium text-muted">Active</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
              isDragActive ? "border-accent bg-accent-bg" : "border-border hover:border-accent/50 hover:bg-paper"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-bg flex items-center justify-center">
                <UploadCloud size={28} className="text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink mb-1">
                  Upload resumes to get started
                </h3>
                <p className="text-sm text-muted">
                  Drop PDF resumes above, then ask questions like{" "}
                  <span className="text-accent font-medium">&ldquo;Who has the strongest React experience?&rdquo;</span>
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-ink text-white text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobWorkspaceContent() {
  const { job, documents, uploadingFiles, handleUpload } = useJobContext();

  if (documents.length === 0 && uploadingFiles.length === 0) {
    return <EmptyState onUpload={handleUpload} />;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col h-[calc(100vh-theme(spacing.14))] overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="font-display text-xl text-ink">
            {job.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <p className="text-xs font-medium text-muted">
              Active
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizableColumns
          defaultWidths={[22, 48, 30]}
          storageKey={`workspace-${job.id}`}
          minWidth={220}
          className="gap-0"
        >
          <div className="flex flex-col min-h-0 pr-2.5">
            <LeftPanelClient />
          </div>

          <div className="flex flex-col min-h-0 px-2.5">
            <CenterPanel />
          </div>

          <div className="flex flex-col min-h-0 pl-2.5">
            <RightPanel />
          </div>
        </ResizableColumns>
      </div>
    </div>
  );
}

export function JobWorkspace({
  job,
  documents: initialDocuments,
}: JobWorkspaceProps) {
  return (
    <JobProvider job={job} initialDocuments={initialDocuments}>
      <JobWorkspaceContent />
    </JobProvider>
  );
}

