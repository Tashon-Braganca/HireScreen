"use client";

import { FileText, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Document } from "@/types";

interface CandidateListProps {
  documents: Document[];
  jobId: string;
}

export function CandidateList({ documents, jobId }: CandidateListProps) {
  const router = useRouter();

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this resume?")) return;

    try {
      const res = await fetch(`/api/jobs/${jobId}/documents/${docId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Resume deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <FileText className="h-10 w-10 mb-2 opacity-50" />
        <p className="text-sm">No resumes yet</p>
        <p className="text-xs">Upload PDFs to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 pr-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0">
              {doc.status === "processing" && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {doc.status === "ready" && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {doc.status === "failed" && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{doc.filename}</p>
              <p className="text-xs text-muted-foreground">
                {doc.status === "processing" && "Processing..."}
                {doc.status === "ready" && "Ready"}
                {doc.status === "failed" && "Failed to process"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleDelete(doc.id, e)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
