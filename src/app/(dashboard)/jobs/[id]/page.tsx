import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JobHeader } from "@/components/jobs/job-header";
import { ResumeUploader } from "@/components/upload/resume-uploader";
import { ResumeList } from "@/components/jobs/resume-list";
import { QueryInterface } from "@/components/query/query-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    .limit(20);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const isPro = profile?.subscription_status === "pro";
  const resumeLimit = isPro ? 100 : 10;
  const canUpload = (documents?.length || 0) < resumeLimit;
  const hasResumes = (documents?.length || 0) > 0;
  const readyResumes = documents?.filter(d => d.status === "ready").length || 0;

  return (
    <div className="space-y-6">
      <JobHeader job={job} />

      <Tabs defaultValue={hasResumes ? "query" : "upload"} className="space-y-4">
        <TabsList>
          <TabsTrigger value="query" disabled={readyResumes === 0}>
            Ask Questions {readyResumes > 0 && `(${readyResumes} resumes)`}
          </TabsTrigger>
          <TabsTrigger value="upload">
            Upload Resumes
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({queries?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4">
          {readyResumes > 0 ? (
            <QueryInterface 
              jobId={id} 
              queries={queries || []}
              isPro={isPro}
              queriesUsed={profile?.queries_used || 0}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Upload and process some resumes first to start asking questions.
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <ResumeUploader 
            jobId={id} 
            canUpload={canUpload}
            currentCount={documents?.length || 0}
            limit={resumeLimit}
          />
          <ResumeList documents={documents || []} jobId={id} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <QueryInterface 
            jobId={id} 
            queries={queries || []}
            isPro={isPro}
            queriesUsed={profile?.queries_used || 0}
            showHistoryOnly
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
