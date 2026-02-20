"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Job, Document, RankedCandidate } from "@/types";
import { UploadedFile } from "@/components/ui/ResumeList";
import { uploadResume, deleteDocument, getDocuments } from "@/app/actions/documents";
import { chatWithJob } from "@/app/actions/chat";
import { rankCandidates } from "@/app/actions/rank";
import { toast } from "sonner";
import { trackResumeUploaded, trackQuerySubmitted, trackRankingRun } from "@/lib/analytics/posthog";

// --- Types ---

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface JobFilters {
    authorized: string; // 'all' | 'authorized' | 'sponsorship'
    location: string;
    yoe: string;
    skills: string[];
}

interface JobContextType {
    job: Job;
    documents: Document[];
    rankedCandidates: RankedCandidate[];
    messages: Message[];
    uploadingFiles: UploadedFile[];

    // State setters (for initial hydration)
    setDocuments: (docs: Document[]) => void;
    setRankedCandidates: (candidates: RankedCandidate[]) => void;
    setMessages: (msgs: Message[]) => void;

    // Actions
    handleUpload: (files: File[]) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    handleRankQuery: (query: string) => Promise<void>;
    handleSendMessage: (content: string) => Promise<void>;

    // Selection - Compare
    compareIds: Set<string>;
    toggleCompare: (id: string) => void;
    clearCompare: () => void;

    // Selection - Shortlist (Stars)
    shortlistedIds: Set<string>;
    toggleShortlist: (id: string) => void;

    viewResume: (id: string) => Promise<void>;

    // UI State
    isRanking: boolean;
    isChatLoading: boolean;
    activeQuery: string | undefined;
    recentQueries: string[];

    // Tabs
    activeTab: string;
    setActiveTab: (tab: string) => void;
    closeResumeTab: (id: string) => void;
    openResumeTabs: string[];

    // Filtered views
    filteredDocuments: Document[];
    filteredRankedCandidates: RankedCandidate[];

    // Filters
    filters: JobFilters;
    setFilters: (filters: JobFilters) => void;

    // Evidence bookmarks
    evidenceBookmarks: Record<string, string[]>;
    toggleBookmark: (candidateId: string, evidenceKey: string) => void;

    // Query input (for re-running from history)
    queryInput: string;
    setQueryInput: (query: string) => void;
}

const JobContext = createContext<JobContextType | null>(null);


export const useJobContext = () => {
    const context = useContext(JobContext);
    if (!context) throw new Error("useJobContext must be used within a JobProvider");
    return context;
};

// --- Helpers ---

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

const RANK_KEYWORDS = /\b(rank|best|top|compare|who has|who can|strongest|weakest|most experienced|least|fit for|suitable|qualified)\b/i;

// --- Provider ---

