'use client';

import { motion } from 'framer-motion';

export default function Features() {
    return (
        <section id="features" className="bg-canvas py-28 relative z-10">
            <div className="max-w-6xl mx-auto px-6">

                {/* Feature 1 */}
                <div className="flex flex-col md:flex-row items-center min-h-[380px] gap-12 md:gap-20 mb-32">
                    {/* Visual Left */}
                    <div className="w-full md:w-1/2 overflow-hidden rounded-[12px]">
                        <motion.div
                            initial={{ clipPath: 'inset(0 100% 0 0)' }}
                            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                            className="flex items-center justify-center p-8 bg-panel border border-sub w-full shadow-[0_24px_50px_rgba(0,0,0,0.4)] relative"
                        >
                            <div className="w-full max-w-sm flex flex-col gap-6">
                                {/* Old Search */}
                                <div className="border border-sub rounded-[8px] px-4 py-3 opacity-30 bg-raised relative">
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-body transform -translate-y-1/2 rotate-1 scale-105" />
                                    <span className="font-[family-name:var(--font-mono)] text-[12px] text-body">
                                        &quot;Python&quot; AND &quot;Data Warehouse&quot; AND &quot;5+ years&quot;
                                    </span>
                                </div>
                                {/* New Search */}
                                <div className="border border-[rgba(126,184,154,0.4)] shadow-[0_0_24px_rgba(126,184,154,0.08)] bg-canvas rounded-[8px] px-4 py-3 relative">
                                    <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink">
                                        Who built <span className="text-sage text-shadow-sm shadow-[0_0_4px_var(--accent-sage)]">data pipelines</span> from scratch <span className="text-sage text-shadow-sm shadow-[0_0_4px_var(--accent-sage)]">at scale</span>?
                                    </span>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-sage rounded-full shadow-[0_0_8px_var(--accent-sage)]"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full md:w-1/2"
                    >
                        <div className="font-[family-name:var(--font-mono)] text-[11px] text-sage uppercase tracking-[0.1em] mb-4 bg-sage-dim inline-block px-3 py-1 rounded-[3px] border border-[rgba(126,184,154,0.2)]">
                            Semantic Search
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] font-bold text-[36px] text-ink mb-6 leading-[1.1]">
                            Conversational intelligence, applied to unstructured data.
                        </h3>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[17px] text-body leading-[1.8] max-w-md">
                            Keyword search misses nuance. CandidRank understands context, scope of work, and intent. Find the exact candidate profile you&apos;ve imagined, not just the one who stuffed the most jargon into their PDF.
                        </p>
                    </motion.div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col-reverse md:flex-row items-center min-h-[380px] gap-12 md:gap-20">
                    {/* Text Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full md:w-1/2"
                    >
                        <div className="font-[family-name:var(--font-mono)] text-[11px] text-sage uppercase tracking-[0.1em] mb-4 bg-sage-dim inline-block px-3 py-1 rounded-[3px] border border-[rgba(126,184,154,0.2)]">
                            Cited Evidence
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] font-bold text-[36px] text-ink mb-6 leading-[1.1]">
                            Verifiable proof. Zero hallucinations.
                        </h3>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[17px] text-body leading-[1.8] max-w-md">
                            Every candidate ranking is paired with verbatim quoted evidence precisely extracted from their document. We don&apos;t just give you a black-box score; we show you exactly why they match.
                        </p>
                    </motion.div>

                    {/* Visual Right */}
                    <div className="w-full md:w-1/2 overflow-hidden rounded-[12px]">
                        <motion.div
                            initial={{ clipPath: 'inset(0 100% 0 0)' }}
                            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                            className="flex items-center justify-center p-8 bg-panel border border-sub w-full shadow-[0_24px_50px_rgba(0,0,0,0.4)] relative"
                        >
                            <div className="w-full max-w-md bg-raised border border-sub rounded-[10px] shadow-sm p-6 py-5 font-[family-name:var(--font-ui)]">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-[36px] h-[36px] rounded-[6px] bg-canvas border border-sub shadow-inner flex items-center justify-center font-medium text-[12px] text-ink">
                                        AL
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-medium text-ink">Arthur Locke</div>
                                        <div className="text-[12px] text-dim mt-[1px]">Data Engineering Lead</div>
                                    </div>
                                </div>
                                <div className="font-[family-name:var(--font-body)] font-normal text-[14px] text-body leading-relaxed bg-canvas p-4 rounded-[6px] border border-sub border-dashed italic relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-sage opacity-50" />
                                    &quot;...Architected the core ingestion service processing 5B+ events daily, and <span className="bg-sage-dim text-sage font-normal px-1 border border-[rgba(126,184,154,0.3)] rounded-[2px]">built the Snowflake data warehouse from scratch</span> driving a 3x reduction in query latency.&quot;
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
