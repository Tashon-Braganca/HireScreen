"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isJobPage = pathname.startsWith("/dashboard/jobs/");

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 px-4 py-3">
      <div className="mx-auto flex items-center justify-between px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            H
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">HireScreen</span>
        </Link>

        {/* Center — context-aware */}
        <div className="hidden md:flex items-center gap-1">
          {isJobPage ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50/80 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Jobs
            </Link>
          ) : (
            <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
              <Link
                href="/dashboard"
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${pathname === "/dashboard"
                    ? "text-slate-900 bg-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/settings"
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${pathname === "/dashboard/settings"
                    ? "text-slate-900 bg-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                Settings
              </Link>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={13} className="text-slate-500" />
            </div>
            <span>Recruiter</span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
