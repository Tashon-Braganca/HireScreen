I'm building this site called the candidrank site, and what it does is, the concept is already stated in the PRD of this. So what it actually, I need is just a lot of like this page for like, remember the UX is specifically designed for like high-end, like HRs and stuff who actually get thousands of resumes a day and they need to scan it and use it to find the best candidates. So we are attaching a gpt model to it. So what I need you to do is, I need you to generate, use Next.js, Tailwind, React, TypeScript, and NPM for the entire project. And I want, and initialize the project. And your task should make a homepage, should be extremely unique, very, very creative, but also very user-friendly. And like user experience should be perfect. And really push your limits of your design capabilities. And I need you to think out of the box here, ultra-think, make sure everything that you think about is already pushed to the maximum as to how you're going to plan this project out. Alright, once initialized, I need you to create five designs, five different designs, and each design will be very different, very creative in their own way, but they will be different from each other, whatever you create. And they should be hosted on /1,/2,/3,/4,/5. Create five designs, different, but each unique and impressive in their own way. Alright, remember, keep it good. Make sure they're beautiful. Use port brackets, insert port number here. Alright, and name it CandidRank. Generate the icons, generate the main homepage, then also generate the, uh, make the homepage and make sure the colors and everything are all locked in and make sure they're all perfect, really clean, aesthetic, and beautiful. Alright, I'm attaching this prompt for you, like this, uh, I'm pushing this inside a .md file and I'm giving it to you. And in that file, there is a, uh, front-end design skill which I want you to use. I want you to follow it to the best of your abilities. Use it as much as you, like, use it and follow it as beautifully as possible and generate me these five, uh, what's it called, designs on, uh, hosted on 1, 2, 3, 4, 5, and I will choose the best one. Alright, so let's go with it. Ultra think and think well.
use port for the dev server : 8000

use your forntend desing skill for you designing capabilities

THE HOMESPAGE SHOULD NEATLY ADN ELEGANTLY DISPLAY WHAT OUR PRODUCT IS TRYITNG TO SERVE AND WHAT IS THE PURPOSE OF OUR PRODuct.

Keep


###The Frontend Design Skill
---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
You are a world-class senior UI/UX engineer and product designer with 20+ years building 
enterprise SaaS products for Fortune 500 companies. You have the design sensibility of 
someone who has shipped interfaces at Stripe, Linear, Vercel, and Notion. You write 
production-ready, error-free code on the first try.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE MISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build a single Next.js 14 App Router project called "candidrank" with TypeScript, 
Tailwind CSS, and Framer Motion. The dev server runs on PORT 8000 only — set this in 
package.json as: "dev": "next dev -p 8000"

Create FIVE completely separate landing page designs, each on its own route:
  /1  →  Design A: Warm Editorial Light
  /2  →  Design B: Dark Refined Intelligence  
  /3  →  Design C: Swiss Typographic Grid
  /4  →  Design D: Soft Corporate Premium
  /5  →  Design E: Monochromatic Brutalist

Each design is a FULL landing page with: Nav, Hero, Social Proof Bar, 
How It Works (3 steps), Features (2 highlights), Pricing (Free + Pro), 
Final CTA, Footer.

The root route "/" is a simple index page with 5 large clickable links:
  → /1 Warm Editorial Light
  → /2 Dark Refined Intelligence
  → /3 Swiss Typographic Grid
  → /4 Soft Corporate Premium
  → /5 Monochromatic Brutalist
Styled minimally, black text on white, DM Serif Display font, centered on screen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PRODUCT: CandidRank
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CandidRank is an AI-powered resume screening platform for enterprise HR teams.
It lets HR managers upload PDF resumes in bulk then ask natural language questions 
like "Who has 5+ years React + startup experience?" and instantly gets a ranked 
list of candidates with quoted excerpts from their resumes as evidence.

Problems solved:
  — Manual resume reading wastes 8+ hours per role
  — Keyword search misses nuanced, contextual experience  
  — Great candidates get buried under a stack of PDFs

Tagline: "Stop reading resumes. Start asking questions."

Target users: Senior HR directors, talent acquisition leads, and technical recruiting 
managers at growing tech companies. They are INTELLIGENT, design-literate professionals 
who want PRECISION, SPEED, CONTROL, and TRUST. They respond to products that feel 
like precision instruments. They are NOT impressed by hype or startup culture aesthetics.

Pricing:
  Free — $0/mo: 3 active jobs, 20 queries/month, 50 uploads, CSV export
  Pro  — $49/mo: Unlimited everything, PDF export, priority support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE HARD RULES — ZERO EXCEPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORBIDDEN — if any of these appear, the output is invalid:
  ✗ Fonts: Inter, Roboto, Arial, system-ui, -apple-system  
  ✗ Colors: ANY neon green, electric cyan, neon anything  
  ✗ Colors: Any purple, violet, indigo, purple-to-blue gradients
  ✗ Backgrounds: Pure white #FFFFFF or pure black #000000 — neither, ever
  ✗ Layout: Identical 3-column card grids for features
  ✗ Copy: "Transform", "Unlock", "Supercharge", "Revolutionize", "Game-changing"
  ✗ Icons: Emoji as decoration, Heroicons/Lucide used generically
  ✗ Animations: Bounce easing, elastic, excessive parallax, random floating blobs
  ✗ Hero: Browser mockup screenshot as the primary visual element
  ✗ Structure: identical Nav→Hero→3 cards→pricing→footer across all 5 designs

REQUIRED in every design:
  ✓ A unique, non-generic font pairing loaded via next/font/google
  ✓ All colors in :root CSS variables, referenced only via var()
  ✓ At least one animated demo widget in the hero that shows the product working
  ✓ Framer Motion for scroll-triggered reveals (useInView, once: true)
  ✓ Custom scrollbar styled in globals.css
  ✓ ::selection color matching the design's accent
  ✓ The CTA button must have a deliberate, surprising hover state
  ✓ Mobile responsive (md: breakpoint is the only required breakpoint)
  ✓ Scroll progress bar wired to Framer Motion's useScroll()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN A — /1 — WARM EDITORIAL LIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEEL: Like the Financial Times digital edition designed by a Swiss typographer. 
