import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Check if user is pro
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_status !== "pro") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "CSV export is a Pro feature" } },
        { status: 403 }
      );
    }

    // Verify job exists and belongs to user
    const { data: job } = await supabase
      .from("jobs")
      .select("id, title")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (!job) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Job not found" } },
        { status: 404 }
      );
    }

    // Get all queries for this job
    const { data: queries, error: queriesError } = await supabase
      .from("queries")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (queriesError) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: queriesError.message } },
        { status: 500 }
      );
    }

    if (!queries || queries.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NO_DATA", message: "No queries to export" } },
        { status: 400 }
      );
    }

    // Build CSV content
    const headers = ["Date", "Question", "Answer", "Sources"];
    const rows = queries.map((q) => {
      const date = new Date(q.created_at).toISOString();
      const question = escapeCSV(q.question);
      const answer = escapeCSV(q.answer);
      const sources = escapeCSV(
        (q.sources || [])
          .map((s: { filename: string; page?: number }) => 
            `${s.filename}${s.page ? ` (p.${s.page})` : ""}`
          )
          .join("; ")
      );
      return `${date},${question},${answer},${sources}`;
    });

    const csv = [headers.join(","), ...rows].join("\n");

    // Generate filename
    const safeTitle = job.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
    const filename = `hirescreen_${safeTitle}_queries_${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting queries:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

function escapeCSV(value: string): string {
  if (!value) return '""';
  // Escape double quotes by doubling them
  const escaped = value.replace(/"/g, '""');
  // Wrap in quotes if contains comma, newline, or quotes
  if (escaped.includes(",") || escaped.includes("\n") || escaped.includes('"')) {
    return `"${escaped}"`;
  }
  return `"${escaped}"`;
}
