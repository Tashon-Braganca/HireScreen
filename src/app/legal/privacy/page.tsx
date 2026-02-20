import { BRAND_NAME } from "@/config/brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND_NAME}`,
  description: "Privacy Policy for CandidRank - AI Resume Screening for Technical Hiring",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-ink mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-8">Last updated: January 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-muted">
          <section>
            <h2 className="font-display text-lg text-ink mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect the following information when you use {BRAND_NAME}:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Information:</strong> Email address, name (optional)
              </li>
              <li>
                <strong>Uploaded Files:</strong> PDF resumes and documents you upload to the platform
              </li>
              <li>
                <strong>Query History:</strong> Questions you ask about candidates and AI-generated responses
              </li>
              <li>
                <strong>Usage Data:</strong> Login times, feature usage, browser type
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">2. How We Store Your Data</h2>
            <p className="mb-3">Your data is stored securely using:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Supabase:</strong> Primary database for account information, resumes, and query history. Data is encrypted at rest and in transit.
              </li>
              <li>
                <strong>OpenAI API:</strong> Resume text is processed through OpenAI&apos;s API for AI analysis. 
                <span className="block text-xs mt-1 text-muted-foreground">
                  Note: OpenAI may temporarily retain API data according to their data retention policy. 
                  See <a href="https://openai.com/privacy" className="text-accent underline" target="_blank" rel="noopener noreferrer">OpenAI&apos;s Privacy Policy</a> for details.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">3. How We Use Your Data</h2>
            <p className="mb-3">We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide AI-powered resume screening and ranking services</li>
              <li>Improve our AI models and service quality</li>
              <li>Communicate with you about your account</li>
              <li>Process payments and manage subscriptions</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">4. Data Sharing</h2>
            <p className="mb-3">
              <strong>We do not sell your data to third parties.</strong>
            </p>
            <p className="mb-3">We share data only with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>OpenAI:</strong> For AI processing of resume content</li>
              <li><strong>Paddle:</strong> For payment processing (billing info only)</li>
              <li><strong>Service providers:</strong> Who assist in operating the platform (hosting, analytics)</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">5. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Delete your account:</strong> Contact privacy@candidrank.cc or use account settings. All your data will be deleted within 90 days.
              </li>
              <li>
                <strong>Export your data:</strong> Request a copy of all data associated with your account by contacting privacy@candidrank.cc.
              </li>
              <li>
                <strong>Correct your data:</strong> Update your account information at any time through settings.
              </li>
              <li>
                <strong>Opt-out of communications:</strong> Unsubscribe from marketing emails at any time.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">6. Data Retention</h2>
            <p className="mb-3">
              We retain your data for as long as your account is active. After account cancellation:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Resumes and candidate data: Deleted within 90 days</li>
              <li>Query history: Deleted within 90 days</li>
              <li>Account information: May be retained for legal/accounting purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">7. Security</h2>
            <p>
              We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">8. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We may use analytics cookies (with your consent) to improve the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for users under 18. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Significant changes will be notified via email. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-ink mb-3">11. Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact:
            </p>
            <p className="mt-2">
              <a href="mailto:privacy@candidrank.cc" className="text-accent underline">privacy@candidrank.cc</a>
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted">
              {BRAND_NAME} is committed to protecting your privacy and the privacy of candidates whose data you upload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
