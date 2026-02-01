"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  LogOut, 
  Settings, 
  User as UserIcon, 
  CreditCard,
  Mail,
  Crown,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

interface DashboardHeaderProps {
  user: User;
  profile: Profile | null;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter();
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        toast.error(data.error?.message || "Failed to start checkout");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpgradeLoading(false);
    }
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  const isPro = profile?.subscription_status === "pro";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="HireScreen" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg text-zinc-100">HireScreen</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Contact */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <a href="mailto:tashon.braganca@gmail.com">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Contact</span>
            </a>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Upgrade (Free users) */}
          {!isPro && (
            <Button 
              size="sm" 
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium"
            >
              {upgradeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-1.5" />
                  Upgrade
                </>
              )}
            </Button>
          )}

          {/* Pro Badge */}
          {isPro && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-500">PRO</span>
            </div>
          )}
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-zinc-800">
                <Avatar className="h-8 w-8 border border-zinc-700">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300 text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-zinc-900 border-zinc-800" 
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-zinc-100">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">
                <Link href="/settings">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">
                <Link href="/settings?tab=billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">
                <Link href="/settings?tab=danger">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
