"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase, Settings, CreditCard, LayoutDashboard, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
];

const secondaryItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-muted/10 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-4">
        <div className="px-2 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Platform
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <Separator className="mx-2 bg-border/40" />

        <div className="px-2 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Account
          </h2>
          <div className="space-y-1">
             <Link
                href="/settings?tab=billing"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/settings" && pathname.includes("billing")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
             <Link
                href="/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/settings" && !pathname.includes("billing")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
          </div>
        </div>
      </div>

      <div className="mt-auto px-2">
         <div className="rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-primary">System Online</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Need help? Contact support via email.
            </p>
         </div>
      </div>
    </aside>
  );
}
