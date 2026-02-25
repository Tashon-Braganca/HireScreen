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
            <h2 className="font-display text-lg text-ink mb-3">1. 14-Day Refund Window</h2>
            <p>
              {BRAND_NAME} provides a 14-day refund window for eligible Paddle charges. If you request a refund within 14 days of the charge date, we will process the refund.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">2. How to Request a Refund</h2>
            <p>
              To request a refund, email <a href="mailto:support@candidrank.cc" className="text-accent underline">support@candidrank.cc</a> with your billing email and Paddle transaction details.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">3. Processing Timeline</h2>
            <p>
              Approved refunds are submitted promptly, and final timing depends on your payment provider and bank.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">4. Billing Provider</h2>
            <p>
              Payments are processed by Paddle, our merchant of record. Paddle may apply its own operational controls for billing and refund processing.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
