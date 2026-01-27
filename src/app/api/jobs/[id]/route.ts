import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/jobs/[id] - Get a specific job
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !job) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Job not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] - Update a job
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Check job exists and belongs to user
    const { data: existingJob } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Job not found" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", message: "Title cannot be empty" } },
          { status: 400 }
        );
      }
      if (body.title.length > 100) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", message: "Title must be 100 characters or less" } },
          { status: 400 }
        );
      }
      updates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null;
    }

    if (body.status !== undefined) {
      if (!["active", "archived"].includes(body.status)) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid status" } },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "No valid fields to update" } },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data: job, error } = await supabase
      .from("jobs")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a job and all related data
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Check job exists and belongs to user
    const { data: existingJob } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Job not found" } },
        { status: 404 }
      );
    }

    // Delete document chunks first (due to FK constraints)
    await supabase
      .from("document_chunks")
      .delete()
      .eq("job_id", id);

    // Delete documents
    await supabase
      .from("documents")
      .delete()
      .eq("job_id", id);

    // Delete queries
    await supabase
      .from("queries")
      .delete()
      .eq("job_id", id);

    // Delete the job itself
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
