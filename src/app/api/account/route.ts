import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/account - Get account usage stats
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { count: jobCount } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: documentCount } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: queryCount } = await supabase
      .from("queries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        stats: {
          jobs: jobCount || 0,
          documents: documentCount || 0,
          queries: queryCount || 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

// DELETE /api/account - Delete all user data (keeps account)
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Get all job IDs
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("user_id", user.id);

    const jobIds = jobs?.map((j) => j.id) || [];

    if (jobIds.length > 0) {
      // Delete document chunks
      await supabase
        .from("document_chunks")
        .delete()
        .in("job_id", jobIds);

      // Delete documents
      await supabase
        .from("documents")
        .delete()
        .eq("user_id", user.id);

      // Delete queries
      await supabase
        .from("queries")
        .delete()
        .eq("user_id", user.id);

      // Delete jobs
      await supabase
        .from("jobs")
        .delete()
        .eq("user_id", user.id);
    }

    // Reset profile stats
    await supabase
      .from("profiles")
      .update({
        queries_used: 0,
        jobs_created: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    });
  } catch (error) {
    console.error("Error deleting account data:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
