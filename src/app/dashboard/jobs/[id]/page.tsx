import React from "react";
import { getJob } from "@/app/actions/jobs";
import { getDocuments } from "@/app/actions/documents";
import { JobWorkspace } from "@/components/dashboard/JobWorkspace";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function JobPage({ params }: PageProps) {
  const job = await getJob(params.id);
  
  if (!job) {
    redirect("/dashboard");
  }

  const documents = await getDocuments(params.id);

  return <JobWorkspace job={job} documents={documents || []} />;
}
