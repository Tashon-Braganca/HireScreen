"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
      });
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function usePostHog() {
  return posthog;
}

export function trackResumeUploaded(jobId: string, fileCount: number) {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture("resume_uploaded", { job_id: jobId, file_count: fileCount });
  }
}

export function trackQuerySubmitted(jobId: string, queryLength: number) {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture("query_submitted", { job_id: jobId, query_length: queryLength });
  }
}

export function trackRankingRun(jobId: string, candidateCount: number) {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture("ranking_run", { job_id: jobId, candidate_count: candidateCount });
  }
}

export function trackUpgradeClicked(source: "dashboard" | "settings" | "limit_banner") {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture("upgrade_clicked", { source });
  }
}
