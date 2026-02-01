import { createClient } from "@/lib/supabase/server";
import { JobList } from "@/components/jobs/job-list";
import { CreateJobButton } from "@/components/jobs/create-job-button";
import { UsageCard } from "@/components/dashboard/usage-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, GraduationCap } from "lucide-react";

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
  const queriesLimit = isPro ? 1000 : 20;

  // Separate jobs and internships
  const jobs = allJobs?.filter(j => j.type === "job" || !j.type) || [];
  const internships = allJobs?.filter(j => j.type === "internship") || [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <UsageCard
          title="Positions Created"
          current={allJobs?.length || 0}
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

      <Tabs defaultValue="jobs" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="internships" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Internships ({internships.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Full-time Positions</h2>
              <p className="text-sm text-muted-foreground">
                AI will focus on experience, skills, and job stability
              </p>
            </div>
            <CreateJobButton 
              disabled={(allJobs?.length || 0) >= jobsLimit && !isPro}
              defaultType="job"
            />
          </div>
          <JobList jobs={jobs} />
        </TabsContent>

        <TabsContent value="internships" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Internship Positions</h2>
              <p className="text-sm text-muted-foreground">
                AI will focus on potential, coursework, and projects
              </p>
            </div>
            <CreateJobButton 
              disabled={(allJobs?.length || 0) >= jobsLimit && !isPro}
              defaultType="internship"
            />
          </div>
          <JobList jobs={internships} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
