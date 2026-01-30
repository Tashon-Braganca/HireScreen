import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { generateAnswer } from "@/lib/openai/chat";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const LIMITS = {
  free: { queries: 20 },
  pro: { queries: 1000 },
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Verify job exists and belongs to user
    const { data: job } = await supabase
      .from("jobs")
      .select("id, user_id")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (!job) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Job not found" } },
        { status: 404 }
      );
    }

    // Check query limits
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, queries_used, last_query_reset_date")
      .eq("id", user.id)
      .single();

    // Check for monthly reset for free users
    let queriesUsed = profile?.queries_used || 0;
    const lastReset = profile?.last_query_reset_date ? new Date(profile.last_query_reset_date) : new Date(0);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (lastReset < oneMonthAgo) {
      // Reset the counter
      await supabase
        .from("profiles")
        .update({ 
          queries_used: 0, 
          last_query_reset_date: new Date().toISOString() 
        })
        .eq("id", user.id);
      queriesUsed = 0;
    }

    const isPro = profile?.subscription_status === "pro";
    const queryLimit = isPro ? LIMITS.pro.queries : LIMITS.free.queries;

    if (queriesUsed >= queryLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "LIMIT_EXCEEDED", 
            message: `Query limit reached (${queryLimit}). ${!isPro ? "Upgrade to Pro for more queries." : "Limit resets monthly."}` 
          } 
        },
        { status: 403 }
      );
    }

    // Parse request
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Question is required" } },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Question must be 500 characters or less" } },
        { status: 400 }
      );
    }

    // Check if there are any ready documents
    const { count: readyCount } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("job_id", jobId)
      .eq("status", "ready");

    if (!readyCount || readyCount === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NO_DOCUMENTS", message: "No processed resumes found. Upload and wait for processing." } },
        { status: 400 }
      );
    }

    // Generate embedding for the question
    const questionEmbedding = await createEmbedding(question.trim());

    // Search for similar chunks using pgvector
    // Using RPC function for vector similarity search
    const { data: similarChunks, error: searchError } = await supabase
      .rpc("match_document_chunks", {
        query_embedding: JSON.stringify(questionEmbedding),
        match_job_id: jobId,
        match_threshold: 0.5,
        match_count: 10,
      });

    if (searchError) {
      console.error("Vector search error:", searchError);
      // Fallback: get recent chunks if RPC fails
      const { data: fallbackChunks } = await supabase
        .from("document_chunks")
        .select(`
          id,
          content,
          page_number,
          document_id,
          documents!inner(filename)
        `)
        .eq("job_id", jobId)
        .limit(10);

      if (!fallbackChunks || fallbackChunks.length === 0) {
        return NextResponse.json(
          { success: false, error: { code: "NO_CONTENT", message: "No searchable content found" } },
          { status: 400 }
        );
      }
    }

    // Get document filenames for the matched chunks
    const chunkDocIds = Array.from(new Set((similarChunks || []).map((c: { document_id: string }) => c.document_id)));
    const { data: documents } = await supabase
      .from("documents")
      .select("id, filename")
      .in("id", chunkDocIds);

    const docMap = new Map((documents || []).map((d) => [d.id, d.filename]));

    // Prepare context for GPT
    const contexts = (similarChunks || []).map((chunk: {
      document_id: string;
      content: string;
      page_number: number | null;
      similarity?: number;
    }) => ({
      content: chunk.content,
      filename: docMap.get(chunk.document_id) || "Unknown",
      page: chunk.page_number,
    }));

    // Generate answer
    const { answer, tokensUsed } = await generateAnswer(question.trim(), contexts);

    // Build sources array
    const sources = (similarChunks || []).slice(0, 5).map((chunk: {
      document_id: string;
      content: string;
      page_number: number | null;
      similarity?: number;
    }) => ({
      document_id: chunk.document_id,
      filename: docMap.get(chunk.document_id) || "Unknown",
      page: chunk.page_number,
      snippet: chunk.content.slice(0, 200) + (chunk.content.length > 200 ? "..." : ""),
      similarity: chunk.similarity || 0,
    }));

    // Save the query
    const { data: savedQuery, error: saveError } = await supabase
      .from("queries")
      .insert({
        job_id: jobId,
        user_id: user.id,
        question: question.trim(),
        answer,
        sources,
        tokens_used: tokensUsed,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving query:", saveError);
    }

    // Increment queries_used
    await supabase
      .from("profiles")
      .update({ queries_used: queriesUsed + 1 })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      data: {
        id: savedQuery?.id,
        question: question.trim(),
        answer,
        sources,
        tokensUsed,
      },
    });
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
