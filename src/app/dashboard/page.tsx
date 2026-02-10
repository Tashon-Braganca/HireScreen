import React from "react";
import Link from "next/link";
import { getJobs } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Users, Search, Clock, ArrowRight, Zap } from "lucide-react";

export default async function DashboardPage() {
  const jobs = await getJobs();
  const totalCandidates = jobs.reduce((acc, job) => acc + (job.resume_count || 0), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-2">
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

      {/* Stats — inline pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2.5 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <Briefcase size={16} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 leading-tight">{jobs.length}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jobs</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
            <Users size={16} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 leading-tight">{totalCandidates}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Candidates</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
          <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
            <Zap size={16} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 leading-tight">AI</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Powered</p>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Your Jobs</h2>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {jobs.length} total
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <div className="group relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-200 p-5 cursor-pointer h-full">
                  {/* Gradient accent line */}
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
                    {job.description || "No description provided."}
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
    </div>
  );
}
