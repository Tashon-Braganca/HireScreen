"use client";

import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { deleteJob } from "@/app/actions/jobs";
import { FileText, Calendar, MoreVertical, Trash2, Loader2, ArrowRight } from "lucide-react";
import { Job } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs: initialJobs }: JobListProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Delete this job? This cannot be undone.")) return;

    setDeletingId(jobId);
    try {
      const result = await deleteJob(jobId);
      if (result.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        alert(result.error || "Failed to delete job");
      }
    } catch {
      alert("Failed to delete job");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job, index) => {
        const isActive = job.status === "active";
        const isArchived = job.status === "archived";

        return (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <motion.div
              whileHover={{ scale: 1.005, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative block w-full bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-[10px] p-5 hover:bg-[var(--bg-raised)] hover:border-[var(--border-vis)] hover:shadow-[0_0_24px_rgba(140,196,166,0.06),0_4px_16px_rgba(0,0,0,0.15)] transition-[background-color,border-color,box-shadow] duration-300 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/dashboard/jobs/${job.id}`);
                }
              }}
            >
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1 right-padding-guard">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isActive ? "bg-[var(--accent-sage)] animate-pulse-soft" : isArchived ? "bg-[var(--text-dim)]" : "bg-[var(--accent-amber)]"
                        }`}
                    />
                    <span className="font-sans font-normal text-[11px] uppercase tracking-[0.1em] text-[var(--text-dim)]">
                      {job.status || "active"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[17px] text-[var(--text-ink)] mt-1 mb-2 tracking-[-0.01em]">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-4 font-normal text-[11px] text-[var(--text-dim)]">
                    <span className="flex items-center gap-1.5">
                      <FileText size={12} className="text-[var(--text-dim)]" />
                      {job.resume_count || 0} resumes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[var(--text-dim)]" />
                      {new Date(job.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-4 relative">
                  <span className="font-sans font-normal text-[13px] text-[var(--text-body)] group-hover:text-[var(--accent-sage)] flex items-center gap-1 transition-all duration-300">
                    Open
                    <ArrowRight size={14} className="transform group-hover:translate-x-[4px] transition-transform duration-300 ease-out" />
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 rounded-md text-[var(--text-dim)] hover:bg-[var(--bg-canvas)] hover:text-[var(--text-ink)] transition-colors relative z-20"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(event) => event.stopPropagation()}
                      className="bg-[var(--bg-raised)] border-[var(--border-vis)] min-w-[140px] p-1 rounded-lg"
                    >
                      <DropdownMenuItem
                        disabled={deletingId === job.id}
                        onClick={(e) => handleDelete(job.id, e)}
                        className="text-red-400 focus:bg-[var(--bg-canvas)] focus:text-red-300 cursor-pointer rounded-md font-sans text-[13px] flex items-center gap-2 px-3 py-2"
                      >
                        {deletingId === job.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
