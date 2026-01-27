"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Jobs", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 border-r border-border/60 bg-background/50 min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1 w-full">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "h-4 w-4 transition-transform duration-200",
              (pathname === item.href || pathname.startsWith(item.href + "/")) && "scale-110"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