Warm, credible, editorial, premium. This is what serious professionals trust.
NOT startup. NOT tech. Like a Bloomberg Terminal that went to a liberal arts college.

COLOR PALETTE (all in :root):
  --bg-canvas:       #F5F0E8    ← warm parchment, the dominant surface
  --bg-panel:        #EDE8DF    ← slightly darker for cards/sections
  --bg-raised:       #E6E0D6    ← elevated elements, borders
  --text-ink:        #1A1714    ← near-black with warmth, primary text
  --text-body:       #4A443C    ← warm dark gray, body copy
  --text-muted:      #8C8278    ← labels, captions, secondary
  --accent-rust:     #C4451A    ← sharp terracotta/rust, the ONE accent
  --accent-rust-dim: rgba(196,69,26,0.1)  ← for glows/tints
  --border-line:     rgba(26,23,20,0.1)   ← subtle borders
  --border-strong:   rgba(26,23,20,0.2)   ← stronger borders

FONTS (next/font/google):
  Display: "Playfair Display" weight 700, 900, style italic + normal → --font-display
  Body:    "Lora" weight 400, 500 → --font-body  
  UI:      "DM Sans" weight 300, 400, 500, 600 → --font-ui
  Mono:    "IBM Plex Mono" weight 400, 500 → --font-mono

LAYOUT APPROACH:
  The page uses a MAGAZINE EDITORIAL layout — not centered blocks.
  Content lives inside a max-w-6xl container but elements break the grid intentionally.
  Horizontal rules (1px var(--border-line)) divide sections like newspaper columns.
  
  NAV:
    Background: var(--bg-canvas), border-bottom: 1px solid var(--border-line)
    NO blur. Solid. Confident.
    Left: "CandidRank" in Playfair Display 700 italic, 20px, var(--text-ink)
    Center: Three nav links in DM Sans 400 13px var(--text-muted), uppercase, 
            letter-spacing: 0.12em
    Right: "Sign in" text link + "Start Free →" pill button
    Pill button: border 1px solid var(--accent-rust), color var(--accent-rust),
                 background transparent, padding 8px 20px, border-radius 4px
    Hover: background var(--accent-rust), color var(--bg-canvas), 
           transition 200ms ease, the arrow shifts right 3px

  HERO — TWO COLUMN, ASYMMETRIC (60/40 split):
    Left column contains all text:
      Small label above title:
        DM Sans 500, 11px, uppercase, letter-spacing 0.15em, var(--accent-rust)
        Background: var(--accent-rust-dim), padding 4px 10px, border-radius 3px
        Content: "AI RESUME SCREENING"
      
      H1: Playfair Display 900, 72px desktop / 44px mobile
          Line height: 1.0, letter-spacing: -0.02em
          Color: var(--text-ink)
          Line 1: "Stop reading"
          Line 2: "resumes."
          Line 3 (italic, var(--accent-rust)): "Start asking."
          Each line is a separate motion.div, staggered 150ms, 
          using: initial { opacity:0, y:20 } animate { opacity:1, y:0 }
          transition: duration 0.6s, ease [0.25, 1, 0.5, 1]
      
      Body: Lora 400, 18px, var(--text-body), line-height 1.75, max-w-md, mt-6
        "Upload your candidate PDFs. Ask any question in plain English.
         Get ranked results with cited proof — in under 10 seconds."
      
      CTA row (mt-8, flex gap-4 align-center):
        Primary: "Start Free — 20 Queries"
          Background: var(--text-ink), color: var(--bg-canvas)
          DM Sans 600, 14px, padding 14px 28px, border-radius 4px
          Hover: background var(--accent-rust), transition 250ms
          whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }
        
        Secondary: Lora italic, 16px, var(--text-body), underline on hover
          "See how it works →"
      
      Trust row (mt-6, flex gap-6):
        DM Sans 400, 12px, var(--text-muted)
        Three items: "✓ No credit card" | "✓ Free forever plan" | "✓ SOC 2 ready"
        The ✓ is var(--accent-rust)

    Right column — THE HERO WIDGET (the editorial card):
      Card: background var(--bg-panel), border 1px solid var(--border-line),
            border-radius 8px, overflow hidden, no box-shadow
      
      Window bar (40px, background var(--bg-raised), border-bottom 1px var(--border-line)):
        Left: Three dots (8px circles): #E74C3C, #F39C12, #2ECC71
        Center: IBM Plex Mono 11px var(--text-muted): "candidrank — Job Workspace"
        Right: DM Sans 400 11px var(--accent-rust): "● Active"
      
      Query bar (padding 14px 16px, border-bottom 1px var(--border-line)):
        IBM Plex Mono 13px var(--text-ink): Typewriter animation cycling 3 queries
        (See TypewriterQuery component spec below)
        Blinking cursor in var(--accent-rust)
      
      Results (padding 16px):
        3 candidate rows, each 52px, flex, gap-3, border-bottom 1px var(--border-line)
        Animate in sequentially (stagger 120ms) after query finishes
        
        Row format:
          Rank badge: IBM Plex Mono 11px var(--text-muted): "#1" "#2" "#3"
          Avatar: 30×30 rounded-full, background var(--bg-raised), 
                  initials DM Sans 500 11px var(--text-body)
          Name/summary (flex col):
            DM Sans 500 13px var(--text-ink)
            DM Sans 400 11px var(--text-muted) truncated
          Match %: IBM Plex Mono 600 15px var(--accent-rust) right-aligned
                   Mini bar below it: 56px wide, 3px tall, rounded
                   Fill: var(--accent-rust), Track: var(--bg-raised)

  PROOF BAR (section):
    Border-top and bottom: 1px solid var(--border-line)
    Background: var(--bg-panel), padding: 20px 0
    Left: DM Sans 400 12px var(--text-muted) uppercase letter-spacing 0.1em:
          "TRUSTED BY HIRING TEAMS AT"
    Right: CSS marquee — company names in Playfair Display italic 16px var(--text-muted)
           Companies: "Vercel" "Linear" "Loom" "Retool" "Postman" "Notion" "Deel" "Figma"
           Separated by "·" in var(--text-muted), opacity 0.4
           Marquee animation: 30s linear infinite, duplicate content for seamless loop

  HOW IT WORKS (section, py-24):
    Background: var(--bg-canvas)
    Border-top: 1px solid var(--border-line)
    
    Section header (flex justify-between align-start):
      Left: 
        Overline: IBM Plex Mono 11px var(--accent-rust) uppercase letter-spacing 0.1em
        H2: Playfair Display 900 italic, 52px: "Three steps."
      Right: Lora 400 16px var(--text-body) max-w-xs:
        "From a folder of PDFs to a ranked shortlist. No training required."
    
    Steps (mt-16, three items in a horizontal row with step numbers as large type):
      Each step (padding-right 40px, border-right 1px var(--border-line), last has no border):
        Number: Playfair Display 900, 80px, color var(--bg-raised), 
                position absolute top-0 left-0 (decorative watermark behind content)
        Position relative so content overlaps the number
        Step label: IBM Plex Mono 11px var(--accent-rust) uppercase: "01" "02" "03"
        Title: DM Sans 600 18px var(--text-ink): "Upload" / "Ask" / "Rank"
        Body: Lora 400 15px var(--text-body) leading-relaxed, max-w-xs

  FEATURES (py-24, two alternating rows):
    Background: var(--bg-panel)
    Each row: min-h 380px, two-column, gap-20, align-center
    Row 1: visual left, text right
    Row 2: text left, visual right
    
    Feature visuals (CSS-only, no images):
      Feature 1 — Natural Language:
        Two stacked "search bars" — old keyword search (struck through, grayed out)
        vs new natural language query (glowing rust border, IBM Plex Mono text)
      Feature 2 — Cited Proof:
        A stylized "result card" showing a candidate with highlighted text excerpts
        The highlighted portions use background var(--accent-rust-dim) color var(--accent-rust)
    
    Feature text:
      Overline: IBM Plex Mono 11px uppercase var(--accent-rust) letter-spacing 0.1em
      Title: Playfair Display 700, 36px, var(--text-ink)
      Body: Lora 400, 16px, var(--text-body), line-height 1.8

  PRICING (py-24, background var(--bg-canvas), border-top 1px var(--border-line)):
    Left-aligned layout (not centered):
    H2: Playfair Display 900, 52px: "Clear pricing."
    Subtitle: Playfair Display 400 italic, 24px, var(--text-body): "No surprises."
    
    Two cards side by side (mt-14, gap-6, max-w-2xl):
      Free card: bg var(--bg-panel), border var(--border-line), border-radius 6px, p-8
      Pro card: bg var(--text-ink), color var(--bg-canvas), border-radius 6px, p-8
                Features use "✓" in var(--accent-rust) (on dark bg)
      
      Price typography: Playfair Display 900, 56px
      Period: Lora italic 15px, 0.6 opacity
      Feature list: Lora 400, 15px, leading-loose
      CTA buttons: full-width, 12px radius, DM Sans 600 14px, 14px padding

  FINAL CTA (py-32, background var(--accent-rust), color var(--bg-canvas)):
    This is the ONLY section with the accent color as background — maximum impact.
    H2: Playfair Display 900 italic, 64px: "Your next hire is already in the pile."
    Email input + button (white input on rust background)
    Below: Lora italic 14px, 0.7 opacity: "Free plan available. No credit card needed."

  FOOTER: 
    Border-top 1px var(--border-line), bg var(--bg-panel), py-10
    Flex row: brand wordmark left | nav links center | copyright right
    All DM Sans 400 13px var(--text-muted)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN B — /2 — DARK REFINED INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEEL: The Economist meets Figma's dashboard. Dark, confident, editorial. The kind of 
