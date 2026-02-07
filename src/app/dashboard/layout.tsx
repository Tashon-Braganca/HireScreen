import React from "react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { FloatingShape } from "@/components/ui/FloatingShape";
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
      {/* Background Blobs (Matches Homepage) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <FloatingShape className="w-[500px] h-[500px] bg-purple-200/40 top-[-10%] left-[-10%]" delay={0} />
         <FloatingShape className="w-[400px] h-[400px] bg-blue-200/40 bottom-[-10%] right-[-5%]" delay={2} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DashboardNavbar />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
