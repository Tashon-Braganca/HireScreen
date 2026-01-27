import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string; documentId: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: jobId, documentId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Verify document exists and belongs to user's job
    const { data: document } = await supabase
      .from("documents")
      .select("id, job_id, jobs!inner(user_id)")
      .eq("id", documentId)
      .eq("job_id", jobId)
      .single();

    if (!document) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Document not found" } },
        { status: 404 }
      );
    }

    // Delete chunks first (due to FK constraints)
    await supabase
      .from("document_chunks")
      .delete()
      .eq("document_id", documentId);

    // Delete the document
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("job_id", jobId);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: deleteError.message } },
        { status: 500 }
      );
    }

    // Update resume count on the job
    const { count } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("job_id", jobId)
      .eq("status", "ready");

    await supabase
      .from("jobs")
      .update({ resume_count: count || 0, updated_at: new Date().toISOString() })
      .eq("id", jobId);

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
