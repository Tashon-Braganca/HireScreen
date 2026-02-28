"use server";

import { createClient } from "@/lib/supabase/server";
import type { EvidenceBookmark } from "@/types";

// --- Get all bookmarks for a job ---

export async function getBookmarks(
  jobId: string
): Promise<{ success: boolean; bookmarks: EvidenceBookmark[]; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, bookmarks: [], error: "Not authenticated" };

    const { data, error } = await supabase
      .from("evidence_bookmarks")
      .select("*")
      .eq("job_id", jobId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[bookmarks] getBookmarks error:", error.message);
      return { success: false, bookmarks: [], error: error.message };
    }

    return { success: true, bookmarks: (data ?? []) as EvidenceBookmark[] };
  } catch (err) {
    console.error("[bookmarks] getBookmarks exception:", err);
    return { success: false, bookmarks: [], error: "Failed to load bookmarks" };
  }
}

// --- Add a bookmark ---

export async function addBookmark(params: {
  jobId: string;
  documentId: string | null;
  chunkId?: string | null;
  citationText: string;
  filename?: string | null;
  pageNumber?: number | null;
  content?: string | null;
  comment?: string | null;
}): Promise<{ success: boolean; bookmark?: EvidenceBookmark; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase
      .from("evidence_bookmarks")
      .insert({
        user_id: user.id,
        job_id: params.jobId,
        document_id: params.documentId,
        chunk_id: params.chunkId ?? null,
        citation_text: params.citationText,
        filename: params.filename ?? null,
        page_number: params.pageNumber ?? null,
        content: params.content ?? null,
        comment: params.comment ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("[bookmarks] addBookmark error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, bookmark: data as EvidenceBookmark };
  } catch (err) {
    console.error("[bookmarks] addBookmark exception:", err);
    return { success: false, error: "Failed to add bookmark" };
  }
}

// --- Remove a bookmark ---

export async function removeBookmark(
  bookmarkId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await supabase
      .from("evidence_bookmarks")
      .delete()
      .eq("id", bookmarkId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[bookmarks] removeBookmark error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[bookmarks] removeBookmark exception:", err);
    return { success: false, error: "Failed to remove bookmark" };
  }
}

// --- Toggle bookmark (add if missing, remove if exists) ---

export async function toggleBookmark(params: {
  jobId: string;
  documentId: string | null;
  citationText: string;
  chunkId?: string | null;
  filename?: string | null;
  pageNumber?: number | null;
  content?: string | null;
}): Promise<{ success: boolean; added: boolean; bookmark?: EvidenceBookmark; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, added: false, error: "Not authenticated" };

    // Check if bookmark already exists for this citation
    const { data: existing } = await supabase
      .from("evidence_bookmarks")
      .select("id")
      .eq("job_id", params.jobId)
      .eq("user_id", user.id)
      .eq("citation_text", params.citationText)
      .maybeSingle();

    if (existing) {
      // Remove it
      const { error } = await supabase
        .from("evidence_bookmarks")
        .delete()
        .eq("id", existing.id);

      if (error) return { success: false, added: false, error: error.message };
      return { success: true, added: false };
    } else {
      // Add it
      const { data, error } = await supabase
        .from("evidence_bookmarks")
        .insert({
          user_id: user.id,
          job_id: params.jobId,
          document_id: params.documentId,
          chunk_id: params.chunkId ?? null,
          citation_text: params.citationText,
          filename: params.filename ?? null,
          page_number: params.pageNumber ?? null,
          content: params.content ?? null,
        })
        .select()
        .single();

      if (error) return { success: false, added: false, error: error.message };
      return { success: true, added: true, bookmark: data as EvidenceBookmark };
    }
  } catch (err) {
    console.error("[bookmarks] toggleBookmark exception:", err);
    return { success: false, added: false, error: "Failed to toggle bookmark" };
  }
}