dark mode that feels considered, not just inverted. Warm stone tones on deep charcoal.
The aesthetic of intelligence, NOT the aesthetic of technology.

COLOR PALETTE:
  --bg-canvas:     #111210    ← Very dark warm charcoal (NOT pure black)
  --bg-panel:      #191B18    ← Panel surfaces
  --bg-raised:     #22251F    ← Cards, elevated elements
  --text-ink:      #E8E4DC    ← Warm off-white (NOT pure white)
  --text-body:     #9A9690    ← Warm stone gray
  --text-dim:      #5A5652    ← Muted labels
  --accent-sage:   #7EB89A    ← Muted sage green — sophisticated, NOT neon
  --accent-amber:  #D4A853    ← Warm amber for secondary highlights
  --accent-dim:    rgba(126,184,154,0.12) ← Sage glow layer
  --border-sub:    rgba(232,228,220,0.07) ← Almost invisible borders
  --border-vis:    rgba(232,228,220,0.14) ← Visible borders

FONTS:
  Display: "Cormorant Garamond" weight 600, 700, style italic+normal → --font-display
  Body:    "Source Serif 4" weight 300, 400 → --font-body
  UI:      "Outfit" weight 300, 400, 500, 600 → --font-ui
  Mono:    "Fira Code" weight 400, 500 → --font-mono

