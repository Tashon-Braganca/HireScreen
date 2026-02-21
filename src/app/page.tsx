import React from "react";
import Link from "next/link";
import {
    Zap, Upload, MessageSquare, BarChart3,
    CheckCircle, ArrowRight, Shield, Clock
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { BRAND_NAME, BRAND_LOGO_LETTER } from "@/config/brand";
import { HeroMockup } from "@/components/landing/HeroMockup";

/* ─── Navbar ─── */
const Navbar = ({ user }: { user: { id: string } | null }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="font-bold text-lg text-[var(--text)] flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[var(--accent)] flex items-center justify-center text-[var(--accent-foreground)] font-bold text-sm">{BRAND_LOGO_LETTER}</div>
                {BRAND_NAME}
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-[var(--muted)]">
                <a href="#how-it-works" className="hover:text-[var(--text)] transition-colors">How It Works</a>
                <a href="#pricing" className="hover:text-[var(--text)] transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
                {user ? (
                    <Link href="/dashboard" className="bg-[var(--accent)] text-[var(--accent-foreground)] px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href="/login" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]">
                            Log in
                        </Link>
                        <Link href="/login" className="bg-[var(--text)] text-[var(--bg)] px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--text)]/90 transition-colors">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </div>
    </nav>
);

/* ─── Hero ─── */
const Hero = ({ user }: { user: { id: string } | null }) => (
    <section className="pt-32 pb-20 px-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 max-w-2xl">
                <div
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-full text-xs font-semibold text-[var(--accent)] uppercase tracking-wide animate-stagger-in"
                    style={{ animationDelay: "0ms" }}
                >
                    <Zap size={12} />
                    AI-Powered Resume Screening
                </div>

                <h1
                    className="text-5xl lg:text-6xl font-bold text-[var(--text)] leading-[1.1] animate-stagger-in"
                    style={{ animationDelay: "100ms" }}
                >
                    Stop reading resumes. <br />
                    Start asking questions.
                </h1>

                <p
                    className="text-lg text-[var(--muted)] max-w-lg leading-relaxed animate-stagger-in"
                    style={{ animationDelay: "200ms" }}
                >
                    Upload resumes. Ask &quot;Who has 5+ years React + startup experience?&quot; Get ranked candidates with cited proof — in seconds.
                </p>

                <div
                    className="flex gap-4 animate-stagger-in"
                    style={{ animationDelay: "300ms" }}
                >
                    <Link href={user ? "/dashboard" : "/login"} className="bg-[var(--accent)] text-[var(--accent-foreground)] px-6 py-3.5 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2">
                        {user ? "Go to Dashboard" : "Start Free Trial"}
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div
                    className="flex items-center gap-6 text-sm text-[var(--muted)] animate-stagger-in"
                    style={{ animationDelay: "400ms" }}
                >
                    <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[var(--success)]" /> No credit card</div>
                    <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[var(--success)]" /> 20 free queries</div>
                </div>
            </div>

            {/* Mockup Card — Animated */}
            <div className="hidden lg:block relative animate-stagger-in" style={{ animationDelay: "300ms" }}>
                <div className="absolute inset-0 bg-[var(--panel)] -z-10 rounded-3xl border border-[var(--border)]" />
                <HeroMockup />
            </div>
        </div>
    </section>
);

/* ─── Problem Section ─── */
const ProblemSection = () => (
    <section className="py-20 px-6 border-y border-[var(--border)] bg-[var(--panel)]">
        <div className="max-w-[1440px] mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-[var(--text)] mb-4">Hiring is broken.</h2>
                <p className="text-[var(--muted)]">Manual screening wastes hours and keyword search misses context.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "8+ Hours", text: "Time spent reading resumes per role." },
                    { title: "Zero Context", text: "Keyword search checks boxes but misses true experience." },
                    { title: "Lost Talent", text: "Great candidates get buried in the stack." },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-[var(--card)] p-6 rounded-lg border border-[var(--border)] animate-stagger-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <h3 className="text-xl font-bold text-[var(--text)] mb-2">{item.title}</h3>
                        <p className="text-sm text-[var(--muted)]">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ─── How It Works ─── */
const HowItWorks = () => (
    <section id="how-it-works" className="py-24 px-6 max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--text)] mb-3">How It Works</h2>
            <p className="text-[var(--muted)]">From PDFs to ranked results in minutes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                { icon: Upload, step: "01", title: "Upload Resumes", desc: "Drag & drop PDFs. We extract text and create AI embeddings automatically." },
                { icon: MessageSquare, step: "02", title: "Ask Questions", desc: "\"Who has 5+ years of React and worked at a startup?\" — natural language, not keywords." },
                { icon: BarChart3, step: "03", title: "Get Ranked Results", desc: "Candidates ranked by relevance score with specific citations from their resumes." },
            ].map((item, i) => (
                <div
                    key={i}
                    className="group animate-stagger-in"
                    style={{ animationDelay: `${i * 120}ms` }}
                >
                    <div className="w-12 h-12 rounded-lg bg-[var(--panel)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] mb-6 group-hover:border-[var(--accent)] transition-colors">
                        <item.icon size={20} />
                    </div>
                    <div className="text-xs font-bold text-[var(--accent)] mb-2">STEP {item.step}</div>
                    <h3 className="font-bold text-[var(--text)] text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

/* ─── Pricing ─── */
const Pricing = () => (
    <section id="pricing" className="py-24 px-6 bg-[var(--panel)] border-t border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-[var(--text)] mb-3">Simple Pricing</h2>
                <p className="text-[var(--muted)]">Start free. Upgrade for power.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free */}
                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-8">
                    <h3 className="font-bold text-[var(--text)] text-lg mb-1">Free</h3>
                    <div className="text-4xl font-bold text-[var(--text)] mb-6">$0<span className="text-base font-normal text-[var(--muted)]">/mo</span></div>
                    <ul className="space-y-4 mb-8">
                        {["3 active jobs", "20 queries per month", "50 resume uploads", "CSV export"].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-[var(--text)]">
                                <CheckCircle size={16} className="text-[var(--muted)] flex-shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/login" className="block w-full text-center py-3 rounded-lg border border-[var(--border)] text-[var(--text)] font-semibold text-sm hover:bg-[var(--panel)] transition-colors">
                        Get Started
                    </Link>
                </div>
                {/* Pro */}
                <div className="bg-[var(--text)] rounded-xl border border-[var(--text)] p-8 text-[var(--bg)] relative overflow-hidden">
                    <h3 className="font-bold text-lg mb-1">Pro</h3>
                    <div className="text-4xl font-bold mb-6">$49<span className="text-base font-normal opacity-70">/mo</span></div>
                    <ul className="space-y-4 mb-8">
                        {["Unlimited jobs", "Unlimited queries", "Unlimited uploads", "PDF export", "Priority support"].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm">
                                <CheckCircle size={16} className="text-[var(--accent)] flex-shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/login" className="block w-full text-center py-3 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">
                        Start Pro Trial
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

/* ─── Footer ─── */
const Footer = () => (
    <footer className="py-12 px-6 border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-[var(--text)]">
                <div className="w-6 h-6 rounded bg-[var(--text)] flex items-center justify-center text-[var(--bg)] text-xs font-bold">{BRAND_LOGO_LETTER}</div>
                {BRAND_NAME}
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-1.5"><Shield size={13} /> SOC 2 Ready</div>
                <div className="flex items-center gap-1.5"><Clock size={13} /> 99.9% Uptime</div>
            </div>
            <p className="text-sm text-[var(--muted)]">&copy; {new Date().getFullYear()} {BRAND_NAME}.</p>
        </div>
    </footer>
);

/* ─── Server Component ─── */
export default async function Home() {
    const supabase = createClient();
    const { data: { user } } = await (await supabase).auth.getUser();

    return (
        <main className="min-h-screen bg-[var(--bg)] bg-noise selection:bg-[var(--accent-light)] selection:text-[var(--text)]">
            <Navbar user={user} />
            <Hero user={user} />
            <ProblemSection />
            <HowItWorks />
            <Pricing />
            <Footer />
        </main>
    );
}
