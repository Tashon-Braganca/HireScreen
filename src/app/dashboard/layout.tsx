import React from "react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

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

  return (
    <div className="min-h-screen bg-paper text-ink font-sans relative flex flex-col">
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 w-full overflow-hidden">
          {children}
        </main>
        <footer className="flex-shrink-0 py-3 px-6 border-t border-border bg-panel">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs text-muted">
            <span>© 2026 CandidRank</span>
            <div className="flex items-center gap-4">
              <Link href="/legal/terms" className="hover:text-ink transition-colors">Terms of Service</Link>
              <Link href="/legal/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
