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
        <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8" aria-hidden="true">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                    <Skeleton className="h-9 w-40 sm:w-52" />
                    <Skeleton className="h-4 w-52 sm:w-64" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="hidden sm:block h-10 w-56 rounded-lg" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — Job list block */}
                <div className="lg:col-span-2 bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-xl p-4 sm:p-5 space-y-3">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className="bg-[var(--bg-canvas)]/35 border border-[var(--border-sub)] rounded-lg p-4 animate-stagger-in"
                            style={{ animationDelay: `${index * 70}ms` }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1 space-y-2.5">
                                    <Skeleton className="h-4 w-[55%] sm:w-[42%]" />
                                    <Skeleton className="h-3 w-[82%]" />
                                </div>
                                <Skeleton className="h-6 w-14 rounded-full" />
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right — Cards skeleton */}
                <div className="space-y-4">
                    <div className="bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-10 rounded-md" />
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-3">
                                <Skeleton className="h-3.5 w-20" />
                                <Skeleton className="h-3.5 w-24" />
                            </div>
                            <div className="h-1.5 rounded-full bg-[var(--bg-raised)] overflow-hidden">
                                <div className="h-full w-[64%] animate-shimmer" />
                            </div>
                        </div>
                        <div className="border-t border-[var(--border-sub)] pt-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-3.5 w-6" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3.5 w-28" />
                                <Skeleton className="h-3.5 w-10" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-xl p-5 space-y-3">
                        <Skeleton className="h-5 w-32" />
                        {[0, 1].map((index) => (
                            <div key={index} className="flex items-start gap-3 py-2">
                                <Skeleton className="h-7 w-7 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3.5 w-[80%]" />
                                    <Skeleton className="h-3 w-[55%]" />
                                </div>
                            </div>
                        ))}
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
