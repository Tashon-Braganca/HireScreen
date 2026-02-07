import React from "react";
import Link from "next/link";
import { getJobs } from "@/app/actions/jobs";
import { BentoCard, BentoHeader } from "@/components/ui/BentoCard";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Users, Search, Clock } from "lucide-react";

export default async function DashboardPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Manage your hiring pipeline and candidates.</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="gap-2">
            <Plus size={16} />
            New Job
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Active Jobs" 
          value={jobs.length} 
          icon={Briefcase}
          trend={{ value: "12%", isPositive: true }}
        />
        <StatCard 
          label="Candidates" 
          value={jobs.reduce((acc, job) => acc + (job.resume_count || 0), 0)} 
          icon={Users}
        />
        <StatCard 
          label="Queries" 
          value="124" 
          icon={Search}
        />
      </div>

      {/* Jobs Grid */}
      <div>
        <BentoHeader title="Recent Jobs" />
        {jobs.length === 0 ? (
          <BentoCard className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No jobs yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">Create your first job posting to start screening resumes with AI.</p>
            <Link href="/dashboard/new">
              <Button>Create Job</Button>
            </Link>
          </BentoCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <BentoCard className="h-full hover:border-indigo-200 hover:shadow-lg transition-all group relative cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Briefcase size={20} />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                      Active
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{job.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">{job.description || "No description provided."}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {job.resume_count || 0} Candidates
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </BentoCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
