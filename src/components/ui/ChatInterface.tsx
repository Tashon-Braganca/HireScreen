"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Search, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/** Lightweight markdown renderer for findings */
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  const renderInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(
          <strong key={key++} className="font-semibold text-ink">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        parts.push(
          <code
            key={key++}
            className="px-1 py-0.5 bg-paper border border-border rounded text-[10px] font-mono"
          >
            {match[3]}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={i} className="h-1.5" />);
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="text-xs font-bold text-ink mt-2 mb-1">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-ink mt-2 mb-1">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <div key={i} className="flex gap-1.5 ml-1">
          <span className="text-accent font-medium flex-shrink-0">
            {trimmed.match(/^\d+/)![0]}.
          </span>
          <span>{renderInline(text)}</span>
        </div>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      elements.push(
        <div key={i} className="flex gap-1.5 ml-2">
          <span className="text-accent mt-0.5 flex-shrink-0">&bull;</span>
          <span>{renderInline(trimmed.slice(2))}</span>
        </div>
      );
    } else {
      elements.push(<p key={i}>{renderInline(trimmed)}</p>);
    }
  }

  return <div className="space-y-0.5">{elements}</div>;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  onRankQuery: (query: string) => void;
  isLoading?: boolean;
  recentQueries?: string[];
  jobTitle?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  onRankQuery,
  isLoading,
  recentQueries = [],
  jobTitle,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Debounce ref
  const lastSubmitRef = useRef<number>(0);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (!input.trim() || isLoading || now - lastSubmitRef.current < 300)
        return;
      lastSubmitRef.current = now;

      const message = input;
      setInput("");
      await onSendMessage(message);
    },
    [input, isLoading, onSendMessage]
  );

  // Quick-ask chips
  const quickChips = [
    "Who has the most experience?",
    "Compare top 3 candidates",
    "Who is the best fit?",
    `Best match for ${jobTitle || "this role"}?`,
  ];

  // Separate user and assistant messages to render as findings
  const findings = messages.filter((m) => m.role === "assistant" && m.id !== "1");
  const hasFindings = findings.length > 0;

  return (
    <div className="panel h-full flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded bg-accent flex items-center justify-center text-white">
          <Search size={14} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Ask</h3>
          <p className="text-[10px] text-muted">
            Query resumes with natural language
          </p>
        </div>
      </div>

      {/* Input Area — top position (evidence-first) */}
      <div className="p-3 border-b border-border flex-shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 p-1 pr-1.5 border border-border rounded focus-within:border-accent transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about resumes..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:outline-none min-w-0"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-accent text-white rounded hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Send size={12} />
            )}
          </button>
        </form>
        {isLoading && (
          <p className="text-[10px] text-accent mt-1.5 ml-1">Processing...</p>
        )}
      </div>

      {/* Suggested chips */}
      <div className="p-3 border-b border-border/50 flex-shrink-0">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">
          Suggested
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => onRankQuery(chip)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1.5 rounded border border-border bg-panel text-muted hover:bg-paper hover:text-ink hover:border-accent/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
      >
        {!hasFindings && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Search size={20} className="text-border mb-2" />
            <p className="text-xs text-muted">
              Ask anything about the uploaded resumes
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {/* Render findings (assistant messages) with their corresponding user query */}
          {messages
            .filter((m) => m.id !== "1")
            .map((msg) => {
              if (msg.role === "user") {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-accent bg-accent-bg border border-accent/20 rounded px-3 py-2"
                  >
                    <Search size={10} className="inline mr-1.5" />
                    {msg.content}
                  </motion.div>
                );
              }

              // Check if it's an error
              const isError =
                msg.content.includes("error") ||
                msg.content.includes("failed") ||
                msg.content.includes("Error");

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded border px-3 py-3 text-xs leading-relaxed",
                    isError
                      ? "border-[#B91C1C]/20 bg-[#FEF2F2] text-[#B91C1C]"
                      : "border-border bg-panel text-muted"
                  )}
                >
                  {isError && (
                    <div className="flex items-center gap-1.5 mb-2 text-[#B91C1C] font-medium">
                      <AlertCircle size={12} />
                      Something went wrong
                    </div>
                  )}
                  <SimpleMarkdown content={msg.content} />
                </motion.div>
              );
            })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded border border-border px-3 py-3 flex items-center gap-2"
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
              </div>
              <span className="text-xs text-muted">Analyzing...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Queries */}
      {recentQueries.length > 0 && (
        <div className="px-3 py-2 border-t border-border flex-shrink-0">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Clock size={9} /> Recent
          </p>
          <div className="space-y-0.5 max-h-20 overflow-y-auto">
            {recentQueries.slice(0, 5).map((q, i) => (
              <button
                key={i}
                onClick={() => onRankQuery(q)}
                className="text-left w-full text-xs text-muted hover:text-accent truncate transition-colors py-0.5"
              >
                &rarr; {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
