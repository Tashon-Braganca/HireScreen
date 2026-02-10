"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/app/actions/jobs";
import { BentoCard, BentoHeader } from "@/components/ui/BentoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      type: "job", // Default for now
    });

    if (res.success) {
      router.push("/dashboard");
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12 pt-6 overflow-y-auto h-full">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <BentoCard>
        <BentoHeader title="Create New Job" subtitle="Set up a new position to start screening." />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Job Title</label>
            <Input name="title" placeholder="e.g. Senior Product Designer" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm"
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/dashboard">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={loading}>Create Job</Button>
          </div>
        </form>
      </BentoCard>
    </div>
  );
}
