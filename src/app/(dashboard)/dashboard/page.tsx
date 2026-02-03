import { createClient } from "@/lib/supabase/server";
import { CreateJobButton } from "@/components/jobs/create-job-button";
import Link from "next/link";
import { 
  Briefcase, 
  GraduationCap, 
  ChevronRight,
  FileText,
  Clock
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user?.id)
    .order("updated_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const isPro = profile?.subscription_status === "pro";
  const jobsLimit = isPro ? Infinity : 2;

  const totalPositions = allJobs?.length || 0;
  const canCreateMore = totalPositions < jobsLimit || isPro;

  // If no positions, show onboarding
  if (totalPositions === 0) {
    return <OnboardingView canCreateMore={canCreateMore} />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Positions</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {totalPositions} active
            </p>
          </div>
          <CreateJobButton disabled={!canCreateMore} defaultType="job" />
        </div>

        {/* Unified Position List - Efficient rows */}
        <div className="space-y-2">
          {allJobs?.map((job) => (
            <PositionRow key={job.id} job={job} />
          ))}
        </div>

        {/* Quick add for internship */}
        {canCreateMore && (
          <div className="mt-6 pt-6 border-t border-border">
            <CreateJobButton disabled={!canCreateMore} defaultType="internship" />
          </div>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PositionRow({ job }: { job: any }) {
  const isInternship = job.type === "internship";
  const resumeCount = job.resume_count || 0;
  const updatedAt = new Date(job.updated_at || job.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="group relative flex items-center gap-4 px-4 py-3.5 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 cursor-pointer">
        {/* Type Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
          isInternship 
            ? 'bg-blue-500/10 text-blue-500' 
            : 'bg-primary/10 text-primary'
        }`}>
          {isInternship ? (
            <GraduationCap className="h-4 w-4" />
          ) : (
            <Briefcase className="h-4 w-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider ${
              isInternship 
                ? 'bg-blue-500/10 text-blue-500' 
                : 'bg-primary/10 text-primary'
            }`}>
              {isInternship ? 'Intern' : 'Job'}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5" title="Resumes">
            <FileText className="h-4 w-4" />
            <span className="tabular-nums">{resumeCount}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs" title="Last updated">
            <Clock className="h-3.5 w-3.5" />
            <span>{updatedAt}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function OnboardingView({ canCreateMore }: { canCreateMore: boolean }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        {/* Simple Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        
        {/* Headline */}
        <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
          Start screening
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Create a position, upload resumes, and ask AI to find the best candidates.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <CreateJobButton disabled={!canCreateMore} defaultType="job" />
          <CreateJobButton disabled={!canCreateMore} defaultType="internship" />
        </div>

        {/* Simple How-it-works */}
        <div className="mt-10 pt-8 border-t border-border text-left">
          <div className="grid gap-3">
            <Step number="1" text="Create a job or internship position" />
            <Step number="2" text="Upload PDF resumes" />
            <Step number="3" text='Ask "Who has the most experience?"' />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex-shrink-0">
        {number}
      </div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
