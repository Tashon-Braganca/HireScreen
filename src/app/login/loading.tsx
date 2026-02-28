import React from "react";

export default function LoginLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-canvas)] flex">
            {/* Left Column Skeleton */}
            <div className="hidden lg:flex flex-col w-[45%] bg-[var(--bg-panel)] border-r border-[var(--border-sub)]">
                <div className="flex-1 flex flex-col justify-center px-12 animate-pulse space-y-6">
                    <div className="w-12 h-12 bg-[var(--bg-raised)] rounded-lg"></div>
                    <div className="w-3/4 h-16 bg-[var(--bg-raised)] rounded-lg"></div>
                    <div className="w-1/2 h-8 bg-[var(--bg-raised)] rounded-lg"></div>
                </div>
            </div>
            {/* Right Column Skeleton */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md animate-pulse">
                    <div className="w-full h-12 bg-[var(--bg-raised)] rounded-lg mb-8"></div>
                    <div className="w-3/4 h-10 bg-[var(--bg-raised)] rounded-lg mb-4"></div>
                    <div className="w-full h-12 bg-[var(--bg-raised)] rounded-lg mb-6"></div>
                    <div className="w-full h-12 bg-[var(--bg-raised)] rounded-lg mb-4"></div>
                    <div className="w-full h-12 bg-[var(--bg-raised)] rounded-lg mb-6"></div>
                    <div className="w-full h-14 bg-[var(--accent-dim)] rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
