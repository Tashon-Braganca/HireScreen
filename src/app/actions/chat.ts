"use server";

import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { generateAnswer } from "@/lib/openai/chat";

export async function chatWithJob(question: string, jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. Embed the question
    console.log(`[CHAT] Generating embedding for: "${question}"`);
    const queryEmbedding = await createEmbedding(question);
    console.log(`[CHAT] Query embedding dimension: ${queryEmbedding.length}`);

    // 2. Search for relevant chunks
    console.log(`[CHAT] Searching chunks for job ${jobId} with threshold 0.3...`);
    const { data: chunks, error: searchError } = await supabase.rpc("match_document_chunks", {
      query_embedding: queryEmbedding,
      match_threshold: 0.3, // Lowered from 0.4 to catch more results
      match_count: 10,
      filter_job_id: jobId,
    });

    if (searchError) {
      console.error("[CHAT] Search RPC error:", searchError);
      return { success: false, error: `Search failed: ${searchError.message}. Did you run the SQL migration?` };
    }

    console.log(`[CHAT] Found ${chunks?.length || 0} matching chunks`);

    // Debug: Check if ANY chunks exist for this job
    if (!chunks || chunks.length === 0) {
      const { data: debugChunks, error: debugError } = await supabase
        .from("document_chunks")
        .select("id, document_id, chunk_index, content")
        .eq("job_id", jobId)
        .limit(3);

      console.log(`[CHAT] DEBUG: Total chunks in job: ${debugChunks?.length || 0}`, debugError || "");
      if (debugChunks && debugChunks.length > 0) {
        console.log(`[CHAT] DEBUG: Sample chunk content (first 100 chars): "${debugChunks[0].content?.substring(0, 100)}"`);

        // Check if embeddings exist
        const { data: embCheck } = await supabase
          .from("document_chunks")
          .select("id, embedding")
          .eq("job_id", jobId)
          .limit(1);

        const hasEmbedding = embCheck && embCheck.length > 0 && embCheck[0].embedding !== null;
        console.log(`[CHAT] DEBUG: Chunks have embeddings: ${hasEmbedding}`);
      }

      return {
        success: true,
        answer: "I checked the resumes but couldn't find any specific information matching your question. This might mean the embeddings weren't stored correctly or there are no processed resumes.",
        sources: []
      };
    }

    // Log top match similarity
    if (chunks.length > 0) {
      console.log(`[CHAT] Top match similarity: ${chunks[0].similarity}, filename: ${chunks[0].filename}`);
    }

    // 3. Format Context for OpenAI
    const contexts = chunks.map((chunk: { content: string; filename?: string; page_number?: number }) => ({
      content: chunk.content,
      filename: chunk.filename || "Unknown Document",
      page: chunk.page_number ?? null
    }));

    // 4. Generate Answer
    const { answer, tokensUsed } = await generateAnswer(question, contexts);

    // 5. Save Query
    await supabase.from("queries").insert({
      job_id: jobId,
      user_id: user.id,
      question: question,
      answer: answer,
      tokens_used: tokensUsed
    });

    console.log(`[CHAT] ✅ Answer generated (${tokensUsed} tokens)`);

    return {
      success: true,
      answer,
      sources: chunks.map((c: { filename: string; content: string }) => ({ filename: c.filename, snippet: c.content }))
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[CHAT] ❌ Error:", error);
    return { success: false, error: errorMessage };
  }
}
