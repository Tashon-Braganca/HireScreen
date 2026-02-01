# GEMINI PROMPT: Generate Comprehensive Product Requirements Document (PRD)

## INSTRUCTIONS FOR GEMINI

You are a world-class product strategist and startup advisor who has helped build 50+ successful SaaS companies from 0 to $10M ARR. Your task is to generate an EXTREMELY detailed Product Requirements Document for HireScreen.

**CRITICAL: Use your web search capabilities to research current market trends, competitor features, and best practices in AI-powered recruiting tools before writing.**

---

## CONTEXT FILES TO REFERENCE

Before generating, internalize these two architecture documents that define what HireScreen is:

### From ARCHITECTURE.md:
- HireScreen is an AI-powered resume screening SaaS
- Tech Stack: Next.js 14, TypeScript, Supabase (PostgreSQL + pgvector), OpenAI (gpt-4o-mini, text-embedding-3-small)
- Core Flow: Upload PDFs -> Chunk & Embed -> Vector Search -> RAG Answer with Citations
- Pricing: Free tier (2 jobs, 10 resumes, 20 queries) vs Pro tier ($29/mo, unlimited)
- Target Users: Recruiters, HR teams, small agencies, startup founders hiring

### From IMPLEMENTATION_PLAN.md:
- MVP is functional with: Auth (Google + Email), Job Management, Resume Upload, AI Query, Landing Page
- Scaling considerations: Async processing queues, batch embeddings, rate limiting
- Deployment: Vercel + Supabase

---

## YOUR TASK: Generate a PRD with the following sections

### SECTION 1: Executive Summary (500+ words)
- What is HireScreen in one paragraph
- The problem we solve (with statistics on recruiter pain points - SEARCH FOR REAL DATA)
- Our unique value proposition vs. existing solutions
- Target market size (TAM/SAM/SOM) - USE WEB SEARCH for real recruiting software market data
- Success metrics for MVP and beyond

### SECTION 2: User Personas (Create 5 detailed personas)
For each persona include:
- Name, age, role, company size
- Daily pain points (be specific)
- Current tools they use
- Why they would switch to HireScreen
- Willingness to pay
- Acquisition channel (how we reach them)

### SECTION 3: Feature Roadmap (Phase 0 to Phase 3)

**Phase 0: Pre-Launch (Current State)**
- List every feature that exists today
- Identify critical bugs or UX gaps
- Security audit checklist

**Phase 1: MVP Launch (Week 1-4)**
- Features required for first paying customer
- Minimum viable onboarding flow
- Payment integration requirements
- Analytics and monitoring setup
- Error handling and edge cases

**Phase 2: Product-Market Fit (Month 2-3)**
- Features based on user feedback patterns
- Retention improvement features
- Viral/referral mechanisms
- Integration possibilities (ATS systems like Greenhouse, Lever)

**Phase 3: Scale (Month 4-6)**
- Team/agency features
- API access for developers
- White-label possibilities
- Enterprise security features (SSO, audit logs)

### SECTION 4: Technical Requirements
For each feature, specify:
- User story format: "As a [user], I want to [action] so that [benefit]"
- Acceptance criteria (bullet points)
- Edge cases to handle
- Database schema changes if needed
- API endpoints required
- UI/UX specifications

### SECTION 5: Success Metrics & KPIs
Define specific, measurable targets:
- Acquisition: Signups, activation rate, source attribution
- Engagement: DAU/MAU, queries per user, resumes uploaded
- Revenue: MRR, conversion rate, churn rate, LTV
- Product: Query accuracy, processing speed, error rate

### SECTION 6: Risk Assessment

**BE BRUTALLY HONEST. List:**

#### Reasons This Startup Will FAIL (minimum 15 reasons):
1. [Reason with detailed explanation]
2. [Continue...]
...

For each failure reason, provide:
- The specific risk
- Probability (Low/Medium/High)
- Impact (Low/Medium/High)
- Mitigation strategy

#### Reasons This Startup Will SUCCEED (minimum 15 reasons):
1. [Reason with detailed explanation]
2. [Continue...]

For each success factor, provide:
- The specific advantage
- How to maximize it
- Evidence from market research

### SECTION 7: Competitive Moat Analysis
- What makes HireScreen defensible?
- Network effects potential
- Switching costs for users
- Data advantages over time
- Brand/community building opportunities

### SECTION 8: Go-to-Market Timeline
Week-by-week action plan for the first 90 days:
- Week 1-2: [Specific actions]
- Week 3-4: [Specific actions]
- ...continue for 12 weeks

### SECTION 9: Budget & Resource Requirements
- Monthly costs breakdown (hosting, AI API, tools)
- Revenue projections (conservative, moderate, optimistic)
- Break-even analysis
- Funding requirements if any

### SECTION 10: Legal & Compliance
- GDPR considerations for resume data
- Data retention policies
- Terms of Service requirements
- Privacy policy requirements
- AI disclosure requirements

---

## OUTPUT FORMAT REQUIREMENTS

1. Use proper Markdown formatting with headers, bullet points, tables
2. Include specific numbers, dates, and metrics wherever possible
3. Reference real competitor names and features (use web search)
4. Be actionable - every section should have clear next steps
5. Total length: 5000+ words minimum
6. Include a TL;DR summary at the top

---

## FINAL INSTRUCTION

After generating the PRD, end with a section called "FOUNDER'S HONEST ASSESSMENT" where you rate this startup idea on a scale of 1-10 across:
- Market Opportunity: X/10
- Technical Feasibility: X/10  
- Competitive Positioning: X/10
- Team Requirements: X/10
- Timing: X/10
- Overall Viability: X/10

Provide a final paragraph with your honest, unfiltered opinion on whether the founder should pursue this full-time, part-time, or pivot to something else. Be harsh if needed - false optimism helps no one.
