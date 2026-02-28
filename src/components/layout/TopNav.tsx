"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { BRAND_NAME, BRAND_LOGO_LETTER } from "@/config/brand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProfile {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    subscription_status: string | null;
}

const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/settings", label: "Settings" },
] as const;

function isJobWorkspacePath(pathname: string): boolean {
    return /^\/dashboard\/jobs\/[^/]+$/.test(pathname);
}

function getInitials(name: string | null, email: string): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name[0].toUpperCase();
    }
    return email[0].toUpperCase();
}

export function TopNav({ profile }: { profile: TopNavProfile }) {
    const pathname = usePathname();
    const router = useRouter();
    const initials = getInitials(profile.full_name, profile.email);
    const displayName = profile.full_name || profile.email;

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full h-14 bg-[var(--bg-panel)] border-b border-[var(--border-sub)] px-6 md:px-8">
            <div className="flex items-center justify-between h-full max-w-[1440px] mx-auto">
                {/* Left: Logo */}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 group"
                >
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: -3 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="w-8 h-8 rounded-lg bg-[var(--accent-sage)] text-[var(--bg-canvas)] font-bold text-sm flex items-center justify-center"
                    >
                        {BRAND_LOGO_LETTER}
                    </motion.div>
                    <span className="font-semibold text-[16px] text-[var(--text-ink)] tracking-[-0.01em]">
                        {BRAND_NAME}
                    </span>
                </Link>

                {/* Center: Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = link.href === "/dashboard"
                            ? pathname === "/dashboard" || pathname === "/dashboard/new"
                            : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                                    isActive
                                        ? "text-[var(--accent-sage)]"
                                        : "text-[var(--text-body)] hover:text-[var(--text-ink)]"
                                }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="topnav-active-pill"
                                        className="absolute inset-0 rounded-lg bg-[var(--accent-dim)]"
                                        style={{ zIndex: -1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* Breadcrumb for job workspace */}
                    {isJobWorkspacePath(pathname) && (
                        <div className="flex items-center gap-1.5 ml-1">
                            <span className="text-[var(--text-dim)] text-[12px] leading-none">/</span>
                            <span className="px-2.5 py-1 rounded-md text-[13px] font-medium text-[var(--text-body)] bg-[var(--bg-raised)]">
                                Job Workspace
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: Avatar + Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--bg-raised)] transition-colors duration-150 outline-none"
                        >
                            <Avatar className="w-8 h-8 rounded-full border border-[var(--border-vis)] bg-[var(--bg-raised)]">
                                {profile.avatar_url && (
                                    <AvatarImage src={profile.avatar_url} alt={displayName} />
                                )}
                                <AvatarFallback className="text-[11px] font-semibold text-[var(--text-body)] bg-transparent">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden md:block text-[13px] font-medium text-[var(--text-body)] max-w-[120px] truncate">
                                {displayName}
                            </span>
                        </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="min-w-[180px] rounded-xl border border-[var(--border-vis)] bg-[var(--bg-raised)] p-1.5"
                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                    >
                        <DropdownMenuItem
                            className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-[var(--text-body)] focus:bg-[var(--bg-panel)] focus:text-[var(--text-ink)] flex items-center gap-2"
                            onClick={() => router.push("/settings")}
                        >
                            <User size={14} />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-[var(--text-body)] focus:bg-[var(--bg-panel)] focus:text-[var(--text-ink)] flex items-center gap-2"
                            onClick={() => router.push("/settings")}
                        >
                            <Settings size={14} />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 h-px bg-[var(--border-sub)]" />
                        <DropdownMenuItem
                            className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-[#E05A5A] focus:bg-[var(--bg-panel)] focus:text-[#E05A5A] flex items-center gap-2"
                            onClick={handleSignOut}
                        >
                            <LogOut size={14} />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
