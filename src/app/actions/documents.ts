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
    console.error("[UPLOAD] Unauthorized — no user session");
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    console.error("[UPLOAD] No file in FormData");
    return { success: false, error: "No file provided" };
  }

  console.log(`[UPLOAD] Starting: ${file.name} (${file.size} bytes) for job ${jobId}`);

  // Read file content first so we get actual byte size
  const arrayBuffer = await file.arrayBuffer();
  const actualFileSize = arrayBuffer.byteLength;
  console.log(`[UPLOAD] Actual file size from buffer: ${actualFileSize} bytes`);

  // 1. Create Document Record Immediately
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      job_id: jobId,
      user_id: user.id,
      filename: file.name,
      file_size: actualFileSize,
      status: "processing",
    })
    .select()
    .single();

  if (docError || !doc) {
    console.error("[UPLOAD] Failed to create document record:", docError);
    return {
      success: false,
      error: docError?.message || "Failed to create document",
    };
  }

  console.log(`[UPLOAD] Document record created: ${doc.id}`);

  try {
    // 2. Parse PDF
    console.log(`[UPLOAD] Parsing PDF (${actualFileSize} bytes)...`);

    const { text, totalPages } = await extractText(
      new Uint8Array(arrayBuffer),
      { mergePages: true }
    );

    console.log(`[UPLOAD] Extracted ${text.length} chars, ${totalPages} pages`);

    if (!text || text.trim().length < 20) {
      console.warn(`[UPLOAD] Very little text extracted from ${file.name}`);
    }

    // Update page count
    await supabase
      .from("documents")
      .update({ page_count: totalPages })
      .eq("id", doc.id);

    // 3. Chunk Text
    const chunks = chunkText(text);
    console.log(`[UPLOAD] Created ${chunks.length} chunks`);

    if (chunks.length === 0) {
      console.warn(`[UPLOAD] No chunks generated for ${file.name} — marking as ready anyway`);
      await supabase
        .from("documents")
        .update({ status: "ready" })
        .eq("id", doc.id);
      return {
        success: true,
        document: { ...doc, status: "ready", page_count: totalPages } as Document,
      };
    }

    // 4. Generate Embeddings (batches of 20)
    const batchSize = 20;
    const chunkBatches = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
      chunkBatches.push(chunks.slice(i, i + batchSize));
    }

    console.log(`[UPLOAD] Generating embeddings for ${chunks.length} chunks in ${chunkBatches.length} batches...`);

    const allEmbeddings = await Promise.all(
      chunkBatches.map((batch) =>
        createEmbeddings(batch.map((c) => c.content))
      )
    );
    const flatEmbeddings = allEmbeddings.flat();

    console.log(`[UPLOAD] Got ${flatEmbeddings.length} embeddings, first dimension: ${flatEmbeddings[0]?.length || 'N/A'}`);

    // 5. Insert Chunks (Batch Insert)
    const chunksToInsert = chunks.map((chunk, index) => ({
      document_id: doc.id,
      job_id: jobId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      embedding: flatEmbeddings[index],
    }));

    console.log(`[UPLOAD] Inserting ${chunksToInsert.length} chunks into document_chunks...`);

    const { error: chunkError } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert);

    if (chunkError) {
      console.error("[UPLOAD] Chunk insert error:", chunkError);
      throw new Error(chunkError.message);
    }

    console.log(`[UPLOAD] Chunks inserted successfully`);

    // 6. Mark as Ready
    const { error: updateError } = await supabase
      .from("documents")
      .update({ status: "ready" })
      .eq("id", doc.id);

    if (updateError) {
      console.error("[UPLOAD] Failed to update status to ready:", updateError);
    }

    // 7. Increment Resume Count
    const { error: rpcError } = await supabase.rpc("increment_resume_count", { job_id_input: jobId });
    if (rpcError) {
      console.error("[UPLOAD] increment_resume_count RPC error:", rpcError);
    }

    // 8. Upload to Supabase Storage
    console.log(`[UPLOAD] Uploading file to Storage (resumes bucket)...`);
    const storagePath = `${jobId}/${doc.id}/${file.name}`;
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, arrayBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (storageError) {
      console.error("[UPLOAD] Storage upload error (continuing anyway):", storageError);
      // We don't fail the whole process if storage fails, but it will break previews
    } else {
      console.log(`[UPLOAD] Storage upload successful: ${storagePath}`);
      await supabase.from("documents").update({ file_path: storagePath }).eq("id", doc.id);
    }

    console.log(`[UPLOAD] ✅ Complete: ${file.name} → ready`);

    return {
      success: true,
      document: { ...doc, status: "ready", page_count: totalPages, file_size: actualFileSize, file_path: storagePath } as Document,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`[UPLOAD] ❌ FAILED: ${file.name} — ${errorMessage}`, error);
    if (doc) {
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", doc.id);
    }
    // Return the failed document so UI can show it with error status
    return {
      success: false,
      error: errorMessage,
      document: { ...doc, status: "failed" } as Document,
    };
  }
}

export async function getResumeUrl(docId: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", docId)
    .single();

  if (docError || !doc?.file_path) {
    return { success: false, error: "Resume file not found" };
  }

  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(doc.file_path, 3600); // 1 hour

  if (error || !data?.signedUrl) {
    return { success: false, error: "Failed to generate preview link" };
  }

  return { success: true, url: data.signedUrl };
}

export async function getDocuments(jobId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET_DOCS] Error fetching documents:", error);
  }

  return data || [];
}

export async function deleteDocument(
  docId: string,
  jobId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  console.log(`[DELETE] Deleting document ${docId} from job ${jobId}`);

  try {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", docId);

    if (error) {
      console.error("[DELETE] Delete error:", error);
      throw error;
    }

    // Decrement resume count
    const { error: rpcError } = await supabase.rpc("decrement_resume_count", { job_id_input: jobId });
    if (rpcError) {
      console.error("[DELETE] decrement_resume_count RPC error:", rpcError);
    }

    // Cleanup Storage
    const { data: doc } = await supabase.from("documents").select("file_path").eq("id", docId).single();
    if (doc?.file_path) {
      const { error: storageError } = await supabase.storage.from("resumes").remove([doc.file_path]);
      if (storageError) {
        console.warn("[DELETE] Failed to remove file from storage:", storageError);
      } else {
        console.log(`[DELETE] Storage file removed: ${doc.file_path}`);
      }
    }

    console.log(`[DELETE] ✅ Document ${docId} deleted`);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Delete failed";
    console.error(`[DELETE] ❌ FAILED: ${docId} — ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}
