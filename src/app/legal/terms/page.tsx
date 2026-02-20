import { BRAND_NAME, BRAND_DOMAIN } from "@/config/brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Terms of Service | ${BRAND_NAME}`,
  description: "Terms of Service for CandidRank - AI Resume Screening for Technical Hiring",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl text-ink mb-2">Terms of Service</h1>
        <p className="text-muted text-sm mb-8">Last updated: February 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-ink">
          <section>
            <h2 className="font-display text-xl text-ink mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted">
              By accessing or using {BRAND_NAME} (&quot;Service&quot;), operated at {BRAND_DOMAIN}, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">2. Description of Service</h2>
            <p className="text-muted">
              {BRAND_NAME} is a B2B SaaS platform that provides AI-powered resume screening services. The Service:
            </p>
            <ul className="list-disc pl-5 text-muted space-y-1">
              <li>Processes and stores PDF resumes (candidate PII data) on your behalf</li>
              <li>Uses the OpenAI API to analyze and extract information from resume content</li>
              <li>Charges subscription fees via Paddle for access to premium features</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">3. Data Processing and GDPR Compliance</h2>
            <p className="text-muted">
              <strong>You are solely responsible for GDPR compliance in your jurisdiction</strong> for the resume data you upload to the Service. This includes:
            </p>
            <ul className="list-disc pl-5 text-muted space-y-1">
              <li>Obtaining proper consent from candidates before uploading their resumes</li>
              <li>Informing candidates about how their data will be processed</li>
              <li>Responding to candidate requests for data access, correction, or deletion</li>
              <li>Ensuring lawful basis for processing personal data under applicable law</li>
            </ul>
            <p className="text-muted mt-3">
              {BRAND_NAME} acts as a data processor on your behalf. You are the data controller for all candidate information uploaded to the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">4. Data Retention Policy</h2>
            <p className="text-muted">
              All resume data and associated information is retained for the duration of your active subscription. Upon account cancellation:
            </p>
            <ul className="list-disc pl-5 text-muted space-y-1">
              <li>All uploaded resumes and extracted data will be deleted within 90 days</li>
              <li>Query history and ranking results will be deleted within 90 days</li>
              <li>Account information (email, billing history) may be retained for legal and accounting purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">5. OpenAI API Usage</h2>
            <p className="text-muted">
              Resume content is processed using OpenAI&apos;s API. By using {BRAND_NAME}, you acknowledge that:
            </p>
            <ul className="list-disc pl-5 text-muted space-y-1">
              <li>Resume text may be transmitted to OpenAI for analysis</li>
              <li>OpenAI&apos;s data handling practices are governed by their own privacy policy</li>
              <li>We do not control OpenAI&apos;s data retention or processing practices</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">6. Subscription and Billing</h2>
            <p className="text-muted">
              Subscription fees are charged via Paddle. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-5 text-muted space-y-1">
              <li>Pay all fees associated with your selected plan</li>
              <li>Provide accurate billing information</li>
              <li>Allow automatic renewal unless cancelled before the billing period ends</li>
            </ul>
            <p className="text-muted mt-3">
              Refunds are provided at our discretion. Contact support@candidrank.cc for refund requests.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">7. Acceptable Use</h2>
            <p className="text-muted">You agree not to:</p>
            <ul className="list-disc pl-5 text-muted space-y-1">
              <li>Upload resumes without proper authorization from candidates</li>
              <li>Use the Service for discriminatory hiring practices</li>
              <li>Attempt to reverse engineer or extract the AI models</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">8. Disclaimer of Warranties</h2>
            <p className="text-muted">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-muted mt-3">
              {BRAND_NAME} does not guarantee the accuracy of AI-generated insights, rankings, or recommendations. All hiring decisions remain your sole responsibility.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">9. Limitation of Liability</h2>
            <p className="text-muted">
              IN NO EVENT SHALL {BRAND_NAME.toUpperCase()}, ITS OWNERS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="text-muted mt-3">
              Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">10. Changes to Terms</h2>
            <p className="text-muted">
              We may update these Terms from time to time. Significant changes will be notified via email. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">11. Contact</h2>
            <p className="text-muted">
              For questions about these Terms, contact: legal@candidrank.cc
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
