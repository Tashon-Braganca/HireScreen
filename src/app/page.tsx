import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Upload,
  MessageSquare,
  Download
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">HireScreen</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Screen resumes 10x faster with AI
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Stop manually reading resumes.
            <span className="text-primary"> Ask questions instead.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload a stack of resumes and ask &quot;Who has 3+ years Python experience in NYC?&quot; 
            Get ranked answers with citations in seconds, not hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Screening Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Free tier available. No credit card required.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Three simple steps to transform your resume screening process
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Upload Resumes</h3>
              <p className="text-muted-foreground">
                Drag and drop up to 50 PDF resumes at once. We extract and index all the content automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Ask Questions</h3>
              <p className="text-muted-foreground">
                Ask anything in plain English. &quot;Who knows React?&quot; &quot;Find candidates with MBA degrees.&quot;
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Export Shortlist</h3>
              <p className="text-muted-foreground">
                Get instant answers with citations. Export your shortlist to CSV for your ATS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Recruiters Love HireScreen</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Purpose-built for high-volume resume screening
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Search,
                title: "Semantic Search",
                description: "Find candidates by skills, experience, and qualifications - not just keywords."
              },
              {
                icon: FileText,
                title: "Cited Answers",
                description: "Every answer includes the exact resume and page number for verification."
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Get answers in seconds, not hours. Screen 50 resumes in under a minute."
              },
              {
                icon: CheckCircle,
                title: "Bulk Upload",
                description: "Upload up to 50 resumes at once. Organize by job or role."
              },
              {
                icon: Download,
                title: "CSV Export",
                description: "Export your shortlist with notes to import into your ATS."
              },
              {
                icon: MessageSquare,
                title: "Natural Language",
                description: "No complex queries. Just ask questions like you would to a colleague."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Start free, upgrade when you need more
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="font-semibold text-lg mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">Perfect for trying it out</p>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-3 mb-8">
                {["2 job folders", "10 resumes per job", "20 queries per month", "7-day data retention"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
            {/* Pro Tier */}
            <div className="p-8 rounded-2xl border-2 border-primary bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="font-semibold text-lg mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">For serious recruiters</p>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-3 mb-8">
                {["Unlimited job folders", "100 resumes per job", "1000 queries per month", "CSV export", "Unlimited data retention", "Email support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to screen smarter?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join recruiters who save hours every day with AI-powered resume screening.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold">HireScreen</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for recruiters who value their time.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
