import React from "react";
import Link from "next/link";
import { getJobs } from "@/app/actions/jobs";
import { getDashboardStats } from "@/app/actions/stats";
import {
  Plus,
  Briefcase,
  Users,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  BarChart3,
} from "lucide-react";

export default async function DashboardPage() {
  const [jobs, stats] = await Promise.all([getJobs(), getDashboardStats()]);

  const queryPercentage = (stats.queriesThisMonth / stats.queryLimit) * 100;
  const hasJobs = jobs.length > 0;

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
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded hover:bg-accent-light transition-colors">
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
                  {jobs.map((job, i) => (
                    <tr
                      key={job.id}
                      className={`group border-b border-border/50 last:border-0 hover:bg-paper transition-colors ${i % 2 === 1 ? "bg-paper/40" : ""
                        }`}
                    >
                      <td className="px-4 py-3">
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
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded hover:bg-accent-light transition-colors">
                    <Plus size={16} />
                    Create Job
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right rail — Getting Started */}
        <div className="space-y-5">
          <div className="panel p-5">
            <h3 className="font-display text-base text-ink mb-4">
              Getting Started
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {hasJobs ? (
                    <CheckCircle2 size={18} className="text-accent" />
                  ) : (
                    <Circle size={18} className="text-border" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Create a job
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Define the role title and type for AI context.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {stats.totalCandidates > 0 ? (
                    <CheckCircle2 size={18} className="text-accent" />
                  ) : (
                    <Circle size={18} className="text-border" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Upload resumes
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Drop candidate PDFs into your job workspace.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {stats.queriesThisMonth > 0 ? (
                    <CheckCircle2 size={18} className="text-accent" />
                  ) : (
                    <Circle size={18} className="text-border" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Rank candidates
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Ask &quot;Who has 5+ yrs React?&quot; to see ranked results
                    with citations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="panel p-5">
            <h3 className="font-display text-base text-ink mb-3">Tips</h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-muted">
                <CheckCircle2
                  size={14}
                  className="text-accent mt-0.5 flex-shrink-0"
                />
                <p>
                  Be specific about years of experience for better accuracy.
                </p>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted">
                <CheckCircle2
                  size={14}
                  className="text-accent mt-0.5 flex-shrink-0"
                />
                <p>Use the Ask panel to compare candidates side-by-side.</p>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted">
                <CheckCircle2
                  size={14}
                  className="text-accent mt-0.5 flex-shrink-0"
                />
                <p>Export results to PDF to share with hiring managers.</p>
              </div>
            </div>
          </div>

          {/* Usage detail */}
          <div className="panel p-5">
            <h3 className="font-display text-base text-ink mb-3">
              Usage This Month
            </h3>
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
                <span className="text-muted">Total candidates</span>
                <span className="font-semibold text-ink">
                  {stats.totalCandidates}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
