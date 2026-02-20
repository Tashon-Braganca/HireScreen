"use server";

import { createClient } from "@/lib/supabase/server";
import type { ImportedCandidate } from "@/types";

export interface ParsedImportCandidate {
  name: string;
  email: string;
  resume_url?: string;
  notes?: string;
}

export async function importCandidates(
  jobId: string,
  candidates: ParsedImportCandidate[]
): Promise<{ success: boolean; imported?: ImportedCandidate[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (!candidates || candidates.length === 0) {
    return { success: false, error: "No candidates to import" };
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("id, user_id")
    .eq("id", jobId)
    .single();

  if (!job || job.user_id !== user.id) {
    return { success: false, error: "Job not found" };
  }

  const insertData = candidates.map((c) => ({
    job_id: jobId,
    user_id: user.id,
    name: c.name,
    email: c.email,
    resume_url: c.resume_url || null,
    notes: c.notes || null,
  }));

  const { data, error } = await supabase
    .from("imported_candidates")
    .insert(insertData)
    .select();

  if (error) {
    console.error("[IMPORT] Error inserting candidates:", error);
    return { success: false, error: error.message };
  }

  return { success: true, imported: data as ImportedCandidate[] };
}

export async function getImportedCandidates(
  jobId: string
): Promise<ImportedCandidate[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("imported_candidates")
    .select("*")
    .eq("job_id", jobId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[IMPORT] Error fetching candidates:", error);
    return [];
  }

  return (data as ImportedCandidate[]) || [];
}

export async function deleteImportedCandidate(
  candidateId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("imported_candidates")
    .delete()
    .eq("id", candidateId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
