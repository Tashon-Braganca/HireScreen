import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeUploader } from "@/components/upload/resume-uploader";
import { CandidateList } from "@/components/jobs/candidate-list";
import { ChatPane } from "@/components/query/chat-pane";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, GraduationCap } from "lucide-react";
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
  const isInternship = jobType === "internship";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Compact Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                isInternship ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'
              }`}>
                {isInternship ? (
                  <GraduationCap className="h-3.5 w-3.5" />
                ) : (
                  <Briefcase className="h-3.5 w-3.5" />
                )}
              </div>
              <h1 className="text-base font-medium text-foreground">{job.title}</h1>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider ${
                isInternship ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'
              }`}>
                {isInternship ? 'Internship' : 'Job'}
              </span>
            </div>
          </div>

          {/* Right: Resume count + Actions */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {readyResumes.length}/{resumeLimit} resumes
            </span>
            <DeleteJobButton jobId={job.id} />
          </div>
        </div>
      </header>

      {/* Main Content: Split Pane */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel: Resumes */}
        <aside className="w-[340px] flex-shrink-0 border-r border-border bg-card/30 flex flex-col">
          {/* Upload Zone */}
          <div className="p-4 border-b border-border">
            <ResumeUploader 
              jobId={id} 
              canUpload={canUpload}
              currentCount={documents?.length || 0}
              limit={resumeLimit}
              compact
            />
          </div>
          
          {/* Candidate List Header */}
          <div className="px-4 py-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-foreground">
                Candidates
              </h2>
              <span className="text-xs text-muted-foreground tabular-nums">
                {documents?.length || 0}
              </span>
            </div>
          </div>
          
          {/* Candidate List */}
          <div className="flex-1 overflow-y-auto">
            <CandidateList documents={documents || []} jobId={id} />
          </div>
        </aside>

        {/* Right Panel: AI Chat */}
        <main className="flex-1 flex flex-col min-h-0 bg-background">
          <ChatPane 
            jobId={id}
            hasResumes={hasReadyResumes}
            queries={queries || []}
            isPro={isPro}
            queriesUsed={profile?.queries_used || 0}
            jobType={jobType}
          />
        </main>
      </div>
    </div>
  );
}
