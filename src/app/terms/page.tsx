import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/">
          <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using HireScreen, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
            <p className="leading-relaxed">
              HireScreen provides an AI-powered resume screening tool that allows users to upload resumes and query them using natural language.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
            <p className="leading-relaxed">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Maintaining the confidentiality of your account</li>
              <li>Ensuring you have the right to upload and process the resumes you submit</li>
              <li>Using the service in compliance with all applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Usage Limits</h2>
            <p className="leading-relaxed">
              Service usage is subject to the limits of your subscription plan (Free or Pro). We reserve the right to enforce these limits and suspend accounts that attempt to bypass them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend your access to the service immediately, without prior notice, for any reason, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              In no event shall HireScreen be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
