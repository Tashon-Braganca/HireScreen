"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(data: { full_name: string }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ full_name: data.full_name, updated_at: new Date().toISOString() })
        .eq("id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function deleteAccount() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { data: jobs } = await supabase.from("jobs").select("id").eq("user_id", user.id);
    const jobIds = (jobs ?? []).map((job) => job.id);

    if (jobIds.length > 0) {
        await supabase.from("queries").delete().in("job_id", jobIds);
        await supabase.from("document_chunks").delete().in("job_id", jobIds);
    }

    await supabase.from("documents").delete().eq("user_id", user.id);
    await supabase.from("evidence_bookmarks").delete().eq("user_id", user.id);
    await supabase.from("imported_candidates").delete().eq("user_id", user.id);
    await supabase.from("jobs").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);

    await supabase.auth.signOut();

    // auth.admin.deleteUser requires a service role key; use /api/delete-account if full auth user deletion is needed.
    return { success: true };
}
