"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  suffix?: string;
  prefix?: string;
}

/**
 * Animated counter that counts from 0 to `value` when entering viewport.
 * Gives a satisfying "numbers revealing" dopamine hit.
 */
export function AnimatedCounter({
  value,
  duration = 1.2,
  className,
  style,
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 4 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
}

/**
 * Animated score badge that pops in with a satisfying scale + rotate.
 * Used for candidate ranking scores.
 */
interface AnimatedScoreProps {
  score: number;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export function AnimatedScore({ score, className, style, delay = 0 }: AnimatedScoreProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, score, {
      duration: 0.8,
      delay: delay,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => {
        setDisplayScore(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, score, delay]);

  return (
    <motion.span
      ref={ref}
      className={className}
      style={style}
      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
      animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275], // spring-like
      }}
    >
      {displayScore}%
    </motion.span>
  );
}
