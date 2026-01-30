"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RolodexTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function RolodexText({ words, interval = 3000, className }: RolodexTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      
      // Change word at the midpoint of the animation
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 300);
      
      // Animation complete
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span 
      className={cn(
        "inline-block overflow-hidden h-[1.15em] align-bottom",
        className
      )}
    >
      <span
        className={cn(
          "inline-block transition-all duration-300 ease-in-out gradient-text",
          isAnimating 
            ? "opacity-0 translate-y-[-20%] blur-[2px]" 
            : "opacity-100 translate-y-0 blur-0"
        )}
      >
        {words[currentIndex]}
      </span>
    </span>
  );
}
