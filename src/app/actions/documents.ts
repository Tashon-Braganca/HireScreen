"use server";

import { createClient } from "@/lib/supabase/server";
import { extractText } from "unpdf";
import { chunkText } from "@/lib/pdf/chunking";
import { createEmbeddings } from "@/lib/openai/embeddings";
import { extractContactInfo } from "@/lib/pdf/extract-contact";
import type { Document } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

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

  if (file.type !== "application/pdf") {
    return { success: false, error: "Invalid file type. Only PDF files are allowed." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "File size exceeds 10MB limit." };
  }

  const sanitizedName = sanitizeFilename(file.name);
  if (sanitizedName !== file.name) {
    console.log(`[UPLOAD] Sanitized filename: ${file.name} → ${sanitizedName}`);
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
    // 2. Parse PDF — IMPORTANT: copy buffer first, extractText detaches the original
    console.log(`[UPLOAD] Parsing PDF (${actualFileSize} bytes)...`);
    const pdfBuffer = arrayBuffer.slice(0); // defensive copy for storage upload later

    const { text, totalPages } = await extractText(
      new Uint8Array(pdfBuffer),
      { mergePages: true }
    );

    console.log(`[UPLOAD] Extracted ${text.length} chars, ${totalPages} pages`);

    if (!text || text.trim().length < 20) {
      console.warn(`[UPLOAD] Very little text extracted from ${file.name}`);
    }

    // Extract contact info
    const contact = extractContactInfo(text);
    console.log(`[UPLOAD] Extracted contact: name="${contact.name}", email="${contact.email}", phone="${contact.phone}"`);

    // Update page count + contact info
    await supabase
      .from("documents")
      .update({
        page_count: totalPages,
        candidate_name: contact.name,
        candidate_email: contact.email,
        candidate_phone: contact.phone,
      })
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
    // IMPORTANT: pgvector requires embeddings as string "[0.1, 0.2, ...]" not JS array
    const chunksToInsert = chunks.map((chunk, index) => ({
      document_id: doc.id,
      job_id: jobId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      embedding: `[${flatEmbeddings[index].join(',')}]`,
    }));

    console.log(`[UPLOAD] Inserting ${chunksToInsert.length} chunks into document_chunks...`);
    console.log(`[UPLOAD] Sample embedding format (first 5 values): [${flatEmbeddings[0].slice(0, 5).join(',')}...]`);

    const { error: chunkError, data: insertedChunks } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert)
      .select("id");

    if (chunkError) {
      console.error("[UPLOAD] Chunk insert error:", JSON.stringify(chunkError, null, 2));
      throw new Error(`Chunk insert failed: ${chunkError.message}`);
    }

    console.log(`[UPLOAD] Chunks inserted successfully: ${insertedChunks?.length || 0} rows`);

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

    // 8. Upload to Supabase Storage — use the ORIGINAL arrayBuffer (not the copy)
    console.log(`[UPLOAD] Uploading file to Storage (resumes bucket)...`);
    const storagePath = `${jobId}/${doc.id}/${file.name}`;
    const storageBuffer = arrayBuffer.slice(0); // fresh copy since original may be detached
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, storageBuffer, {
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
      document: { ...doc, status: "ready", page_count: totalPages, file_size: actualFileSize, file_path: storagePath, candidate_name: contact.name, candidate_email: contact.email, candidate_phone: contact.phone } as Document,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`[UPLOAD] ❌ FAILED: ${file.name} — ${errorMessage}`, error);
    if (doc) {
      await supabase
        .from("documents")
        .update({ status: "failed", error_message: errorMessage })
        .eq("id", doc.id);
    }
    return {
      success: false,
      error: `Processing failed: ${errorMessage}`,
      document: { ...doc, status: "failed", error_message: errorMessage } as Document,
    };
  }
}

export async function getResumeUrl(docId: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("file_path, job_id, filename")
    .eq("id", docId)
    .single();

  if (docError || !doc) {
    return { success: false, error: "Document not found" };
  }

  let filePath = doc.file_path;

  // Fallback: if no file_path stored, try to find in storage by listing
  if (!filePath) {
    console.log(`[PREVIEW] No file_path for doc ${docId}, trying storage listing...`);
    const { data: files } = await supabase.storage
      .from("resumes")
      .list(`${doc.job_id}/${docId}`);

    if (files && files.length > 0) {
      filePath = `${doc.job_id}/${docId}/${files[0].name}`;
      // Save it so future lookups are instant
      await supabase.from("documents").update({ file_path: filePath }).eq("id", docId);
      console.log(`[PREVIEW] Found and saved file_path: ${filePath}`);
    } else {
      return { success: false, error: "Resume file not found in storage. Try re-uploading." };
    }
  }

  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(filePath, 3600);

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

    const { error: rpcError } = await supabase.rpc("decrement_resume_count", { job_id_input: jobId });
    if (rpcError) {
      console.error("[DELETE] decrement_resume_count RPC error:", rpcError);
    }

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

export async function deleteResume(
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("id, user_id, job_id, file_path")
    .eq("id", documentId)
    .single();

  if (fetchError || !doc) {
    return { success: false, error: "Document not found" };
  }

  if (doc.user_id !== user.id) {
    return { success: false, error: "You don't have permission to delete this document" };
  }

  try {
    console.log(`[DELETE_RESUME] Deleting document ${documentId}`);

    const { error: chunksError } = await supabase
      .from("document_chunks")
      .delete()
      .eq("document_id", documentId);

    if (chunksError) {
      console.error("[DELETE_RESUME] Failed to delete chunks:", chunksError);
    }

    const { error: docError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (docError) {
      console.error("[DELETE_RESUME] Failed to delete document:", docError);
      throw docError;
    }

    const { error: rpcError } = await supabase.rpc("decrement_resume_count", {
      job_id_input: doc.job_id,
    });
    if (rpcError) {
      console.error("[DELETE_RESUME] decrement_resume_count RPC error:", rpcError);
    }

    if (doc.file_path) {
      const { error: storageError } = await supabase
        .storage
        .from("resumes")
        .remove([doc.file_path]);
      if (storageError) {
        console.warn("[DELETE_RESUME] Failed to remove file from storage:", storageError);
      }
    }

    console.log(`[DELETE_RESUME] ✅ Document ${documentId} deleted`);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Delete failed";
    console.error(`[DELETE_RESUME] ❌ FAILED: ${documentId} — ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}
