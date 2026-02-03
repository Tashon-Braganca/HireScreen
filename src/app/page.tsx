import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, Zap, Search, Sparkles, FileText, MessageSquare, Upload } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TypewriterQuery } from "@/components/landing/typewriter-query";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-white" />
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
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-medium rounded-full px-6 shadow-lg shadow-amber-500/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-60 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="container mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 mb-8">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-zinc-300">AI-Powered Resume Screening</span>
          </div>

          {/* Hero Text */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Upload resumes.
              <br />
              <span className="text-zinc-400">Ask </span>
              <TypewriterQuery />
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Hire faster.
              </span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop reading every resume. Upload PDFs, ask natural language questions, 
            get ranked candidates with citations in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold rounded-full px-8 h-14 text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105">
                Start Screening Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 text-sm">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10x</p>
              <p className="text-zinc-500">Faster screening</p>
            </div>
            <div className="w-px h-12 bg-zinc-800" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">100+</p>
              <p className="text-zinc-500">Resumes at once</p>
            </div>
            <div className="w-px h-12 bg-zinc-800" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">60s</p>
              <p className="text-zinc-500">To ranked list</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-sm">
            {/* Browser Chrome */}
            <div className="h-12 bg-zinc-800/80 border-b border-zinc-700/50 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              </div>
              <div className="ml-4 h-7 flex-1 max-w-sm bg-zinc-700/50 rounded-lg flex items-center px-4 text-xs text-zinc-500">
                <span className="text-amber-500/70">https://</span>hirescreen.ai/dashboard
              </div>
            </div>

            {/* Split View */}
            <div className="grid md:grid-cols-12 min-h-[480px]">
              {/* Sidebar */}
              <div className="md:col-span-4 border-r border-zinc-800/50 p-6 bg-zinc-950/50">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Candidates</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", match: "95%", skills: "React, Node.js" },
                    { name: "Mike Ross", match: "88%", skills: "Python, AWS" },
                    { name: "Jessica Park", match: "82%", skills: "Full-stack" },
                    { name: "David Kim", match: "76%", skills: "Backend" },
                  ].map((c, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${i === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-zinc-800 bg-zinc-900/50'} transition-all hover:border-zinc-700`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg ${i === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-zinc-700'} flex items-center justify-center text-xs font-bold text-white`}>
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-zinc-200">{c.name}</span>
                            <p className="text-xs text-zinc-500">{c.skills}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${i === 0 ? 'text-amber-500' : 'text-emerald-500'}`}>{c.match}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="md:col-span-8 p-6 flex flex-col bg-zinc-900/30">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 px-5 py-3 rounded-2xl rounded-br-md text-sm font-medium max-w-sm shadow-lg shadow-amber-500/10">
                      Who has React and Node.js experience?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-zinc-800/80 px-5 py-4 rounded-2xl rounded-bl-md text-sm max-w-lg space-y-3 border border-zinc-700/50">
                      <p className="font-semibold text-amber-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Found 2 strong matches:
                      </p>
                      <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span><strong className="text-zinc-100">Sarah Chen</strong> — 5 years React, built 3 production apps at Series B startup</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span><strong className="text-zinc-100">Mike Ross</strong> — 3 years full-stack with Node.js, led backend team</span>
                        </li>
                      </ul>
                      <div className="flex gap-2 pt-2">
                        <span className="text-xs bg-zinc-700/80 px-2.5 py-1 rounded-lg text-zinc-400 border border-zinc-600/50">Sarah_Resume.pdf</span>
                        <span className="text-xs bg-zinc-700/80 px-2.5 py-1 rounded-lg text-zinc-400 border border-zinc-600/50">Mike_CV.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center gap-3 h-12 bg-zinc-800/50 rounded-xl border border-zinc-700/50 px-4 text-sm text-zinc-500">
                    <MessageSquare className="w-4 h-4" />
                    Ask a follow-up question...
                    <div className="ml-auto flex items-center gap-2 text-xs text-zinc-600">
                      <span className="px-2 py-0.5 rounded bg-zinc-700/50">GPT-4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Three steps to better hiring</h2>
            <p className="text-zinc-500 text-lg">
              From 100 resumes to shortlist in under 60 seconds
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload PDFs",
                desc: "Drop up to 100 resumes at once. We extract and index all the text content."
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Ask Questions",
                desc: '"Who has AWS experience?" "Find React developers with 3+ years" — ask anything.'
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Get Rankings",
                desc: "AI analyzes all resumes and returns ranked candidates with cited evidence."
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-px bg-gradient-to-b from-amber-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <div className="relative p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all h-full">
                  <div className="text-6xl font-bold text-zinc-800 mb-4">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                    <item.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why HireScreen?</h2>
            <p className="text-zinc-500 text-lg">
              Built for modern recruiting teams who value their time
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Search,
                title: "Semantic Search",
                desc: 'Find "Frontend" experts even if they only list React and Vue. AI understands context and synonyms.'
              },
              {
                icon: Zap,
                title: "Instant Results",
                desc: "Upload 50 resumes, get a ranked list in under 60 seconds. Save hours of manual reading."
              },
              {
                icon: Shield,
                title: "Private & Secure",
                desc: "Your data is encrypted and isolated. We never train on your candidate data. SOC2 compliant."
              }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex items-center justify-center mb-4 group-hover:from-amber-500/20 group-hover:to-orange-500/10 transition-all border border-amber-500/10">
                  <f.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing</h2>
            <p className="text-zinc-500 text-lg">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-zinc-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {["2 positions", "10 resumes per position", "20 AI queries/month"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check className="w-5 h-5 text-zinc-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl h-12">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="relative p-8 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-transparent">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 text-xs font-bold px-4 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg font-normal text-zinc-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {["Unlimited positions", "100 resumes per position", "1,000 AI queries/month", "CSV export", "Priority support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-5 h-5 text-amber-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-medium rounded-xl h-12">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to hire 10x faster?</h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
            Join recruiters who screen hundreds of candidates in minutes, not hours.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold rounded-full px-12 h-14 text-lg shadow-xl shadow-amber-500/25 transition-all hover:scale-105">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">HireScreen</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <a href="mailto:tashon.braganca@gmail.com" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
          <div className="text-sm text-zinc-600">
            © 2024 HireScreen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
