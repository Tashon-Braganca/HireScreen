"use client";

import React, { useState, useCallback, useRef } from "react";
import { Job, Document, RankedCandidate } from "@/types";
import { ResumeList, UploadedFile } from "@/components/ui/ResumeList";
import { ChatInterface } from "@/components/ui/ChatInterface";
import { RankedResultsPanel } from "@/components/ui/RankedResultsPanel";
import { ExportModal } from "@/components/ui/ExportModal";
import { uploadResume, deleteDocument } from "@/app/actions/documents";
import { chatWithJob } from "@/app/actions/chat";
import { rankCandidates } from "@/app/actions/rank";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface JobWorkspaceProps {
  job: Job;
  documents: Document[];
}

export function JobWorkspace({
  job,
  documents: initialDocuments,
}: JobWorkspaceProps) {
  // --- Client-side document state (no more router.refresh()) ---
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Ready to screen candidates for ${job.title}. Upload resumes and ask me anything — or use the Quick Ask chips!`,
      timestamp: new Date(),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Ranked results state
  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>(
    []
  );
  const [isRanking, setIsRanking] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string | undefined>();
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  // Selection & export state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExport, setShowExport] = useState(false);

  // Ref to prevent duplicate deletes
  const deletingIds = useRef<Set<string>>(new Set());

  // Map server docs + uploading files to unified UI format
  const fileList: UploadedFile[] = [
    ...uploadingFiles,
    ...documents.map((d) => ({
      id: d.id,
      name: d.filename,
      size: d.file_size || 0,
      status: d.status as "processing" | "ready" | "error" | "uploading",
    })),
  ];

  // --- OPTIMISTIC DELETE ---
  const handleDelete = useCallback(
    async (id: string) => {
      // Prevent double-delete
      if (deletingIds.current.has(id)) return;
      deletingIds.current.add(id);

      // Save for rollback
      const previousDocs = documents;

      // Instantly remove from UI
      setDocuments((prev) => prev.filter((d) => d.id !== id));

      // Fire backend delete in background
      try {
        const res = await deleteDocument(id, job.id);
        if (!res.success) {
          // Rollback on failure
          setDocuments(previousDocs);
          toast.error(`Delete failed: ${res.error}`);
        }
      } catch {
        // Rollback on network error
        setDocuments(previousDocs);
        toast.error("Network error — document restored.");
      } finally {
        deletingIds.current.delete(id);
      }
    },
    [documents, job.id]
  );

  // --- PARALLEL UPLOADS ---
  const handleUpload = useCallback(
    async (files: File[]) => {
      // Create optimistic uploading entries
      const newUploads: UploadedFile[] = files.map((f, i) => ({
        id: `uploading-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        status: "uploading" as const,
      }));
      setUploadingFiles((prev) => [...prev, ...newUploads]);

      // Process ALL files in parallel
      const results = await Promise.allSettled(
        files.map(async (file, i) => {
          const formData = new FormData();
          formData.append("file", file);

          const res = await uploadResume(formData, job.id);

          // Remove this file from uploading list
          setUploadingFiles((prev) =>
            prev.filter((f) => f.id !== newUploads[i].id)
          );

          if (res.success && res.document) {
            // Add completed document directly to state
            setDocuments((prev) => [res.document!, ...prev]);
            toast.success(`${file.name} ready`);
          } else {
            toast.error(`${file.name}: ${res.error || "Upload failed"}`);
          }

          return res;
        })
      );

      // Clean up any stragglers
      const uploadIds = new Set(newUploads.map((u) => u.id));
      setUploadingFiles((prev) => prev.filter((f) => !uploadIds.has(f.id)));

      const succeeded = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      if (files.length > 1) {
        toast.info(`${succeeded}/${files.length} resumes processed`);
      }
    },
    [job.id]
  );

  // --- Selection ---
  const handleToggleSelect = useCallback((documentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(documentId)) {
        next.delete(documentId);
      } else {
        next.add(documentId);
      }
      return next;
    });
  }, []);

  const handleViewResume = useCallback(
    (documentId: string) => {
      const doc = documents.find((d) => d.id === documentId);
      if (doc) {
        toast.info(`Viewing: ${doc.filename}`);
      }
    },
    [documents]
  );

  // --- Rank candidates ---
  const handleRankQuery = useCallback(
    async (query: string) => {
      setIsRanking(true);
      setActiveQuery(query);
      setRecentQueries((prev) => {
        const filtered = prev.filter((q) => q !== query);
        return [query, ...filtered].slice(0, 10);
      });

      const res = await rankCandidates(query, job.id);
      setIsRanking(false);

      if (res.success && res.candidates) {
        setRankedCandidates(res.candidates);
        if (res.candidates.length === 0) {
          toast.info("No strong matches found. Try a broader query.");
        }
      } else {
        toast.error(res.error || "Ranking failed");
        setRankedCandidates([]);
      }
    },
    [job.id]
  );

  // --- Chat ---
  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    const res = await chatWithJob(content, job.id);
    setIsChatLoading(false);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: res.success
        ? res.answer || "No answer generated."
        : res.error || "Sorry, I encountered an error.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  // Get selected candidates for export
  const selectedCandidates = rankedCandidates.filter((c) =>
    selectedIds.has(c.documentId)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-medium text-slate-500">
                Active • {documents.length} Resumes •{" "}
                {documents.filter((d) => d.status === "ready").length} Ready
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left: Resumes (25%) */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <ResumeList
            files={fileList}
            onUpload={handleUpload}
            onDelete={handleDelete}
            isUploading={uploadingFiles.length > 0}
            selectedIds={selectedIds}
          />
        </div>

        {/* Center: Ranked Results (50%) */}
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <RankedResultsPanel
            candidates={rankedCandidates}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onViewResume={handleViewResume}
            onExport={() => setShowExport(true)}
            onQueryClick={handleRankQuery}
            isLoading={isRanking}
            activeQuery={activeQuery}
            jobTitle={job.title}
          />
        </div>

        {/* Right: AI Chat (25%) */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onRankQuery={handleRankQuery}
            isLoading={isChatLoading}
            recentQueries={recentQueries}
            jobTitle={job.title}
          />
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        candidates={selectedCandidates}
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
