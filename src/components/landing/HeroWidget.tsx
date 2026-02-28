'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const QUERIES = [
    "Who has 5+ years React + startup experience?",
    "Who led a team of 10+ engineers and shipped?",
    "Who worked at a funded startup or public company?"
];

const RESULTS_DATA = [
    [
        { rank: '#1', init: 'AK', name: 'A. Kumar', summary: 'Ex-Series B · 6yr React', score: 94, citation: '...led React migration at Series B startup, managing 6 engineers across 3 products...', highlights: ['React migration', 'Series B startup', '6 engineers'] },
        { rank: '#2', init: 'JD', name: 'J. Davis', summary: 'TypeScript lead · startup founder', score: 87, citation: '', highlights: [] },
        { rank: '#3', init: 'MR', name: 'M. Russo', summary: 'Frontend architect · OSS contrib', score: 79, citation: '', highlights: [] }
    ],
    [
        { rank: '#1', init: 'SC', name: 'S. Chen', summary: 'Eng manager · 14-person team', score: 96, citation: '...managed cross-functional team of 14, shipped 2 major product lines in 18 months...', highlights: ['team of 14', 'shipped 2 major product lines'] },
        { rank: '#2', init: 'OP', name: 'O. Patel', summary: 'Director of Eng · scaled 3 products', score: 89, citation: '', highlights: [] },
        { rank: '#3', init: 'LW', name: 'L. Walsh', summary: 'Led migration · 8 direct reports', score: 81, citation: '', highlights: [] }
    ],
    [
        { rank: '#1', init: 'BT', name: 'B. Torres', summary: 'Ex-Google · Series C startup', score: 92, citation: '...joined as engineer #4 at YC W21 company, grew to $12M ARR before Series A...', highlights: ['YC W21', '$12M ARR', 'Series A'] },
        { rank: '#2', init: 'NA', name: 'N. Ahmed', summary: 'Staff eng at public fintech co', score: 85, citation: '', highlights: [] },
        { rank: '#3', init: 'CL', name: 'C. Li', summary: 'Ex-Stripe · YC company alum', score: 78, citation: '', highlights: [] }
    ]
];

