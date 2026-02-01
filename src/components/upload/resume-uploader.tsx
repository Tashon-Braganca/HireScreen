"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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

      // Update status to uploading
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

        // Update to processing
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "processing", progress: 60 } : f
          )
        );

        // Simulate processing time
        await new Promise((r) => setTimeout(r, 500));

        // Complete
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
    toast.success("Resumes uploaded and processed!");
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
    
    // Trigger upload immediately for new files
    uploadFiles(filesToAdd);
  }, [limit, currentCount, files.length, uploadFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    disabled: !canUpload || isUploading,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const completedCount = files.filter((f) => f.status === "complete").length;

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "hover:border-primary/50"
        } ${!canUpload ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <CardContent className={compact ? "py-4 text-center" : "py-12 text-center"}>
          <input {...getInputProps()} />
          <Upload className={compact ? "h-6 w-6 mx-auto text-muted-foreground mb-2" : "h-12 w-12 mx-auto text-muted-foreground mb-4"} />
          <p className={compact ? "text-sm font-medium" : "font-medium mb-1"}>
            {isDragActive ? "Drop PDFs here" : compact ? "Drop PDFs" : "Drag & drop PDF resumes"}
          </p>
          {!compact && (
            <p className="text-sm text-muted-foreground">
              or click to browse (max 10MB each)
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {currentCount} / {limit} resumes
          </p>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadFile) => (
            <div
              key={uploadFile.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
            >
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                {uploadFile.status === "uploading" && (
                  <Progress value={uploadFile.progress} className="h-1 mt-1" />
                )}
                {uploadFile.status === "processing" && (
                  <p className="text-xs text-muted-foreground">Processing...</p>
                )}
                {uploadFile.status === "error" && (
                  <p className="text-xs text-red-600">{uploadFile.error}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                {uploadFile.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(uploadFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {(uploadFile.status === "uploading" || uploadFile.status === "processing") && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                {uploadFile.status === "complete" && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {uploadFile.status === "error" && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          ))}

          {pendingCount > 0 && isUploading && (
            <div className="flex items-center justify-center p-2 text-sm text-muted-foreground bg-secondary/50 rounded-md">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading {pendingCount} file{pendingCount > 1 ? "s" : ""}...
            </div>
          )}

          {completedCount > 0 && pendingCount === 0 && !isUploading && (
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              className="w-full"
            >
              Clear completed
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
