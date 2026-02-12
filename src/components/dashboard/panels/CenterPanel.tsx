"use client";

import React from "react";
import { useJobContext } from "../JobContext";
import { CenterPanelTabs } from "./CenterPanelTabs";
import { RankedResultsPanel } from "@/components/ui/RankedResultsPanel";
import { CompareView } from "./CompareView";
import { ResumeViewer } from "./ResumeViewer";

export function CenterPanel() {
    const { activeTab, filteredRankedCandidates, shortlistedIds, toggleShortlist, compareIds, toggleCompare, viewResume, handleRankQuery, isRanking, activeQuery, job, documents } = useJobContext();

    return (
        <div className="flex flex-col h-full overflow-hidden bg-bg">
            <CenterPanelTabs />
            <div className="flex-1 overflow-hidden relative">
                {activeTab === "ranked" && (
                    <RankedResultsPanel
                        candidates={filteredRankedCandidates}
                        selectedIds={shortlistedIds}
                        onToggleSelect={toggleShortlist}
                        compareIds={compareIds || new Set()}
                        onToggleCompare={toggleCompare}
                        onViewResume={viewResume}
                        onExport={() => { console.log("Export not implemented in Context yet"); }}
                        onQueryClick={handleRankQuery}
                        isLoading={isRanking}
                        activeQuery={activeQuery}
                        jobTitle={job.title}
                        documents={documents}
                    />
                )}
                {activeTab === "compare" && (
                    <CompareView />
                )}
                {activeTab.startsWith("pdf-") && (
                    <div className="h-full w-full">
                        <ResumeViewer documentId={activeTab.replace("pdf-", "")} />
                    </div>
                )}
            </div>
        </div>
    );
}
