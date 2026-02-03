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

export const maxDuration = 60; // Allow up to 60 seconds for PDF processing

// Simple PDF text extraction that works in serverless
async function extractTextFromPDF(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  // Try unpdf first
  try {
    const { extractText } = await import("unpdf");
    const uint8Array = new Uint8Array(buffer);
    const result = await extractText(uint8Array, { mergePages: true });
    const text = typeof result.text === "string" ? result.text : (result.text as string[]).join("\n");
    console.log("[PDF] unpdf extracted text successfully");
    return { text, numPages: result.totalPages };
  } catch (unpdfError) {
    console.error("[PDF] unpdf failed:", unpdfError);
  }

  // Fallback: Basic text extraction from PDF bytes
  // This is a simple regex-based approach that works for most text-based PDFs
  try {
    const pdfString = buffer.toString("latin1");
    
    // Extract text between stream and endstream
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
    let allText = "";
    let match;
    
    while ((match = streamRegex.exec(pdfString)) !== null) {
      const content = match[1];
      // Look for text operators
      const textRegex = /\((.*?)\)/g;
      let textMatch;
      while ((textMatch = textRegex.exec(content)) !== null) {
        allText += textMatch[1] + " ";
      }
      // Also look for hex strings
      const hexRegex = /<([0-9A-Fa-f]+)>/g;
      let hexMatch;
      while ((hexMatch = hexRegex.exec(content)) !== null) {
        const hex = hexMatch[1];
        let decoded = "";
        for (let i = 0; i < hex.length; i += 2) {
          decoded += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        allText += decoded + " ";
      }
    }

    // Clean up the extracted text
    allText = allText
      .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (allText.length > 50) {
      console.log("[PDF] Fallback extraction got text:", allText.length, "chars");
      return { text: allText, numPages: 1 };
    }
  } catch (fallbackError) {
    console.error("[PDF] Fallback extraction failed:", fallbackError);
  }

  throw new Error("Could not extract text from PDF");
}

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

    console.log(`[PDF] File received: ${file.name}, size: ${file.size} bytes`);

    // Extract text from PDF
    let rawText: string;
    let pageCount: number;
    
    try {
      const result = await extractTextFromPDF(buffer);
      rawText = result.text;
      pageCount = result.numPages;
      console.log(`[PDF] Extracted: ${pageCount} pages, ${rawText.length} chars`);
    } catch (pdfError) {
      console.error("[PDF] Text extraction failed:", pdfError);
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "PDF_ERROR", message: "Failed to extract text from PDF. Make sure it's a text-based PDF, not a scanned image." } },
        { status: 400 }
      );
    }

    if (!rawText || rawText.trim().length < 20) {
      console.error("[PDF] Insufficient text:", rawText?.length || 0, "chars");
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "PDF_ERROR", message: "Could not extract enough text from PDF. The file might be empty, image-based, or encrypted." } },
        { status: 400 }
      );
    }

    // Clean and chunk the text
    const cleanedText = cleanText(rawText);
    const chunks = chunkText(cleanedText);
    console.log(`[PDF] Created ${chunks.length} text chunks`);

    if (chunks.length === 0) {
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "PDF_ERROR", message: "No text content found in PDF after processing" } },
        { status: 400 }
      );
    }

    // Generate embeddings for all chunks
    console.log(`[PDF] Generating embeddings for ${chunks.length} chunks...`);
    const chunkTexts = chunks.map((c) => c.content);
    
    let embeddings: number[][];
    try {
      embeddings = await createEmbeddings(chunkTexts);
      console.log(`[PDF] Generated ${embeddings.length} embeddings`);
    } catch (embeddingError) {
      console.error("[PDF] OpenAI embedding error:", embeddingError);
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "EMBEDDING_ERROR", message: "Failed to generate AI embeddings. Please try again." } },
        { status: 500 }
      );
    }

    // Prepare chunk records - Format embedding as array string for pgvector
    const chunkRecords = chunks.map((chunk, i) => ({
      document_id: documentId,
      job_id: jobId,
      content: chunk.content,
      page_number: chunk.pageNumber || 1,
      embedding: `[${embeddings[i].join(",")}]`, // pgvector format
    }));

    // Insert chunks using admin client
    console.log(`[PDF] Inserting ${chunkRecords.length} chunks into database...`);
    const { error: chunksError } = await adminClient
      .from("document_chunks")
      .insert(chunkRecords);

    if (chunksError) {
      console.error("[PDF] Database insert error:", chunksError);
      await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: `Database error: ${chunksError.message}` } },
        { status: 500 }
      );
    }

    // Update document status to ready
    console.log(`[PDF] Updating document to ready status...`);
    const { error: updateError } = await adminClient
      .from("documents")
      .update({
        status: "ready",
        text_content: cleanedText.slice(0, 10000),
        page_count: pageCount,
      })
      .eq("id", documentId);

    if (updateError) {
      console.error("[PDF] Document update error:", updateError);
    }

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

    console.log(`[PDF] SUCCESS! Document ${documentId} is ready with ${chunks.length} chunks`);

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          id: document.id, 
          filename: document.filename,
          status: "ready",
          pageCount,
          chunkCount: chunks.length,
          textLength: cleanedText.length
        } 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[PDF] Unexpected error:", error);
    
    // Mark document as failed if we have an ID
    if (documentId) {
      try {
        await adminClient.from("documents").update({ status: "failed" }).eq("id", documentId);
      } catch (e) {
        console.error("[PDF] Failed to update document status:", e);
      }
    }
    
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: String(error) } },
      { status: 500 }
    );
  }
}
