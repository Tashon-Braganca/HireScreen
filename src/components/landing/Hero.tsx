'use client';

import { motion } from 'framer-motion';
import HeroWidget from './HeroWidget';
import Link from 'next/link';
import { useState } from 'react';
import { useSubscription, openCheckout } from '@/hooks/useSubscription';

export default function Hero({ user }: { user: { id: string } | null }) {
    const line1 = "Stop reading resumes.";
    const words1 = line1.split(' ');

    // Custom CTA fill animation
    const [ctaHovered, setCtaHovered] = useState(false);
    const { isPro, isLoading } = useSubscription();

    const handleCtaClick = async (e: React.MouseEvent) => {
        if (user && !isPro) {
            e.preventDefault();
            try {
                await openCheckout();
            } catch (error) {
                console.error('Failed to open checkout:', error);
            }
        }
    };

    return (
        <section className="bg-canvas min-h-[100vh] relative pt-32 pb-24 px-6 overflow-hidden flex items-center">

            {/* Dot-Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(232,228,220,0.04) 1px, transparent 1px)',
                    backgroundSize: '28px 28px'
                }}
            />

            {/* Primary sage glow — top right */}
            <div className="absolute right-[-200px] top-[-100px] w-[900px] h-[800px] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(126,203,158,0.06) 0%, transparent 65%)',
                }}
            />

            {/* Secondary warm glow — bottom left */}
            <div className="absolute left-[-250px] bottom-[-150px] w-[700px] h-[600px] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(229,199,110,0.03) 0%, transparent 60%)',
                }}
            />

            {/* Animated floating orbs */}
            <motion.div
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[15%] left-[8%] w-[6px] h-[6px] rounded-full bg-[var(--accent-sage)] pointer-events-none z-0"
                style={{ filter: 'blur(1px)' }}
            />
            <motion.div
                animate={{ y: [15, -25, 15], x: [5, -8, 5], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-[30%] right-[12%] w-[4px] h-[4px] rounded-full bg-[var(--accent-amber)] pointer-events-none z-0"
                style={{ filter: 'blur(1px)' }}
            />
            <motion.div
                animate={{ y: [10, -15, 10], opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-[25%] left-[15%] w-[5px] h-[5px] rounded-full bg-[var(--accent-sage)] pointer-events-none z-0"
                style={{ filter: 'blur(1px)' }}
            />
            <motion.div
                animate={{ y: [-12, 18, -12], x: [8, -5, 8], opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="absolute top-[60%] right-[25%] w-[3px] h-[3px] rounded-full bg-[var(--accent-sage)] pointer-events-none z-0"
                style={{ filter: 'blur(0.5px)' }}
            />
            <motion.div
                animate={{ y: [8, -20, 8], opacity: [0.1, 0.35, 0.1] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute top-[20%] left-[45%] w-[4px] h-[4px] rounded-full bg-[var(--accent-amber)] pointer-events-none z-0"
                style={{ filter: 'blur(1.5px)' }}
            />

            {/* Diagonal accent line — subtle */}
            <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.06, scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[40%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-sage)] to-transparent pointer-events-none z-0 origin-left"
                style={{ transform: 'rotate(-4deg)' }}
            />

            {/* Vertical accent line */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.04, scaleY: 1 }}
                transition={{ duration: 1.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-gradient-to-b from-transparent via-[var(--accent-sage)] to-transparent pointer-events-none z-0 origin-top"
            />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 items-center relative z-10 gap-16">
                {/* Left Column */}
                <div className="w-full">
                    {/* Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block font-[family-name:var(--font-mono)] text-[11px] bg-sage-dim border border-[rgba(126,184,154,0.25)] text-sage px-3 py-1 rounded-[3px] mb-8 shadow-[0_0_12px_rgba(126,184,154,0.08)]"
                    >
                        ✦ AI-POWERED SCREENING
                    </motion.div>

                    {/* H1 Headline - Staggered Word Reveal */}
                    <h1 className="font-[family-name:var(--font-display)] font-bold text-5xl lg:text-7xl leading-[0.96] tracking-[-0.025em] text-ink flex flex-col items-start">
                        <div className="flex flex-wrap">
                            {words1.map((word, wordIndex) => (
                                <motion.span
                                    key={wordIndex}
                                    initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{
                                        duration: 0.6,
                                        delay: (0 * 0.18) + (wordIndex * 0.07),
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    style={{ display: 'inline-block', marginRight: '0.3em' }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{
                                duration: 0.6,
                                delay: (1 * 0.18) + (0 * 0.07),
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="italic text-sage mt-2 block"
                        >
                            Start asking.
                        </motion.div>
                    </h1>

                    {/* Body */}
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="font-[family-name:var(--font-body)] font-normal text-[18px] text-body leading-[1.75] max-w-md mt-6"
                    >
                        Upload your candidate PDFs. Ask any question in plain English. Get ranked results with cited proof — in under 10 seconds.
                    </motion.p>

                    {/* CTA Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                    >
                        <Link href={user ? (isPro ? "/dashboard" : "#pricing") : "/login"} passHref legacyBehavior>
                            <a
                                onMouseEnter={() => setCtaHovered(true)}
                                onMouseLeave={() => setCtaHovered(false)}
                                onClick={handleCtaClick}
                                className="relative overflow-hidden rounded-[8px] bg-sage flex items-center shadow-[0_0_24px_rgba(126,184,154,0.2)] text-[#0C0D0C] hover:text-[#0C0D0C]"
                                style={{ padding: '14px 28px' }}
                            >
                                <motion.div
                                    animate={{
                                        scale: ctaHovered ? 18 : 1,
                                        opacity: ctaHovered ? 1 : 0
                                    }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute w-[32px] h-[32px] rounded-full z-0 pointer-events-none"
                                    style={{
                                        background: '#ffffff',
                                        opacity: 0.25,
                                        right: '20px',
                                        top: '50%',
                                        y: '-50%'
                                    }}
                                />
                                <span className="relative z-10 font-[family-name:var(--font-ui)] font-semibold text-[15px] flex items-center">
                                    {isLoading ? "Loading..." : user ? (isPro ? "Go to Dashboard" : "Upgrade to Pro") : "Start Free Trial"}
                                    <motion.span
                                        animate={{ x: ctaHovered ? 4 : 0 }}
                                        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                                        className="inline-block ml-2"
                                    >
                                        →
                                    </motion.span>
                                </span>
                            </a>
                        </Link>
                        <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }} className="font-[family-name:var(--font-body)] italic text-[16px] text-body hover:text-ink transition-colors hover:underline">
                            See how it works &rarr;
                        </a>
                    </motion.div>

                    {/* Trust Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-ui)] font-normal text-[12px] text-dim"
                    >
                        <span className="flex items-center"><span className="text-sage mr-1.5">&#10003;</span> No credit card</span>
                        <span className="flex items-center"><span className="text-sage mr-1.5">&#10003;</span> Free forever plan</span>
                        <span className="flex items-center"><span className="text-sage mr-1.5">&#10003;</span> SOC 2 ready</span>
                    </motion.div>
                </div>

                {/* Right Column - The Hero Widget */}
                <div className="w-full hidden lg:flex justify-center xl:justify-end">
                    <HeroWidget />
                </div>
            </div>
        </section>
    );
}
