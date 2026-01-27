import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LIMITS = {
  free: { jobs: 2 },
  pro: { jobs: 999999 },
};

// GET /api/jobs - List all jobs for the current user
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

    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Get user profile to check limits
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, jobs_created")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_status === "pro";
    const jobLimit = isPro ? LIMITS.pro.jobs : LIMITS.free.jobs;

    // Count current active jobs
    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");

    if ((count || 0) >= jobLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "LIMIT_EXCEEDED", 
            message: `You've reached the limit of ${jobLimit} jobs. ${!isPro ? "Upgrade to Pro for unlimited jobs." : ""}` 
          } 
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, description } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Title is required" } },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Title must be 100 characters or less" } },
        { status: 400 }
      );
    }

    // Create the job
    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        status: "active",
        resume_count: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Update jobs_created count in profile
    await supabase
      .from("profiles")
      .update({ jobs_created: (profile?.jobs_created || 0) + 1 })
      .eq("id", user.id);

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
