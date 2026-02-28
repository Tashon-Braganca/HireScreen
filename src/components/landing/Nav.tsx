'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRAND_NAME, BRAND_LOGO_LETTER } from '@/config/brand';

export default function Nav({ user }: { user: { id: string } | null }) {
    const { scrollY } = useScroll();
    const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const sections = ['problem', 'how-it-works', 'features', 'pricing'];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        });

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 bg-[#111210]/90 backdrop-blur-md"
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center">
                        <div className="w-[20px] h-[20px] bg-sage text-canvas font-bold text-[11px] flex items-center justify-center rounded-[4px] mr-2">
                            {BRAND_LOGO_LETTER}
                        </div>
                        <div className="font-[family-name:var(--font-display)] font-semibold text-[18px] text-ink tracking-tight translate-y-[1px]">
                            {BRAND_NAME}
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 translate-y-[1px]">
                        {[
                            { id: 'problem', label: 'Problem' },
                            { id: 'how-it-works', label: 'How It Works' },
                            { id: 'features', label: 'Features' },
                            { id: 'pricing', label: 'Pricing' }
                        ].map((item) => (
                            <div key={item.id} className="relative flex flex-col items-center">
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => scrollTo(e, item.id)}
                                    className={`font-[family-name:var(--font-ui)] text-[13px] transition-colors ${activeSection === item.id ? 'text-ink' : 'text-body hover:text-ink'}`}
                                >
                                    {item.label}
                                </a>
                                {activeSection === item.id && (
                                    <motion.div
                                        layoutId="activeNavDot"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute -bottom-3 w-[4px] h-[4px] rounded-full bg-sage"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="font-[family-name:var(--font-ui)] text-[13px] text-body hover:text-ink transition-colors translate-y-[1px]">
                            Log In
                        </Link>
                        <Link href={user ? "/dashboard" : "/login"} passHref legacyBehavior>
                            <motion.a
                                whileHover={{ scale: 1.02, backgroundColor: '#8FCBAA' }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-sage text-canvas font-[family-name:var(--font-ui)] font-semibold text-[12px] px-4 py-2 rounded-[4px] shadow-sm tracking-wide"
                            >
                                {user ? "Dashboard" : "Free Trial"}
                            </motion.a>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-ink">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {mobileMenuOpen ? (
                                    <path d="M18 6L6 18M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scroll Aware Border */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-vis"
                    style={{ opacity: borderOpacity, height: '1px' }}
                />
            </motion.nav>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-16 left-0 right-0 bg-panel border-b border-sub z-40 p-6 flex flex-col gap-4 shadow-xl">
                    <a href="#problem" onClick={(e) => scrollTo(e, 'problem')} className="font-[family-name:var(--font-ui)] text-[15px] text-ink py-2 border-b border-sub">Problem</a>
                    <a href="#how-it-works" onClick={(e) => scrollTo(e, 'how-it-works')} className="font-[family-name:var(--font-ui)] text-[15px] text-ink py-2 border-b border-sub">How It Works</a>
                    <a href="#features" onClick={(e) => scrollTo(e, 'features')} className="font-[family-name:var(--font-ui)] text-[15px] text-ink py-2 border-b border-sub">Features</a>
                    <a href="#pricing" onClick={(e) => scrollTo(e, 'pricing')} className="font-[family-name:var(--font-ui)] text-[15px] text-ink py-2 border-b border-sub">Pricing</a>

                    <div className="flex flex-col gap-3 mt-4">
                        <Link href="/login" className="text-center font-[family-name:var(--font-ui)] text-[15px] text-ink py-3 border border-sub rounded-[6px]">
                            Log In
                        </Link>
                        <Link href={user ? "/dashboard" : "/login"} className="text-center font-[family-name:var(--font-ui)] font-semibold text-[15px] text-canvas bg-sage py-3 rounded-[6px] shadow-sm">
                            {user ? "Dashboard" : "Free Trial"}
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
