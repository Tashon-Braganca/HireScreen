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
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsFlipping(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={cn("inline-block relative overflow-hidden", className)}>
      <span
        className={cn(
          "inline-block transition-all duration-300 ease-in-out",
          isFlipping && "transform -translate-y-full opacity-0"
        )}
      >
        {words[currentIndex]}
      </span>
      <span
        className={cn(
          "absolute left-0 top-full inline-block transition-all duration-300 ease-in-out",
          isFlipping && "transform -translate-y-full opacity-100",
          !isFlipping && "opacity-0"
        )}
      >
        {words[(currentIndex + 1) % words.length]}
      </span>
    </span>
  );
}
