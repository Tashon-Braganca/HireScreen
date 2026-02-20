"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog as usePH } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePH();

  useEffect(() => {
    if (pathname && ph) {
      ph.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "https://us.i.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
      });
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
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
