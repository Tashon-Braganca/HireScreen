"use client";

import React from "react";
import type { Document as SchemaDocument, Job as SchemaJob } from "@/types";
import { JobProvider, useJobContext } from "./JobContext";
import { LeftPanelClient } from "./panels/LeftPanelClient";
import { CenterPanel } from "./panels/CenterPanel";
import { RightPanel } from "./panels/RightPanel";
import { ResizableColumns } from "@/components/ui/ResizableColumns";
import { Upload } from "lucide-react";

interface JobWorkspaceProps {
  job: SchemaJob;
  documents: SchemaDocument[];
}

/* Empty state shown when no resumes uploaded yet */
function EmptyState() {
  const { handleUpload, job } = useJobContext();

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(
        (f: File) => f.type === "application/pdf"
      );
      if (files.length > 0) handleUpload(files);
    },
    [handleUpload]
  );

  const handleFileSelect = React.useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.multiple = true;
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      if (files.length > 0) handleUpload(files);
    };
    input.click();
  }, [handleUpload]);

  return (
    <div className="flex h-full items-center justify-center bg-[var(--bg-canvas)]">
      <div
        className="flex max-w-md flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[var(--border-default)] p-12 text-center transition-colors hover:border-[var(--accent)]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="rounded-full bg-[var(--bg-raised)] p-4">
          <Upload className="h-8 w-8 text-[var(--text-muted)]" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--text-ink)]">
            Upload resumes for &ldquo;{job.title}&rdquo;
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Drop PDF files here or click to browse. CandidRank will extract and
            index them for AI-powered screening.
          </p>
        </div>
        <button
          onClick={handleFileSelect}
          className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--bg-canvas)] transition-colors hover:bg-[var(--accent-light)]"
        >
          Choose Files
        </button>
        <p className="text-xs text-[var(--text-muted)]">PDF files only &middot; Max 10 MB each</p>
      </div>
    </div>
  );
}

/* Inner workspace content — rendered inside JobProvider */
function JobWorkspaceContent() {
  const { documents, uploadingFiles } = useJobContext();

  const hasResumes = documents.length > 0 || uploadingFiles.length > 0;

  if (!hasResumes) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-[var(--bg-canvas)]">
      <ResizableColumns
        defaultWidths={[22, 48, 30]}
        storageKey="job-workspace"
        minWidth={220}
      >
        <LeftPanelClient />
        <CenterPanel />
        <RightPanel />
      </ResizableColumns>
    </div>
  );
}

/* Root exported component — wraps everything in JobProvider */
export function JobWorkspace({ job, documents: initialDocuments }: JobWorkspaceProps) {
  return (
    <JobProvider job={job} initialDocuments={initialDocuments}>
      <JobWorkspaceContent />
    </JobProvider>
  );
}
