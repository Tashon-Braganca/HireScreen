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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="HireScreen" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg text-foreground">HireScreen</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Contact */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
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
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-secondary">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-popover border-border" 
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild className="text-foreground focus:bg-accent focus:text-accent-foreground">
                <Link href="/settings">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-foreground focus:bg-accent focus:text-accent-foreground">
                <Link href="/settings?tab=billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-foreground focus:bg-accent focus:text-accent-foreground">
                <Link href="/settings?tab=danger">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
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
