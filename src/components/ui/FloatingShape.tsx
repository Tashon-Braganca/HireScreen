"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingShape = ({ className, delay }: { className?: string, delay?: number }) => (
    <motion.div
        animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
        }}
        transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
        className={cn("absolute rounded-full mix-blend-multiply filter blur-3xl opacity-70", className)}
    />
);
