import React from "react";
import { Outfit } from "next/font/google";
import Link from "next/link";
import {
    Search, FileText, Zap, Upload, MessageSquare, BarChart3,
    CheckCircle, XCircle, ArrowRight, Star, Shield, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"] });

/* ─── Navbar ─── */
const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm">
            <div className="font-bold text-xl text-slate-800 tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">H</div>
                HireScreen
            </div>
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
                <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
                <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            </div>
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                Get Started
            </Link>
        </div>
    </nav>
);

/* ─── Hero ─── */
const Hero = () => (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Static gradient blobs */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-200/40 blur-3xl top-[-15%] left-[-10%]" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl bottom-[-15%] right-[-8%]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-pink-100/40 blur-3xl top-[40%] left-[30%]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700">
                    <Zap size={14} />
                    AI-Powered Resume Screening
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                    Stop reading 200 resumes.{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Start asking questions.
                    </span>
                </h1>

                <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                    Upload resumes. Ask &quot;Who has 5+ years React + startup experience?&quot; Get ranked candidates with proof — in 60 seconds.
                </p>

                <div className="flex gap-4">
                    <Link href="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                        Start Free Trial
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> No credit card</div>
                    <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> 20 free queries</div>
                    <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> Setup in 2 min</div>
                </div>
            </div>

            {/* Mockup Card */}
            <div className="hidden lg:block">
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-6 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 text-sm">Senior React Developer</div>
                            <div className="text-xs text-slate-400">24 Candidates • 8 Matches</div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        {[
                            { initials: "JD", name: "John Doe", role: "Ex-Google • Senior Dev", score: 95, color: "from-blue-400 to-indigo-500" },
                            { initials: "AS", name: "Alice Smith", role: "Full Stack Eng", score: 91, color: "from-pink-400 to-rose-500" },
                            { initials: "MK", name: "Mike K.", role: "Frontend Dev", score: 87, color: "from-amber-400 to-orange-500" },
                        ].map((c, i) => (
                            <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all", i === 0 ? "bg-white/80 border-blue-100 shadow-sm" : "opacity-60")}>
                                <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold", c.color)}>{c.initials}</div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-700">{c.name}</div>
                                    <div className="text-[10px] text-slate-400">{c.role}</div>
                                </div>
                                <div className={cn("text-sm font-bold px-2 py-0.5 rounded-lg", i === 0 ? "text-emerald-600 bg-emerald-50" : "text-emerald-500")}>{c.score}%</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 border-t border-slate-100 pt-3">
                        <Search size={14} />
                        <span className="text-slate-400">&quot;Find candidates with 3+ yrs Next.js...&quot;</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ─── Problem Section ─── */
const ProblemSection = () => (
    <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Hiring is broken. You&apos;re drowning in resumes.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Every open role attracts hundreds of applicants. Manual screening wastes hours and still misses great candidates.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: XCircle, text: "Reading 200+ resumes takes 8 hours per role", color: "text-red-500 bg-red-50" },
                { icon: XCircle, text: "Keyword search misses context — skills buried in project descriptions", color: "text-red-500 bg-red-50" },
                { icon: XCircle, text: "Great candidates get lost in the stack and slip away", color: "text-red-500 bg-red-50" },
            ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-5">
                    <div className={cn("p-2 rounded-xl flex-shrink-0", item.color)}>
                        <item.icon size={18} />
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.text}</p>
                </div>
            ))}
        </div>
        <div className="max-w-4xl mx-auto mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-semibold text-emerald-700">
                <CheckCircle size={16} />
                HireScreen fixes this — ask natural questions, get ranked candidates with page citations
            </div>
        </div>
    </section>
);

/* ─── How It Works ─── */
const HowItWorks = () => (
    <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
                <p className="text-slate-500">From PDFs to ranked results in three simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Upload, step: "01", title: "Upload Resumes", desc: "Drag & drop PDFs. We extract text, chunk it, and create AI embeddings automatically.", color: "from-blue-500 to-blue-600" },
                    { icon: MessageSquare, step: "02", title: "Ask Questions", desc: "\"Who has 5+ years of React and worked at a startup?\" — natural language, not boolean filters.", color: "from-purple-500 to-purple-600" },
                    { icon: BarChart3, step: "03", title: "Get Ranked Results", desc: "Candidates ranked by relevance score with specific citations from their resumes as proof.", color: "from-emerald-500 to-emerald-600" },
                ].map((item, i) => (
                    <div key={i} className="group relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className="absolute top-4 right-4 text-3xl font-black text-slate-100">{item.step}</div>
                        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-4", item.color)}>
                            <item.icon size={22} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ─── Social Proof ─── */
const Testimonials = () => (
    <section className="py-20 px-6 bg-white/30">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Loved by Recruiters</h2>
                <p className="text-slate-500">See what hiring teams are saying.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: "Sarah Chen", role: "Head of Talent, TechCo", quote: "Cut our screening time from 8 hours to 20 minutes. The citation feature is incredible — I can verify every match." },
                    { name: "James Rivera", role: "Recruiter, StartupXYZ", quote: "Finally, a tool that understands context. Keyword search never caught candidates who described skills in projects." },
                    { name: "Priya Patel", role: "HR Director, ScaleUp Inc", quote: "The ranked results make it so easy to shortlist. My hiring managers love the export reports." },
                ].map((t, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-6">
                        <div className="flex gap-1 text-amber-400 mb-3">
                            {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">&quot;{t.quote}&quot;</p>
                        <div>
                            <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                            <div className="text-xs text-slate-400">{t.role}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ─── Pricing ─── */
const Pricing = () => (
    <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Simple Pricing</h2>
                <p className="text-slate-500">Start free. Upgrade when you need more.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Free */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-8">
                    <h3 className="font-bold text-slate-900 text-xl mb-1">Free</h3>
                    <p className="text-sm text-slate-400 mb-6">Perfect for trying things out</p>
                    <div className="text-4xl font-black text-slate-900 mb-6">$0<span className="text-lg font-medium text-slate-400">/mo</span></div>
                    <ul className="space-y-3 mb-8">
                        {["3 active jobs", "20 queries per month", "50 resume uploads", "CSV export"].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/login" className="block w-full text-center py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                        Get Started Free
                    </Link>
                </div>
                {/* Pro */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/20 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full">Popular</div>
                    <h3 className="font-bold text-xl mb-1">Pro</h3>
                    <p className="text-sm text-blue-200 mb-6">For serious hiring teams</p>
                    <div className="text-4xl font-black mb-6">$29<span className="text-lg font-medium text-blue-200">/mo</span></div>
                    <ul className="space-y-3 mb-8">
                        {["Unlimited jobs", "Unlimited queries", "Unlimited uploads", "PDF & CSV export", "Priority AI processing", "Email support"].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-blue-100">
                                <CheckCircle size={14} className="text-blue-300 flex-shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/login" className="block w-full text-center py-3 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors">
                        Start Pro Trial
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

/* ─── Footer ─── */
const Footer = () => (
    <footer className="py-12 px-6 border-t border-slate-200/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-800">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">H</div>
                HireScreen
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-1.5"><Shield size={13} /> SOC 2 Ready</div>
                <div className="flex items-center gap-1.5"><Clock size={13} /> 99.9% Uptime</div>
            </div>
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} HireScreen. All rights reserved.</p>
        </div>
    </footer>
);

/* ─── Page ─── */
export default function Home() {
    return (
        <main className={cn(outfit.className, "min-h-screen bg-[#f0f4f8] selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden")}>
            <Navbar />
            <Hero />
            <ProblemSection />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <Footer />
        </main>
    );
}
