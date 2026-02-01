import { createClient } from "@/lib/supabase/server";
import { CreateJobButton } from "@/components/jobs/create-job-button";
import Link from "next/link";
import { 
  Briefcase, 
  GraduationCap, 
  ChevronRight,
  Sparkles,
  Users,
  FileText,
  Zap
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const isPro = profile?.subscription_status === "pro";
  const jobsLimit = isPro ? Infinity : 2;

  const jobs = allJobs?.filter(j => j.type === "job" || !j.type) || [];
  const internships = allJobs?.filter(j => j.type === "internship") || [];
  const totalPositions = allJobs?.length || 0;
  const canCreateMore = totalPositions < jobsLimit || isPro;

  // If no positions, show onboarding
  if (totalPositions === 0) {
    return <OnboardingView canCreateMore={canCreateMore} />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Your Positions</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {totalPositions} position{totalPositions !== 1 ? 's' : ''} • Click to screen candidates
            </p>
          </div>
          <CreateJobButton disabled={!canCreateMore} defaultType="job" />
        </div>

        {/* Positions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Jobs Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-md bg-amber-500/10">
                <Briefcase className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-zinc-300">Jobs</span>
              <span className="text-xs text-zinc-600 ml-auto">{jobs.length}</span>
            </div>
            
            <div className="space-y-3">
              {jobs.length === 0 ? (
                <EmptyCard type="job" canCreate={canCreateMore} />
              ) : (
                jobs.map((job) => <PositionCard key={job.id} job={job} />)
              )}
            </div>
          </div>

          {/* Internships Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-md bg-blue-500/10">
                <GraduationCap className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-zinc-300">Internships</span>
              <span className="text-xs text-zinc-600 ml-auto">{internships.length}</span>
            </div>
            
            <div className="space-y-3">
              {internships.length === 0 ? (
                <EmptyCard type="internship" canCreate={canCreateMore} />
              ) : (
                internships.map((job) => <PositionCard key={job.id} job={job} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PositionCard({ job }: { job: any }) {
  const isInternship = job.type === "internship";
  const resumeCount = job.resume_count || 0;
  
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200 cursor-pointer">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 w-1 h-full ${isInternship ? 'bg-blue-500' : 'bg-amber-500'}`} />
        
        <div className="flex items-center justify-between gap-4 pl-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-zinc-100 truncate group-hover:text-white transition-colors">
              {job.title}
            </h3>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {resumeCount} resume{resumeCount !== 1 ? 's' : ''}
              </span>
              {resumeCount > 0 && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <Zap className="h-3 w-3" />
                  Ready to screen
                </span>
              )}
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </div>
    </Link>
  );
}

function EmptyCard({ type, canCreate }: { type: "job" | "internship"; canCreate: boolean }) {
  const isJob = type === "job";
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-center">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${isJob ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
        {isJob ? (
          <Briefcase className={`h-5 w-5 ${isJob ? 'text-amber-500' : 'text-blue-500'}`} />
        ) : (
          <GraduationCap className="h-5 w-5 text-blue-500" />
        )}
      </div>
      <p className="text-sm text-zinc-500">No {type}s yet</p>
      {canCreate && (
        <div className="mt-3">
          <CreateJobButton disabled={!canCreate} defaultType={type} />
        </div>
      )}
    </div>
  );
}

function OnboardingView({ canCreateMore }: { canCreateMore: boolean }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 mb-8">
          <Sparkles className="h-8 w-8 text-amber-500" />
        </div>
        
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
          Screen resumes with AI
        </h1>
        <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto">
          Upload resumes, ask questions like &quot;Who has React experience?&quot;, and get ranked candidates instantly.
        </p>
        
        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <CreateJobButton disabled={!canCreateMore} defaultType="job" />
        </div>

        {/* How it works */}
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <Step 
            number="1" 
            title="Create a position" 
            description="Add a job or internship you're hiring for"
            icon={<Briefcase className="h-4 w-4" />}
          />
          <Step 
            number="2" 
            title="Upload resumes" 
            description="Drag & drop PDFs - we'll extract the data"
            icon={<Users className="h-4 w-4" />}
          />
          <Step 
            number="3" 
            title="Ask AI anything" 
            description="Natural language queries with cited answers"
            icon={<Sparkles className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, description, icon }: { 
  number: string; 
  title: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold">
          {number}
        </div>
        <span className="text-zinc-400">{icon}</span>
      </div>
      <h3 className="font-medium text-zinc-200 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  );
}
