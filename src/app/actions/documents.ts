"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractText } from "unpdf";
import { chunkText } from "@/lib/pdf/chunking";
import { createEmbeddings } from "@/lib/openai/embeddings";

export async function uploadResume(formData: FormData, jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    return { success: false, error: docError?.message || "Failed to create document" };
  }

  // Start processing in background (but since Vercel serverless kills background tasks, 
  // we must await it if we want to be sure. To be "fast", we optimize the steps).
  
  try {
    // 2. Parse PDF (Fastest method)
    const arrayBuffer = await file.arrayBuffer();
    const { text, totalPages } = await extractText(new Uint8Array(arrayBuffer), {
        mergePages: true
    });
    
    // Update basic info
    await supabase.from("documents").update({ page_count: totalPages }).eq("id", doc.id);

    // 3. Chunk Text
    const chunks = chunkText(text);

    // 4. Generate Embeddings (Parallelized)
    // Create batches of 10 to avoid hitting API limits or timeouts
    const batchSize = 10;
    const chunkBatches = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
        chunkBatches.push(chunks.slice(i, i + batchSize));
    }

    const embeddings: number[][] = [];
    
    // Process batches in parallel
    await Promise.all(chunkBatches.map(async (batch) => {
        const batchTexts = batch.map(c => c.content);
        const batchEmbeddings = await createEmbeddings(batchTexts);
        embeddings.push(...batchEmbeddings);
    }));

    // Re-align embeddings with original chunks (Promise.all might finish out of order, but map preserves order of start)
    // Wait, createEmbeddings returns the array in order of input, so pushing spread is risky if batches finish out of order.
    // Let's fix that.
    
    const allEmbeddings = await Promise.all(
        chunkBatches.map(batch => createEmbeddings(batch.map(c => c.content)))
    );
    const flatEmbeddings = allEmbeddings.flat();

    // 5. Insert Chunks (Batch Insert)
    const chunksToInsert = chunks.map((chunk, index) => ({
      document_id: doc.id,
      job_id: jobId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      embedding: flatEmbeddings[index],
      page_number: 1 
    }));

    const { error: chunkError } = await supabase.from("document_chunks").insert(chunksToInsert);

    if (chunkError) throw new Error(chunkError.message);

    // 6. Mark as Ready
    await supabase
      .from("documents")
      .update({ status: "ready" })
      .eq("id", doc.id);

    // 7. Increment Resume Count
    await supabase.rpc('increment_resume_count', { job_id: jobId });

    revalidatePath(`/dashboard/jobs/${jobId}`);
    return { success: true };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Upload processing error:", error);
    if (doc) {
        await supabase.from("documents").update({ status: 'failed' }).eq('id', doc.id);
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

export async function deleteDocument(docId: string) {
    const supabase = await createClient();
    await supabase.from("documents").delete().eq("id", docId);
    revalidatePath("/dashboard/jobs/[id]"); 
}
