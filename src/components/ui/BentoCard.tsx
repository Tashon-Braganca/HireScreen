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
        "backdrop-blur-xl bg-white/60 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
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
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 font-medium mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
