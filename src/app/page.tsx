"use client";

import React from "react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";
import { Search, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingShape } from "@/components/ui/FloatingShape";

const outfit = Outfit({ subsets: ["latin"] });

const Typewriter = ({ phrases }: { phrases: string[] }) => {
    const [index, setIndex] = React.useState(0);
    const [subIndex, setSubIndex] = React.useState(0);
    const [reverse, setReverse] = React.useState(false);
    const [blink, setBlink] = React.useState(true);

    React.useEffect(() => {
        const timeout2 = setTimeout(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    React.useEffect(() => {
        if (subIndex === phrases[index].length + 1 && !reverse) {
            const timeout = setTimeout(() => setReverse(true), 2000); // Wait before deleting
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % phrases.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 100); // Deleting speed vs typing speed

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, phrases]);

    return (
        <span className="font-mono text-slate-600">
            &quot;{phrases[index].substring(0, subIndex)}{blink ? "|" : "\u00A0"}&quot;
        </span>
    );
};

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("backdrop-blur-xl bg-white/40 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl", className)}>
        {children}
    </div>
);

const Navbar = () => (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center">
        <GlassCard className="px-8 py-4 flex items-center gap-12 rounded-full">
            <div className="font-bold text-2xl text-slate-800 tracking-normal px-2 py-1">HireScreen</div>
            <div className="flex gap-6 text-sm font-medium text-slate-600">
                <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            </div>
            <a href="/login" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform">
                Get Started
            </a>
        </GlassCard>
    </nav>
);

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Blobs */}
            <FloatingShape className="w-[500px] h-[500px] bg-purple-300 top-[-10%] left-[-10%]" delay={0} />
            <FloatingShape className="w-[400px] h-[400px] bg-blue-300 bottom-[-10%] right-[-5%]" delay={2} />
            <FloatingShape className="w-[300px] h-[300px] bg-pink-300 top-[40%] left-[20%]" delay={1} />

            <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
                <div className="space-y-8">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl lg:text-7xl font-bold text-slate-800 leading-tight tracking-tight pb-4"
                    >
                        Screening, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 pb-2">Clarified.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 max-w-md leading-relaxed"
                    >
                        Experience the fluid way to process talent. Drop your PDFs into a smart workspace that thinks like a recruiter.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4"
                    >
                        <a href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
                            Start Free Trial
                        </a>
                        <a href="#mockup" className="px-8 py-4 rounded-xl font-semibold text-slate-600 hover:bg-white/50 transition-colors flex items-center justify-center">
                            Watch Demo
                        </a>
                    </motion.div>
                </div>

                {/* Glass UI Mockup */}
                <motion.div
                    id="mockup"
                    initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="perspective-1000"
                >
                    <GlassCard className="p-6 w-full max-w-md mx-auto transform rotate-y-[-5deg] rotate-x-[5deg]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">Senior React Developer</div>
                                <div className="text-xs text-slate-500">24 Candidates • 8 Matches</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Top Match Criteria</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-medium border border-blue-100">React.js</span>
                                <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-md font-medium border border-purple-100">TypeScript</span>
                                <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md font-medium border border-emerald-100">5+ Years</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm cursor-pointer group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-700">John Doe</div>
                                    <div className="flex gap-1 text-[10px] text-slate-500">
                                        <span>Ex-Google</span>
                                        <span>•</span>
                                        <span>Senior Dev</span>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">95%</div>
                            </div>

                             <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors cursor-pointer group opacity-60">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold">AS</div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-700">Alice Smith</div>
                                    <div className="text-[10px] text-slate-500">Full Stack Eng</div>
                                </div>
                                <div className="text-sm font-bold text-green-600/80">91%</div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors cursor-pointer group opacity-40">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">MK</div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-700">Mike K.</div>
                                    <div className="text-[10px] text-slate-500">Frontend Dev</div>
                                </div>
                                <div className="text-sm font-bold text-green-600/60">87%</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-500 h-6">
                                <Search size={14} />
                                <Typewriter phrases={[
                                    "Find candidates with 3+ yrs Next.js...",
                                    "Show Senior Product Designers in SF...",
                                    "Filter by remote availability...",
                                    "Sort by years of experience..."
                                ]} />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Floating Badge */}
                    <GlassCard className="absolute -right-8 top-20 p-4 shadow-xl animate-bounce-slow">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                                <Zap size={16} fill="currentColor" />
                            </div>
                            <div className="text-xs font-bold text-slate-700">
                                AI Analysis <br />Complete
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    );
};

export default function Home() {
    return (
        <main className={cn(outfit.className, "min-h-screen bg-[#f0f4f8] selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden")}>
            <Navbar />
            <Hero />
        </main>
    );
}
