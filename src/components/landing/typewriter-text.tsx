"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
}

export function TypewriterText({ 
  texts, 
  speed = 80,
  deleteSpeed = 40,
  pause = 3000,
  className,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "paused" | "deleting">("typing");

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    let timeout: NodeJS.Timeout;

    if (phase === "typing") {
      if (displayedText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, speed);
      } else {
        // Finished typing, pause before deleting
        timeout = setTimeout(() => {
          setPhase("deleting");
        }, pause);
      }
    } else if (phase === "deleting") {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Finished deleting, move to next text
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, phase, currentTextIndex, texts, speed, deleteSpeed, pause]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 animate-pulse align-middle" />
    </span>
  );
}
