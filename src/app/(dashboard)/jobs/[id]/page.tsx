import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeUploader } from "@/components/upload/resume-uploader";
import { CandidateList } from "@/components/jobs/candidate-list";
import { ChatPane } from "@/components/query/chat-pane";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, GraduationCap, Trash2 } from "lucide-react";
import Link from "next/link";
import { DeleteJobButton } from "@/components/jobs/delete-job-button";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (error || !job) {
    notFound();
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("job_id", id)
    .order("created_at", { ascending: false });

  const { data: queries } = await supabase
    .from("queries")
    .select("*")
    .eq("job_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const isPro = profile?.subscription_status === "pro";
  const resumeLimit = isPro ? 100 : 10;
  const canUpload = (documents?.length || 0) < resumeLimit;
  const readyResumes = documents?.filter(d => d.status === "ready") || [];
  const hasReadyResumes = readyResumes.length > 0;
  const jobType = (job.type as "job" | "internship") || "job";

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pb-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-zinc-100">{job.title}</h1>
              <Badge variant="outline" className="flex items-center gap-1 border-zinc-700 text-zinc-400">
                {jobType === "internship" ? (
                  <>
                    <GraduationCap className="h-3 w-3" />
                    Internship
                  </>
                ) : (
                  <>
                    <Briefcase className="h-3 w-3" />
                    Job
                  </>
                )}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">
              {readyResumes.length} / {resumeLimit} resumes
            </span>
            <DeleteJobButton jobId={job.id} />
          </div>
        </div>
        {job.description && (
          <p className="text-sm text-zinc-500 mt-2 ml-12">{job.description}</p>
        )}
        {jobType === "internship" && (
          <p className="text-xs text-zinc-600 mt-2 ml-12">
            AI is optimized for early-career screening: focusing on potential, coursework, and projects
          </p>
        )}
      </div>

      {/* Split Pane Layout */}
      <div className="flex-1 flex gap-4 pt-4 min-h-0">
        {/* Left Pane: Candidates */}
        <div className="w-80 flex-shrink-0 flex flex-col border-r border-zinc-800 pr-4 overflow-hidden">
          <div className="flex-shrink-0 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-zinc-300">
                Candidates
                <span className="ml-2 text-zinc-500 text-sm font-normal">
                  ({documents?.length || 0})
                </span>
              </h3>
            </div>
            <ResumeUploader 
              jobId={id} 
              canUpload={canUpload}
              currentCount={documents?.length || 0}
              limit={resumeLimit}
              compact
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <CandidateList documents={documents || []} jobId={id} />
          </div>
        </div>

        {/* Right Pane: Chat */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatPane 
            jobId={id}
            hasResumes={hasReadyResumes}
            queries={queries || []}
            isPro={isPro}
            queriesUsed={profile?.queries_used || 0}
            jobType={jobType}
          />
        </div>
      </div>
    </div>
  );
}