LAYOUT: 
  Full dark canvas. Sections feel like different depths of the same darkness.
  Strong horizontal rules using border instead of background color changes.
  Generous padding. Sections are tall and unhurried.

  NAV: Glassmorphism done RIGHT — bg rgba(17,18,16,0.8) blur(20px)
    Brand: "CandidRank" in Cormorant Garamond 600, 20px, var(--text-ink)
    The "C" is a small square 24×24 bg var(--accent-sage) color var(--bg-canvas) 
    font-weight 700, border-radius 4px, mr-2
    Links: Outfit 400, 13px, var(--text-body), uppercase letter-spacing 0.1em
    Hover: color var(--text-ink), transition 200ms
    CTA: "Get Started →" — border 1px var(--border-vis), color var(--text-ink),
         bg transparent, border-radius 6px, padding 8px 18px, Outfit 500 13px
         Hover: bg var(--accent-sage), color var(--bg-canvas), border-color transparent

  HERO: Full viewport, two-column asymmetric
    Left 58%, right 42%
    
    Background:
      Base: var(--bg-canvas)
      Fine dot grid: radial-gradient(circle, rgba(232,228,220,0.035) 1px, transparent 1px) 
                     background-size 32px 32px
      Subtle right radial glow: 500px ellipse, rgba(126,184,154,0.04), 
                                 position absolute right-0 top-1/2
    
    Pill label: Fira Code 11px, bg var(--accent-dim), border 1px rgba(126,184,154,0.25),
               color var(--accent-sage), padding 4px 12px, border-radius 3px
               "✦ AI-POWERED SCREENING"
    
    H1: Cormorant Garamond 700, 76px desktop / 46px mobile
        Letter-spacing: -0.025em, line-height: 0.96
        Line 1+2: "Stop reading resumes." — color var(--text-ink)
        Line 3 (italic): "Start asking." — color var(--accent-sage)
        Staggered Framer Motion fade+blur reveal:
        initial { opacity:0, y:24, filter:'blur(8px)' }
        animate { opacity:1, y:0, filter:'blur(0px)' }
        transition: duration 0.7s, ease [0.22,1,0.36,1], stagger 0.15s per line
    
    Body: Source Serif 4, 300, 18px, var(--text-body), max-w-md, line-height 1.75
    
    CTA: 
      Primary: bg var(--accent-sage), color var(--bg-canvas), Outfit 600 14px,
               padding 14px 28px, border-radius 6px
               Box-shadow: 0 0 24px rgba(126,184,154,0.2)
               Hover: bg #8FCBAA (slightly lighter), shadow intensifies,
               whileHover scale 1.02, whileTap scale 0.97
      Secondary: Source Serif 4 italic 16px var(--text-body), underline on hover
    
    Trust row: Outfit 400 12px var(--text-dim), ✓ in var(--accent-sage)
    
    HERO WIDGET (right column):
      Same structure as Design A but styled dark:
      Container: bg var(--bg-panel), border 1px var(--border-vis),
                 border-radius 12px, overflow hidden
                 box-shadow: 0 32px 80px rgba(0,0,0,0.6)
      Window bar: bg var(--bg-raised), border-bottom 1px var(--border-sub)
      Query text: Fira Code 13px var(--accent-sage) — typewriter cycling
      Results: same 3-row structure, scores in var(--accent-amber)
      Progress bars: fill var(--accent-sage), track var(--bg-raised)
      Enters from: x:50 opacity:0 blur:10px → x:0 opacity:1 blur:0, delay 0.4s

  HOW IT WORKS: py-28, bg var(--bg-panel), border-top+bottom 1px var(--border-sub)
    Layout: vertical centered, max-w-3xl mx-auto, text-center
    H2: Cormorant Garamond 700, 56px, two-line:
        "Three steps to find" + italic "your best hire."
    Three step cards in a horizontal row (no connecting lines):
      Card: bg var(--bg-raised), border 1px var(--border-sub), 
            border-radius 10px, p-8, text-left
      Step number: Fira Code 12px var(--text-dim) uppercase: "STEP 01"
      CSS icon (same approach as before — document stacks, cursor, bar chart)
      Title: Outfit 600 18px var(--text-ink)
      Body: Source Serif 4 300 15px var(--text-body)
      whileHover: y:-4, borderColor var(--border-vis), 
                  boxShadow '0 16px 40px rgba(0,0,0,0.3)'

  FEATURES: py-28, bg var(--bg-canvas)
    Two alternating feature rows (same structure as Design A)
    Visual components use dark card styling
    Text uses Cormorant Garamond for H3, Source Serif 4 for body

  PRICING: py-28, bg var(--bg-panel)
    H2: Cormorant Garamond 700 56px italic: "Simple, honest pricing."
    Free card: bg var(--bg-raised), border var(--border-vis), p-8, border-radius 10px
    Pro card: border 1px rgba(126,184,154,0.35), 
              box-shadow 0 0 60px rgba(126,184,154,0.07), bg var(--bg-canvas)
              "RECOMMENDED" badge: bg var(--accent-sage), color var(--bg-canvas),
              Fira Code 10px uppercase, centered top badge
    Price: Cormorant Garamond 700 italic 60px
    Features: Outfit 400 14px var(--text-body), ✓ var(--accent-sage)

  FINAL CTA: py-32, bg var(--bg-canvas)
    Large centered text:
    H2: Cormorant Garamond 700 italic 68px, two lines:
        "Your next great hire" (var(--text-ink))
        "is already in your inbox." (var(--accent-sage))
    Email + button, same dark styling
    Watermark behind: "CandidRank" in Cormorant Garamond 900, 200px, 
                      color rgba(232,228,220,0.02), centered, z-index 0

  FOOTER: Dark footer, border-top var(--border-sub), py-10
    Flex row: brand | links | copyright
    Outfit 400 12px var(--text-dim)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN C — /3 — SWISS TYPOGRAPHIC GRID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEEL: International Typographic Style. Pure, disciplined, unapologetically grid-based.
Like a Müller-Brockmann poster built a SaaS. Light, airy, obsessively precise.
Every element has a reason to exist. Nothing decorative. Mathematical beauty.

COLOR PALETTE:
  --bg-canvas:      #F8F6F2    ← Warm light off-white, nearly paper
  --bg-rule:        #E8E4DE    ← Grid lines, dividers
  --text-black:     #141210    ← Near-black for headlines
  --text-body:      #3C3832    ← Body text
  --text-light:     #8C8880    ← Captions, labels
  --accent-red:     #D63B1F    ← Classic Swiss red — sharp, single accent
  --accent-red-bg:  rgba(214,59,31,0.08) ← Tint backgrounds
  --grid-line:      rgba(20,18,16,0.06)  ← The grid itself

FONTS:
  Display: "Bebas Neue" weight 400 → --font-display (for large UPPERCASE headings ONLY)
  Subhead: "Libre Baskerville" weight 400, 700, italic → --font-sub
  Body:    "Source Sans 3" weight 300, 400, 600 → --font-body
  Mono:    "Space Mono" weight 400, 700 → --font-mono

IMPORTANT: Bebas Neue is ONLY for large display numbers and hero headline.
Everything else uses Libre Baskerville or Source Sans 3.

