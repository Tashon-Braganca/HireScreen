"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, ChevronRight, LayoutDashboard, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BRAND_NAME, BRAND_LOGO_LETTER } from "@/config/brand";

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
    <nav className="sticky top-0 z-50 border-b border-border bg-panel">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 h-14">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-white font-bold text-sm">
            {BRAND_LOGO_LETTER}
          </div>
          <span className="font-display text-lg text-ink tracking-tight">{BRAND_NAME}</span>
        </Link>

        {/* Center — breadcrumb or tabs */}
        <div className="hidden md:flex items-center gap-1">
          {isJobPage ? (
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors font-medium"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <ChevronRight size={14} className="text-border" />
              <div className="flex items-center gap-1.5 text-ink font-semibold">
                <Briefcase size={14} />
                Job Workspace
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 font-medium rounded transition-colors ${pathname === "/dashboard"
                  ? "text-ink bg-paper"
                  : "text-muted hover:text-ink"
                  }`}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/settings"
                className={`px-3 py-1.5 font-medium rounded transition-colors ${pathname === "/dashboard/settings"
                  ? "text-ink bg-paper"
                  : "text-muted hover:text-ink"
                  }`}
              >
                Settings
              </Link>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted px-3 py-1.5 rounded border border-border bg-paper">
            <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center">
              <User size={13} className="text-muted" />
            </div>
            <span>Recruiter</span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 rounded text-muted hover:text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