export default function HeroWidget() {
    const [phase, setPhase] = useState<'typing' | 'revealing' | 'holding' | 'deleting' | 'pausing'>('typing');
    const [displayText, setDisplayText] = useState('');
    const [queryIndex, setQueryIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let intervalId: NodeJS.Timeout;

        if (phase === 'typing') {
            setShowResults(false);
            const fullText = QUERIES[queryIndex];
            let i = 0;
            intervalId = setInterval(() => {
                i++;
                setDisplayText(fullText.slice(0, i));
                if (i === fullText.length) {
                    clearInterval(intervalId);
                    timeoutId = setTimeout(() => {
                        setPhase('revealing');
                    }, 180);
                }
            }, 48);
        } else if (phase === 'revealing') {
            setShowResults(true);
            timeoutId = setTimeout(() => {
                setPhase('holding');
            }, 500);
        } else if (phase === 'holding') {
            timeoutId = setTimeout(() => {
                setPhase('deleting');
            }, 2800);
        } else if (phase === 'deleting') {
            const currentText = QUERIES[queryIndex];
            let i = currentText.length;
            intervalId = setInterval(() => {
                i--;
                setDisplayText(currentText.slice(0, i));
                if (i === 0) {
                    clearInterval(intervalId);
                    setPhase('pausing');
                }
            }, 24);
        } else if (phase === 'pausing') {
            setShowResults(false);
            timeoutId = setTimeout(() => {
                setQueryIndex((prev) => (prev + 1) % 3);
                setPhase('typing');
            }, 400);
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [phase, queryIndex]);

    const highlightKeywords = (text: string, keywords: string[]) => {
        let highlightedText = text;
        keywords.forEach(keyword => {
            if (highlightedText.includes(keyword)) {
                highlightedText = highlightedText.replace(
                    new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    `<mark style="background:rgba(126,184,154,0.22); color:var(--accent-sage); border-radius:3px; padding:1px 4px; font-style:normal">${keyword}</mark>`
                );
            }
        });
        return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
    };

    const currentResults = RESULTS_DATA[queryIndex];
    const topScore = currentResults[0].score;

    return (
        <motion.div
            initial={{ x: 60, opacity: 0, filter: 'blur(12px)', rotateY: -5 }}
            animate={{ x: 0, opacity: 1, filter: 'blur(0px)', rotateY: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[600px] relative"
        >
            {/* Ambient glow behind card */}
            <div className="absolute -inset-8 rounded-[32px] pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 40%, rgba(126,203,158,0.07) 0%, transparent 70%)',
                }}
            />

            {/* Badge: Top match score */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{
                    opacity: { delay: 0.9, duration: 0.4 },
                    scale: { delay: 0.9, duration: 0.4 },
                    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="absolute -top-[16px] right-[28px] z-20"
            >
                <div className="bg-[var(--bg-raised)] border border-[var(--border-vis)] rounded-[10px] px-[14px] py-[7px] font-[family-name:var(--font-mono)] text-[11px] text-[var(--accent-sage)] shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_12px_rgba(126,203,158,0.1)]">
                    ✦ {topScore}% match
                </div>
            </motion.div>

            {/* Badge: Resume count */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, x: [0, 5, 0] }}
                transition={{
                    opacity: { delay: 1.0, duration: 0.4 },
                    scale: { delay: 1.0, duration: 0.4 },
                    x: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }
                }}
                className="absolute -right-[16px] top-[42%] z-20"
            >
                <div className="bg-[var(--accent-sage)] text-[var(--bg-canvas)] font-[family-name:var(--font-mono)] text-[11px] font-semibold px-[10px] py-[5px] rounded-[6px] shadow-[0_4px_16px_rgba(126,203,158,0.3)]">
                    12 resumes
                </div>
            </motion.div>

            {/* Badge: Processing */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, 6, 0] }}
                transition={{
                    opacity: { delay: 1.1, duration: 0.4 },
                    scale: { delay: 1.1, duration: 0.4 },
                    y: { duration: 3.0, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                }}
                className="absolute -bottom-[14px] left-[32px] z-20"
            >
                <div className="bg-[var(--bg-raised)] border border-[var(--border-vis)] rounded-[20px] px-[12px] py-[6px] flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[var(--accent-sage)] animate-[pulse-dot_2s_ease-in-out_infinite]" />
                    <span className="font-[family-name:var(--font-ui)] text-[11px] text-[var(--text-body)]">Processing</span>
                </div>
            </motion.div>

            {/* Main Card */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-vis)] rounded-[18px] overflow-visible flex flex-col relative z-10"
                style={{ boxShadow: '0 0 0 1px rgba(232,228,220,0.04), 0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(126,184,154,0.04)' }}>

                {/* Window chrome */}
                <div className="h-[50px] bg-[var(--bg-raised)] border-b border-[var(--border-sub)] rounded-t-[18px] px-5 flex items-center justify-between">
                    <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.3 }} className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] cursor-pointer" />
                        <motion.div whileHover={{ scale: 1.3 }} className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E] cursor-pointer" />
                        <motion.div whileHover={{ scale: 1.3 }} className="w-[10px] h-[10px] rounded-full bg-[#28C840] cursor-pointer" />
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)]">
                        candidrank · job-workspace
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-[8px] h-[8px] rounded-full bg-[var(--accent-sage)] animate-[pulse-dot_2s_ease-in-out_infinite]" />
                        <span className="font-[family-name:var(--font-ui)] text-[12px] text-[var(--accent-sage)]">Active</span>
                    </div>
                </div>

                {/* Query bar */}
                <div
                    className="py-[14px] px-5 border-b border-[var(--border-sub)] flex items-center gap-3"
                    style={{
                        background: (phase === 'typing' || phase === 'deleting') ? 'rgba(126,184,154,0.06)' : 'rgba(126,184,154,0.03)',
                        borderLeft: (phase === 'typing' || phase === 'deleting') ? '3px solid var(--accent-sage)' : '3px solid transparent',
                        transition: '200ms ease'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-dim)] flex-shrink-0">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <div className="font-[family-name:var(--font-mono)] text-[15px] text-[var(--accent-sage)] flex-1 flex items-center leading-snug">
                        {displayText}
                        <span className={`text-[var(--accent-sage)] ml-[1px] ${(phase === 'typing' || phase === 'deleting') ? 'animate-[cursor-blink_0.6s_step-end_infinite]' : 'opacity-0'}`}>
                            |
                        </span>
                    </div>
                </div>

                {/* Results area */}
                <div className="p-4 px-5 min-h-[210px] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!showResults ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-3 pt-1"
                            >
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="h-[56px] bg-[var(--bg-raised)] rounded-[8px] relative overflow-hidden">
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(90deg, var(--bg-raised) 25%, rgba(232,228,220,0.05) 50%, var(--bg-raised) 75%)',
                                                backgroundSize: '200% 100%',
                                                animation: 'shimmer-skeleton 1.8s ease-in-out infinite'
                                            }}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="results" className="flex flex-col">
                                {currentResults.map((candidate, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -14, filter: 'blur(5px)' }}
                                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, x: 8 }}
                                        transition={{ duration: 0.45, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                                        className={`min-h-[60px] flex items-center gap-3 border-b border-[var(--border-sub)] last:border-0 py-3 ${i === 0 ? 'bg-[rgba(126,203,158,0.04)] -mx-5 px-5 rounded-lg' : ''}`}
                                    >
                                        <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] w-6">{candidate.rank}</span>
                                        <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center font-[family-name:var(--font-mono)] font-semibold text-[11px] shrink-0 ${i === 0 ? 'bg-[var(--accent-sage)] text-[var(--bg-canvas)]' : 'bg-[var(--bg-raised)] text-[var(--text-body)] border border-[var(--border-sub)]'}`}>
                                            {candidate.init}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="font-[family-name:var(--font-body)] font-semibold text-[14px] text-[var(--text-ink)] leading-tight">{candidate.name}</span>
                                            <span className="font-[family-name:var(--font-ui)] font-normal text-[11px] text-[var(--text-dim)] truncate mt-0.5">{candidate.summary}</span>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0 gap-1">
                                            <span className={`font-[family-name:var(--font-mono)] font-bold text-[18px] ${i === 0 ? 'text-[var(--accent-sage)]' : 'text-[var(--accent-amber)]'}`}>{candidate.score}%</span>
                                            <div className="w-[60px] h-[3px] bg-[var(--bg-raised)] rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full bg-[var(--accent-sage)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${candidate.score}%` }}
                                                    transition={{ duration: 0.8, delay: 0.3 + (i * 0.12), ease: [0.25, 1, 0.5, 1] }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Citation strip */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="px-5 py-[12px] bg-[var(--bg-canvas)] border-t border-[var(--border-sub)] rounded-b-[18px]"
                        >
                            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)] mb-1.5">
                                ✦ CITED FROM RESUME
                            </div>
                            <div className="font-[family-name:var(--font-body)] font-normal italic text-[13px] text-[var(--text-body)] leading-relaxed">
                                {highlightKeywords(currentResults[0].citation, currentResults[0].highlights)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.6); }
                }
                @keyframes cursor-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                @keyframes shimmer-skeleton {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}} />
        </motion.div>
    );
}
