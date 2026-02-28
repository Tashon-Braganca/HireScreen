'use client';

import { motion, useScroll } from 'framer-motion';
import Nav from './Nav';
import Hero from './Hero';
import ProofBar from './ProofBar';
import Problem from './Problem';
import HowItWorks from './HowItWorks';
import Features from './Features';
import Pricing from './Pricing';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

export default function DesignBPage({ user }: { user: { id: string } | null }) {
    const { scrollYProgress } = useScroll();

    return (
        <div className="design-b-root antialiased font-[family-name:var(--font-body)] bg-canvas text-body selection:bg-sage selection:text-canvas">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-sage origin-left z-[100]"
                style={{ scaleX: scrollYProgress, opacity: 0.8 }}
            />

            <Nav user={user} />
            <main>
                <Hero user={user} />
                <ProofBar />
                <Problem />
                <HowItWorks />
                <Features />
                <Pricing user={user} />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    );
}
