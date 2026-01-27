import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createEmbeddings } from "@/lib/openai/embeddings";
import { chunkText, cleanText } from "@/lib/pdf/chunking";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const LIMITS = {
  free: { resumesPerJob: 10 },
  pro: { resumesPerJob: 100 },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    // Check user limits
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

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
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: "Failed to create document record" } },
        { status: 500 }
      );
    }

    // Process the PDF asynchronously but return immediately
    // In a production app, you'd use a queue like Inngest or Trigger.dev
    processDocument(document.id, jobId, file).catch((err) => {
      console.error("Error processing document:", err);
    });

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          id: document.id, 
          filename: document.filename,
          status: "processing" 
        } 
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

async function processDocument(
  documentId: string,
  jobId: string,
  file: File
) {
  const adminClient = createAdminClient();
  
  try {
    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF using dynamic import
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParseModule = await import("pdf-parse") as any;
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text;
    const pageCount = pdfData.numpages;

    if (!rawText || rawText.trim().length === 0) {
      throw new Error("Could not extract text from PDF");
    }

    // Clean and chunk the text
    const cleanedText = cleanText(rawText);
    const chunks = chunkText(cleanedText);

    if (chunks.length === 0) {
      throw new Error("No text content found in PDF");
    }

    // Generate embeddings for all chunks
    const chunkTexts = chunks.map((c) => c.content);
    const embeddings = await createEmbeddings(chunkTexts);

    // Prepare chunk records
    const chunkRecords = chunks.map((chunk, i) => ({
      document_id: documentId,
      job_id: jobId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      page_number: chunk.pageNumber,
      embedding: JSON.stringify(embeddings[i]),
    }));

    // Insert chunks using admin client (bypasses RLS for background processing)
    const { error: chunksError } = await adminClient
      .from("document_chunks")
      .insert(chunkRecords);

    if (chunksError) {
      throw new Error(`Failed to store chunks: ${chunksError.message}`);
    }

    // Update document status to ready
    await adminClient
      .from("documents")
      .update({
        status: "ready",
        text_content: cleanedText.slice(0, 10000), // Store first 10k chars for reference
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

  } catch (error) {
    console.error("Error processing document:", error);
    
    // Mark document as failed
    await adminClient
      .from("documents")
      .update({ status: "failed" })
      .eq("id", documentId);
  }
}
