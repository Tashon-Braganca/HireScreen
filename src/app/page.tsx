import { createClient } from "@/lib/supabase/server";
import DesignBPage from "@/components/landing/DesignBPage";

export default async function LandingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return <DesignBPage user={user} />;
}
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

/* ─── Server Component ─── */
=======
>>>>>>> fix/final-build-fix
export default async function Home() {
    const supabase = createClient();
    const { data: { user } } = await (await supabase).auth.getUser();

    return (
<<<<<<< HEAD
        <main className="min-h-screen bg-[var(--bg)] bg-noise selection:bg-[var(--accent-light)] selection:text-[var(--text)]">
            <Navbar user={user} />
            <Hero user={user} />
            <ProblemSection />
            <HowItWorks />
            <Pricing />
            <footer className="w-full border-t border-border/30 py-8 mt-16">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted">
                        © 2026 CandidRank. All rights reserved.
                    </p>
                    <nav className="flex items-center gap-6">
                        <a href="/legal" className="text-xs text-muted hover:text-ink transition-colors">
                            Legal
                        </a>
                        <a href="/terms" className="text-xs text-muted hover:text-ink transition-colors">
                            Terms of Service
                        </a>
                        <a href="/legal/privacy" className="text-xs text-muted hover:text-ink transition-colors">
                            Privacy Policy
                        </a>
                        <a href="/legal/refund-policy" className="text-xs text-muted hover:text-ink transition-colors">
                            Refund Policy
                        </a>
                    </nav>
                </div>
            </footer>
        </main>
=======
        <DesignBPage user={user} />
>>>>>>> fix/final-build-fix
    );
}
