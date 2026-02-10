"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Job, Document, RankedCandidate } from "@/types";
import { ResumeList, UploadedFile } from "@/components/ui/ResumeList";
import { ChatInterface } from "@/components/ui/ChatInterface";
import { RankedResultsPanel } from "@/components/ui/RankedResultsPanel";
import { ExportModal } from "@/components/ui/ExportModal";
import { ResizableColumns } from "@/components/ui/ResizableColumns";
import { uploadResume, deleteDocument, getDocuments, getResumeUrl } from "@/app/actions/documents";
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

// --- Session storage helpers ---
function loadSession<T>(jobId: string, key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(`hs-${key}-${jobId}`);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveSession<T>(jobId: string, key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`hs-${key}-${jobId}`, JSON.stringify(value));
  } catch { /* ignore */ }
}

// Ranking keyword detector
const RANK_KEYWORDS = /\b(rank|best|top|compare|who has|who can|strongest|weakest|most experienced|least|fit for|suitable|qualified)\b/i;

export function JobWorkspace({
  job,
  documents: initialDocuments,
}: JobWorkspaceProps) {
  // --- Client-side document state ---
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);

  // Chat state — restore from session
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadSession<Message[]>(job.id, "msgs", []);
    if (saved.length > 0) return saved;
    return [
      {
        id: "1",
        role: "assistant",
        content: `Ready to screen candidates for ${job.title}. Upload resumes and ask me anything — or use the Quick Ask chips!`,
        timestamp: new Date(),
      },
    ];
  });
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Ranked results state — restore from session
  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>(
    () => loadSession<RankedCandidate[]>(job.id, "ranked", [])
  );
  const [isRanking, setIsRanking] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string | undefined>(
    () => loadSession<string | undefined>(job.id, "query", undefined)
  );
  const [recentQueries, setRecentQueries] = useState<string[]>(
    () => loadSession<string[]>(job.id, "recent", [])
  );

  // Selection & export state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExport, setShowExport] = useState(false);

  // Ref to prevent duplicate deletes
  const deletingIds = useRef<Set<string>>(new Set());

  // --- Persist important state to sessionStorage ---
  useEffect(() => {
    saveSession(job.id, "ranked", rankedCandidates);
  }, [job.id, rankedCandidates]);

  useEffect(() => {
    saveSession(job.id, "msgs", messages);
  }, [job.id, messages]);

  useEffect(() => {
    if (activeQuery !== undefined) saveSession(job.id, "query", activeQuery);
  }, [job.id, activeQuery]);

  useEffect(() => {
    saveSession(job.id, "recent", recentQueries);
  }, [job.id, recentQueries]);

  // Map server docs + uploading files to unified UI format
  const fileList: UploadedFile[] = [
    ...uploadingFiles,
    ...documents.map((d) => ({
      id: d.id,
      name: d.candidate_name
        ? `${d.candidate_name} — ${d.filename}`
        : d.filename,
      size: d.file_size || 0,
      status: d.status as "processing" | "ready" | "error" | "uploading",
    })),
  ];

  // --- OPTIMISTIC DELETE ---
  const handleDelete = useCallback(
    async (id: string) => {
      if (deletingIds.current.has(id)) return;
      deletingIds.current.add(id);

      const previousDocs = documents;
      setDocuments((prev) => prev.filter((d) => d.id !== id));

      try {
        const res = await deleteDocument(id, job.id);
        if (!res.success) {
          setDocuments(previousDocs);
          toast.error(`Delete failed: ${res.error}`);
        }
      } catch (err) {
        setDocuments(previousDocs);
        toast.error("Network error — document restored.");
        console.error("[UI] Delete rollback:", err);
      } finally {
        deletingIds.current.delete(id);
      }
    },
    [documents, job.id]
  );

  // --- PARALLEL UPLOADS ---
  const handleUpload = useCallback(
    async (files: File[]) => {
      console.log(`[UI] Starting upload of ${files.length} file(s)`);

      const newUploads: UploadedFile[] = files.map((f, i) => ({
        id: `uploading-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        status: "uploading" as const,
      }));
      setUploadingFiles((prev) => [...prev, ...newUploads]);

      const results = await Promise.allSettled(
        files.map(async (file, i) => {
          const formData = new FormData();
          formData.append("file", file);

          const res = await uploadResume(formData, job.id);

          setUploadingFiles((prev) =>
            prev.filter((f) => f.id !== newUploads[i].id)
          );

          if (res.success && res.document) {
            setDocuments((prev) => [res.document!, ...prev]);
            toast.success(`${file.name} ready`);
          } else if (res.document) {
            setDocuments((prev) => [res.document!, ...prev]);
            toast.error(`${file.name}: ${res.error || "Processing failed"}`);
          } else {
            toast.error(`${file.name}: ${res.error || "Upload failed"}`);
          }

          return res;
        })
      );

      // Clean up
      const uploadIds = new Set(newUploads.map((u) => u.id));
      setUploadingFiles((prev) => prev.filter((f) => !uploadIds.has(f.id)));

      // Refetch from server for sync
      try {
        const freshDocs = await getDocuments(job.id);
        setDocuments(freshDocs as Document[]);
      } catch (err) {
        console.error("[UI] Failed to refetch documents:", err);
      }

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
      if (next.has(documentId)) next.delete(documentId);
      else next.add(documentId);
      return next;
    });
  }, []);

  const handleViewResume = useCallback(
    async (documentId: string) => {
      const doc = documents.find((d) => d.id === documentId);
      if (!doc) {
        console.error(`[PREVIEW] Document ${documentId} not found in local state`, documents);
        toast.error("Document not found. Please refresh the page.");
        return;
      }

      const toastId = toast.loading(`Preparing preview for ${doc.filename}...`);

      try {
        const res = await getResumeUrl(documentId);
        if (res.success && res.url) {
          toast.dismiss(toastId);
          window.open(res.url, "_blank");
        } else {
          toast.error(res.error || "Failed to get preview link", { id: toastId });
        }
      } catch {
        toast.error("Error opening resume", { id: toastId });
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

  // --- Chat (also triggers ranking for ranking-like queries) ---
  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    // If the message looks like a ranking query, fire ranking in parallel
    const isRankingQuery = RANK_KEYWORDS.test(content);
    if (isRankingQuery) {
      handleRankQuery(content); // runs in parallel — don't await
    }

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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0 px-1">
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

      {/* 3-Column Resizable Layout */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizableColumns
          defaultWidths={[33.3, 33.3, 33.4]}
          storageKey={`workspace-${job.id}`}
          minWidth={220}
          className="gap-0"
        >
          {/* Left: Resumes */}
          <div className="flex flex-col min-h-0 pr-1.5">
            <ResumeList
              files={fileList}
              onUpload={handleUpload}
              onDelete={handleDelete}
              isUploading={uploadingFiles.length > 0}
              selectedIds={selectedIds}
            />
          </div>

          {/* Center: Ranked Results */}
          <div className="flex flex-col min-h-0 px-1.5">
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
              documents={documents}
            />
          </div>

          {/* Right: AI Chat */}
          <div className="flex flex-col min-h-0 pl-1.5">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onRankQuery={handleRankQuery}
              isLoading={isChatLoading}
              recentQueries={recentQueries}
              jobTitle={job.title}
            />
          </div>
        </ResizableColumns>
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
