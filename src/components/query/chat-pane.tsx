"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, FileText, Download, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  "Who has the most years of experience?",
  "List candidates with Python and AWS skills",
  "Which candidates worked at FAANG companies?",
];

const INTERNSHIP_EXAMPLES = [
  "Who has the best academic projects?",
  "List candidates with leadership experience",
  "Which candidates show the most potential?",
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryLimit = isPro ? QUERY_LIMITS.pro : QUERY_LIMITS.free;
  const queriesRemaining = queryLimit - queriesUsed;
  const canQuery = queriesRemaining > 0 && hasResumes;

  const examples = jobType === "internship" ? INTERNSHIP_EXAMPLES : JOB_EXAMPLES;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [question]);

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
      setMessages((prev) => prev.slice(0, -1)); // Remove the user message on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!hasResumes) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No resumes yet</h3>
            <p className="text-muted-foreground text-sm">
              Upload some resumes on the left to start asking questions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI Screening</span>
          <Badge variant="outline" className="text-xs">
            {jobType === "internship" ? (
              <><GraduationCap className="h-3 w-3 mr-1" /> Intern Mode</>
            ) : (
              <><Briefcase className="h-3 w-3 mr-1" /> Job Mode</>
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={canQuery ? "secondary" : "destructive"}>
            {queriesRemaining} queries left
          </Badge>
          {isPro && queries.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <a href={`/api/jobs/${jobId}/export`} download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-4" ref={scrollRef}>
        <div className="space-y-4 pr-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground text-sm">
                Ask questions about the candidates in natural language
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {examples.map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleExampleClick(example)}
                    disabled={!canQuery}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <>
                    <Separator className="my-2 bg-border/50" />
                    <div className="flex flex-wrap gap-1">
                      {msg.sources.slice(0, 4).map((source, j) => (
                        <Badge key={j} variant="outline" className="text-xs py-0 bg-background/50">
                          <FileText className="h-3 w-3 mr-1" />
                          {source.filename.slice(0, 20)}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex-shrink-0 pt-3 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              canQuery
                ? "Ask about the candidates..."
                : "Upload resumes to start"
            }
            className="min-h-[44px] max-h-[100px] resize-none"
            disabled={isLoading || !canQuery}
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 flex-shrink-0"
            disabled={!question.trim() || isLoading || !canQuery}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {!canQuery && queriesRemaining <= 0 && (
          <p className="text-xs text-destructive mt-2">
            Query limit reached. {!isPro && <a href="/settings?tab=billing" className="underline">Upgrade to Pro</a>}
          </p>
        )}
      </div>
    </div>
  );
}
