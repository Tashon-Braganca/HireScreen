'use client';

import { useScroll, useVelocity, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export default function ProofBar() {
    const companies = ["Vercel", "Linear", "Loom", "Retool", "Postman", "Notion", "Deel", "Figma"];
    const duplicatedCompanies = [...companies, ...companies];

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [1.6, 1, 1.6]);

    const [duration, setDuration] = useState(45); // default slowest when idle

    useMotionValueEvent(velocityFactor, "change", (latest) => {
        // Map [0.4, 1.6] roughly to ['18s', '45s']
        // Actually the prompt says: Map velocityFactor [0.4, 1.6] -> animationDuration ['18s', '45s']
        // Wait, velocity is higher -> factor higher -> duration lower
        // If 1 is idle, duration is 45s.
        // Let's just create a smooth mapping:
        const mapped = Math.max(18, 45 - ((latest - 1) * (45 - 18) / 0.6));
        setDuration(mapped <= 45 ? mapped : 45);
    });

    return (
        <section className="bg-canvas border-b border-sub py-5 overflow-hidden flex items-center">
            <div className="w-full flex flex-col md:flex-row md:items-center">
                {/* Label */}
                <div className="px-6 md:pr-4 md:border-r border-sub md:shrink-0 mb-3 md:mb-0 z-10 bg-canvas">
                    <span className="font-[family-name:var(--font-ui)] text-[12px] text-dim uppercase tracking-[0.1em] whitespace-nowrap">
                        Trusted by hiring teams at
                    </span>
                </div>

                {/* Marquee Wrapper */}
                <div className="flex-1 overflow-hidden relative w-full mask-marquee">
                    <style dangerouslySetInnerHTML={{
                        __html: `
            @keyframes proof-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}} />
                    <div
                        className="flex w-max items-center pl-6 md:pl-8"
                        style={{
                            animationName: 'proof-marquee',
                            animationTimingFunction: 'linear',
                            animationIterationCount: 'infinite',
                            animationDuration: `${duration}s`
                        }}
                    >
                        {duplicatedCompanies.map((company, index) => (
                            <div key={index} className="flex items-center gap-10 group">
                                <span className="font-[family-name:var(--font-ui)] font-normal text-[14px] text-dim transition-colors duration-200 group-hover:text-body whitespace-nowrap cursor-default">
                                    {company}
                                </span>
                                <span className="text-dim opacity-30 cursor-default">·</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
