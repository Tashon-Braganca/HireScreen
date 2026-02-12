import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "Consolas", "monospace"],
      },
      colors: {
        paper: "var(--bg)",
        panel: "var(--panel)",
        border: "var(--border)",
        ink: "var(--text)",
        muted: "var(--muted)",
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          bg: "var(--accent-light)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        // shadcn/ui compat tokens
        background: "var(--bg)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        secondary: {
          DEFAULT: "var(--panel)",
          foreground: "var(--text)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "#FFFFFF",
        },
        ring: "var(--accent)",
        input: "var(--border)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--text)",
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--text)",
        },
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.04)",
        DEFAULT:
          "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "stagger-in": "staggerIn 0.5s ease-out both",
        "progress-fill": "progressFill 0.8s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        staggerIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        progressFill: {
          "0%": { width: "0%" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
