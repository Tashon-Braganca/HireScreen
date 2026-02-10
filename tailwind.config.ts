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
        display: ['"Ibarra Real Nova"', "Georgia", "serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "Consolas", "monospace"],
      },
      colors: {
        paper: "#F6F3EC",
        panel: "#FBFAF7",
        border: "#E7E1D7",
        ink: "#131313",
        muted: "#5D5A55",
        accent: {
          DEFAULT: "#0F766E",
          light: "#14B8A6",
          bg: "#F0FDFA",
        },
        // shadcn/ui compat tokens
        background: "#F6F3EC",
        foreground: "#131313",
        primary: {
          DEFAULT: "#0F766E",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FBFAF7",
          foreground: "#131313",
        },
        destructive: {
          DEFAULT: "#B91C1C",
          foreground: "#FFFFFF",
        },
        ring: "#0F766E",
        input: "#E7E1D7",
        card: {
          DEFAULT: "#FBFAF7",
          foreground: "#131313",
        },
        popover: {
          DEFAULT: "#FBFAF7",
          foreground: "#131313",
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
        DEFAULT: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
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
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