LAYOUT: 
  A visible 12-column CSS grid underlies everything.
  Vertical rhythm: 8px base unit, everything is a multiple of 8.
  Sections separated by 1px solid var(--grid-line) — borders, not backgrounds.
  Text and elements align to invisible grid columns.
  Large negative space treated as a design element.

  NAV: bg var(--bg-canvas), border-bottom 2px solid var(--text-black), height 64px
    Left: "CANDIDRANK" — Bebas Neue 28px var(--text-black), letter-spacing 0.05em
    A 2px × 32px vertical separator bar (var(--text-black)) mx-4
    After separator: Source Sans 3 400 13px var(--text-light) uppercase letter-spacing 0.15em:
    "AI Resume Screening"
    Right: "LOG IN" Source Sans 3 600 12px uppercase letter-spacing 0.12em var(--text-body)
           + "GET STARTED" button: bg var(--accent-red) color #FFF, 
           Source Sans 3 600 11px uppercase letter-spacing 0.12em,
           padding 10px 20px, NO border-radius (rectangle), 
           Hover: bg #BF3219, the text shifts right 2px via translateX

  HERO: Full viewport, strict grid
    Background: var(--bg-canvas)
    A subtle grid overlay (CSS):
      Multiple vertical lines: 
        Created via repeating-linear-gradient(to right, 
        var(--grid-line) 0px, var(--grid-line) 1px, transparent 1px, transparent 8.33%)
        Absolutely positioned behind content, pointer-events none, opacity 0.5
    
    Left column (col-span 7 of 12):
      Label: Space Mono 400, 11px, var(--accent-red), uppercase letter-spacing 0.15em
             Border-left: 3px solid var(--accent-red), padding-left 12px
             Content: "AI-POWERED / RESUME SCREENING / 2026"
      
      H1: Bebas Neue, 120px desktop / 68px mobile, var(--text-black), 
          line-height 0.92, letter-spacing 0.01em
          "STOP READING" (line 1)
          "RESUMES." (line 2, var(--accent-red))
          "START ASKING." (line 3)
          Reveal: each word animates in from y:30 opacity:0, stagger 0.05s per word
                  use split-by-word approach, wrap each word in motion.span
      
      Divider rule: 2px solid var(--text-black), width 100%, my-8
      
      Body: Libre Baskerville 400, 17px, var(--text-body), line-height 1.75, max-w-lg
      
      CTA: 
        Two buttons side by side:
        "GET STARTED FREE →": bg var(--text-black), color var(--bg-canvas),
          Source Sans 3 600 13px uppercase letter-spacing 0.1em, NO border-radius
          padding: 16px 32px
          Hover: bg var(--accent-red), transition 200ms ease
          whileTap scale 0.98
        "HOW IT WORKS": border 2px solid var(--text-black), bg transparent,
          color var(--text-black), same font, same padding
          Hover: bg var(--text-black), color var(--bg-canvas)
      
      Numbers row (mt-8, flex gap-8):
        Three stats:
        Number: Bebas Neue 48px var(--text-black)
        Label: Source Sans 3 300 12px uppercase var(--text-light) letter-spacing 0.12em
        Stats: "8+" "Hours saved per role" | "10s" "Query response time" | "0" "Hours reading"
    
    Right column (col-span 5 of 12):
      A LARGE oversized Bebas Neue "01" in var(--grid-line), 
      300px, positioned as a background watermark for the column
      Over it: the HERO WIDGET, same structure, styled for this aesthetic:
        Container: bg var(--bg-canvas), border 2px solid var(--text-black), NO border-radius
        Window bar: bg var(--text-black), color var(--bg-canvas)
          "CANDIDRANK — WORKSPACE" in Space Mono 10px, color var(--bg-canvas)
        Query: Space Mono 12px var(--accent-red) typewriter
        Results: candidate rows, border-bottom 1px var(--grid-line)
                 Score: Bebas Neue 28px var(--accent-red) right-aligned
                 Mini progress bar below score

  PROOF BAR: border-top+bottom 2px solid var(--grid-line), py-4
    Single row: "USED BY TEAMS AT" Space Mono 10px var(--text-light) | marquee of company names
    ALL CAPS company names in Bebas Neue 18px var(--text-light)

  HOW IT WORKS: py-24, bg var(--bg-canvas), border-top 2px solid var(--text-black)
    Header spans full width: large Bebas Neue 80px "THREE STEPS." left-aligned
    Below it: Libre Baskerville 400 italic 16px var(--text-light): "No configuration needed."
    
    Three columns STRICTLY aligned to grid:
      NO cards, NO borders — pure typographic layout
      Step: Space Mono 11px var(--accent-red) uppercase: "01 —" "02 —" "03 —"
      Title: Bebas Neue 36px var(--text-black): "UPLOAD" / "ASK" / "RANK"
      Body: Source Sans 3 300 15px var(--text-body) leading-relaxed
      A 1px horizontal rule above each step header

  FEATURES: py-24, alternating rows, border-top 1px var(--grid-line)
    No cards. Feature title in Bebas Neue 56px, body in Libre Baskerville.
    Feature visuals: same CSS-drawn components but squared off, no border-radius

  PRICING: py-24, border-top 2px solid var(--text-black)
    H2: Bebas Neue 80px "PRICING."
    Free: simple bordered box (2px var(--grid-line)) NO border-radius
    Pro: bg var(--text-black) color var(--bg-canvas), NO border-radius
         Price: Bebas Neue 72px
         A 2px var(--accent-red) top border on Pro card

  FINAL CTA: py-32, bg var(--accent-red), color #FFF
    Full bleed accent color section (similar to Design A's CTA — maximum contrast)
    H2: Bebas Neue 100px "FIND YOUR NEXT HIRE."
    Email input: bg transparent, border-bottom 2px solid white, no other border
    Submit: bg white, color var(--accent-red), Bebas Neue 20px, no border-radius

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN D — /4 — SOFT CORPORATE PREMIUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEEL: This is the one enterprise HR directors forward to their CTO and CEO and nobody 
objects. Calm, trusted, measured. Think Stripe's website in terms of trust level, 
but with warmer tones. NOT startup. Feels like it costs money. Quiet confidence.

COLOR PALETTE:
  --bg-canvas:    #FAFAF8    ← Extremely subtle warm gray, almost white but not
  --bg-section:   #F3F2EE    ← Alternating section background
  --bg-panel:     #EBEBE6    ← Cards, raised panels
  --text-primary: #18181B    ← Deep near-black
  --text-body:    #52525B    ← Warm gray body
  --text-dim:     #A1A1AA    ← Labels, captions
  --accent-teal:  #0D7377    ← Deep teal — trustworthy, NOT cyan, NOT mint
  --accent-light: rgba(13,115,119,0.1) ← Teal tint
  --border:       rgba(24,24,27,0.08)  ← Borders
  --border-med:   rgba(24,24,27,0.14)  ← Stronger borders

FONTS:
  Display: "Fraunces" weight 700, 800, style italic+normal → --font-display
  Body:    "Nunito Sans" weight 300, 400, 600 → --font-body
  Mono:    "JetBrains Mono" weight 400, 500 → --font-mono

LAYOUT: Clean, professional, slightly rounded everything. Generous padding.
  Maximum width containers. Subtle shadows instead of hard borders.
  The feeling of a well-designed B2B SaaS that has shipped for 3 years.

  NAV: bg rgba(250,250,248,0.9) blur(16px), border-bottom 1px var(--border)
    Brand: Small teal rounded square (28×28, bg var(--accent-teal), 
           "CR" Fraunces 800 13px white) + "CandidRank" Fraunces 700 18px var(--text-primary)
    Links: Nunito Sans 400 14px var(--text-body), hover var(--text-primary)
    CTA: "Start Free" pill, bg var(--accent-teal) white, Nunito Sans 600 14px,
         border-radius 999px, padding 9px 22px
         Hover: bg #0A5E62, whileHover scale 1.02

  HERO: Two column, 55/45
    Centered vertically, min-h-screen
    No dramatic background effects — just clean canvas
    A very subtle bottom fade gradient from transparent to var(--bg-section) 
    to create section transition (position absolute bottom-0 left-0 right-0, 
    height 200px, pointer-events none)
    
    Left:
      Badge: Nunito Sans 600 11px uppercase letter-spacing 0.1em, 
             bg var(--accent-light), color var(--accent-teal),
             border-radius 999px, padding 5px 14px
             "AI Resume Screening · For HR Teams"
      
      H1: Fraunces 800, 64px, line-height 1.05, letter-spacing -0.025em
          var(--text-primary)
          "Stop reading resumes." (normal weight)
          Italic accent: "Start asking." (italic, var(--accent-teal))
          Reveal: y:16 opacity:0 → y:0 opacity:1, stagger 0.12s, ease [0.25,1,0.5,1]
      
      Body: Nunito Sans 300, 18px, var(--text-body), max-w-md, line-height 1.75
      
      CTA:
        Primary: bg var(--accent-teal), white, Nunito Sans 600 15px, 
                 border-radius 8px, padding 14px 28px
                 Box-shadow: 0 4px 16px rgba(13,115,119,0.25)
                 Hover: bg #0A5E62, shadow deepens, whileHover scale 1.02
        Secondary: Nunito Sans 400 15px var(--text-body), no bg, arrow shifts right
      
      Trust: teal ✓ marks, Nunito Sans 400 13px var(--text-dim)
    
    Right: HERO WIDGET
      Container: bg white, border 1px var(--border), border-radius 16px,
                 box-shadow: 0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)
                 This elevated card shadow is the key premium signal
      Window bar: bg var(--bg-panel), border-bottom 1px var(--border), border-radius 16px 16px 0 0
      Query: JetBrains Mono 12px var(--accent-teal), typewriter animation
      Results: same structure, score in var(--accent-teal) Fraunces 700 italic 22px
      Progress bars: teal fill on panel track

  PROOF BAR: bg var(--bg-section), border-top+bottom 1px var(--border), py-5
    Same marquee but company names in Nunito Sans 500 15px var(--text-dim)

  HOW IT WORKS: py-24, bg var(--bg-canvas)
    Centered, max-w-4xl mx-auto
    H2: Fraunces 800, 52px, var(--text-primary)
        "Three steps. " + italic span "No manual reading."
    Three cards in row: bg var(--bg-section), border 1px var(--border), 
                        border-radius 12px, p-8
    Step count: JetBrains Mono 11px var(--accent-teal) uppercase
    CSS icon (same 3 types — document stack, cursor blink, bar chart)
    Title: Fraunces 700 20px, Body: Nunito Sans 300 15px
    Hover: y:-4, box-shadow deepens subtly

  FEATURES: py-24, bg var(--bg-section)
    Two alternating rows, same approach
    Fraunces for H3, Nunito Sans for body
    Visual components have rounded corners (border-radius 12px)

  PRICING: py-24, bg var(--bg-canvas)
    Centered, max-w-2xl mx-auto
    H2: Fraunces 800 52px centered: "Honest pricing."
    Two cards, Free and Pro:
      Free: border 1px var(--border), bg var(--bg-section), border-radius 12px, p-8
      Pro: border 2px solid var(--accent-teal), bg white, border-radius 12px, p-8
           box-shadow: 0 0 0 4px var(--accent-light), 0 16px 40px rgba(13,115,119,0.1)
           "MOST POPULAR" chip: bg var(--accent-teal), white, Nunito Sans 600 10px uppercase,
           border-radius 999px, centered at top

  FINAL CTA: py-32, bg var(--accent-teal), white
    Fraunces 800 italic 60px: "Your next great hire is waiting."
    Rounded email input + rounded white button
    Subtle: "Free plan available · No credit card" below in 0.7 opacity

  FOOTER: bg var(--bg-section), border-top var(--border), py-10
    Nunito Sans 400 13px var(--text-dim)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN E — /5 — MONOCHROMATIC BRUTALIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FEEL: Raw. Direct. Every element is honest about what it is. Like a physical newspaper 
