"use client";

import React from "react";
import { useJobContext } from "../JobContext";
import { ChatInterface } from "@/components/ui/ChatInterface";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export function RightPanel() {
    const {
        messages,
        handleSendMessage,
        handleRankQuery,
        isChatLoading,
        recentQueries,
        job
    } = useJobContext();

    return (
        <ErrorBoundary>
            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onRankQuery={handleRankQuery}
                isLoading={isChatLoading}
                recentQueries={recentQueries}
                jobTitle={job.title}
            />
        </ErrorBoundary>
    );
}
