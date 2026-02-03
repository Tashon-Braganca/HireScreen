"use client";

import { FileText, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No resumes yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Drop PDFs above</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors"
        >
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {doc.status === "processing" && (
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              </div>
            )}
            {doc.status === "ready" && (
              <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              </div>
            )}
            {doc.status === "failed" && (
              <div className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {doc.filename.replace(/\.pdf$/i, "")}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {doc.status === "processing" && "Processing..."}
              {doc.status === "ready" && "Ready"}
              {doc.status === "failed" && "Failed"}
            </p>
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => handleDelete(doc.id, e)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
