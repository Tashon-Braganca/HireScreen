"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, FileText, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Query, QuerySource } from "@/types";

interface QueryInterfaceProps {
  jobId: string;
  queries: Query[];
  isPro: boolean;
  queriesUsed: number;
  showHistoryOnly?: boolean;
}

const QUERY_LIMITS = {
  free: 20,
  pro: 1000,
};

const EXAMPLE_QUESTIONS = [
  "Who has the most experience with Python?",
  "List all candidates with a Master's degree",
  "Which candidates have worked at FAANG companies?",
  "Compare the top 3 candidates for a senior role",
  "Who has experience with React and TypeScript?",
];

export function QueryInterface({
  jobId,
  queries,
  isPro,
  queriesUsed,
  showHistoryOnly = false,
}: QueryInterfaceProps) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<{
    answer: string;
    sources: QuerySource[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryLimit = isPro ? QUERY_LIMITS.pro : QUERY_LIMITS.free;
  const queriesRemaining = queryLimit - queriesUsed;
  const canQuery = queriesRemaining > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [question]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || isLoading || !canQuery) return;

    setIsLoading(true);
    setError(null);
    setCurrentAnswer(null);

    try {
      const response = await fetch(`/api/jobs/${jobId}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get answer");
      }

      setCurrentAnswer({
        answer: data.data.answer,
        sources: data.data.sources,
      });
      setQuestion("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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

  if (showHistoryOnly) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Query History</h3>
          {isPro && queries.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/api/jobs/${jobId}/export`} download>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </a>
            </Button>
          )}
        </div>
        {queries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No queries yet.</p>
              <p className="text-sm mt-1">Start asking questions to see your history.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {queries.map((query) => (
              <QueryCard key={query.id} query={query} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Query Input */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Ask a Question
            </CardTitle>
            <Badge variant={canQuery ? "secondary" : "destructive"}>
              {queriesRemaining} / {queryLimit} queries left
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about the resumes... (e.g., Who has the most Python experience?)"
                className="min-h-[60px] pr-12 resize-none"
                disabled={isLoading || !canQuery}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute bottom-2 right-2"
                disabled={!question.trim() || isLoading || !canQuery}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {!canQuery && (
              <p className="text-sm text-destructive">
                You&apos;ve reached your query limit.{" "}
                {!isPro && (
                  <a href="/settings" className="underline font-medium">
                    Upgrade to Pro
                  </a>
                )}
              </p>
            )}

            {/* Example Questions */}
            {!isLoading && !currentAnswer && (
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUESTIONS.slice(0, 3).map((example) => (
                  <Button
                    key={example}
                    type="button"
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
            )}
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-4 text-destructive text-sm">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Current Answer */}
      {currentAnswer && (
        <Card className="border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{currentAnswer.answer}</p>
            </div>
            {currentAnswer.sources.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentAnswer.sources.map((source, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {source.filename}
                        {source.page && ` (p.${source.page})`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent History */}
      {queries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Recent Queries
          </h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {queries.slice(0, 5).map((query) => (
                <QueryCard key={query.id} query={query} compact />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

function QueryCard({ query, compact = false }: { query: Query; compact?: boolean }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={compact ? "bg-muted/50" : ""}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-medium ${compact ? "text-sm" : ""}`}>
              {query.question}
            </p>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDate(query.created_at)}
            </span>
          </div>
          <p className={`text-muted-foreground ${compact ? "text-xs line-clamp-2" : "text-sm"}`}>
            {query.answer}
          </p>
          {query.sources && query.sources.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {query.sources.slice(0, 3).map((source, i) => (
                <Badge key={i} variant="outline" className="text-xs py-0">
                  {source.filename}
                </Badge>
              ))}
              {query.sources.length > 3 && (
                <Badge variant="outline" className="text-xs py-0">
                  +{query.sources.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
