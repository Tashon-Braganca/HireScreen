"use client";

import React, { useEffect, useState } from "react";
import { getResumeUrl } from "@/app/actions/documents";
import { Loader2, AlertCircle } from "lucide-react";

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
            } catch (_err) {
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
            <div className="flex flex-col items-center justify-center h-full text-red-500">
                <AlertCircle size={24} className="mb-2" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        );
    }

    if (!url) return null;

    return (
        <div className="h-full w-full bg-gray-100">
            <iframe
                src={url}
                className="w-full h-full border-none"
                title="Resume Preview"
            />
        </div>
    );
}