export function JobProvider({
    children,
    job,
    initialDocuments = []
}: {
    children: React.ReactNode;
    job: Job;
    initialDocuments?: Document[]
}) {
    // --- State ---
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);

    // Session-persisted state
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = loadSession<Message[]>(job.id, "msgs", []);
        if (saved.length > 0) return saved;
        return [{
            id: "1", role: "assistant", content: `Ready to screen candidates for ${job.title}.`, timestamp: new Date()
        }];
    });

    const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>(
        () => loadSession<RankedCandidate[]>(job.id, "ranked", [])
    );
    const [activeQuery, setActiveQuery] = useState<string | undefined>(
        () => loadSession<string | undefined>(job.id, "query", undefined)
    );
    const [recentQueries, setRecentQueries] = useState<string[]>(
        () => loadSession<string[]>(job.id, "recent", [])
    );

    const [isRanking, setIsRanking] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [queryInput, setQueryInput] = useState<string>("");

    const deletingIds = useRef<Set<string>>(new Set());

    // Selection State
    const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
    // Only load shortlist from session for now (or DB if available, but prompt says "Shortlist is controlled by toggles on candidate cards, and left panel has All / Shortlisted tabs.", implies session or local persistence is fine for MVP)
    const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(() => {
        // We can't easily perform Set serialization in sessionStorage without converting to Array.
        const saved = loadSession<string[]>(job.id, "shortlist", []);
        return new Set(saved);
    });

    // Filters
    const [filters, setFilters] = useState<JobFilters>({
        authorized: "all",
        location: "",
        yoe: "",
        skills: []
    });

    // Derived State: Filtering
    const filteredDocuments = React.useMemo(() => {
        return documents.filter(doc => {
            const text = (doc.text_content || "").toLowerCase();

            // Location (Text match for now)
            if (filters.location && !text.includes(filters.location.toLowerCase())) return false;

            // Skills (All must be present)
            if (filters.skills.length > 0) {
                const hasAllSkills = filters.skills.every(skill => text.includes(skill.toLowerCase()));
                if (!hasAllSkills) return false;
            }

            // YOE (Regex heuristic - very rough)
            if (filters.yoe) {
                const minYoe = parseInt(filters.yoe);
                if (!isNaN(minYoe)) {
                    // Look for "X years" pattern? Too risky for naive. 
                    // Let's skip YOE filtering for MVP without extraction.
                }
            }

            return true;
        });
    }, [documents, filters]);

    const filteredRankedCandidates = React.useMemo(() => {
        // Filter candidates whose documentId is in filteredDocuments
        const allowedIds = new Set(filteredDocuments.map(d => d.id));
        return rankedCandidates.filter(c => allowedIds.has(c.documentId));
    }, [rankedCandidates, filteredDocuments]);

    // Note: filteredRankedCandidates is used in the context value below

    // --- Effects ---
    useEffect(() => { saveSession(job.id, "ranked", rankedCandidates); }, [job.id, rankedCandidates]);
    useEffect(() => { saveSession(job.id, "msgs", messages); }, [job.id, messages]);
    useEffect(() => { if (activeQuery) saveSession(job.id, "query", activeQuery); }, [job.id, activeQuery]);
    useEffect(() => { saveSession(job.id, "recent", recentQueries); }, [job.id, recentQueries]);
    useEffect(() => { saveSession(job.id, "shortlist", Array.from(shortlistedIds)); }, [job.id, shortlistedIds]);
    // Persist filters if needed, or keep local to session
    useEffect(() => { saveSession(job.id, "filters", filters); }, [job.id, filters]);

    // --- Actions ---

    const handleDelete = useCallback(async (id: string) => {
        if (deletingIds.current.has(id)) return;
        deletingIds.current.add(id);
        const prevDocs = documents;
        setDocuments(prev => prev.filter(d => d.id !== id));
        try {
            const res = await deleteDocument(id, job.id);
            if (!res.success) {
                setDocuments(prevDocs);
                toast.error(`Delete failed: ${res.error}`);
            }
        } catch {
            setDocuments(prevDocs);
            toast.error("Network error");
        } finally {
            deletingIds.current.delete(id);
        }
    }, [documents, job.id]);

const handleUpload = useCallback(async (files: File[]) => {
        const newUploads: UploadedFile[] = files.map((f, i) => ({
            id: `uploading-${Date.now()}-${i}`,
            name: f.name,
            size: f.size,
            status: "uploading" as const
        }));
        setUploadingFiles(prev => [...prev, ...newUploads]);

        await Promise.allSettled(files.map(async (file, i) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadResume(formData, job.id);

            setUploadingFiles(prev => prev.filter(f => f.id !== newUploads[i].id));

            if (res.success && res.document) {
                setDocuments(prev => [res.document!, ...prev]);
                toast.success(`${file.name} ready`);
            } else {
                toast.error(`${file.name}: ${res.error || "Failed"}`);
            }
            return res;
        }));

        const uploadIds = new Set(newUploads.map(u => u.id));
        setUploadingFiles(prev => prev.filter(f => !uploadIds.has(f.id)));

        trackResumeUploaded(job.id, files.length);

        try {
            const fresh = await getDocuments(job.id);
            setDocuments(fresh as Document[]);
        } catch (e) { console.error(e); }

    }, [job.id]);

