"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Job, JobType } from "@/types";

export async function createJob(data: { title: string; description: string; type: JobType }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("jobs").insert({
    user_id: user.id,
    title: data.title,
    description: data.description,
    type: data.type,
    status: "active",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getJobs() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }

  return data as Job[];
}

export async function getJob(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data as Job;
}

export async function deleteJob(jobId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("id, user_id")
    .eq("id", jobId)
    .single();

  if (fetchError || !job) {
    return { success: false, error: "Job not found" };
  }

  if (job.user_id !== user.id) {
    return { success: false, error: "You don't have permission to delete this job" };
  }

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId);

  if (error) {
    console.error("[DELETE_JOB] Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
