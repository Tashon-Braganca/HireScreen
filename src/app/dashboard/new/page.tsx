"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/app/actions/jobs";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Label from "@radix-ui/react-label";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await createJob({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: "job",
    });

    if (res.success && res.jobId) {
      router.push(`/dashboard/jobs/${res.jobId}`);
    } else {
      alert(res.error || "Failed to create job");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--text-ink)] mb-6 transition-colors font-medium text-[13px]">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="font-bold text-[32px] text-[var(--text-ink)] leading-tight">
          Create New Job
        </h1>
        <p className="font-normal text-[14px] text-[var(--text-body)] mt-1">
          Set up a new position to start screening.
        </p>
      </div>

      <div className="bg-[var(--bg-panel)] border border-[var(--border-sub)] rounded-[12px] p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-1.5 flex flex-col">
            <Label.Root className="font-medium text-[12px] text-[var(--text-body)] uppercase tracking-[0.08em]">
              JOB TITLE
            </Label.Root>
            <input
              name="title"
              placeholder="e.g. Senior Product Designer"
              required
              className="w-full bg-[var(--bg-canvas)] border border-[var(--border-sub)] rounded-lg px-4 py-3 font-normal text-[14px] text-[var(--text-ink)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-vis)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-dim)] transition-colors duration-200"
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label.Root className="font-medium text-[12px] text-[var(--text-body)] uppercase tracking-[0.08em]">
              JOB DESCRIPTION
            </Label.Root>
            <textarea
              name="description"
              className="flex min-h-[140px] w-full bg-[var(--bg-canvas)] border border-[var(--border-sub)] rounded-lg px-4 py-3 font-normal text-[14px] text-[var(--text-ink)] placeholder:text-[var(--text-dim)] focus:border-[var(--border-vis)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-dim)] transition-colors duration-200 resize-y"
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-sub)]">
            <Link href="/dashboard">
              <button type="button" className="px-5 py-2.5 font-semibold text-[13px] text-[var(--text-body)] hover:text-[var(--text-ink)] transition-colors duration-200">
                Cancel
              </button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(126,184,154,0.2)' }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[var(--accent-sage)] text-[var(--bg-canvas)] font-semibold text-[13px] rounded-lg hover:bg-[#8FCBAA] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : "Create Job"}
            </motion.button>
          </div>
        </form>
      </div>

    </div>
  );
}
