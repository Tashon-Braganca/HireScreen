"use client";

import React, { useEffect, useState } from "react";
import { useJobContext } from "../JobContext";
import { getJobQueryHistory, QueryHistoryItem } from "@/app/actions/stats";
import { Clock, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function HistoryPanel() {
  const { job, setQueryInput } = useJobContext();
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      const data = await getJobQueryHistory(job.id);
      setHistory(data);
      setLoading(false);
    }
    loadHistory();
  }, [job.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Clock className="w-10 h-10 text-muted mb-3" />
        <p className="text-sm text-muted">No query history yet</p>
        <p className="text-xs text-muted/70 mt-1">Your past queries will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-lg bg-panel overflow-hidden"
          >
            <div
              className="p-3 cursor-pointer hover:bg-paper transition-colors"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    {item.question}
                  </p>
                  <p className="text-xs text-muted mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {formatRelativeTime(item.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQueryInput?.(item.question);
                    }}
                    className="p-1.5 text-muted hover:text-accent hover:bg-accent-bg rounded transition-colors"
                    title="Re-run query"
                  >
                    <RefreshCw size={14} />
                  </button>
                  {expandedId === item.id ? (
                    <ChevronUp size={16} className="text-muted flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-muted flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
            {expandedId === item.id && (
              <div className="px-3 pb-3 pt-0 border-t border-border">
                <div className="pt-3">
                  <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                    Answer
                  </p>
                  <div className="text-sm text-ink whitespace-pre-wrap bg-paper rounded p-2 max-h-64 overflow-y-auto">
                    {item.answer || "No answer recorded"}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
