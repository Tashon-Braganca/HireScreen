"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: EASE,
    },
  },
};

/**
 * Wraps dashboard content with staggered entrance animations.
 * Each direct child will fade-in + slide-up in sequence.
 */
export function DashboardStagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item within a DashboardStagger container.
 * Auto-animates with the stagger sequence.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Animated stat number that counts from 0 to value when mounted.
 */
export function AnimatedStat({
  value,
  suffix = "",
  className,
  style,
}: {
  value: number | string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const numericValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numericValue)) {
    return (
      <span className={className} style={style}>
        {value}{suffix}
      </span>
    );
  }

  return (
    <Counter value={numericValue} suffix={suffix} className={className} style={style} />
  );
}

function Counter({
  value,
  suffix,
  className,
  style,
}: {
  value: number;
  suffix: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (value === 0) return;

    let start: number | null = null;
    const duration = 800;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out-cubic

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(ease(progress) * value));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [value]);

  return (
    <motion.span
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {display}{suffix}
    </motion.span>
  );
}
