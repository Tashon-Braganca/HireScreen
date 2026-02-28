import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { TopNav } from "@/components/layout/TopNav";

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
      <div className="flex flex-col bg-[var(--bg-canvas)] min-h-screen text-[var(--text-body)] antialiased">
        <TopNav profile={profile || { email: user.email || "", full_name: null, avatar_url: null, subscription_status: null }} />

        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </>
  );
}
