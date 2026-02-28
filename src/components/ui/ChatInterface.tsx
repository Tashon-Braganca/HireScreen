"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Clock, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
      if (match[2]) parts.push(<strong key={key++} className="font-semibold text-[var(--text-ink)]">{match[2]}</strong>);
      else if (match[3]) parts.push(<code key={key++} className="px-1 py-0.5 bg-[var(--bg-raised)] rounded text-[10px] font-mono">{match[3]}</code>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { elements.push(<div key={i} className="h-1" />); }
    else if (trimmed.startsWith("### ")) elements.push(<h4 key={i} className="text-xs font-semibold text-[var(--text-ink)] mt-2 mb-0.5">{renderInline(trimmed.slice(4))}</h4>);
    else if (trimmed.startsWith("## ")) elements.push(<h3 key={i} className="text-sm font-semibold text-[var(--text-ink)] mt-2 mb-1">{renderInline(trimmed.slice(3))}</h3>);
    else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      elements.push(<div key={i} className="flex gap-1.5 ml-1 my-0.5"><span className="text-[var(--accent-sage)] font-medium flex-shrink-0">{trimmed.match(/^\d+/)![0]}.</span><span className="text-[var(--text-body)]">{renderInline(text)}</span></div>);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("\u2022 ")) {
      elements.push(<div key={i} className="flex gap-1.5 ml-2 my-0.5"><span className="text-[var(--accent-sage)] mt-0.5 flex-shrink-0 text-[10px]">&bull;</span><span className="text-[var(--text-body)]">{renderInline(trimmed.slice(2))}</span></div>);
    } else {
      elements.push(<p key={i} className="text-[var(--text-body)]">{renderInline(trimmed)}</p>);
    }
  }
  return <div className="space-y-0.5 text-xs leading-relaxed">{elements}</div>;
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
  const [showRecent, setShowRecent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const lastSubmitRef = useRef<number>(0);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (!input.trim() || isLoading || now - lastSubmitRef.current < 300) return;
    lastSubmitRef.current = now;
    const message = input;
    setInput("");
    await onSendMessage(message);
  }, [input, isLoading, onSendMessage]);

  const isTechnical = jobTitle?.toLowerCase().match(/engineer|dev|ml|ai|data|backend|frontend|fullstack|python|java/);

  const quickChips = isTechnical ? [
    "Who has the strongest system design experience?",
    "Which candidate has shipped production code?",
    "Who has the most relevant tech stack experience?",
    `Best fit for ${jobTitle}?`,
  ] : [
    "Who has the most relevant experience?",
    "Compare the top 3 candidates",
    "Who would ramp up fastest?",
    `Best match for ${jobTitle || "this role"}?`,
  ];

  const conversation = messages.filter((m) => m.id !== "1");
  const hasConversation = conversation.length > 0;

  return (
    <div className="h-full flex flex-col min-h-0 bg-[var(--bg-panel)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border-sub)] flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[var(--accent-sage)]/15 flex items-center justify-center">
            <Sparkles size={12} className="text-[var(--accent-sage)]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--text-ink)] leading-none">Ask</p>
            <p className="text-[10px] text-[var(--text-dim)] mt-0.5">Query resumes with natural language</p>
          </div>
        </div>
        {recentQueries.length > 0 && (
          <button
            onClick={() => setShowRecent(v => !v)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors",
              showRecent
                ? "bg-[var(--bg-raised)] text-[var(--text-ink)]"
                : "text-[var(--text-dim)] hover:text-[var(--text-body)] hover:bg-[var(--bg-raised)]"
            )}
          >
            <Clock size={10} />
            Recent
          </button>
        )}
      </div>

      {/* Recent queries dropdown */}
      <AnimatePresence>
        {showRecent && recentQueries.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden flex-shrink-0 border-b border-[var(--border-sub)]"
          >
            <div className="p-2 space-y-0.5">
              {recentQueries.slice(0, 6).map((q, i) => (
                <button
                  key={i}
                  onClick={() => { onRankQuery(q); setShowRecent(false); }}
                  className="w-full text-left text-xs text-[var(--text-dim)] hover:text-[var(--text-ink)] hover:bg-[var(--bg-raised)] px-2.5 py-1.5 rounded truncate transition-colors flex items-center gap-2"
                >
                  <span className="text-[var(--accent-sage)] flex-shrink-0 text-[9px]">&#8594;</span>
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 p-3 space-y-2">
        {!hasConversation && !isLoading && (
          <div className="pt-2">
            <p className="text-[10px] font-medium text-[var(--text-dim)] uppercase tracking-wider mb-2 px-1">Suggested</p>
            <div className="space-y-1.5">
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => onRankQuery(chip)}
                  disabled={isLoading}
                  className="w-full text-left text-[12px] px-3 py-2.5 rounded-lg border border-[var(--border-sub)] bg-transparent text-[var(--text-dim)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-body)] hover:border-[var(--border-vis)] transition-colors leading-snug"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {conversation.map((msg) => {
            if (msg.role === "user") {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[85%] text-xs bg-[var(--accent-sage)]/15 border border-[var(--accent-sage)]/20 text-[var(--text-body)] rounded-xl rounded-tr-sm px-3 py-2 leading-relaxed">
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            const isErr = msg.content.includes("Error") || msg.content.includes("failed");
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className={cn(
                  "max-w-[95%] text-xs rounded-xl rounded-tl-sm px-3 py-2.5",
                  isErr
                    ? "bg-[#3a1a1a] border border-[#5a2a2a] text-[#f87171]"
                    : "bg-[var(--bg-raised)] border border-[var(--border-sub)] text-[var(--text-body)]"
                )}>
                  {isErr && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-[#f87171] font-medium text-[11px]">
                      <AlertCircle size={11} />
                      Something went wrong
                    </div>
                  )}
                  <SimpleMarkdown content={msg.content} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-[var(--bg-raised)] border border-[var(--border-sub)] rounded-xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[var(--accent-sage)] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-[var(--accent-sage)] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-[var(--accent-sage)] rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input — pinned at bottom */}
      <div className="flex-shrink-0 border-t border-[var(--border-sub)] p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about resumes..."
            className="flex-1 bg-[var(--bg-raised)] border border-[var(--border-sub)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text-ink)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-sage)]/50 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 flex-shrink-0 bg-[var(--accent-sage)] text-[var(--bg-canvas)] rounded-lg flex items-center justify-center hover:bg-[var(--accent-sage)]/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
