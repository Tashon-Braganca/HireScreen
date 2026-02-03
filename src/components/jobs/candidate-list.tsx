"use client";

import { Loader2, CheckCircle, AlertCircle, Trash2, User } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/5 border border-primary/10 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-primary/50" />
        </div>
        <p className="text-base font-medium text-foreground">No candidates yet</p>
        <p className="text-sm text-muted-foreground mt-1">Upload resumes to see them here</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            className="group flex items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {doc.status === "processing" && (
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
              {doc.status === "ready" && (
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
              {doc.status === "failed" && (
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {doc.filename.replace(/\.pdf$/i, "")}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  doc.status === "processing" ? 'bg-primary/10 text-primary' :
                  doc.status === "ready" ? 'bg-green-500/10 text-green-600' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {doc.status === "processing" && "Processing"}
                  {doc.status === "ready" && "Ready"}
                  {doc.status === "failed" && "Failed"}
                </span>
                {doc.page_count && (
                  <span className="text-[10px] text-muted-foreground">
                    {doc.page_count} pages
                  </span>
                )}
              </div>
            </div>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => handleDelete(doc.id, e)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
