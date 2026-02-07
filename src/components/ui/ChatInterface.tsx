"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput("");
    await onSendMessage(message);
  };

  return (
    <BentoCard className="flex flex-col h-full min-h-[600px] relative p-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <Bot size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">HireScreen AI</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online & Ready
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4">
              <Sparkles size={32} />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Ask anything about the candidates</h4>
            <p className="text-sm text-slate-500 max-w-xs">
              &quot;Who has the most React experience?&quot;<br/>
              &quot;Compare the top 3 candidates&quot;<br/>
              &quot;Draft an email to John Doe&quot;
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-sm",
                msg.role === "assistant" ? "bg-white text-indigo-600 border border-indigo-100" : "bg-slate-800 text-white"
              )}>
                {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === "assistant" 
                  ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none" 
                  : "bg-slate-800 text-white rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
             <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-none shadow-sm flex gap-1 items-center h-[52px]">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 z-10">
        <form 
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 pr-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the resumes..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-w-0"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="text-[10px] text-center text-slate-400 mt-2 font-medium">
          AI can make mistakes. Please verify important information.
        </div>
      </div>
    </BentoCard>
  );
}
