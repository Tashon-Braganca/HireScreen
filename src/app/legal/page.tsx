import Link from "next/link";
import { Metadata } from "next";
import { BRAND_NAME } from "@/config/brand";

export const metadata: Metadata = {
  title: `Legal | ${BRAND_NAME}`,
  description: "Legal documents for CandidRank including terms, privacy, and refund policy.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-paper py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-ink mb-2">Legal</h1>
        <p className="text-sm text-muted mb-8">
          This page links to all legal documents required for billing and compliance review.
        </p>
        <p className="text-xs text-muted mb-6">
          Public URLs: /legal/terms, /legal/privacy, /legal/refund-policy
        </p>

        <div className="space-y-4">
          <Link
            href="/legal/terms"
            className="block rounded-lg border border-border bg-panel p-4 hover:border-accent transition-colors"
          >
            <p className="font-medium text-ink">Terms and Conditions</p>
            <p className="text-sm text-muted mt-1">/legal/terms</p>
          </Link>

          <Link
            href="/legal/privacy"
            className="block rounded-lg border border-border bg-panel p-4 hover:border-accent transition-colors"
          >
            <p className="font-medium text-ink">Privacy Policy</p>
            <p className="text-sm text-muted mt-1">/legal/privacy</p>
          </Link>

          <Link
            href="/legal/refund-policy"
            className="block rounded-lg border border-border bg-panel p-4 hover:border-accent transition-colors"
          >
            <p className="font-medium text-ink">Refund Policy</p>
            <p className="text-sm text-muted mt-1">/legal/refund-policy</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
