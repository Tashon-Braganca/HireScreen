"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export function NewJobButton() {
    return (
        <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(140,196,166,0.25)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "13px" }}
            className="flex items-center justify-center gap-2 rounded-[8px] px-[18px] py-[10px] bg-[var(--accent-sage)] text-[var(--bg-canvas)] hover:bg-[#8FCBAA] shadow-[0_0_12px_rgba(140,196,166,0.15)] animate-glow-pulse"
        >
            <motion.span
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
                <Plus size={15} />
            </motion.span>
            New Job
        </motion.button>
    );
}
