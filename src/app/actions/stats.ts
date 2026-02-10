"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { totalJobs: 0, totalCandidates: 0, queriesThisMonth: 0, queryLimit: 20 };

    // 1. Get total jobs and candidate count sum
    const { data: jobs } = await supabase
        .from("jobs")
        .select("resume_count")
        .eq("user_id", user.id);

    const totalJobs = jobs?.length || 0;
    const totalCandidates = jobs?.reduce((acc, job) => acc + (job.resume_count || 0), 0) || 0;

    // 2. Get queries this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: queries } = await supabase
        .from("queries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString());

    return {
        totalJobs,
        totalCandidates,
        queriesThisMonth: queries || 0,
        queryLimit: 20, // Free tier limit
    };
}
