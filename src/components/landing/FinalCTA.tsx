'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&';

function useTextScramble(finalText: string, trigger: boolean) {
    const [display, setDisplay] = useState(finalText);

    useEffect(() => {
        if (!trigger) return;

        // Start showing scrambled random string
        let iteration = 0;
        const letters = finalText.split('');
        const maxIterations = letters.length * 3;

        const interval = setInterval(() => {
            setDisplay(
                letters.map((letter, i) => {
                    if (letter === ' ') return ' ';
                    if (i < Math.floor(iteration / 3)) return letter;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join('')
            );
            iteration++;

            if (iteration >= maxIterations) {
                setDisplay(finalText);
                clearInterval(interval);
            }
        }, 35);

        return () => clearInterval(interval);
    }, [trigger, finalText]);

    return display;
}

export default function FinalCTA() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    const scrambledHeadline = useTextScramble("Your next great hire", inView);

    return (
        <section ref={ref} className="bg-canvas border-t border-sub py-32 px-6 flex items-center justify-center text-center relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-[family-name:var(--font-display)] font-black text-[120px] md:text-[200px] text-[rgba(232,228,220,0.02)] whitespace-nowrap z-0 pointer-events-none tracking-tighter">
                CandidRank
            </div>

            <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 w-full">
                <h2 className="font-[family-name:var(--font-display)] font-bold italic text-[48px] md:text-[68px] leading-[1.05] tracking-[-0.02em] mb-12 max-w-2xl text-center flex flex-col items-center min-h-[142px]">
                    <span className="text-ink block">
                        {scrambledHeadline}
                    </span>
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-sage block"
                    >
                        is already in your inbox.
                    </motion.span>
                </h2>

                <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Work email address"
                        className="flex-1 bg-panel border border-vis text-ink font-[family-name:var(--font-ui)] text-[14px] px-5 py-4 rounded-[6px] outline-none focus:border-[rgba(126,184,154,0.6)] focus:shadow-[0_0_15px_rgba(126,184,154,0.1)] transition-all placeholder-dim"
                    />
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#8FCBAA' }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-sage text-canvas font-[family-name:var(--font-ui)] font-medium text-[14px] px-8 py-4 rounded-[6px] transition-colors whitespace-nowrap"
                    >
                        Get Started
                    </motion.button>
                </div>

                <p className="font-[family-name:var(--font-body)] font-normal text-[14px] text-body opacity-60 mt-6">
                    Free plan available · No credit card needed.
                </p>
            </div>
        </section>
    );
}
