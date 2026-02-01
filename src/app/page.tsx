import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, Zap, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TypewriterQuery } from "@/components/landing/typewriter-query";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-amber-500/20">
// eslint-disable-next-line @next/next/no-img-element
              <img src="/logo.svg" alt="HireScreen" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">HireScreen</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 text-center">
          {/* Hero Text - 3 Lines */}
          <div className="max-w-4xl mx-auto space-y-4 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-100">
              Upload 100+ resumes.
            </h1>
            <div className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-zinc-400">Ask </span>
              <TypewriterQuery />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-100">
              Get ranked candidates in seconds.
            </h2>
          </div>
          
          <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10">
            AI-powered resume screening that saves hours. Upload PDFs, ask natural language questions, get instant answers with citations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-full px-8 h-12 text-base shadow-lg shadow-amber-500/25">
                Start Screening Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 border-y border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="h-10 bg-zinc-800 border-b border-zinc-700 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              </div>
              <div className="ml-4 h-6 flex-1 max-w-xs bg-zinc-700/50 rounded flex items-center px-3 text-xs text-zinc-500">
                hirescreen.ai/dashboard
              </div>
            </div>

            {/* Split View */}
            <div className="grid md:grid-cols-12 min-h-[450px]">
              {/* Sidebar */}
              <div className="md:col-span-4 border-r border-zinc-800 p-5 bg-zinc-950/50">
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Candidates</div>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", match: "95%", ready: true },
                    { name: "Mike Ross", match: "88%", ready: true },
                    { name: "Jessica Park", match: "82%", ready: true },
                  ].map((c, i) => (
                    <div key={i} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-zinc-200">{c.name}</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">{c.match}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="md:col-span-8 p-6 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-amber-500 text-zinc-900 px-4 py-2 rounded-2xl rounded-br-sm text-sm font-medium max-w-sm">
                      Who has React and Node.js experience?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm text-sm max-w-lg space-y-2">
                      <p className="font-medium text-amber-400">Found 2 strong matches:</p>
                      <ul className="space-y-2 text-zinc-300">
                        <li><strong className="text-zinc-100">Sarah Chen</strong> — 5 years React, built 3 production apps</li>
                        <li><strong className="text-zinc-100">Mike Ross</strong> — 3 years full-stack with Node.js</li>
                      </ul>
                      <div className="flex gap-2 pt-2">
                        <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded text-zinc-400">Sarah_Resume.pdf</span>
                        <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded text-zinc-400">Mike_CV.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="h-10 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center px-4 text-sm text-zinc-500">
                    Ask a follow-up question...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Hire faster with AI</h2>
            <p className="text-zinc-500">
              Stop reading every resume. Let AI surface the best candidates instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Search,
                title: "Semantic Search",
                desc: "Find 'Frontend' experts even if they only list React and Vue. AI understands context."
              },
              {
                icon: Zap,
                title: "Instant Results",
                desc: "Upload 50 resumes, get a ranked list in under 60 seconds. Save hours of reading."
              },
              {
                icon: Shield,
                title: "Private & Secure",
                desc: "Your data is encrypted and isolated. We never train on your candidate data."
              }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-zinc-900/30 border-y border-zinc-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">The Old Way vs. HireScreen</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Old Way */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="text-red-500 font-bold text-lg">✕</div>
                <div>
                  <h3 className="font-semibold text-red-400">Ctrl+F Keywords</h3>
                  <p className="text-sm text-zinc-500 mt-1">Misses qualified candidates who use different terms.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="text-red-500 font-bold text-lg">✕</div>
                <div>
                  <h3 className="font-semibold text-red-400">Reading every PDF</h3>
                  <p className="text-sm text-zinc-500 mt-1">Takes 5-10 minutes per resume. 50 resumes = 5+ hours.</p>
                </div>
              </div>
            </div>

            {/* HireScreen Way */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-emerald-500 font-bold text-lg">✓</div>
                <div>
                  <h3 className="font-semibold text-emerald-400">Concept Matching</h3>
                  <p className="text-sm text-zinc-500 mt-1">Finds &quot;Leadership&quot; skills from project descriptions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-emerald-500 font-bold text-lg">✓</div>
                <div>
                  <h3 className="font-semibold text-emerald-400">Instant Answers</h3>
                  <p className="text-sm text-zinc-500 mt-1">&quot;Who worked at a startup?&quot; → Instant ranked list.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-zinc-500">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-zinc-500">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {["2 positions", "10 resumes per position", "20 queries/month"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-zinc-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border-2 border-amber-500/50 bg-amber-500/5 relative">
              <div className="absolute -top-3 right-6 bg-amber-500 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal text-zinc-500">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {["Unlimited positions", "100 resumes per position", "1,000 queries/month", "CSV export", "Priority support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-zinc-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to hire 10x faster?</h2>
          <p className="text-xl text-zinc-500 mb-10 max-w-xl mx-auto">
            Join recruiters who screen hundreds of candidates in minutes.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-full px-12 h-14 text-lg shadow-xl shadow-amber-500/25">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold">
            <div className="w-7 h-7 rounded-lg overflow-hidden">
// eslint-disable-next-line @next/next/no-img-element
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            HireScreen
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-300">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300">Terms</Link>
            <a href="mailto:tashon.braganca@gmail.com" className="hover:text-zinc-300">Contact</a>
          </div>
          <div className="text-sm text-zinc-600">
            © 2024 HireScreen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
