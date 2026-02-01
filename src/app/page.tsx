import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Terminal, Shield, Zap, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            HireScreen
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] opacity-30" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">v1.0 Now Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Stop reading resumes.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Start asking questions.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload 100+ PDFs. Ask "Who has 5 years of React experience?" <br className="hidden md:block" />
            Get a ranked list of top candidates in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                Start Screening Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-border/40 max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6 font-medium">TRUSTED BY RECRUITERS AT</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella'].map((brand) => (
                <div key={brand} className="text-lg font-bold font-mono">{brand}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Demo / Interface Shot */}
      <section id="demo" className="py-20 bg-secondary/20 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto rounded-xl border bg-background shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Fake Browser Header */}
            <div className="h-10 bg-muted border-b flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 h-6 w-64 bg-background/50 rounded-md flex items-center px-2 text-xs text-muted-foreground font-mono">
                hirescreen.ai/dashboard
              </div>
            </div>

            {/* Split View Mockup */}
            <div className="grid md:grid-cols-12 h-[500px]">
              {/* Sidebar */}
              <div className="md:col-span-3 border-r bg-muted/10 p-4 space-y-3 hidden md:block">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Candidates</div>
                {[
                  { name: "Sarah Chen", status: "95% Match", color: "text-green-600" },
                  { name: "Mike Ross", status: "88% Match", color: "text-green-600" },
                  { name: "Jessica P.", status: "Processing", color: "text-yellow-600" },
                ].map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-background flex items-center justify-between shadow-sm">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className={`text-xs ${c.color}`}>{c.status}</div>
                  </div>
                ))}
                <div className="h-px bg-border my-4" />
                <div className="p-3 rounded-lg border border-dashed text-center text-xs text-muted-foreground">
                  + Upload more PDFs
                </div>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-9 p-6 flex flex-col">
                <div className="flex-1 space-y-6">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-sm text-sm">
                      Who has experience with Next.js and Supabase?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm text-sm max-w-lg space-y-2 shadow-sm">
                      <p className="font-medium text-primary">I found 2 strong candidates:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>
                          <span className="font-semibold text-foreground">Sarah Chen</span>: 
                          5 years exp. Built 3 SaaS apps with Next.js.
                        </li>
                        <li>
                          <span className="font-semibold text-foreground">Mike Ross</span>: 
                          Used Supabase at previous role for 2 years.
                        </li>
                      </ul>
                      <div className="flex gap-2 pt-2">
                        <span className="text-[10px] border px-1.5 py-0.5 rounded bg-background">Source: Sarah_Resume.pdf</span>
                        <span className="text-[10px] border px-1.5 py-0.5 rounded bg-background">Source: Mike_CV.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="h-10 bg-muted/50 rounded-md border flex items-center px-3 text-sm text-muted-foreground">
                    Ask a follow up...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to hire faster</h2>
            <p className="text-muted-foreground">
              Manual screening is dead. Use AI to surface the best talent instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Semantic Search",
                desc: "Don't just match keywords. Match meaning. Find 'Frontend' experts even if they only list 'React' and 'Vue'."
              },
              {
                icon: Zap,
                title: "Instant Ranking",
                desc: "Upload 50 resumes and get a ranked list in under 60 seconds. Save hours of reading time."
              },
              {
                icon: Shield,
                title: "Private & Secure",
                desc: "Your candidate data is encrypted and isolated. We never train our models on your data."
              }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">The Old Way vs. HireScreen</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="mt-1 text-red-500 font-bold">❌</div>
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-400">Ctrl+F Keywords</h3>
                    <p className="text-sm text-muted-foreground">Misses qualified candidates who use different terms.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="mt-1 text-red-500 font-bold">❌</div>
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-400">Reading every PDF</h3>
                    <p className="text-sm text-muted-foreground">Takes 5-10 minutes per resume. 50 resumes = 5+ hours.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20 shadow-sm">
                  <div className="mt-1 text-green-500 font-bold">✅</div>
                  <div>
                    <h3 className="font-semibold text-green-700 dark:text-green-400">Concept Matching</h3>
                    <p className="text-sm text-muted-foreground">Finds "Leadership" skills from project descriptions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20 shadow-sm">
                  <div className="mt-1 text-green-500 font-bold">✅</div>
                  <div>
                    <h3 className="font-semibold text-green-700 dark:text-green-400">Instant Answers</h3>
                    <p className="text-sm text-muted-foreground">&quot;Who worked at a startup?&quot; -&gt; Instant list.</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade for power features.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl border hover:border-primary/50 transition-colors relative">
              <h3 className="text-2xl font-bold mb-2">Free Starter</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" /> 2 Jobs
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" /> 10 Resumes per job
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" /> Basic Search
                </li>
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full rounded-full">Get Started</Button>
              </Link>
            </div>

            <div className="p-8 rounded-3xl border-2 border-primary bg-primary/5 relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro Recruiter</h3>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" /> Unlimited Jobs
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" /> 100 Resumes per job
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" /> Priority Support
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500" /> Export to CSV
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full rounded-full">Start 7-Day Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to hire 10x faster?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of recruiters who have switched to AI-powered screening.
          </p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full px-12 h-14 text-lg shadow-xl shadow-primary/25">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
              <Terminal className="w-3 h-3" />
            </div>
            HireScreen
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="mailto:support@hirescreen.ai" className="hover:text-foreground">Contact</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 HireScreen AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
