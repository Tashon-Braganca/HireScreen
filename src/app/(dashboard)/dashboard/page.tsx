import { createClient } from "@/lib/supabase/server";
import { JobList } from "@/components/jobs/job-list";
import { CreateJobButton } from "@/components/jobs/create-job-button";
import { UsageCard } from "@/components/dashboard/usage-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: jobs } = await supabase
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
  const queriesLimit = isPro ? 1000 : 20;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">
            Organize your resume screening by job or role
          </p>
        </div>
        <CreateJobButton 
          disabled={(jobs?.length || 0) >= jobsLimit && !isPro} 
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <UsageCard
          title="Jobs Created"
          current={jobs?.length || 0}
          limit={isPro ? "Unlimited" : jobsLimit}
          isPro={isPro}
        />
        <UsageCard
          title="Queries Used"
          current={profile?.queries_used || 0}
          limit={queriesLimit}
          isPro={isPro}
        />
        <UsageCard
          title="Plan"
          current={isPro ? "Pro" : "Free"}
          showUpgrade={!isPro}
          isPro={isPro}
        />
      </div>

      <JobList jobs={jobs || []} />
    </div>
  );
}
