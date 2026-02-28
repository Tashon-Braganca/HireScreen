import React from "react";
import Link from "next/link";
import { getJobs } from "@/app/actions/jobs";
import { getDashboardStats, shouldShowLimitWarning } from "@/app/actions/stats";
import { Briefcase, Users, BookmarkCheck } from "lucide-react";
import { LimitWarningBanner } from "@/components/ui/LimitWarningBanner";
import { JobList } from "@/components/ui/JobList";
import { Progress } from "@/components/ui/progress";
import { NewJobButton } from "@/components/dashboard/NewJobButton";
import { DashboardStagger, StaggerItem, AnimatedStat } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const [jobs, stats] = await Promise.all([getJobs(), getDashboardStats()]);

  const queryLimit = typeof stats.queryLimit === 'number' ? stats.queryLimit : 999;
  const queryPercentage = Math.min(100, (stats.queriesThisMonth / queryLimit) * 100);
  const hasJobs = jobs.length > 0;

  const limitWarning = await shouldShowLimitWarning(stats.queriesThisMonth, queryLimit);

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">
      {limitWarning.show && !stats.isPro && (
        <LimitWarningBanner message={limitWarning.message!} />
      )}

      <DashboardStagger>
        {/* PAGE HEADER */}
        <StaggerItem>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="font-bold text-[26px] text-[var(--text-ink)] leading-tight tracking-[-0.01em]">
                Dashboard
              </h1>
              <p className="font-normal text-[13px] text-[var(--text-dim)] mt-1">
                Your active hiring pipeline
              </p>
            </div>
            <Link href="/dashboard/new">
              <NewJobButton />
            </Link>
          </div>
        </StaggerItem>

        {/* STAT STRIP */}
        <StaggerItem>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <StatCard
              icon={<Briefcase size={16} />}
              label="Active Jobs"
              value={stats.totalJobs}
            />
            <StatCard
              icon={<Users size={16} />}
              label="Candidates Screened"
              value={stats.totalCandidates}
            />
            <StatCard
              icon={<BookmarkCheck size={16} />}
              label="Queries Used"
              value={stats.queriesThisMonth}
              suffix={typeof stats.queryLimit === 'number' ? ` / ${stats.queryLimit}` : ''}
              progress={typeof stats.queryLimit === 'number' ? queryPercentage : undefined}
            />
          </div>
        </StaggerItem>

        {/* JOBS LIST */}
        <StaggerItem>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-[11px] text-[var(--text-dim)] uppercase tracking-[0.12em]">
              Your Jobs
            </h2>
          </div>

          {hasJobs ? (
            <JobList jobs={jobs} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-sub)] flex items-center justify-center text-[var(--text-dim)] mb-5">
                <Briefcase size={22} />
              </div>
              <h3 className="font-semibold text-[15px] text-[var(--text-ink)] mb-1">
                No jobs yet
              </h3>
              <p className="font-normal text-[13px] text-[var(--text-dim)] mb-6 max-w-xs text-center">
                Create your first job to start screening candidates.
              </p>
              <Link href="/dashboard/new">
                <NewJobButton />
              </Link>
            </div>
          )}
        </StaggerItem>
      </DashboardStagger>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix = "",
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  progress?: number;
}) {
  return (
    <div className="bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-xl px-6 py-5 hover:border-[var(--border-vis)] transition-colors duration-200">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[var(--text-dim)]">{icon}</span>
        <span className="font-medium text-[11px] text-[var(--text-dim)] uppercase tracking-[0.1em]">
          {label}
        </span>
      </div>
      <div className="font-bold text-[28px] text-[var(--text-ink)] mt-1 tabular-nums">
        <AnimatedStat value={value} suffix={suffix} />
      </div>
      {progress !== undefined && (
        <Progress
          value={progress}
          className="h-[4px] rounded-full bg-[var(--bg-raised)] mt-3"
          indicatorClassName={`${progress >= 80 ? 'bg-[#E05A5A]' : progress >= 60 ? 'bg-[var(--accent-amber)]' : 'bg-[var(--accent-sage)]'}`}
        />
      )}
    </div>
  );
}
