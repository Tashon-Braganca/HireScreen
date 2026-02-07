"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Job, Document } from "@/types";
import { ResumeList, UploadedFile } from "@/components/ui/ResumeList";
import { ChatInterface } from "@/components/ui/ChatInterface";
import { uploadResume, deleteDocument } from "@/app/actions/documents";
import { chatWithJob } from "@/app/actions/chat";
import { StatCard } from "@/components/ui/StatCard";
import { ArrowLeft, MoreHorizontal, Users, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner"; // Assuming sonner is installed from package.json

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface JobWorkspaceProps {
  job: Job;
  documents: Document[];
}

export function JobWorkspace({ job, documents }: JobWorkspaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      role: "assistant", 
      content: `Hello! I'm ready to help you screen candidates for the ${job.title} position. Upload some resumes to get started!`,
      timestamp: new Date()
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);

  // Map server docs to UI format
  const fileList: UploadedFile[] = [
    ...uploadingFiles,
    ...documents.map(d => ({
      id: d.id,
      name: d.filename,
      size: d.file_size || 0,
      status: d.status as "processing" | "ready" | "error" | "uploading",
    }))
  ];

  const handleUpload = async (files: File[]) => {
    // Optimistic UI
    const newUploads: UploadedFile[] = files.map(f => ({
      id: Math.random().toString(),
      name: f.name,
      size: f.size,
      status: "uploading"
    }));
    setUploadingFiles(prev => [...prev, ...newUploads]);

    // Process sequentially for now
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await uploadResume(formData, job.id);
        
        if (!res.success) {
          console.error(res.error);
          toast.error(`Upload failed: ${res.error}`);
        } else {
          toast.success("File uploaded successfully");
        }
      } catch (error) {
        console.error("Client Upload Error:", error);
        toast.error("Network error during upload. Please try again.");
      }
    }

    setUploadingFiles([]); // Clear optimistic state
    router.refresh(); // Fetch real data
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    router.refresh();
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    // Call API
    const res = await chatWithJob(content, job.id);
    
    setIsChatLoading(false);
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: res.success ? (res.answer || "No answer generated.") : (res.error || "Sorry, I encountered an error."),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 bg-white/60 hover:bg-white rounded-xl text-slate-500 hover:text-slate-900 transition-all border border-white/60 shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-medium text-slate-500">
                Active Recruiting • {documents.length} Candidates
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="icon" className="rounded-xl border-white/60 bg-white/60 hover:bg-white">
          <MoreHorizontal size={18} />
        </Button>
      </div>

      {/* Stats Row (The "Bento Boxes" from the image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Candidates" 
          value={documents.length} 
          icon={Users}
          className="bg-white/80"
        />
        <StatCard 
          label="Parsed Documents" 
          value={documents.filter(d => d.status === 'ready').length} 
          icon={FileText}
          trend={{ value: "100%", isPositive: true }}
          className="bg-white/80"
        />
        <StatCard 
          label="AI Interactions" 
          value={messages.length > 1 ? messages.length - 1 : 0} 
          icon={Activity}
          className="bg-white/80"
        />
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left: Files & Context */}
        <div className="lg:col-span-4 flex flex-col h-full">
           <ResumeList 
            files={fileList} 
            onUpload={handleUpload} 
            onDelete={handleDelete}
            isUploading={uploadingFiles.length > 0}
          />
        </div>

        {/* Right: Chat */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
          />
        </div>
      </div>
    </div>
  );
}
