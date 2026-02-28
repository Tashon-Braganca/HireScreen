'use client';

import { motion, useInView, animate, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function Counter({ from, to, duration, inView }: { from: number; to: number; duration: number, inView: boolean }) {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (v) => Math.round(v));
    const [display, setDisplay] = useState(from);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(count, to, {
            duration: duration,
            ease: [0.25, 1, 0.5, 1],
        });
        return controls.stop;
    }, [count, from, to, duration, inView]);

    useEffect(() => {
        const unsubscribe = rounded.onChange(v => setDisplay(v));
        return unsubscribe;
    }, [rounded]);

    return <motion.span>{display}+</motion.span>;
}

export default function Problem() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [floatActive, setFloatActive] = useState(false);

    const onEntranceComplete = () => {
        setFloatActive(true);
    };

    return (
        <section ref={ref} id="problem" className="bg-panel border-b border-sub py-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16">

                {/* Left block (col-span-4) */}
                <div className="md:col-span-4">
                    <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase text-sage tracking-[0.1em]">
                        THE PROBLEM
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] font-bold italic text-[52px] text-ink leading-[1.0] mt-4">
                        Hiring is broken.
                    </h2>
                    <p className="font-[family-name:var(--font-body)] font-normal text-[17px] text-body leading-[1.75] max-w-xs mt-4">
                        Manual screening wastes days. Keyword search misses nuance. Great candidates stay buried.
                    </p>
                </div>

                {/* Right stat cards (col-span-8) */}
                <div className="md:col-span-8 flex flex-col md:flex-row gap-6">
                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={floatActive ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.65, delay: 0 * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationComplete={onEntranceComplete}
                        animate={floatActive ? { y: [0, -8, 0] } : undefined}
                        whileHover={{
                            scale: 1.03,
                            borderColor: 'var(--border-vis)',
                            boxShadow: '0 20px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(126,184,154,0.12)'
                        }}
                        className="flex-1 bg-raised border border-sub rounded-[10px] p-7"
                    >
                        <div className="font-[family-name:var(--font-display)] font-bold italic text-[68px] text-sage leading-none mb-2">
                            <Counter from={0} to={8} duration={1.4} inView={inView} />
                        </div>
                        <div className="font-[family-name:var(--font-ui)] text-[12px] uppercase tracking-[0.1em] text-dim mb-2">
                            HOURS
                        </div>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[13px] text-body">
                            Wasted reading per role, every week.
                        </p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={floatActive ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 } : { duration: 0.65, delay: 1 * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        animate={floatActive ? { y: [0, -6, 0] } : undefined}
                        whileHover={{
                            scale: 1.03,
                            borderColor: 'var(--border-vis)',
                            boxShadow: '0 20px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(126,184,154,0.12)'
                        }}
                        className="flex-1 bg-raised border border-sub rounded-[10px] p-7"
                    >
                        <div className="font-[family-name:var(--font-display)] font-bold italic text-[68px] text-amber leading-none mb-2">
                            0%
                        </div>
                        <div className="font-[family-name:var(--font-ui)] text-[12px] uppercase tracking-[0.1em] text-dim mb-2">
                            CONTEXT
                        </div>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[13px] text-body">
                            Boolean search finds keywords — not experience or nuance.
                        </p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={floatActive ? { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } : { duration: 0.65, delay: 2 * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        animate={floatActive ? { y: [0, -9, 0] } : undefined}
                        whileHover={{
                            scale: 1.03,
                            borderColor: 'var(--border-vis)',
                            boxShadow: '0 20px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(126,184,154,0.12)'
                        }}
                        className="flex-1 bg-raised border border-sub rounded-[10px] p-7"
                    >
                        <div className="font-[family-name:var(--font-display)] font-bold italic text-[68px] text-dim leading-none mb-2">
                            ∞
                        </div>
                        <div className="font-[family-name:var(--font-ui)] text-[12px] uppercase tracking-[0.1em] text-dim mb-2">
                            MISSED
                        </div>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[13px] text-body">
                            Qualified candidates buried at the bottom. Never seen.
                        </p>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
