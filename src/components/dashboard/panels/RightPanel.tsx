"use client";

import React from "react";
import { useJobContext } from "../JobContext";
import { ChatInterface } from "@/components/ui/ChatInterface";

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
        <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onRankQuery={handleRankQuery}
            isLoading={isChatLoading}
            recentQueries={recentQueries}
            jobTitle={job.title}
        />
    );
}
