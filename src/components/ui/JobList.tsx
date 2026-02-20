"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteJob } from "@/app/actions/jobs";
import {
  Users,
  Clock,
  ArrowRight,
  MoreVertical,
  Trash2,
  Loader2,
} from "lucide-react";
import { Job } from "@/types";

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs: initialJobs }: JobListProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDelete = async (jobId: string) => {
    setDeletingId(jobId);
    setOpenMenuId(null);
    try {
      const result = await deleteJob(jobId);
      if (result.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        console.error("Failed to delete job:", result.error);
        alert(result.error || "Failed to delete job");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete job");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
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
                  {new Date(job.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <ArrowRight
                      size={16}
                      className="text-border group-hover:text-accent transition-colors"
                    />
                  </Link>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === job.id ? null : job.id);
                      }}
                      className="p-1 rounded hover:bg-paper transition-colors"
                    >
                      <MoreVertical size={14} className="text-muted" />
                    </button>
                    {openMenuId === job.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                          <button
                            onClick={() => {
                              setConfirmDeleteId(job.id);
                              setOpenMenuId(null);
                            }}
                            disabled={deletingId === job.id}
                            className="w-full px-3 py-2 text-left text-xs text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2"
                          >
                            {deletingId === job.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                            Delete Job
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-ink mb-2">Delete Job?</h3>
            <p className="text-sm text-muted mb-4">
              This cannot be undone. All resumes and queries associated with this job will be deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="px-4 py-2 text-sm font-medium text-white bg-[#B91C1C] rounded hover:bg-[#991B1B] disabled:opacity-50 transition-colors"
              >
                {deletingId === confirmDeleteId ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
