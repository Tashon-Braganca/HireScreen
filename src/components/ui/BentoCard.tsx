import React from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function BentoCard({ children, className, noPadding = false, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        "bg-panel border border-border rounded-md overflow-hidden transition-colors",
        noPadding ? "p-0" : "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-display text-xl text-ink tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
