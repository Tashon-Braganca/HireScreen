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
    // interval is the total time between start of flips
    // We want it to stay static for (interval - transitionTime)
    
    const timer = setInterval(() => {
      setIsFlipping(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsFlipping(false);
      }, 500); // Transition duration
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={cn("inline-grid grid-cols-1 relative overflow-visible h-[1.1em] align-top", className)}> 
      {/* Changed overflow-hidden to visible temporarily if needed, but 'h-[1.1em]' and 'align-top' help */}
      <span
        className={cn(
          "col-start-1 row-start-1 transition-all duration-500 ease-in-out block whitespace-nowrap gradient-text pb-1",
          isFlipping ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        {words[currentIndex]}
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 transition-all duration-500 ease-in-out block whitespace-nowrap gradient-text pb-1 absolute top-full left-0",
          isFlipping ? "-translate-y-full opacity-100" : "opacity-0"
        )}
      >
        {words[(currentIndex + 1) % words.length]}
      </span>
    </span>
  );
}
