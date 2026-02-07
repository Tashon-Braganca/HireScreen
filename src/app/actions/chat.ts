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
    const queryEmbedding = await createEmbedding(question);

    // 2. Search for relevant chunks
    const { data: chunks, error: searchError } = await supabase.rpc("match_document_chunks", {
      query_embedding: queryEmbedding,
      match_threshold: 0.4, // Lowered threshold slightly to ensure matches
      match_count: 5,
      filter_job_id: jobId,
    });

    if (searchError) {
      console.error("Search error (RPC match_document_chunks):", searchError);
      return { success: false, error: `Search failed: ${searchError.message}. Did you run the SQL migration?` };
    }

    if (!chunks || chunks.length === 0) {
      return { 
          success: true, 
          answer: "I checked the resumes but couldn't find any specific information matching your question.",
          sources: []
      };
    }

    // 3. Format Context for OpenAI
    const contexts = chunks.map((chunk: { content: string; filename?: string; page_number: number }) => ({
      content: chunk.content,
      filename: chunk.filename || "Unknown Document", 
      page: chunk.page_number
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

    return { 
        success: true, 
        answer,
        sources: chunks.map((c: { filename: string; content: string }) => ({ filename: c.filename, snippet: c.content }))
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Chat Action Error:", error);
    return { success: false, error: errorMessage };
  }
}
