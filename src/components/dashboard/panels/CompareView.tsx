"use client";

import React from "react";
import { useJobContext } from "../JobContext";


export function CompareView() {
    const { compareIds, rankedCandidates } = useJobContext();

    const selectedCandidates = rankedCandidates.filter(c => compareIds.has(c.documentId));

    if (selectedCandidates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted p-8 text-center">
                <p>Select candidates to compare.</p>
                <p className="text-xs mt-1">Check the box on candidate cards to add them here.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto p-6">
            <h2 className="text-lg font-semibold mb-4 text-ink">Compare Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCandidates.map(c => (
                    <div key={c.documentId} className="border border-border rounded-lg p-4 bg-panel">
                        <h3 className="font-bold text-ink">{c.name}</h3>
                        <div className="text-sm text-muted mt-1">Rank #{c.rank} &middot; Score {c.score}%</div>

                        <div className="mt-4 space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Strengths</h4>
                            <ul className="text-sm space-y-1">
                                {c.matchReasons.map((r, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-accent">&bull;</span>
                                        <span>{r.reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
