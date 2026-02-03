import { createClient } from "@/lib/supabase/server";
import { CreateJobButton } from "@/components/jobs/create-job-button";
import Link from "next/link";
import { 
  Briefcase, 
  GraduationCap, 
  ChevronRight,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
  Sparkles
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

  // Get total documents count
  const { count: totalResumes } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);

  // Get total queries count
  const { count: totalQueries } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);

  const isPro = profile?.subscription_status === "pro";
  const jobsLimit = isPro ? Infinity : 2;

  const totalPositions = allJobs?.length || 0;
  const canCreateMore = totalPositions < jobsLimit || isPro;

  // If no positions, show onboarding
  if (totalPositions === 0) {
    return <OnboardingView canCreateMore={canCreateMore} />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard 
            icon={<Briefcase className="h-5 w-5" />}
            value={totalPositions}
            label="Active Positions"
            trend="+2 this week"
            color="primary"
          />
          <StatCard 
            icon={<FileText className="h-5 w-5" />}
            value={totalResumes || 0}
            label="Total Resumes"
            trend="Ready to screen"
            color="blue"
          />
          <StatCard 
            icon={<MessageSquare className="h-5 w-5" />}
            value={totalQueries || 0}
            label="AI Queries"
            trend={`${(profile?.queries_used || 0)}/${isPro ? 1000 : 20} used`}
            color="purple"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Your Positions</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Click on a position to start screening candidates
            </p>
          </div>
          <CreateJobButton disabled={!canCreateMore} defaultType="job" />
        </div>

        {/* Positions Grid */}
        <div className="grid gap-4">
          {allJobs?.map((job, index) => (
            <PositionCard key={job.id} job={job} index={index} />
          ))}
        </div>

        {/* Quick Actions */}
        {canCreateMore && (
          <div className="mt-8 p-6 rounded-2xl border border-dashed border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Need more positions?</h3>
                <p className="text-sm text-muted-foreground mt-1">Add jobs or internships to organize your screening</p>
              </div>
              <div className="flex gap-3">
                <CreateJobButton disabled={!canCreateMore} defaultType="job" />
                <CreateJobButton disabled={!canCreateMore} defaultType="internship" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  value, 
  label, 
  trend, 
  color 
}: { 
  icon: React.ReactNode; 
  value: number; 
  label: string; 
  trend: string;
  color: 'primary' | 'blue' | 'purple';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  const iconBg = {
    primary: 'bg-primary/20',
    blue: 'bg-blue-500/20',
    purple: 'bg-purple-500/20',
  };

  return (
    <div className="group relative p-5 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconBg[color]}`}>
          {icon}
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-foreground tracking-tight">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
      <p className={`text-xs mt-2 ${color === 'primary' ? 'text-primary' : color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`}>
        {trend}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PositionCard({ job, index }: { job: any; index: number }) {
  const isInternship = job.type === "internship";
  const resumeCount = job.resume_count || 0;
  const updatedAt = new Date(job.updated_at || job.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  
  return (
    <Link href={`/jobs/${job.id}`}>
      <div 
        className="group relative flex items-center gap-5 p-5 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Gradient accent line */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isInternship ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gradient-to-b from-primary to-orange-500'}`} />
        
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Type Icon */}
        <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
          isInternship 
            ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-500' 
            : 'bg-gradient-to-br from-primary/20 to-orange-500/10 text-primary'
        }`}>
          {isInternship ? (
            <GraduationCap className="h-6 w-6" />
          ) : (
            <Briefcase className="h-6 w-6" />
          )}
        </div>

        {/* Content */}
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
              isInternship 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-primary/20 text-primary'
            }`}>
              {isInternship ? 'Internship' : 'Job'}
            </span>
          </div>
          {job.description && (
            <p className="text-sm text-muted-foreground truncate mt-1 max-w-md">
              {job.description}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="relative flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground tabular-nums">{resumeCount}</span>
            <span className="text-muted-foreground text-xs">resumes</span>
          </div>
          <div className="hidden sm:block text-xs text-muted-foreground">
            Updated {updatedAt}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function OnboardingView({ canCreateMore }: { canCreateMore: boolean }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-lg mx-auto px-6 text-center">
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 mb-8">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping opacity-20" />
        </div>
        
        {/* Headline */}
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          AI-Powered Resume Screening
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Upload resumes, ask natural language questions, get instant answers with citations.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <CreateJobButton disabled={!canCreateMore} defaultType="job" />
          <CreateJobButton disabled={!canCreateMore} defaultType="internship" />
        </div>

        {/* Features */}
        <div className="grid gap-4 text-left">
          <Feature 
            icon={<FileText className="h-5 w-5" />}
            title="Bulk Upload"
            description="Drop up to 100 PDF resumes at once"
          />
          <Feature 
            icon={<MessageSquare className="h-5 w-5" />}
            title="Natural Language"
            description='Ask "Who has React experience?" and get ranked results'
          />
          <Feature 
            icon={<Users className="h-5 w-5" />}
            title="Smart Ranking"
            description="AI finds the best candidates with cited sources"
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
