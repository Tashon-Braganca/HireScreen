"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { FileText, X, Loader2, CheckCircle, CloudUpload } from "lucide-react";
import { toast } from "sonner";

interface ResumeUploaderProps {
  jobId: string;
  canUpload: boolean;
  currentCount: number;
  limit: number;
  compact?: boolean;
}

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  error?: string;
}

export function ResumeUploader({ jobId, canUpload, currentCount, limit, compact = false }: ResumeUploaderProps) {
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = useCallback(async (filesToUpload: UploadFile[]) => {
    if (filesToUpload.length === 0) return;
    setIsUploading(true);

    for (const uploadFile of filesToUpload) {
      if (uploadFile.status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading", progress: 20 } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", uploadFile.file);

        const response = await fetch(`/api/jobs/${jobId}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "Upload failed");
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "processing", progress: 60 } : f
          )
        );

        await new Promise((r) => setTimeout(r, 500));

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "complete", progress: 100 } : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "error", error: (error as Error).message }
              : f
          )
        );
      }
    }

    setIsUploading(false);
    router.refresh();
    toast.success("Resumes uploaded!");
  }, [jobId, router]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remaining = limit - currentCount - files.length;
    const filesToAdd = acceptedFiles.slice(0, remaining).map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: "pending" as const,
      progress: 0,
    }));
    
    setFiles((prev) => [...prev, ...filesToAdd]);
    uploadFiles(filesToAdd);
  }, [limit, currentCount, files.length, uploadFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      "application/pdf": [".pdf"],
      "application/x-pdf": [".pdf"],
      "application/acrobat": [".pdf"],
      "applications/vnd.pdf": [".pdf"],
      "text/pdf": [".pdf"],
      "text/x-pdf": [".pdf"],
    },
    disabled: !canUpload || isUploading,
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    onDropRejected: (rejections) => {
      rejections.forEach((rejection) => {
        const errors = rejection.errors.map(e => e.message).join(", ");
        toast.error(`${rejection.file.name}: ${errors}`);
      });
    },
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const activeUploads = files.filter((f) => f.status === "uploading" || f.status === "processing" || f.status === "pending");
  const completedCount = files.filter((f) => f.status === "complete").length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
          ${isDragActive 
            ? "border-primary bg-primary/10 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-accent/30"
          }
          ${!canUpload ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 pointer-events-none" />
        
        <input {...getInputProps()} />
        <div className={compact ? "py-8 px-6 text-center" : "py-12 px-6 text-center"}>
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 border border-primary/20 mb-4">
            <CloudUpload className={`h-8 w-8 text-primary ${isDragActive ? 'animate-bounce' : ''}`} />
          </div>
          <p className="text-lg font-semibold text-foreground">
            {isDragActive ? "Drop your files here" : "Drop PDF resumes here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse • Max 10MB per file
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-muted/50 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>{currentCount} / {limit} resumes uploaded</span>
          </div>
        </div>
      </div>

      {/* Active Uploads */}
      {activeUploads.length > 0 && (
        <div className="space-y-2 p-4 rounded-xl border border-border bg-card/50">
          <p className="text-xs font-medium text-muted-foreground mb-3">Uploading...</p>
          {activeUploads.map((uploadFile) => (
            <div
              key={uploadFile.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {uploadFile.status === "pending" && <FileText className="h-4 w-4 text-muted-foreground" />}
                {(uploadFile.status === "uploading" || uploadFile.status === "processing") && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {uploadFile.file.name}
                </p>
                {uploadFile.status === "uploading" && (
                  <Progress value={uploadFile.progress} className="h-1.5 mt-2" />
                )}
                {uploadFile.status === "processing" && (
                  <p className="text-[10px] text-primary mt-1">Processing with AI...</p>
                )}
              </div>
              {uploadFile.status === "pending" && (
                <button
                  onClick={() => removeFile(uploadFile.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed notification */}
      {completedCount > 0 && activeUploads.length === 0 && (
        <button
          onClick={() => setFiles([])}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium hover:bg-green-500/20 transition-colors"
        >
          <CheckCircle className="h-4 w-4" />
          {completedCount} resume{completedCount > 1 ? 's' : ''} uploaded successfully! Click to dismiss
        </button>
      )}
    </div>
  );
}
