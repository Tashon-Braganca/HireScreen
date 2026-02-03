"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, FileText, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Query, QuerySource } from "@/types";
import { toast } from "sonner";

interface ChatPaneProps {
  jobId: string;
  hasResumes: boolean;
  queries: Query[];
  isPro: boolean;
  queriesUsed: number;
  jobType: "job" | "internship";
}

const QUERY_LIMITS = {
  free: 20,
  pro: 1000,
};

const JOB_EXAMPLES = [
  "Who has the most experience?",
  "Python or AWS skills?",
  "FAANG experience?",
];

const INTERNSHIP_EXAMPLES = [
  "Best projects?",
  "Leadership?",
  "Most potential?",
];

export function ChatPane({
  jobId,
  hasResumes,
  queries,
  isPro,
  queriesUsed,
  jobType,
}: ChatPaneProps) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; sources?: QuerySource[] }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryLimit = isPro ? QUERY_LIMITS.pro : QUERY_LIMITS.free;
  const queriesRemaining = queryLimit - queriesUsed;
  const canQuery = queriesRemaining > 0 && hasResumes;

  const examples = jobType === "internship" ? INTERNSHIP_EXAMPLES : JOB_EXAMPLES;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || isLoading || !canQuery) return;

    const userQuestion = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get answer");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.data.answer, sources: data.data.sources },
      ]);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Header - Like "Speak ai" */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">HireScreen AI</h2>
            <p className="text-xs text-muted-foreground">
              {queriesRemaining} queries remaining
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="space-y-6">
            {/* AI Welcome */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-2xl rounded-tl-md px-4 py-3 max-w-[90%]">
                  <p className="text-sm text-foreground">
                    Hello, how can I help you screen candidates today?
                  </p>
                </div>
              </div>
            </div>

            {/* Example Questions */}
            {hasResumes && canQuery && (
              <div className="pl-11 space-y-2">
                <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleExampleClick(example)}
                      className="px-3 py-2 text-xs rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all duration-200"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Resumes State */}
            {!hasResumes && (
              <div className="pl-11">
                <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload resumes to start asking questions
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-3">
              {msg.role === "assistant" ? (
                <>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 rounded-2xl rounded-tl-md px-4 py-3">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Sources</p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.slice(0, 4).map((source, j) => (
                              <span 
                                key={j} 
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-background text-[10px] text-muted-foreground border border-border"
                              >
                                <FileText className="h-3 w-3" />
                                {source.filename.length > 12 
                                  ? source.filename.slice(0, 12) + "..." 
                                  : source.filename}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0 flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted/50 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing resumes...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Like the reference */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-card/50">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 p-2 bg-background border border-border rounded-2xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={canQuery ? "Ask our agent..." : "Upload resumes first"}
              className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground px-3 py-2"
              disabled={isLoading || !canQuery}
            />
            <div className="flex items-center gap-2 pr-1">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                <span>GPT-4</span>
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90"
                disabled={!question.trim() || isLoading || !canQuery}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send
                    <Send className="h-3.5 w-3.5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
        
        {!canQuery && queriesRemaining <= 0 && (
          <p className="text-xs text-destructive mt-3 text-center">
            Query limit reached.{" "}
            {!isPro && (
              <a href="/settings?tab=billing" className="underline font-medium">
                Upgrade to Pro
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
