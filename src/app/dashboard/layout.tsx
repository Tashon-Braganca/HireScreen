import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { TopNav } from "@/components/layout/TopNav";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, avatar_url, subscription_status, queries_used")
    .eq("id", user.id)
    .single();

  return (
    <>
      <div className="flex flex-col bg-[var(--bg-canvas)] min-h-screen text-[var(--text-body)] antialiased relative">
        <TopNav profile={profile || { email: user.email || "", full_name: null, avatar_url: null, subscription_status: null }} />

        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>

        <footer className="flex-shrink-0 py-3 px-6 border-t border-[var(--border-sub)] bg-[var(--bg-panel)]">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] text-[var(--text-dim)]">
            <span>┬® 2026 CandidRank</span>
            <div className="flex items-center gap-4">
              <Link href="/legal" className="hover:text-[var(--text-ink)] transition-colors">Legal</Link>
              <Link href="/legal/terms" className="hover:text-[var(--text-ink)] transition-colors">Terms of Service</Link>
              <Link href="/legal/privacy" className="hover:text-[var(--text-ink)] transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
