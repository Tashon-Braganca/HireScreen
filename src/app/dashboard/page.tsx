import React from "react";
import Link from "next/link";
import { getJobs } from "@/app/actions/jobs";
import { getDashboardStats } from "@/app/actions/stats";
import {
  Plus,
  Briefcase,
  Users,
  ArrowRight,
  Clock,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";

export default async function DashboardPage() {
  const [jobs, stats] = await Promise.all([getJobs(), getDashboardStats()]);

  const queryPercentage = (stats.queriesThisMonth / stats.queryLimit) * 100;
  const hasJobs = jobs.length > 0;
  const mostRecentJob = hasJobs ? jobs[0] : null;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink tracking-tight">
            Jobs
          </h1>
          <p className="text-sm text-muted mt-1">
            {hasJobs
              ? `${jobs.length} active job${jobs.length !== 1 ? "s" : ""}`
              : "Create your first screening job to get started."}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Usage meter — compact */}
          <div className="hidden sm:flex items-center gap-3 text-sm text-muted border border-border rounded px-3 py-2 bg-panel">
            <div className="flex items-center gap-1.5">
              <BarChart3 size={14} />
              <span className="font-medium">
                {stats.queriesThisMonth}/{stats.queryLimit}
              </span>
              <span className="text-xs">queries</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <Briefcase size={14} />
              <span className="font-medium">{stats.totalJobs}</span>
              <span className="text-xs">jobs</span>
            </div>
          </div>

          <Link href="/dashboard/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded hover:bg-accent-hover transition-colors">
              <Plus size={16} />
              New Job
            </button>
          </Link>
        </div>
      </div>

      {/* Usage bar — mobile */}
      <div className="sm:hidden mb-6 flex items-center gap-3 text-sm text-muted border border-border rounded px-3 py-2 bg-panel">
        <div className="flex items-center gap-1.5 flex-1">
          <BarChart3 size={14} />
          <span className="font-medium">
            {stats.queriesThisMonth}/{stats.queryLimit} queries
          </span>
        </div>
        <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${Math.min(100, queryPercentage)}%` }}
          />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main — Jobs table */}
        <div className="lg:col-span-2">
          {hasJobs ? (
            <div className="panel overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider hidden md:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider text-center">
                      Resumes
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider hidden sm:table-cell">
                      Created
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="group border-b border-border/50 last:border-0 hover:bg-accent-light/30 transition-colors relative"
                    >
                      {/* Left accent bar on hover */}
                      <td className="px-4 py-3 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          className="font-semibold text-ink hover:text-accent transition-colors"
                        >
                          {job.title}
                        </Link>
                        {job.description && (
                          <p className="text-xs text-muted mt-0.5 line-clamp-1 max-w-[280px]">
                            {job.description}
                          </p>
                        )}
                        {/* Quick actions on hover */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 pr-2">
                          <Link
                            href={`/dashboard/jobs/${job.id}`}
                            className="px-2 py-1 text-[10px] font-semibold text-accent bg-accent-light rounded hover:bg-accent/10 transition-colors"
                          >
                            Open
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#15803D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <Users size={12} />
                          {job.resume_count || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(job.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/jobs/${job.id}`}>
                          <ArrowRight
                            size={16}
                            className="text-border group-hover:text-accent transition-colors"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty state */
            <div className="panel flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-lg border border-border flex items-center justify-center text-muted mb-5">
                <Briefcase size={24} />
              </div>
              <h3 className="font-display text-lg text-ink mb-2">
                No jobs yet
              </h3>
              <p className="text-sm text-muted max-w-sm mb-6">
                Create your first screening job, upload resumes, and let AI rank
                candidates against your requirements.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/dashboard/new">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded hover:bg-accent-hover transition-colors">
                    <Plus size={16} />
                    Create Job
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right rail — Usage + Recent Activity */}
        <div className="space-y-5">
          {/* Usage & Plan */}
          <div className="panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base text-ink">Usage</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-light text-accent border border-accent/20">
                Free
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Queries</span>
                  <span className="font-semibold text-ink">
                    {stats.queriesThisMonth} / {stats.queryLimit}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, queryPercentage)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Active jobs</span>
                <span className="font-semibold text-ink">
                  {stats.totalJobs}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Total candidates</span>
                <span className="font-semibold text-ink">
                  {stats.totalCandidates}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="panel p-5">
            <h3 className="font-display text-base text-ink mb-3">
              Recent Activity
            </h3>
            {mostRecentJob ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-accent-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase size={13} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {mostRecentJob.title}
                    </p>
                    <p className="text-xs text-muted">
                      Last opened ·{" "}
                      {new Date(mostRecentJob.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
                {stats.totalCandidates > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-[var(--success-bg)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users size={13} className="text-[var(--success)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {stats.totalCandidates} resumes uploaded
                      </p>
                      <p className="text-xs text-muted">Across all jobs</p>
                    </div>
                  </div>
                )}
                {stats.queriesThisMonth > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-[#F5F3FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity size={13} className="text-[#7C3AED]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {stats.queriesThisMonth} queries this month
                      </p>
                      <p className="text-xs text-muted">AI screening active</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted mb-3">
                  <Zap size={16} />
                </div>
                <p className="text-xs text-muted">
                  Activity will show here once you start screening.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
