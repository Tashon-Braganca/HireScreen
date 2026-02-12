"use client";

import React, { useEffect, useState } from "react";
import { getResumeUrl } from "@/app/actions/documents";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";

interface ResumeViewerProps {
    documentId: string;
}

export function ResumeViewer({ documentId }: ResumeViewerProps) {
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        async function fetchUrl() {
            try {
                const res = await getResumeUrl(documentId);
                if (mounted) {
                    if (res.success && res.url) {
                        setUrl(res.url);
                    } else {
                        setError(res.error || "Failed to load resume");
                    }
                    setLoading(false);
                }
            } catch {
                if (mounted) {
                    setError("Network error loading resume");
                    setLoading(false);
                }
            }
        }

        fetchUrl();
        return () => { mounted = false; };
    }, [documentId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted">
                <Loader2 size={24} className="animate-spin mb-2" />
                <p className="text-xs">Loading preview...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[var(--error)]">
                <AlertCircle size={24} className="mb-2" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        );
    }

    if (!url) return null;

    return (
        <div className="h-full w-full bg-[var(--panel)]">
            <object
                data={url}
                type="application/pdf"
                className="w-full h-full"
            >
                {/* Fallback for browsers that can't render PDF inline */}
                <div className="flex flex-col items-center justify-center h-full text-muted gap-3">
                    <p className="text-sm">PDF preview not supported in this browser.</p>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-hover transition-colors"
                    >
                        <ExternalLink size={14} />
                        Open in new tab
                    </a>
                </div>
            </object>
        </div>
    );
}
