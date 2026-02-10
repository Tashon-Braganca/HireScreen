import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "bg-slate-200/60 rounded-xl animate-pulse",
                className
            )}
        />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 pt-2">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-10 w-28 rounded-xl" />
            </div>

            {/* Stat pills */}
            <div className="flex gap-3">
                <Skeleton className="h-16 w-36 rounded-2xl" />
                <Skeleton className="h-16 w-40 rounded-2xl" />
                <Skeleton className="h-16 w-32 rounded-2xl" />
            </div>

            {/* Job cards */}
            <div>
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/60 rounded-2xl border border-white/50 p-5 space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-10 w-full" />
                            <div className="flex gap-4 pt-3 border-t border-slate-100">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function JobWorkspaceSkeleton() {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden px-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
                {/* Left */}
                <div className="col-span-3 bg-white/60 rounded-2xl border border-white/50 p-4 space-y-3">
                    <Skeleton className="h-5 w-20" />
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-xl" />
                    ))}
                </div>
                {/* Center */}
                <div className="col-span-6 bg-white/60 rounded-2xl border border-white/50 p-4 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))}
                </div>
                {/* Right */}
                <div className="col-span-3 bg-white/60 rounded-2xl border border-white/50 p-4 space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
