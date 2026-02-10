import React from "react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans relative">
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
