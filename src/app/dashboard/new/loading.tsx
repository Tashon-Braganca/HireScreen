import React from "react";

export default function NewJobLoading() {
    return (
        <div className="max-w-[640px] mx-auto px-6 py-10 animate-pulse">
            <div className="mb-8 space-y-3">
                <div className="w-32 h-4 bg-[var(--bg-panel)] rounded mb-6"></div>
                <div className="w-64 h-10 bg-[var(--bg-panel)] rounded-lg"></div>
                <div className="w-48 h-4 bg-[var(--bg-panel)] rounded"></div>
            </div>
            <div className="bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-[12px] p-8">
                <div className="space-y-6">
                    <div className="w-full h-16 bg-[var(--bg-raised)] rounded-lg"></div>
                    <div className="w-full h-32 bg-[var(--bg-raised)] rounded-lg"></div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-sub)]">
                        <div className="w-24 h-10 bg-[var(--bg-raised)] rounded-lg"></div>
                        <div className="w-32 h-10 bg-[var(--accent-dim)] rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
