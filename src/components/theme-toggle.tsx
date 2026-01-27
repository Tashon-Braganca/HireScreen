"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full",
          "bg-secondary/50 border border-border/50",
          "transition-all duration-300",
          className
        )}
        aria-label="Toggle theme"
      >
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-full",
        "bg-secondary/80 hover:bg-secondary border border-border/50 hover:border-border",
        "transition-all duration-500 ease-out",
        "hover:shadow-lg hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun icon */}
      <svg
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="4" className="fill-current opacity-90" />
        <path
          strokeLinecap="round"
          d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          className="origin-center transition-transform duration-500 group-hover:rotate-45"
        />
      </svg>

      {/* Moon icon */}
      <svg
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500",
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          className="fill-current opacity-20"
        />
      </svg>

      {/* Ambient glow effect on hover */}
      <span
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100",
          isDark
            ? "bg-gradient-to-br from-amber-400/10 via-transparent to-orange-500/10"
            : "bg-gradient-to-br from-blue-400/10 via-transparent to-indigo-500/10"
        )}
      />
    </button>
  );
}

// Larger toggle variant for settings pages
export function ThemeToggleLarge({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative flex h-10 w-20 items-center rounded-full p-1",
          "bg-secondary border border-border",
          className
        )}
      >
        <span className="h-8 w-8 rounded-full bg-muted" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative flex h-10 w-20 items-center rounded-full p-1",
        "bg-secondary border border-border",
        "transition-all duration-300",
        "hover:border-primary/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sliding pill */}
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "bg-background shadow-md",
          "transition-all duration-300 ease-out",
          isDark ? "translate-x-0" : "translate-x-10"
        )}
      >
        {/* Sun */}
        <svg
          className={cn(
            "absolute h-4 w-4 text-amber-500 transition-all duration-300",
            isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
          )}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon */}
        <svg
          className={cn(
            "absolute h-4 w-4 text-indigo-400 transition-all duration-300",
            isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* Background icons */}
      <span className="absolute left-2.5 flex items-center justify-center">
        <svg
          className={cn(
            "h-4 w-4 transition-all duration-300",
            isDark ? "text-muted-foreground/30" : "text-amber-500"
          )}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
        </svg>
      </span>
      <span className="absolute right-2.5 flex items-center justify-center">
        <svg
          className={cn(
            "h-4 w-4 transition-all duration-300",
            isDark ? "text-indigo-400" : "text-muted-foreground/30"
          )}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
