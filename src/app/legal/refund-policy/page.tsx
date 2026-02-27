import { BRAND_NAME } from "@/config/brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Refund Policy | ${BRAND_NAME}`,
  description: "Refund Policy for CandidRank subscriptions and charges.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-paper py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-ink mb-2">Refund Policy</h1>
        <p className="text-sm text-muted mb-8">Last updated: February 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-muted">
          <section>
            <h2 className="font-display text-lg text-ink mb-3">14-Day Refund Window</h2>
            <p>
              Any customer may request a full refund within 14 days of the original purchase date. No conditions apply.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">How to Request</h2>
            <p>
              Email <a href="mailto:support@candidrank.cc" className="text-accent underline">support@candidrank.cc</a> with your billing email and we will process your refund.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">Processing</h2>
            <p>
              Refunds are processed by Paddle, our merchant of record, and typically appear within 5–10 business days depending on your bank.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
