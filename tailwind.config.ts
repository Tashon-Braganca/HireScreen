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
				display: [
					'Outfit',
					'system-ui',
					'sans-serif'
				],
				sans: [
					'Outfit',
					'system-ui',
					'sans-serif'
				],
				mono: [
					'Outfit',
					'system-ui',
					'sans-serif'
				]
			},
			colors: {
				paper: 'var(--bg)',
				panel: 'var(--panel)',
				border: 'hsl(var(--border))',
				ink: 'var(--text)',
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				canvas: 'var(--bg-canvas)',
				raised: 'var(--bg-raised)',
				body: 'var(--text-body)',
				dim: 'var(--text-dim)',
				sage: 'var(--accent-sage)',
				amber: 'var(--accent-amber)',
				'sage-dim': 'var(--accent-dim)',
				sub: 'var(--border-sub)',
				vis: 'var(--border-vis)',
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					light: 'var(--accent-light)',
					bg: 'var(--accent-light)',
					hover: 'var(--accent-hover)',
					foreground: 'hsl(var(--accent-foreground))'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				ring: 'hsl(var(--ring))',
				input: 'hsl(var(--input))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				sm: 'calc(var(--radius) - 4px)',
				DEFAULT: '6px',
				md: 'calc(var(--radius) - 2px)',
				lg: 'var(--radius)'
			},
			boxShadow: {
				sm: '0 1px 2px rgba(0,0,0,0.04)',
				DEFAULT: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
				md: '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)'
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				shimmer: 'shimmer 2s linear infinite',
				'stagger-in': 'staggerIn 0.5s ease-out both',
				'progress-fill': 'progressFill 0.8s ease-out both'
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				slideUp: {
					'0%': {
						transform: 'translateY(8px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				shimmer: {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				staggerIn: {
					'0%': {
						opacity: '0',
						transform: 'translateY(12px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				progressFill: {
					'0%': {
						width: '0%'
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
