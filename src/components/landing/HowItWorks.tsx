'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    const xTranslate = useTransform(scrollYProgress, [0, 1], ['0vw', '-200vw']);
    const smoothX = useSpring(xTranslate, { stiffness: 80, damping: 20 });

    const [activeStep, setActiveStep] = useState(0);

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        if (v < 0.33) setActiveStep(0);
        else if (v < 0.66) setActiveStep(1);
        else setActiveStep(2);
    });

    return (
        <section id="how-it-works" ref={containerRef} className="relative bg-panel border-y border-sub" style={{ height: '300vh' }}>

            {/* Desktop Sticky Scroll Layout - Hidden on Mobile */}
            <div className="hidden md:flex sticky top-0 h-screen overflow-hidden items-center">
                {/* LEFT: Fixed vertical step indicators */}
                <div className="absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 w-4 items-center">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: activeStep === i ? 1 : 0.6,
                                backgroundColor: activeStep === i ? 'var(--accent-sage)' : 'var(--border-vis)'
                            }}
                            style={{
                                width: activeStep === i ? 10 : 6,
                                height: activeStep === i ? 10 : 6,
                                borderRadius: '50%'
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>

                {/* RIGHT: Sliding panels */}
                <motion.div className="flex" style={{ x: smoothX, width: '300vw' }}>

                    {/* Panel 1 */}
                    <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 relative overflow-hidden">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-[family-name:var(--font-display)] font-bold italic text-[240px] pointer-events-none select-none z-0 opacity-10"
                            style={{ color: 'var(--text-dim)' }}>
                            1
                        </div>

                        <div className="max-w-[800px] w-full grid grid-cols-2 gap-16 items-center z-10">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: activeStep === 0 ? 1 : 0, y: activeStep === 0 ? 0 : 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="font-[family-name:var(--font-mono)] text-[12px] text-sage uppercase tracking-[0.15em] mb-6 drop-shadow-sm"
                                >
                                    01 — Data Ingestion
                                </motion.div>
                                <h3 className="font-[family-name:var(--font-display)] font-bold text-[64px] text-ink mb-6 leading-[1.05]">
                                    Upload everything.
                                </h3>
                                <p className="font-[family-name:var(--font-body)] font-normal text-[20px] text-body leading-relaxed max-w-lg">
                                    Connect your ATS or simply drop hundreds of raw PDF resumes into the secure workspace.
                                </p>
                            </div>

                            {/* Illustration */}
                            <div className="relative h-[300px] flex items-center justify-center">
                                <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute z-30 bg-raised border border-sub rounded-[8px] w-[180px] h-[240px] shadow-lg flex flex-col items-center justify-center" style={{ transform: 'rotate(4deg)' }}>
                                    <div className="w-12 h-12 rounded-full border border-sub bg-panel mb-4 flex items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <div className="w-24 h-1.5 bg-dim rounded-full mb-3" />
                                    <div className="w-16 h-1 bg-sub rounded-full mb-6" />
                                    <div className="w-28 h-1 bg-sub rounded-full mb-2 opacity-60" />
                                    <div className="w-20 h-1 bg-sub rounded-full opacity-60" />
                                </motion.div>
                                <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute z-20 bg-panel border border-sub rounded-[8px] w-[180px] h-[240px] shadow-sm" style={{ transform: 'translate(-20px, 10px) rotate(-6deg)' }} />
                                <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute z-10 bg-[#151714] border border-sub rounded-[8px] w-[180px] h-[240px]" style={{ transform: 'translate(20px, 15px) rotate(12deg)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Panel 2 */}
                    <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 relative overflow-hidden">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-[family-name:var(--font-display)] font-bold italic text-[240px] pointer-events-none select-none z-0 opacity-10"
                            style={{ color: 'var(--text-dim)' }}>
                            2
                        </div>

                        <div className="max-w-[800px] w-full grid grid-cols-2 gap-16 items-center z-10">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: activeStep === 1 ? 1 : 0, y: activeStep === 1 ? 0 : 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="font-[family-name:var(--font-mono)] text-[12px] text-sage uppercase tracking-[0.15em] mb-6 drop-shadow-sm"
                                >
                                    02 — Semantic Query
                                </motion.div>
                                <h3 className="font-[family-name:var(--font-display)] font-bold text-[64px] text-ink mb-6 leading-[1.05]">
                                    Ask anything.
                                </h3>
                                <p className="font-[family-name:var(--font-body)] font-normal text-[20px] text-body leading-relaxed max-w-lg">
                                    Ask completely unstructured questions about experience density, scope, and technical context.
                                </p>
                            </div>

                            {/* Illustration */}
                            <div className="relative h-[300px] flex items-center justify-center">
                                <div className="w-full max-w-[280px] bg-panel border-vis border rounded-[8px] p-4 shadow-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-sage" />
                                        <div className="text-dim font-[family-name:var(--font-mono)] text-[10px]">Active Query</div>
                                    </div>
                                    <div className="font-[family-name:var(--font-mono)] text-[12px] text-sage">
                                        React architect<br />led migration...
                                        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>|</motion.span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel 3 */}
                    <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 relative overflow-hidden">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-[family-name:var(--font-display)] font-bold italic text-[240px] pointer-events-none select-none z-0 opacity-10"
                            style={{ color: 'var(--text-dim)' }}>
                            3
                        </div>

                        <div className="max-w-[800px] w-full grid grid-cols-2 gap-16 items-center z-10">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: activeStep === 2 ? 1 : 0, y: activeStep === 2 ? 0 : 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="font-[family-name:var(--font-mono)] text-[12px] text-sage uppercase tracking-[0.15em] mb-6 drop-shadow-sm"
                                >
                                    03 — Contextual Ranking
                                </motion.div>
                                <h3 className="font-[family-name:var(--font-display)] font-bold text-[64px] text-ink mb-6 leading-[1.05]">
                                    Get instant results.
                                </h3>
                                <p className="font-[family-name:var(--font-body)] font-normal text-[20px] text-body leading-relaxed max-w-lg">
                                    Review top candidates instantly, complete with extracted highlights mapping to your exact query.
                                </p>
                            </div>

                            {/* Illustration */}
                            <div className="relative h-[300px] flex items-end justify-center gap-4 pb-8">
                                <motion.div initial={{ height: 20 }} whileInView={{ height: 120 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="w-12 bg-raised border border-sub rounded-t-[4px]" />
                                <motion.div initial={{ height: 20 }} whileInView={{ height: 200 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="w-12 bg-sage rounded-t-[4px] shadow-[0_0_15px_rgba(126,184,154,0.3)]" />
                                <motion.div initial={{ height: 20 }} whileInView={{ height: 160 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="w-12 bg-raised border border-sub rounded-t-[4px]" />
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* Mobile Fallback - 3-Card Vertical Layout */}
            <div className="md:hidden py-28 px-6">
                <div className="text-center mb-16">
                    <h2 className="font-[family-name:var(--font-display)] font-bold text-[40px] text-ink leading-[1.1]">
                        Three steps to find <br />
                        <span className="italic text-sage font-medium">your best hire.</span>
                    </h2>
                </div>
                <div className="flex flex-col gap-6">
                    {/* Card 1 */}
                    <div className="bg-raised border border-sub rounded-[10px] p-8 shadow-sm flex flex-col">
                        <div className="font-[family-name:var(--font-mono)] text-[12px] text-dim uppercase mb-6 tracking-wide">
                            STEP 01
                        </div>
                        <h3 className="font-[family-name:var(--font-ui)] font-semibold text-[18px] text-ink mb-3 tracking-wide">
                            Data Ingestion
                        </h3>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[15px] text-body leading-relaxed">
                            Connect your ATS or simply drop hundreds of raw PDF resumes into the secure workspace.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-raised border border-sub rounded-[10px] p-8 shadow-sm flex flex-col">
                        <div className="font-[family-name:var(--font-mono)] text-[12px] text-dim uppercase mb-6 tracking-wide">
                            STEP 02
                        </div>
                        <h3 className="font-[family-name:var(--font-ui)] font-semibold text-[18px] text-ink mb-3 tracking-wide">
                            Semantic Query
                        </h3>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[15px] text-body leading-relaxed">
                            Ask completely unstructured questions about experience density, scope, and technical context.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-raised border border-sub rounded-[10px] p-8 shadow-sm flex flex-col">
                        <div className="font-[family-name:var(--font-mono)] text-[12px] text-dim uppercase mb-6 tracking-wide">
                            STEP 03
                        </div>
                        <h3 className="font-[family-name:var(--font-ui)] font-semibold text-[18px] text-ink mb-3 tracking-wide">
                            Contextual Ranking
                        </h3>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[15px] text-body leading-relaxed">
                            Review top candidates instantly, complete with extracted highlights mapping to your exact query.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
