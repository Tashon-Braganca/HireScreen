"use server";

import { createClient } from "@/lib/supabase/server";
import { extractText } from "unpdf";
import { chunkText } from "@/lib/pdf/chunking";
import { createEmbeddings } from "@/lib/openai/embeddings";
import type { Document } from "@/types";

export async function uploadResume(
  formData: FormData,
  jobId: string
): Promise<{ success: boolean; document?: Document; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // 1. Create Document Record Immediately (Optimistic)
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      job_id: jobId,
      user_id: user.id,
      filename: file.name,
      file_size: file.size,
      status: "processing",
    })
    .select()
    .single();

  if (docError || !doc) {
    return {
      success: false,
      error: docError?.message || "Failed to create document",
    };
  }

  try {
    // 2. Parse PDF
    const arrayBuffer = await file.arrayBuffer();
    const { text, totalPages } = await extractText(
      new Uint8Array(arrayBuffer),
      { mergePages: true }
    );

    // Update basic info
    await supabase
      .from("documents")
      .update({ page_count: totalPages })
      .eq("id", doc.id);

    // 3. Chunk Text
    const chunks = chunkText(text);

    // 4. Generate Embeddings (Parallelized in batches of 20)
    const batchSize = 20;
    const chunkBatches = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
      chunkBatches.push(chunks.slice(i, i + batchSize));
    }

    const allEmbeddings = await Promise.all(
      chunkBatches.map((batch) =>
        createEmbeddings(batch.map((c) => c.content))
      )
    );
    const flatEmbeddings = allEmbeddings.flat();

    // 5. Insert Chunks (Batch Insert)
    const chunksToInsert = chunks.map((chunk, index) => ({
      document_id: doc.id,
      job_id: jobId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      embedding: flatEmbeddings[index],
      page_number: 1,
    }));

    const { error: chunkError } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert);

    if (chunkError) throw new Error(chunkError.message);

    // 6. Mark as Ready
    await supabase
      .from("documents")
      .update({ status: "ready" })
      .eq("id", doc.id);

    // 7. Increment Resume Count
    await supabase.rpc("increment_resume_count", { job_id_input: jobId });

    // Return the completed document so client can update state directly
    return {
      success: true,
      document: { ...doc, status: "ready" } as Document,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Upload processing error:", error);
    if (doc) {
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", doc.id);
    }
    return { success: false, error: errorMessage };
  }
}

export async function getDocuments(jobId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function deleteDocument(
  docId: string,
  jobId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // Chunks are deleted by CASCADE from documents table
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", docId);

    if (error) throw error;

    // Decrement resume count
    await supabase.rpc("decrement_resume_count", { job_id_input: jobId });

    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Delete failed";
    console.error("Delete error:", error);
    return { success: false, error: errorMessage };
  }
}
