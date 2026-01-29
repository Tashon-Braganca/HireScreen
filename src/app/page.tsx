import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RolodexText } from "@/components/landing/rolodex-text";
import { TypewriterText } from "@/components/landing/typewriter-text";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Minimal Header - Direct UX */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">HireScreen</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold Statement */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Simplified Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle grid pattern only */}
          <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          {/* Single subtle gradient blob */}
          <div className="absolute top-1/4 right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="animate-fade-up inline-flex items-center gap-2 mb-8">
              <span className="h-px w-8 bg-primary/40" />
              <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                AI-Powered Recruiting
              </span>
              <span className="h-px w-8 bg-primary/40" />
            </div>

            {/* Main Headline with Rolodex Animation */}
            <h1 className="animate-fade-up-delay-1 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
              Screen resumes
              <br />
              <span className="gradient-text">
                <RolodexText 
                  words={["by asking.", "by thinking.", "by searching."]} 
                  interval={3000}
                />
              </span>
            </h1>

            {/* Subheadline with Typewriter Effect */}
            <div className="animate-fade-up-delay-2 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed h-[4rem] md:h-[3rem]">
              <TypewriterText 
                text='Upload your stack. Ask "Who has 5+ years React in SF?" Get ranked answers in seconds.'
                speed={50}
                delay={1500}
              />
            </div>

            {/* CTA */}
            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="rounded-full px-10 py-6 text-lg hover-lift shadow-xl shadow-primary/25">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                No credit card required
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
        </div>
      </section>

      {/* Value Proposition - Asymmetric Layout */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-secondary to-accent/50 border border-border/30">
                {/* Mock UI */}
                <div className="absolute inset-6 bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50">
                  {/* Mock header */}
                  <div className="h-12 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-chart-5" />
                    <div className="w-3 h-3 rounded-full bg-chart-2" />
                  </div>
                  {/* Mock content */}
                  <div className="p-6 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm font-medium">AI</span>
                      </div>
                      <div className="flex-1 p-4 bg-muted/30 rounded-2xl rounded-tl-none">
                        <p className="text-sm text-foreground">Found 12 candidates with Python experience in NYC...</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-14">
                      {["Sarah M. - 5 years, fintech", "James K. - 4 years, startups", "Lisa R. - 6 years, enterprise"].map((name, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/30">
                          <div className="w-8 h-8 rounded-full bg-chart-2/30" />
                          <span className="text-sm">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <span className="text-sm font-medium text-primary tracking-widest uppercase">
                How it works
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Natural language.
                <br />
                <span className="text-muted-foreground">Instant answers.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { num: "01", title: "Upload", desc: "Drop up to 50 resumes. We index everything automatically." },
                  { num: "02", title: "Ask", desc: "Query in plain English. No complex filters or boolean." },
                  { num: "03", title: "Shortlist", desc: "Get ranked results with exact citations. Export to CSV." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-6 items-start group">
                    <span className="text-4xl font-light text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section className="py-32 bg-secondary/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Built for recruiters who
              <br />
              <span className="text-muted-foreground">value their time</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large feature card */}
            <div className="md:col-span-2 lg:col-span-2 p-8 md:p-10 rounded-3xl bg-card border border-border/50 transition-shadow hover:shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Semantic Understanding</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Not keyword matching. Our AI understands context. Ask for &ldquo;frontend developers&rdquo; 
                    and find React, Vue, Angular experts—even if they don&apos;t say &ldquo;frontend.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Smaller cards */}
            {[
              { icon: "📍", title: "Cited Answers", desc: "Every result links to the exact resume and page." },
              { icon: "⚡", title: "Instant Results", desc: "50 resumes analyzed in under 60 seconds." },
              { icon: "📊", title: "Smart Export", desc: "One-click CSV for your ATS integration." },
              { icon: "🔒", title: "Private & Secure", desc: "Your data never trains our models." },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-card border border-border/50 transition-shadow hover:shadow-lg group">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Clean & Direct */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, transparent
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-10 rounded-3xl border border-border/50 bg-card transition-shadow hover:shadow-lg">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-muted-foreground">Perfect to explore</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {["2 job folders", "10 resumes per job", "20 queries/month", "7-day retention"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-chart-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full rounded-full py-6">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-10 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/30">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 text-sm mb-4">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <p className="text-primary-foreground/70">For serious recruiters</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$29</span>
                  <span className="text-primary-foreground/70">/month</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {["Unlimited folders", "100 resumes per job", "1000 queries/month", "CSV export", "Forever retention", "Priority support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="secondary" className="w-full rounded-full py-6 text-primary font-semibold">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold Statement */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Stop reading resumes.
              <br />
              <span className="text-muted-foreground">Start asking questions.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto">
              Join recruiters who screen 10x faster without sacrificing quality.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-12 py-7 text-lg shadow-xl shadow-primary/25">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">H</span>
              </div>
              <span className="font-semibold">HireScreen</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for recruiters who value their time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
