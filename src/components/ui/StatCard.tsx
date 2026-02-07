import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { BentoCard } from "./BentoCard";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <BentoCard className={cn("relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={64} />
      </div>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="p-2 bg-slate-50 rounded-xl w-fit mb-4 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Icon size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{value}</div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-bold px-2 py-1 rounded-full",
            trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
            <span className="mr-1">{trend.isPositive ? "↑" : "↓"}</span>
            {trend.value}
          </div>
        )}
      </div>
    </BentoCard>
  );
}
