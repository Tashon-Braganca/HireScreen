"use client";

import { useState, useEffect } from "react";

const queries = [
  '"Who has 5+ years React experience?"',
  '"Find AWS certified candidates"',
  '"Who led a team before?"',
  '"Show me Stanford grads"',
  '"Who worked at a startup?"',
];

export function TypewriterQuery() {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "paused" | "deleting">("typing");

  useEffect(() => {
    const currentQuery = queries[currentIndex];
    let timeout: NodeJS.Timeout;

    if (phase === "typing") {
      if (displayedText.length < currentQuery.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentQuery.slice(0, displayedText.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => {
          setPhase("deleting");
        }, 2500);
      }
    } else if (phase === "deleting") {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
      } else {
        setCurrentIndex((prev) => (prev + 1) % queries.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, phase, currentIndex]);

  return (
    <span className="text-amber-500">
      {displayedText}
      <span className="inline-block w-[3px] h-[0.9em] bg-amber-500 ml-1 animate-pulse align-middle" />
    </span>
  );
}
