"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  "List candidates with Python skills",
  "Who worked at FAANG?",
];

const INTERNSHIP_EXAMPLES = [
  "Best academic projects?",
  "Leadership experience?",
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

  // Empty state - no resumes
  if (!hasResumes) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Ready to screen</h3>
          <p className="text-muted-foreground text-sm">
            Upload resumes to start asking AI questions about candidates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-border bg-card/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI Assistant</span>
          <span className="text-xs text-muted-foreground">
            ({jobType === "internship" ? "Intern mode" : "Job mode"})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums">
            {queriesRemaining} queries left
          </span>
          {isPro && queries.length > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
              <a href={`/api/jobs/${jobId}/export`} download>
                <Download className="h-3 w-3 mr-1" />
                Export
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <div className="py-6 space-y-4 max-w-2xl mx-auto">
          {/* Empty state with examples */}
          {messages.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                Ask questions about your candidates
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    disabled={!canQuery}
                    className="px-3 py-1.5 text-xs rounded-full border border-border bg-card hover:bg-accent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
                    {msg.sources.slice(0, 4).map((source, j) => (
                      <span 
                        key={j} 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/50 text-[10px] text-muted-foreground"
                      >
                        <FileText className="h-3 w-3" />
                        {source.filename.length > 15 
                          ? source.filename.slice(0, 15) + "..." 
                          : source.filename}
                      </span>
                    ))}
                    {msg.sources.length > 4 && (
                      <span className="text-[10px] text-muted-foreground px-2">
                        +{msg.sources.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing resumes...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-card/30">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={canQuery ? "Ask about candidates..." : "Upload resumes first"}
              className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
              disabled={isLoading || !canQuery}
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg"
              disabled={!question.trim() || isLoading || !canQuery}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {!canQuery && queriesRemaining <= 0 && (
            <p className="text-xs text-destructive mt-2 text-center">
              Query limit reached.{" "}
              {!isPro && (
                <a href="/settings?tab=billing" className="underline">
                  Upgrade to Pro
                </a>
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
