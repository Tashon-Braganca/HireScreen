import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createEmbeddings } from "@/lib/openai/embeddings";
import { chunkText, cleanText } from "@/lib/pdf/chunking";
import { extractText } from "unpdf";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const LIMITS = {
  free: { resumesPerJob: 10 },
  pro: { resumesPerJob: 100 },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const maxDuration = 60; // Allow up to 60 seconds for PDF processing

export async function POST(request: NextRequest, { params }: RouteParams) {
  const adminClient = createAdminClient();
  let documentId: string | null = null;

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

    // Check user limits - get or create profile
    let { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    // If profile doesn't exist (trigger didn't fire), create it
    if (!profile) {
      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || "User",
          subscription_status: "free",
        })
        .select("subscription_status")
        .single();

      if (profileError) {
        console.error("Failed to create profile:", profileError);
        return NextResponse.json(
          { success: false, error: { code: "PROFILE_ERROR", message: "Failed to create user profile" } },
          { status: 500 }
        );
      }
      profile = newProfile;
    }

    const isPro = profile?.subscription_status === "pro";
    const resumeLimit = isPro ? LIMITS.pro.resumesPerJob : LIMITS.free.resumesPerJob;

    // Count current documents for this job
    const { count: currentCount } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("job_id", jobId);

    if ((currentCount || 0) >= resumeLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "LIMIT_EXCEEDED", 
            message: `Resume limit reached (${resumeLimit}). ${!isPro ? "Upgrade to Pro for more." : ""}` 
          } 
        },
        { status: 403 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "No file provided" } },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Only PDF files are allowed" } },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "File size must be under 10MB" } },
        { status: 400 }
      );
    }

    // Create document record with processing status
    const { data: document, error: docError } = await supabase
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

    if (docError || !document) {
      console.error("Document insert error:", docError);
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: docError?.message || "Failed to create document record" } },
        { status: 500 }
      );
    }

    documentId = document.id;
    console.log(`[PDF] Created document record: ${documentId}`);

    // ============ PROCESS PDF SYNCHRONOUSLY ============
    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8Array = new Uint8Array(buffer);

    console.log(`[PDF] Parsing: ${file.name}, size: ${file.size} bytes`);

    // Parse PDF using unpdf
    let rawText = "";
    let pageCount = 1;
    
    try {
      const result = await extractText(uint8Array, { mergePages: true });
      rawText = result.text as string;
      pageCount = result.totalPages;
      console.log(`[PDF] Parsed successfully: ${pageCount} pages, ${rawText.length} chars`);
    } catch (pdfError) {
      console.error("[PDF] Parse error:", pdfError);
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "PDF_ERROR", message: "Failed to parse PDF. Make sure it's a valid text-based PDF." } },
        { status: 400 }
      );
    }

    if (!rawText || rawText.trim().length < 10) {
      console.error("[PDF] No text extracted");
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "PDF_ERROR", message: "Could not extract text from PDF. The PDF might be image-based or empty." } },
        { status: 400 }
      );
    }

    // Clean and chunk the text
    const cleanedText = cleanText(rawText);
    const chunks = chunkText(cleanedText);
    console.log(`[PDF] Created ${chunks.length} chunks`);

    if (chunks.length === 0) {
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "PDF_ERROR", message: "No text content found in PDF" } },
        { status: 400 }
      );
    }

    // Generate embeddings for all chunks
    console.log(`[PDF] Generating embeddings for ${chunks.length} chunks`);
    const chunkTexts = chunks.map((c) => c.content);
    
    let embeddings: number[][];
    try {
      embeddings = await createEmbeddings(chunkTexts);
      console.log(`[PDF] Generated ${embeddings.length} embeddings`);
    } catch (embeddingError) {
      console.error("[PDF] Embedding error:", embeddingError);
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "EMBEDDING_ERROR", message: "Failed to generate embeddings. Please try again." } },
        { status: 500 }
      );
    }

    // Prepare chunk records
    const chunkRecords = chunks.map((chunk, i) => ({
      document_id: documentId,
      job_id: jobId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      page_number: chunk.pageNumber,
      embedding: JSON.stringify(embeddings[i]),
    }));

    // Insert chunks using admin client
    console.log(`[PDF] Inserting ${chunkRecords.length} chunk records`);
    const { error: chunksError } = await adminClient
      .from("document_chunks")
      .insert(chunkRecords);

    if (chunksError) {
      console.error("[PDF] Chunks insert error:", chunksError);
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: `Failed to store chunks: ${chunksError.message}` } },
        { status: 500 }
      );
    }

    // Update document status to ready
    console.log(`[PDF] Updating document status to ready`);
    await adminClient
      .from("documents")
      .update({
        status: "ready",
        text_content: cleanedText.slice(0, 10000),
        page_count: pageCount,
      })
      .eq("id", documentId);

    // Update resume count on the job
    const { count } = await adminClient
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("job_id", jobId)
      .eq("status", "ready");

    await adminClient
      .from("jobs")
      .update({ resume_count: count || 0, updated_at: new Date().toISOString() })
      .eq("id", jobId);

    console.log(`[PDF] Complete! Document ${documentId} is ready`);

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          id: document.id, 
          filename: document.filename,
          status: "ready",
          pageCount,
          chunkCount: chunks.length
        } 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[PDF] Unexpected error:", error);
    
    // Mark document as failed if we have an ID
    if (documentId) {
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
    }
    
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
