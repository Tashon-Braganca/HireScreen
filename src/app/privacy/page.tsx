import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, upload resumes, or communicate with us. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Account information (name, email)</li>
              <li>Uploaded documents (resumes, CVs)</li>
              <li>Usage data (queries, job creations)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and analyze the resumes you upload</li>
              <li>Generate AI-powered answers to your queries</li>
              <li>Send you technical notices and support messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
            <p className="leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access. Your uploaded resumes are stored securely and are only accessed by the AI processing engine when you initiate a query.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. AI Processing</h2>
            <p className="leading-relaxed">
              We use OpenAI&apos;s API to process your queries and resume content. Data sent to OpenAI is not used to train their models.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@hirescreen.io.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
