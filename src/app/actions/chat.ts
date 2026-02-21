"use server";

import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { generateAnswer } from "@/lib/openai/chat";
import { checkUserRateLimit } from "@/lib/ratelimit";

export async function chatWithJob(question: string, jobId: string, _filterDocumentIds?: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rateLimit = checkUserRateLimit(user.id);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many requests. Please wait ${rateLimit.resetInSeconds} seconds.`,
    };
  }

  try {
    console.log(`[CHAT] Generating embedding for: "${question}"`);
    const queryEmbedding = await createEmbedding(question);
    console.log(`[CHAT] Query embedding dimension: ${queryEmbedding.length}`);

    console.log(`[CHAT] Searching chunks for job ${jobId}...`);
    const { data: chunks, error: searchError } = await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: queryEmbedding,
        filter_job_id: jobId,
        match_threshold: 0.0,
        match_count: 8,
      }
    );

    if (searchError) {
      console.error("[CHAT] Search RPC error:", searchError);
      return { success: false, error: `Search failed: ${searchError.message}. Did you run the SQL migration?` };
    }

    console.log(`[CHAT] Found ${chunks?.length || 0} matching chunks`);

    if (!chunks || chunks.length === 0) {
      const { data: debugChunks, error: debugError } = await supabase
        .from("document_chunks")
        .select("id, document_id, chunk_index, content")
        .eq("job_id", jobId)
        .limit(3);

      console.log(`[CHAT] DEBUG: Total chunks in job: ${debugChunks?.length || 0}`, debugError || "");
      if (debugChunks && debugChunks.length > 0) {
        console.log(`[CHAT] DEBUG: Sample chunk content (first 100 chars): "${debugChunks[0].content?.substring(0, 100)}"`);

        const { data: embCheck } = await supabase
          .from("document_chunks")
          .select("id, embedding")
          .eq("job_id", jobId)
          .limit(1);

        const hasEmbedding = embCheck && embCheck.length > 0 && embCheck[0].embedding !== null;
        console.log(`[CHAT] DEBUG: Chunks have embeddings: ${hasEmbedding}`);

        if (hasEmbedding) {
          const emb = embCheck![0].embedding;
          const embType = typeof emb;
          const embIsArray = Array.isArray(emb);
          const embStr = typeof emb === 'string' ? emb.substring(0, 200) : JSON.stringify(emb).substring(0, 200);
          console.log(`[CHAT] DEBUG: Stored embedding type=${embType}, isArray=${embIsArray}, preview=${embStr}`);
          console.log(`[CHAT] DEBUG: Query embedding type=${typeof queryEmbedding}, isArray=${Array.isArray(queryEmbedding)}, first5=${JSON.stringify(queryEmbedding.slice(0, 5))}`);
        }
      }

      return {
        success: true,
        answer: "I checked the resumes but couldn't find any specific information matching your question. This might mean the embeddings weren't stored correctly or there are no processed resumes.",
        sources: []
      };
    }

    if (chunks.length > 0) {
      console.log(`[CHAT] Top match similarity: ${chunks[0].similarity}, filename: ${chunks[0].filename}`);
    }

    const topChunks = chunks.slice(0, 8);

    const contexts = topChunks.map((chunk: { content: string; filename?: string; page_number?: number }) => ({
      content: chunk.content,
      filename: chunk.filename || "Unknown Document",
      page: chunk.page_number ?? null
    }));

    const { answer, tokensUsed } = await generateAnswer(question, contexts);

    await supabase.from("queries").insert({
      job_id: jobId,
      user_id: user.id,
      question: question,
      answer: answer,
      tokens_used: tokensUsed
    });

    console.log(`[CHAT] Answer generated (${tokensUsed} tokens)`);

    return {
      success: true,
      answer,
      sources: topChunks.map((c: { filename: string; content: string }) => ({ filename: c.filename, snippet: c.content }))
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[CHAT] Error:", error);
    return { success: false, error: errorMessage };
  }
}