printed in 2026. No surface decoration — pure hierarchy and rhythm through typography 
and stark contrast alone. This is the one designers will screenshot.

COLOR PALETTE:
  --bg-canvas:    #F2EDE6    ← Aged paper tone
  --bg-inverse:   #141210    ← Near-black for inverted sections
  --text-black:   #141210    ← Dominant text
  --text-paper:   #F2EDE6    ← Text on dark sections
  --text-gray:    #7A7268    ← Secondary text
  --accent-gold:  #B8962A    ← Aged gold — ONE accent, used sparingly
  --rule:         #141210    ← Hard rules/borders

FONTS:
  Display: "Instrument Serif" weight 400, style italic+normal → --font-display
  Giant:   "Anton" weight 400 → --font-giant (for oversized decorative text)
  Body:    "Literata" weight 300, 400 → --font-body
  Mono:    "Courier Prime" weight 400, 700 → --font-mono

LAYOUT:
  Newspaper-inspired. Hard horizontal rules everywhere (2px var(--rule)).
  Columns feel like a broadsheet. Content is DENSE and proud of it.
  The hero has a completely different structure from all others.

  NAV: bg var(--bg-canvas), border-bottom 2px solid var(--rule), height 52px
    Centered: "CANDIDRANK" in Anton 32px var(--text-black) tracking-wider
    Below that (like a newspaper date line): 
      A 1px var(--text-gray) rule, then on it centered:
      Courier Prime 11px var(--text-gray) uppercase letter-spacing 0.2em:
      "AI RESUME SCREENING ··· EST. 2026 ··· TRUSTED BY HIRING TEAMS"
    Full-width date band: 36px tall, centered masthead layout
    Right side has Log in and Get Started in Literata italic
    This whole nav feels like a newspaper masthead

  HERO: NOT a two-column layout.
    This hero uses a FULL-WIDTH typographic poster approach.
    
    Background: var(--bg-canvas) with a very subtle noise texture:
      body::before { content:''; position:fixed; inset:0; 
      background-image: url("data:image/svg+xml,..."); opacity:0.03; 
      pointer-events:none; z-index:9999; }
      (Use an inline SVG data URI for a subtle noise pattern)
    
    Top of hero: full-width horizontal rule 2px
    
    Then a two-column newspaper layout (strictly 50/50):
    
    LEFT COLUMN (border-right 1px var(--text-gray)):
      Column label (like a newspaper section): 
        Courier Prime 11px var(--text-gray) uppercase letter-spacing 0.2em:
        "SECTION A1 — THE HIRING CRISIS"
      
      H1: Instrument Serif italic, 88px, var(--text-black), line-height 0.9:
          "Stop reading" 
          "resumes."
      
      Horizontal rule 1px, my-6
      
      Body: Literata 400, 16px, var(--text-gray), line-height 1.85 (newspaper body style),
            max-w-sm, column count 1
            "Upload your candidate PDFs. Ask any question in plain English. 
            Get ranked results with cited excerpts from each resume 
            — in under 10 seconds."
      
      Horizontal rule 1px, my-6
      
      CTA row (flex gap-4):
        "START FREE" button: bg var(--text-black), color var(--bg-canvas),
          Anton 16px letter-spacing 0.1em, padding 12px 28px, NO border-radius
          Hover: bg var(--accent-gold)
        "HOW IT WORKS →" : Literata italic 15px var(--text-gray), underline
    
    RIGHT COLUMN:
      The HERO WIDGET is styled as a "newspaper article clipping":
      Container: bg var(--bg-canvas), border 2px solid var(--text-black), 
                 NO border-radius, padding 0
      A bold top bar (bg var(--text-black), color var(--bg-canvas), padding 8px 16px):
        Courier Prime 11px uppercase letter-spacing 0.15em: "CANDIDATE QUERY — LIVE"
      Query: Courier Prime 13px var(--text-black) typewriter animation
             blinking cursor in var(--accent-gold)
      Results rows: border-bottom 1px var(--text-gray), py-3 px-4
        Name: Instrument Serif 400 16px var(--text-black)
        Summary: Literata 300 12px var(--text-gray)
        Score: Anton 28px var(--accent-gold) right-aligned
        NO progress bar — just the percentage number
      
      Below widget: A PULL QUOTE box (border-left 3px var(--accent-gold), pl-4, mt-4):
        Instrument Serif italic 18px var(--text-black):
        ""Ranked 200 candidates in 4 minutes.""
        Literata 300 12px var(--text-gray) mt-1: "— Senior HR Director"

  PROOF BAR: bg var(--bg-inverse), color var(--text-paper), py-5
    Inverted dark band. Courier Prime 11px uppercase:
    "TRUSTED BY —" then company names in Anton 20px var(--text-paper)
    Same marquee animation

  HOW IT WORKS: bg var(--bg-canvas), py-20, border-top 2px var(--rule)
    Full-width heading: Anton 100px var(--text-black) — "THREE STEPS."
    Below: horizontal rule 1px
    Three columns with newspaper-style text layout:
      Column header: Courier Prime 11px uppercase var(--text-gray): "01 UPLOAD"
      Title: Instrument Serif italic 32px var(--text-black)
      Body: Literata 400 15px var(--text-gray) leading-relaxed
      NO cards, NO backgrounds — pure typography on paper

  FEATURES: py-20, bg var(--bg-canvas), border-top 2px var(--rule)
    Big section label: Anton 80px, full-width, border-bottom 1px var(--rule)
    Alternating rows with pull-quote style highlighted text excerpts

  PRICING: bg var(--bg-inverse), color var(--text-paper), py-20
    (The ONE section that uses the dark background in this otherwise light design)
    Anton 80px "PRICING." then horizontal rule
    Two "panels" side by side:
      Free: border 1px rgba(242,237,230,0.15), p-8
      Pro: border 2px solid var(--accent-gold), p-8
           A gold top border bar (4px bg var(--accent-gold) across top of card)
    Price: Instrument Serif italic 72px var(--text-paper)
    Features: Literata 400 14px var(--text-paper), ✓ in var(--accent-gold)
    Button on Pro: bg var(--accent-gold), color var(--bg-inverse), Anton 14px uppercase

  FINAL CTA: py-32, bg var(--bg-canvas), border-top 2px var(--rule), text-center
    Instrument Serif italic 72px var(--text-black): "Your next hire"
    Anton 100px var(--text-black): "IS WAITING."
    Email underline input + black button with no border-radius
    "No credit card · Free plan available" in Courier Prime 11px var(--text-gray)

  FOOTER: bg var(--bg-canvas), border-top 2px var(--rule), py-8
    Masthead-style: "CANDIDRANK" Anton 24px centered
    Below: Courier Prime 11px var(--text-gray) centered:
    "© 2026 · AI Resume Screening · Terms · Privacy · SOC 2 Ready"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHARED TECHNICAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INITIALIZATION:
  npx create-next-app@latest candidrank --typescript --tailwind --app --no-src-dir --import-alias "@/*"
  cd candidrank
  npm install framer-motion

