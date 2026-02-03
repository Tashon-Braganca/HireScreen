import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeUploader } from "@/components/upload/resume-uploader";
import { CandidateList } from "@/components/jobs/candidate-list";
import { ChatPane } from "@/components/query/chat-pane";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, GraduationCap, Trash2, FileText, Users, Sparkles } from "lucide-react";
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
    <div className="h-[calc(100vh-4rem)] flex bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Left Panel - Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isInternship 
                    ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-500' 
                    : 'bg-gradient-to-br from-primary/20 to-orange-500/10 text-primary'
                }`}>
                  {isInternship ? (
                    <GraduationCap className="h-5 w-5" />
                  ) : (
                    <Briefcase className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">{job.title}</h1>
                  <p className="text-xs text-muted-foreground">
                    {isInternship ? 'Internship' : 'Job'} • {readyResumes.length} candidates ready
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                <span className="text-muted-foreground">{documents?.length || 0}</span>
                <span className="text-muted-foreground/60">/{resumeLimit}</span>
                <span className="text-muted-foreground ml-1">resumes</span>
              </div>
              <DeleteJobButton jobId={job.id} />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-6 py-4 border-b border-border/50">
          <div className="grid grid-cols-3 gap-4">
            <MiniStatCard 
              icon={<FileText className="h-4 w-4" />}
              value={documents?.length || 0}
              label="Resumes"
              color="primary"
            />
            <MiniStatCard 
              icon={<Users className="h-4 w-4" />}
              value={readyResumes.length}
              label="Ready"
              color="green"
            />
            <MiniStatCard 
              icon={<Sparkles className="h-4 w-4" />}
              value={queries?.length || 0}
              label="Queries"
              color="blue"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-6">
          {/* Upload Section */}
          <div className="mb-6">
            <ResumeUploader 
              jobId={id} 
              canUpload={canUpload}
              currentCount={documents?.length || 0}
              limit={resumeLimit}
              compact={false}
            />
          </div>

          {/* Candidates List */}
          <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Candidates</h2>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                {documents?.length || 0} uploaded
              </span>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <CandidateList documents={documents || []} jobId={id} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - AI Chat Sidebar */}
      <aside className="w-[420px] flex-shrink-0 border-l border-border bg-card/80 backdrop-blur-sm flex flex-col relative">
        {/* Chat gradient accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <ChatPane 
          jobId={id}
          hasResumes={hasReadyResumes}
          queries={queries || []}
          isPro={isPro}
          queriesUsed={profile?.queries_used || 0}
          jobType={jobType}
        />
      </aside>
    </div>
  );
}

function MiniStatCard({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  value: number; 
  label: string;
  color: 'primary' | 'blue' | 'green';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
