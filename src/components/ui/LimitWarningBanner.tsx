"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { trackUpgradeClicked } from "@/lib/analytics/posthog";

interface LimitWarningBannerProps {
  message: string;
  source?: 'dashboard' | 'settings' | 'limit_banner';
}

export function LimitWarningBanner({ message, source = 'limit_banner' }: LimitWarningBannerProps) {
  const handleClick = () => {
    trackUpgradeClicked(source);
  };

  return (
    <div className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">{message}</p>
      </div>
      <Link 
        href="/dashboard/settings?upgrade=true"
        onClick={handleClick}
        className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap"
      >
        Upgrade
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
