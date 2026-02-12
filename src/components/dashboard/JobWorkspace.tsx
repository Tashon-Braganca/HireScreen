"use client";

import React from "react";
import { Job, Document } from "@/types";
import { ResizableColumns } from "@/components/ui/ResizableColumns";
import { JobProvider } from "@/components/dashboard/JobContext";
import { LeftPanelClient } from "@/components/dashboard/panels/LeftPanelClient";
import { CenterPanel } from "@/components/dashboard/panels/CenterPanel";
import { RightPanel } from "@/components/dashboard/panels/RightPanel";

interface JobWorkspaceProps {
  job: Job;
  documents: Document[];
}

export function JobWorkspace({
  job,
  documents: initialDocuments,
}: JobWorkspaceProps) {
  return (
    <JobProvider job={job} initialDocuments={initialDocuments}>
      <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col h-[calc(100vh-theme(spacing.14))] overflow-hidden">
        {/* Header */}
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

        {/* 3-Column Resizable Layout */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ResizableColumns
            defaultWidths={[22, 48, 30]}
            storageKey={`workspace-${job.id}`}
            minWidth={220}
            className="gap-0"
          >
            {/* Left: Resumes & Filters */}
            <div className="flex flex-col min-h-0 pr-2.5">
              <LeftPanelClient />
            </div>

            {/* Center: Ranked Results & Tabs */}
            <div className="flex flex-col min-h-0 px-2.5">
              <CenterPanel />
            </div>

            {/* Right: Ask Panel */}
            <div className="flex flex-col min-h-0 pl-2.5">
              <RightPanel />
            </div>
          </ResizableColumns>
        </div>
      </div>
    </JobProvider>
  );
}

