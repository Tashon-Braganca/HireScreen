'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSubscription, openCheckout } from '@/hooks/useSubscription';

export default function Pricing({ user }: { user: { id: string } | null }) {
    const { isPro, isLoading } = useSubscription();

    const handleUpgrade = async () => {
        try {
            await openCheckout();
        } catch (error) {
            console.error('Failed to open checkout:', error);
        }
    };
    return (
        <section id="pricing" className="bg-panel border-y border-sub py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-20">
                    <div className="font-[family-name:var(--font-mono)] text-[11px] text-sage uppercase tracking-[0.1em] mb-4 drop-shadow-sm">
                        PRICING
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] font-bold italic text-[48px] md:text-[56px] text-ink leading-[1.05]">
                        Simple, transparent pricing.
                    </h2>
                    <p className="font-[family-name:var(--font-body)] font-normal text-[17px] text-body mt-4 max-w-lg mx-auto">
                        Start for free. Upgrade when your volume requires it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-canvas border border-sub rounded-[12px] p-10 flex flex-col"
                    >
                        <h3 className="font-[family-name:var(--font-display)] font-semibold text-[24px] text-ink mb-2">Starter</h3>
                        <div className="font-[family-name:var(--font-ui)] flex items-baseline gap-1 mb-6">
                            <span className="text-[40px] font-bold text-ink">$0</span>
                            <span className="text-[14px] text-dim">/mo</span>
                        </div>
                        <p className="font-[family-name:var(--font-body)] font-normal text-[14px] text-body mb-8 min-h-[40px]">
                            Perfect for small teams hiring occasionally.
                        </p>

                        <div className="flex-1 font-[family-name:var(--font-ui)] text-[14px] text-body space-y-4 mb-10">
                            <div className="flex items-start gap-3">
                                <span className="text-sage mt-[2px]">&#10003;</span>
                                <span>Up to 50 resumes per month</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-sage mt-[2px]">&#10003;</span>
                                <span>Top 5 candidates ranked</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-sage mt-[2px]">&#10003;</span>
                                <span>Basic semantic search</span>
                            </div>
                        </div>

                        <Link href={user ? "/dashboard" : "/login"} passHref legacyBehavior>
                            <a className="w-full text-center py-3.5 bg-raised border border-sub text-ink font-[family-name:var(--font-ui)] font-semibold text-[14px] rounded-[6px] hover:bg-sub transition-colors shadow-sm">
                                {user ? "Go to Dashboard" : "Start Free"}
                            </a>
                        </Link>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        whileHover="hover"
                        className="bg-raised border border-[rgba(126,184,154,0.3)] shadow-[0_24px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(126,184,154,0.12)] rounded-[12px] p-10 flex flex-col relative overflow-hidden group"
                    >
                        {/* Shimmer Sweep Effect via framer motion */}
                        <motion.div
                            className="absolute top-0 left-0 w-[200%] h-full z-0 pointer-events-none opacity-0 group-hover:opacity-100"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(126,184,154,0.05) 50%, transparent 100%)',
                            }}
                            variants={{
                                hover: { x: ['-100%', '100%'], transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } }
                            }}
                        />

                        <div className="absolute top-0 left-0 w-full h-1 bg-sage" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-[family-name:var(--font-display)] font-semibold text-[24px] text-sage">Pro</h3>
                                <div className="bg-sage text-canvas font-[family-name:var(--font-mono)] font-bold text-[10px] uppercase tracking-wide px-2 py-1 rounded-[3px]">
                                    Most Popular
                                </div>
                            </div>
                            <div className="font-[family-name:var(--font-ui)] flex items-baseline gap-1 mb-6">
                                <span className="text-[40px] font-bold text-ink">$49</span>
                                <span className="text-[14px] text-dim">/mo</span>
                            </div>
                            <p className="font-[family-name:var(--font-body)] font-normal text-[14px] text-ink mb-8 min-h-[40px]">
                                For high-volume recruitment teams.
                            </p>

                            <div className="flex-1 font-[family-name:var(--font-ui)] text-[14px] text-ink space-y-4 mb-10">
                                <div className="flex items-start gap-3">
                                    <span className="text-sage mt-[2px]">&#10003;</span>
                                    <span>Unlimited resumes</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-sage mt-[2px]">&#10003;</span>
                                    <span>Deep context matching</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-sage mt-[2px]">&#10003;</span>
                                    <span>ATS integrations</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-sage mt-[2px]">&#10003;</span>
                                    <span>Priority support</span>
                                </div>
                            </div>

                            <button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full text-center py-3.5 bg-sage text-canvas font-[family-name:var(--font-ui)] font-semibold text-[14px] rounded-[6px] shadow-[0_0_24px_rgba(126,184,154,0.2)] transition-shadow duration-300 disabled:opacity-50"
                            >
                                {isLoading ? "Loading..." : user ? (isPro ? "Go to Dashboard" : "Upgrade to Pro") : "Start Free Trial"}
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
