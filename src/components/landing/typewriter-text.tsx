"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  pause?: number;
  className?: string;
}

export function TypewriterText({ 
  texts, 
  speed = 50, 
  pause = 2000,
  className,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentFullText.length) {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        } else {
          // Finished typing, wait before deleting
          setIsDeleting(true);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? (displayedText.length === currentFullText.length ? pause : speed / 2) : speed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTextIndex, texts, speed, pause]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 animate-pulse align-middle" />
    </span>
  );
}
