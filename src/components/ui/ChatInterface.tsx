"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sparkles, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";
import { motion, AnimatePresence } from "framer-motion";

/** Lightweight markdown renderer for chat messages */
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  const renderInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Handle **bold**, `code`, and plain text
    const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(<strong key={key++} className="font-semibold text-slate-900">{match[2]}</strong>);
      } else if (match[3]) {
        parts.push(<code key={key++} className="px-1 py-0.5 bg-slate-100 rounded text-[10px] font-mono">{match[3]}</code>);
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
      elements.push(<h4 key={i} className="text-xs font-bold text-slate-800 mt-2 mb-1">{renderInline(trimmed.slice(4))}</h4>);
    } else if (trimmed.startsWith("## ")) {
      elements.push(<h3 key={i} className="text-sm font-bold text-slate-800 mt-2 mb-1">{renderInline(trimmed.slice(3))}</h3>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <div key={i} className="flex gap-1.5 ml-1">
          <span className="text-indigo-400 font-medium flex-shrink-0">{trimmed.match(/^\d+/)![0]}.</span>
          <span>{renderInline(text)}</span>
        </div>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      elements.push(
        <div key={i} className="flex gap-1.5 ml-2">
          <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
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

  // Debounce ref to prevent rapid-fire submissions
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

  // Dynamic quick-ask chips
  const quickChips = [
    "Who has the most experience?",
    "Compare top 3 candidates",
    "Who can start immediately?",
    `Best fit for ${jobTitle || "this role"}?`,
  ];

  return (
    <BentoCard className="flex flex-col h-full min-h-0 relative p-0 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-100 flex items-center gap-2.5 bg-white/80 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
          <Bot size={14} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-800">AI Assistant</h3>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Ready
          </p>
        </div>
      </div>

      {/* Quick Ask Chips */}
      <div className="p-3 border-b border-slate-50 flex-shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Zap size={10} /> Quick Ask
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => onRankQuery(chip)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 scroll-smooth min-h-0"
      >
        {messages.length <= 1 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 opacity-50">
            <Sparkles size={20} className="text-indigo-400 mb-2" />
            <p className="text-xs text-slate-500">
              Ask anything about the resumes or use Quick Ask above
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-2 max-w-[95%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]",
                  msg.role === "assistant"
                    ? "bg-white text-indigo-600 border border-indigo-100 shadow-sm"
                    : "bg-slate-800 text-white"
                )}
              >
                {msg.role === "assistant" ? (
                  <Bot size={12} />
                ) : (
                  <User size={12} />
                )}
              </div>

              <div
                className={cn(
                  "p-2.5 rounded-xl text-xs leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm prose-chat"
                    : "bg-slate-800 text-white rounded-tr-none"
                )}
              >
                {msg.role === "assistant" ? (
                  <SimpleMarkdown content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 max-w-[95%]"
            >
              <div className="w-6 h-6 rounded-full bg-white text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot size={12} />
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-100 rounded-tl-none shadow-sm flex gap-1 items-center h-9">
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Queries */}
      {recentQueries.length > 0 && (
        <div className="px-3 py-2 border-t border-slate-50 flex-shrink-0 bg-white/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Clock size={9} /> Recent
          </p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {recentQueries.slice(0, 5).map((q, i) => (
              <button
                key={i}
                onClick={() => onRankQuery(q)}
                className="text-left w-full text-[11px] text-slate-500 hover:text-indigo-600 truncate transition-colors py-0.5"
              >
                → {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 z-10 flex-shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 p-1 pr-1.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about resumes..."
            className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none min-w-0"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Send size={12} />
          </button>
        </form>
      </div>
    </BentoCard>
  );
}