PACKAGE.JSON DEV SCRIPT:
  "dev": "next dev -p 8000"

FILE STRUCTURE:
  /app
    layout.tsx              ← Root layout, only wraps in html/body
    page.tsx                ← Root index "/" linking to all 5 designs
    globals.css             ← Base Tailwind + reset (NO design-specific styles here)
    /1/page.tsx             ← Design A: Warm Editorial Light
    /2/page.tsx             ← Design B: Dark Refined Intelligence
    /3/page.tsx             ← Design C: Swiss Typographic Grid
    /4/page.tsx             ← Design D: Soft Corporate Premium
    /5/page.tsx             ← Design E: Monochromatic Brutalist
  /components
    /design-a/              ← All components for Design A
      Nav.tsx, Hero.tsx, ProofBar.tsx, HowItWorks.tsx,
      Features.tsx, Pricing.tsx, FinalCTA.tsx, Footer.tsx
    /design-b/              ← Same for Design B
    /design-c/              ← Same for Design C
    /design-d/              ← Same for Design D
    /design-e/              ← Same for Design E
    /shared/
      TypewriterQuery.tsx   ← Shared typewriter component (one reusable version)

EACH /N/PAGE.TSX PATTERN:
  'use client'
  Each page defines its own CSS variables in a <style> tag inside the component
  OR in a <div style={{...}}> wrapper using CSS custom properties
  This ensures each design's colors are completely isolated from others.
  
  The pattern is:
    export default function Design_X() {
      return (
        <>
          <style>{`
            .design-x-root { --bg-canvas: ...; --accent: ...; ... }
          `}</style>
          <div className="design-x-root">
            <Nav />
            <Hero />
            ... etc
          </div>
        </>
      )
    }

