"use server";

import { createClient } from "@/lib/supabase/server";
import { FREE_TIER_LIMITS, PRO_TIER_LIMITS } from "@/config/limits";

export interface QueryHistoryItem {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

export async function getDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { 
        totalJobs: 0, 
        totalCandidates: 0, 
        queriesThisMonth: 0, 
        queryLimit: FREE_TIER_LIMITS.maxQueriesPerMonth,
        isPro: false,
        jobsUsed: 0,
        jobsLimit: FREE_TIER_LIMITS.maxJobs,
    };

    const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

    const isPro = profile?.subscription_status === "pro";
    const limits = isPro ? PRO_TIER_LIMITS : FREE_TIER_LIMITS;

    const { data: jobs } = await supabase
        .from("jobs")
        .select("resume_count")
        .eq("user_id", user.id);

    const totalJobs = jobs?.length || 0;
    const totalCandidates = jobs?.reduce((acc, job) => acc + (job.resume_count || 0), 0) || 0;

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
        queryLimit: limits.maxQueriesPerMonth === Infinity ? "unlimited" : limits.maxQueriesPerMonth,
        isPro,
        jobsUsed: totalJobs,
        jobsLimit: limits.maxJobs === Infinity ? "unlimited" : limits.maxJobs,
    };
}

export async function shouldShowLimitWarning(queriesThisMonth: number, queryLimit: number): Promise<{ show: boolean; percentage: number; message?: string }> {
    if (queryLimit === Infinity || typeof queryLimit !== 'number') {
        return { show: false, percentage: 0 };
    }
    
    const percentage = (queriesThisMonth / queryLimit) * 100;
    
    if (percentage >= 80 && percentage < 100) {
        return { 
            show: true, 
            percentage, 
            message: `You've used ${queriesThisMonth}/${queryLimit} free queries. Upgrade to Pro for unlimited access.` 
        };
    }
    
    if (percentage >= 100) {
        return { 
            show: true, 
            percentage: 100, 
            message: `You've reached your free query limit. Upgrade to Pro for unlimited access.` 
        };
    }
    
    return { show: false, percentage };
}

export async function getJobQueryHistory(jobId: string): Promise<QueryHistoryItem[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("queries")
        .select("id, question, answer, created_at")
        .eq("job_id", jobId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) {
        console.error("[GET_QUERY_HISTORY] Error:", error);
        return [];
    }

    return (data || []) as QueryHistoryItem[];
}
