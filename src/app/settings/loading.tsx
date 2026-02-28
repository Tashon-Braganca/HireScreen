import React from "react";

export default function SettingsLoading() {
    return (
        <div className="max-w-[800px] mx-auto px-6 py-10 animate-pulse">
            <div className="mb-10 space-y-3">
                <div className="w-48 h-10 bg-[var(--bg-panel)] rounded-lg"></div>
                <div className="w-64 h-4 bg-[var(--bg-panel)] rounded"></div>
            </div>

            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-[12px] mb-6">
                    <div className="px-6 py-5 border-b border-[var(--border-sub)]">
                        <div className="w-32 h-5 bg-[var(--border-vis)] rounded mb-2"></div>
                        <div className="w-48 h-3 bg-[var(--bg-raised)] rounded"></div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="w-full h-12 bg-[var(--bg-raised)] rounded-lg"></div>
                        <div className="w-full h-12 bg-[var(--bg-raised)] rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
