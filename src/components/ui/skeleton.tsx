import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "bg-[var(--border)]/40 rounded-lg animate-pulse",
                className
            )}
        />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — Table skeleton */}
                <div className="lg:col-span-2 panel p-0 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                        <Skeleton className="h-4 w-full" />
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border/30">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>

                {/* Right — Cards skeleton */}
                <div className="space-y-5">
                    <div className="panel p-5 space-y-3">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-1.5 w-full rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="panel p-5 space-y-3">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function JobWorkspaceSkeleton() {
    return (
        <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col h-[calc(100vh-theme(spacing.14))] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <div className="space-y-1.5">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>

            {/* 3-column skeleton */}
            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                {/* Left */}
                <div className="col-span-3 panel p-4 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-md" />
                    ))}
                </div>
                {/* Center */}
                <div className="col-span-5 panel p-4 space-y-4">
                    <div className="flex gap-2 border-b border-border pb-2">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-md border border-border/50 space-y-2 animate-shimmer">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                            <Skeleton className="h-1.5 w-1/2 rounded-full" />
                        </div>
                    ))}
                </div>
                {/* Right */}
                <div className="col-span-4 panel p-4 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-20 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
}
