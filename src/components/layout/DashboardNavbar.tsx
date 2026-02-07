"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Settings, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BentoCard } from "@/components/ui/BentoCard";

export function DashboardNavbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="sticky top-6 z-50 mb-8 px-4">
      <BentoCard className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 rounded-full bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" noPadding>
        
        {/* Logo Area */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
             H
           </div>
           <span className="font-bold text-xl text-slate-800 tracking-tight">HireScreen</span>
        </Link>

        {/* Center Links (Optional) */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/50 rounded-full border border-slate-200/50">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-900 bg-white rounded-full shadow-sm">
                Overview
            </Link>
            <Link href="/dashboard/settings" className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Settings
            </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <User size={14} className="text-slate-500" />
                </div>
                <span>Recruiter</span>
            </div>
            
            <button 
                onClick={handleSignOut}
                className="p-2.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
            >
                <LogOut size={20} />
            </button>
        </div>
      </BentoCard>
    </nav>
  );
}
