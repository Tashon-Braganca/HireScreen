import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="h-full flex flex-col overflow-hidden bg-background">
            {/* Top Bar Skeleton */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>

            {/* 3-Column Layout Skeleton */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Panel */}
                <div className="w-[350px] border-r border-border flex flex-col bg-panel">
                    <div className="p-4 border-b border-border space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="p-4 space-y-4 flex-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Panel */}
                <div className="flex-1 flex flex-col bg-background relative border-r border-border">
                    <div className="p-6 space-y-6">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-[400px] flex flex-col bg-panel">
                    <div className="flex-1 p-4">
                        <Skeleton className="h-full w-full rounded-lg" />
                    </div>
                    <div className="p-4 border-t border-border">
                        <Skeleton className="h-12 w-full rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
