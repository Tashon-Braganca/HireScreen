"use client";

import React, { useState, useEffect } from "react";
import { useJobContext } from "../JobContext";
import { CenterPanelTabs } from "./CenterPanelTabs";
import { RankedResultsPanel } from "@/components/ui/RankedResultsPanel";
import { CompareView } from "./CompareView";
import { ResumeViewer } from "./ResumeViewer";
import { ImportPanel } from "./ImportPanel";
import { HistoryPanel } from "./HistoryPanel";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ExportModal } from "@/components/ui/ExportModal";

export function CenterPanel() {
    const { activeTab, setActiveTab, filteredRankedCandidates, shortlistedIds, toggleShortlist, compareIds, toggleCompare, viewResume, handleRankQuery, isRanking, activeQuery, job, documents } = useJobContext();
    const [exportOpen, setExportOpen] = useState(false);

    // Listen for openCompareTab event dispatched from RankedResultsPanel's compare bar
    useEffect(() => {
        const handler = () => setActiveTab("compare");
        window.addEventListener("openCompareTab", handler);
        return () => window.removeEventListener("openCompareTab", handler);
    }, [setActiveTab]);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-bg">
            <CenterPanelTabs />
            <div className="flex-1 overflow-hidden relative">
                <ErrorBoundary>
                    {activeTab === "ranked" && (
                        <RankedResultsPanel
                            candidates={filteredRankedCandidates}
                            selectedIds={shortlistedIds}
                            onToggleSelect={toggleShortlist}
                            compareIds={compareIds || new Set()}
                            onToggleCompare={toggleCompare}
                            onViewResume={viewResume}
                            onExport={() => setExportOpen(true)}
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
                    {activeTab === "import" && (
                        <ImportPanel />
                    )}
                    {activeTab === "history" && (
                        <HistoryPanel />
                    )}
                    {activeTab.startsWith("pdf-") && (
                        <div className="h-full w-full">
                            <ResumeViewer documentId={activeTab.replace("pdf-", "")} />
                        </div>
                    )}
                </ErrorBoundary>
            </div>
            <ExportModal
                candidates={filteredRankedCandidates}
                isOpen={exportOpen}
                onClose={() => setExportOpen(false)}
            />
        </div>
    );
}