FRAMER MOTION SHARED SETTINGS:
  All scroll reveals: useInView(ref, { once: true, margin: '-80px' })
  All easing: [0.25, 1, 0.5, 1] for smooth deceleration — NEVER bounce/elastic
  All stagger: 0.10s to 0.15s between elements
  Standard entry: { opacity: 0, y: 20 } → { opacity: 1, y: 0 }, duration 0.55s
  Button hover: whileHover={{ scale: 1.02 }}, whileTap={{ scale: 0.97 }}

TYPEWRITER COMPONENT (shared):
  Props: { queries: string[], accentColor: string, bgColor: string }
  State: displayText, queryIndex, showResults
  Logic:
    Type characters at 55ms interval
    When complete: show results after 300ms delay
    Hold results for 2800ms
    Then: clear displayText, increment queryIndex mod length, repeat
  CLEANUP: ALL intervals/timeouts must be cleared in useEffect cleanup
  The cycling queries for all designs:
    "Who has 5+ years React + startup experience?"
    "Who led a team of 10+ engineers and shipped?"
    "Who worked at a well-funded startup or public company?"

SCROLL PROGRESS BAR (in each design's root component):
  const { scrollYProgress } = useScroll()
  <motion.div
    className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
    style={{ scaleX: scrollYProgress, backgroundColor: 'var(--accent-X)' }}
  />
  (Use the respective design's accent color variable)

CUSTOM SCROLLBAR (in each page's <style> block):
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--accent-X); border-radius: 2px; }

MARQUEE (ProofBar, shared pattern):
  CSS @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
  Inner container: display flex, width: max-content, animation: marquee 28s linear infinite
  Duplicate the company list ONCE to create seamless loop
  The outer wrapper: overflow: hidden

MOBILE RESPONSIVE:
  Every hero goes single-column on mobile (md: breakpoint)
  All font sizes scale down (use Tailwind responsive prefixes)
  Nav hides center links on mobile, shows hamburger with useState open/close
  Pricing cards stack on mobile
  Proof bar marquee still works on mobile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate ALL files completely. Never truncate. Never use "// ... rest of component".
Every component must be fully implemented with all JSX and styles.

Output each file as:
// FILE: exact/path/to/file.tsx
[complete file content]

Output order:
  1.  package.json
  2.  tailwind.config.ts
  3.  tsconfig.json
  4.  app/globals.css
  5.  app/layout.tsx
  6.  app/page.tsx
  7.  components/shared/TypewriterQuery.tsx
  8.  All design-a/ components (Nav, Hero, ProofBar, HowItWorks, Features, Pricing, FinalCTA, Footer)
  9.  app/1/page.tsx
  10. All design-b/ components
  11. app/2/page.tsx
  12. All design-c/ components
  13. app/3/page.tsx
  14. All design-d/ components
  15. app/4/page.tsx
  16. All design-e/ components
  17. app/5/page.tsx

After all files, print exactly:
  cd candidrank && npm install && npm run dev
  Then open: http://localhost:8000

FINAL VERIFICATION CHECKLIST — check each before outputting:
  □ package.json has "dev": "next dev -p 8000"
  □ Each design route isolates its CSS variables so designs don't bleed into each other
  □ Zero uses of Inter, Roboto, Arial, system fonts anywhere
  □ Zero pure white #FFFFFF or pure black #000000 backgrounds anywhere
  □ Zero neon colors (no electric green, no neon cyan, no neon anything)
  □ Zero purple, violet, indigo colors anywhere
  □ All 5 TypewriterQuery instances clean up intervals in useEffect return
  □ All useInView uses { once: true } — no re-triggering on scroll
  □ All 5 designs have a working scroll progress bar
  □ All 5 marquees duplicate their content for seamless looping
  □ All buttons have whileHover AND whileTap props
  □ Every hero has a working animated demo widget (not a screenshot image)
  □ Mobile hamburger menus open and close correctly with useState
  □ No TypeScript errors — no implicit any, all props are typed
  □ All next/font/google fonts are loaded with correct variable names
  □ The root "/" index page cleanly links to all 5 designs