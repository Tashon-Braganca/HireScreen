import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select(
            "id, email, full_name, avatar_url, subscription_status, queries_used, last_query_reset_date"
        )
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    const [{ count: jobsCount }, { count: docsCount }] = await Promise.all([
        supabase
            .from("jobs")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
        supabase
            .from("documents")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
    ]);

    return (
        <div className="max-w-[720px] mx-auto px-8 py-10">
            <header className="mb-8">
                <h1
                    className="text-[26px] leading-tight tracking-[-0.01em] font-bold text-[var(--text-ink)]"
                >
                    Settings
                </h1>
                <p
                    className="mt-1 text-[13px] font-normal text-[var(--text-dim)]"
                >
                    Manage your account and preferences.
                </p>
            </header>

            <SettingsClient
                profile={profile}
                jobsCount={jobsCount ?? 0}
                docsCount={docsCount ?? 0}
            />
        </div>
    );
}