const handleRankQuery = useCallback(async (query: string) => {
        setIsRanking(true);
        setActiveQuery(query);
        setRecentQueries(prev => [query, ...prev.filter(q => q !== query)].slice(0, 10));

        trackQuerySubmitted(job.id, query.length);

        const res = await rankCandidates(query, job.id);
        setIsRanking(false);

        if (res.success && res.candidates) {
            setRankedCandidates(res.candidates);
            trackRankingRun(job.id, res.candidates.length);
            if (res.candidates.length === 0) toast.info("No matches found.");
            if (res.warning) toast.warning(res.warning);
        } else {
            toast.error(res.error || "Ranking failed");
            setRankedCandidates([]);
        }
    }, [job.id]);

    const handleSendMessage = useCallback(async (content: string) => {
        const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsChatLoading(true);

        if (RANK_KEYWORDS.test(content)) handleRankQuery(content);

        const res = await chatWithJob(content, job.id, filteredDocuments.map(d => d.id));
        setIsChatLoading(false);

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: res.success ? res.answer || "No answer." : res.error || "Error.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
    }, [job.id, handleRankQuery, filteredDocuments]);

    const toggleCompare = useCallback((id: string) => {
        setCompareIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else {
                if (next.size >= 3) {
                    toast.info("Compare is limited to 3 candidates");
                    return prev;
                }
                next.add(id);
            }
            return next;
        });
    }, []);

    const clearCompare = useCallback(() => setCompareIds(new Set()), []);

    const toggleShortlist = useCallback((id: string) => {
        setShortlistedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);



    // We need activeTab handling for the Center Panel
    const [activeTab, setActiveTab] = useState<string>("ranked"); // "ranked" | "compare" | "pdf-{id}"
    const [openResumeTabs, setOpenResumeTabs] = useState<string[]>([]);

    // Evidence bookmarks (per-job, stored in sessionStorage)
    const [evidenceBookmarks, setEvidenceBookmarks] = useState<Record<string, string[]>>(
        () => loadSession<Record<string, string[]>>(job.id, "bookmarks", {})
    );
    useEffect(() => { saveSession(job.id, "bookmarks", evidenceBookmarks); }, [job.id, evidenceBookmarks]);

    const toggleBookmark = useCallback((candidateId: string, evidenceKey: string) => {
        setEvidenceBookmarks(prev => {
            const current = prev[candidateId] || [];
            const next = current.includes(evidenceKey)
                ? current.filter(k => k !== evidenceKey)
                : [...current, evidenceKey];
            return { ...prev, [candidateId]: next };
        });
    }, []);

    // Updated viewResume that opens a tab and switches to it
    const viewResumeTab = useCallback(async (id: string) => {
        setOpenResumeTabs(prev => prev.includes(id) ? prev : [...prev, id]);
        setActiveTab(`pdf-${id}`);
    }, []);

    const closeResumeTab = useCallback((id: string) => {
        setOpenResumeTabs(prev => prev.filter(t => t !== id));
        setActiveTab(prev => prev === `pdf-${id}` ? "ranked" : prev);
    }, []);

    return (
        <JobContext.Provider value={{
            job,
            documents,
            rankedCandidates,
            messages,
            uploadingFiles,
            setDocuments,
            setRankedCandidates,
            setMessages,
            handleUpload,
            handleDelete,
            handleRankQuery,
            handleSendMessage,
            compareIds,
            toggleCompare,
            clearCompare,
            shortlistedIds,
            toggleShortlist,
            viewResume: viewResumeTab, // Use tab switcher
            isRanking,
            isChatLoading,
            activeQuery,
            recentQueries,
            // Expose activeTab for CenterPanel
            activeTab,
            setActiveTab,
            closeResumeTab,
            openResumeTabs,
            filteredDocuments,
            filteredRankedCandidates,
            filters,
            setFilters,
            evidenceBookmarks,
            toggleBookmark,
            queryInput,
            setQueryInput
        }}>
            {children}
        </JobContext.Provider>
    );
}
