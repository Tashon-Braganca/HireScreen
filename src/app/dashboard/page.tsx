import React from "react";
import Link from "next/link";
import { getJobs } from "@/app/actions/jobs";
import { getDashboardStats } from "@/app/actions/stats";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Users, Clock, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const [jobs, stats] = await Promise.all([
    getJobs(),
    getDashboardStats()
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const queryPercentage = (stats.queriesThisMonth / stats.queryLimit) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 pb-12 pt-6">
      {/* Hero */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {greeting} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Here&apos;s what&apos;s happening with your hiring pipeline.
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 text-white border-0">
            <Plus size={16} />
            New Job
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2.5 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <Briefcase size={16} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 leading-tight">{stats.totalJobs}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jobs</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
            <Users size={16} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 leading-tight">{stats.totalCandidates}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Candidates</p>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col justify-center px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                <Zap size={16} />
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Queries this month</p>
            </div>
            <p className="text-xs font-bold text-slate-700">{stats.queriesThisMonth} / {stats.queryLimit}</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${Math.min(100, queryPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Your Jobs</h2>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {jobs.length} total
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                <Briefcase size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No jobs yet</h3>
              <p className="text-slate-500 max-w-sm mb-6 text-sm">
                Create your first job to start screening resumes with AI.
              </p>
              <Link href="/dashboard/new">
                <Button className="gap-2">
                  <Plus size={16} /> Create Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                  <div className="group relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-200 p-5 cursor-pointer h-full">
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-b opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Briefcase size={18} />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 uppercase tracking-wider">
                        Active
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
                      {job.description || "\u00A0"}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users size={13} />
                          {job.resume_count || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={13} />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar / Guide Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap size={20} className="text-amber-300" />
              🚀 Quick Start Guide
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-sm font-bold">Create a Job</p>
                  <p className="text-xs text-indigo-100">Set the title and role type for context.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-sm font-bold">Upload Resumes</p>
                  <p className="text-xs text-indigo-100">Drop your candidate PDFs into the workspace.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-sm font-bold">Ask Anything</p>
                  <p className="text-xs text-indigo-100">Ask &quot;Who has 5+ yrs React?&quot; to see rankings.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/50 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              Tips & Tricks
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5" />
                <p>Be specific with years of experience for better accuracy.</p>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5" />
                <p>Use &quot;Compare&quot; to see winners side-by-side.</p>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5" />
                <p>Export results to PDF to share with hiring managers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
