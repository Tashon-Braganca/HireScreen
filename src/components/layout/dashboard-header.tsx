"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { FileText, LogOut, Settings, User as UserIcon, CreditCard } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardHeaderProps {
  user: User;
  profile: Profile | null;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-50 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative">
              <FileText className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-bold text-lg tracking-tight">HireScreen</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button 
                variant={pathname === "/dashboard" ? "secondary" : "ghost"} 
                size="sm"
                className="transition-all duration-200"
              >
                Jobs
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle - positioned prominently */}
          <ThemeToggle />

          {profile?.subscription_status === "free" && (
            <Link href="/settings?tab=billing">
              <Button 
                size="sm" 
                variant="outline"
                className="hidden sm:flex border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-200"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full ring-1 ring-border/50 hover:ring-border transition-all duration-200"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-popover/95 backdrop-blur-xl border-border/60" 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings?tab=billing" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
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
