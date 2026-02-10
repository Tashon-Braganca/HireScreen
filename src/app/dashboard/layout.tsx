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
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      {/* Static gradient blobs — zero JS, zero GPU thrashing */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-3xl top-[-15%] left-[-10%]" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl bottom-[-15%] right-[-8%]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-indigo-100/40 blur-3xl top-[50%] left-[40%]" />
      </div>

      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
