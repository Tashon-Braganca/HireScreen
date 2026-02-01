# GEMINI PROMPT: Competitive Intelligence & Market Validation Research

## INSTRUCTIONS FOR GEMINI

You are a senior market research analyst at a top-tier VC firm (Sequoia/a16z level) who specializes in HR Tech and AI SaaS. Your job is to produce an EXHAUSTIVE competitive intelligence report that will determine whether HireScreen should receive funding.

**CRITICAL: You MUST use web search extensively for this task. Search for:**
- Each competitor's website, pricing, features, reviews
- G2, Capterra, TrustRadius reviews for recruiting AI tools
- Recent funding rounds in HR tech space
- Industry reports on AI recruiting market
- Reddit/Twitter/LinkedIn discussions about resume screening tools
- News articles about recruiting AI trends

---

## CONTEXT: What is HireScreen?

**Product:** AI-powered resume screening tool
**How it works:** Upload PDFs of resumes -> Ask natural language questions like "Who has 5+ years React experience in SF?" -> Get ranked answers with citations to specific resumes
**Pricing:** Free tier (limited) + $29/month Pro tier
**Tech:** Next.js, Supabase, OpenAI embeddings + GPT-4o-mini, pgvector
**Target:** Small recruiters, agencies, startup founders hiring

---

## YOUR TASK: Generate a Competitive Research Report

### SECTION 1: Market Overview (Use Web Search)

**1.1 Market Size**
- Global recruiting software market size (current and projected)
- AI in recruiting market size specifically
- Resume screening software market segment
- Average spend per recruiter on tools
- Growth rates and trends

**1.2 Market Dynamics**
- Key drivers pushing AI adoption in recruiting
- Barriers to adoption
- Regulatory considerations (AI hiring laws, EEOC guidelines)
- Remote work impact on recruiting tools

**1.3 Recent Industry Events**
- Major acquisitions in HR tech (last 2 years)
- Notable startup failures and why
- Funding trends in the space

---

### SECTION 2: Direct Competitor Analysis (DEEP DIVE - 15+ Competitors)

For EACH competitor, research and document:

| Field | Details Required |
|-------|------------------|
| Company Name | Official name |
| Website | URL |
| Founded | Year |
| Funding | Total raised, last round, investors |
| Pricing | All tiers with exact prices |
| Target Customer | SMB/Mid-Market/Enterprise |
| Key Features | List 10+ features |
| Integrations | ATS systems they connect with |
| Reviews | G2/Capterra scores, common complaints |
| Strengths | What they do well |
| Weaknesses | Where they fall short |
| Why Customers Leave | Common churn reasons |

**COMPETITORS TO RESEARCH (search for each):**

1. **HireEZ** (formerly Hiretual)
2. **Ideal** (by Ceridian)
3. **Pymetrics** (by Harver)
4. **Humanly.io**
5. **Paradox (Olivia)**
6. **XOR.ai**
7. **Eightfold.ai**
8. **SeekOut**
9. **Fetcher**
10. **Textio**
11. **Beamery**
12. **Phenom**
13. **Greenhouse** (ATS with AI features)
14. **Lever** (ATS with AI features)
15. **Manatal**
16. **Zoho Recruit AI**
17. **ResumeParser.io** (API-focused)
18. **Affinda** (Resume parsing API)
19. **Sovren** (Resume parsing)
20. **Any new AI resume tools launched in 2024-2025**

---

### SECTION 3: Feature Comparison Matrix

Create a detailed comparison table:

| Feature | HireScreen | Competitor 1 | Competitor 2 | ... |
|---------|------------|--------------|--------------|-----|
| Natural Language Query | Yes | ? | ? | |
| Resume Parsing | Yes (PDF) | ? | ? | |
| Semantic Search | Yes (pgvector) | ? | ? | |
| Citation/Source Links | Yes | ? | ? | |
| Batch Upload | Yes (50) | ? | ? | |
| ATS Integration | No | ? | ? | |
| API Access | No | ? | ? | |
| White Label | No | ? | ? | |
| GDPR Compliant | Yes | ? | ? | |
| Pricing (entry) | $0 | ? | ? | |
| Pricing (pro) | $29 | ? | ? | |
| Free Trial | Yes (free tier) | ? | ? | |
| Self-Serve Signup | Yes | ? | ? | |

---

### SECTION 4: Pricing Intelligence

**4.1 Pricing Models in Market**
- Per seat pricing analysis
- Per job posting pricing
- Per resume/candidate pricing
- Platform/subscription pricing
- Usage-based pricing

**4.2 Price Sensitivity Analysis**
- What are recruiters currently paying?
- Price points that work for SMB vs Enterprise
- Is $29/month competitive, too cheap, or too expensive?
- Recommendations for pricing strategy

---

### SECTION 5: Unique Selling Propositions (USP) Analysis

**5.1 What Makes HireScreen Different**

Analyze each potential differentiator:

| Differentiator | HireScreen Advantage | Competitor Comparison | Defensibility |
|----------------|---------------------|----------------------|---------------|
| Simplicity | Upload + Ask, no setup | Most require complex onboarding | Medium |
| Price | $29/mo vs $100+/mo | Significantly cheaper | Low (easy to copy) |
| Natural Language | True conversational queries | Most use filters/boolean | Medium |
| Citations | Every answer cites source | Few provide this | High |
| Self-Serve | No sales calls needed | Most require demos | Medium |
| Speed | Start in 60 seconds | Days of onboarding | High |

**5.2 Features We Should Steal from Competitors**
- List 10 features competitors have that we should build
- Prioritize by: Impact vs Effort
- Explain why each matters

**5.3 Features We Should AVOID**
- List features that are over-engineered or unnecessary
- Explain why simplicity wins

---

### SECTION 6: Customer Review Analysis

**Search G2, Capterra, TrustRadius, Reddit, Twitter for:**

**6.1 What Recruiters LOVE about AI screening tools**
- List top 10 praised features with quotes
- What makes them recommend tools?

**6.2 What Recruiters HATE about current tools**
- List top 10 complaints with quotes
- Pain points we can solve

**6.3 Unmet Needs**
- What are recruiters asking for that no one provides?
- Feature requests in reviews
- Gaps in the market

---

### SECTION 7: Idea Validation Framework

**7.1 Problem Validation**
- Is resume screening actually a painful problem? (Evidence required)
- How many hours do recruiters spend on this?
- What's the cost of a bad hire?
- What's the cost of missing a good candidate?

**7.2 Solution Validation**
- Does AI actually help with resume screening? (Evidence required)
- Are recruiters willing to trust AI recommendations?
- What's the accuracy expectation?

**7.3 Market Validation**
- Are people actively searching for solutions? (Search volume data)
- Are competitors growing? (Evidence of market demand)
- Is the timing right for this product?

---

### SECTION 8: Honest Success/Failure Assessment

**BE BRUTALLY HONEST. This section determines funding decisions.**

#### REASONS HIRESCREEN WILL FAIL (Minimum 20 reasons)

For each reason, provide:
- The specific risk
- Evidence from research
- Probability: Low / Medium / High
- Impact: Low / Medium / High
- Can this be mitigated? How?

Example format:
```
1. RISK: Incumbents will copy our features
   EVIDENCE: Greenhouse added AI features in 2024, Lever launched AI screening
   PROBABILITY: High
   IMPACT: High
   MITIGATION: Move faster, build brand loyalty, focus on underserved segment
```

**Continue for 20+ risks covering:**
- Competition risks
- Technology risks
- Market risks
- Execution risks
- Financial risks
- Regulatory risks
- Team risks
- Timing risks

#### REASONS HIRESCREEN WILL SUCCEED (Minimum 20 reasons)

For each reason, provide:
- The specific advantage
- Evidence from research
- How to maximize this advantage
- Sustainability of the advantage

Example format:
```
1. ADVANTAGE: Dramatically simpler than competitors
   EVIDENCE: Average recruiter uses 12 tools, wants consolidation
   MAXIMIZE BY: Double down on UX, resist feature bloat
   SUSTAINABILITY: Medium - requires constant discipline
```

**Continue for 20+ advantages covering:**
- Product advantages
- Market timing advantages
- Business model advantages
- Distribution advantages
- Team advantages (if applicable)

---

### SECTION 9: Strategic Recommendations

Based on all research, provide:

**9.1 Positioning Recommendation**
- How should HireScreen position itself?
- Tagline suggestions (5 options)
- Key messaging pillars

**9.2 Target Segment Recommendation**
- Which customer segment to focus on first?
- Why this segment?
- How to expand from there

**9.3 Feature Prioritization**
- Top 5 features to build next (with reasoning)
- Features to explicitly NOT build

**9.4 Competitive Response Plan**
- How to respond when competitors copy us
- How to defend against price wars
- How to win enterprise deals against bigger players

---

### SECTION 10: Final Verdict

**INVESTOR DECISION FRAMEWORK**

Rate HireScreen on each dimension (1-10):

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Market Size | X/10 | |
| Market Timing | X/10 | |
| Competition Intensity | X/10 | |
| Product Differentiation | X/10 | |
| Business Model Viability | X/10 | |
| Team (solo founder) | X/10 | |
| Capital Efficiency | X/10 | |
| Path to Profitability | X/10 | |
| Exit Potential | X/10 | |
| **OVERALL** | X/10 | |

**FINAL RECOMMENDATION:**

Write a 500-word honest assessment answering:
1. Should this founder pursue HireScreen full-time?
2. What must change for this to be a fundable company?
3. What's the realistic outcome in 2 years? (Be specific about revenue/users)
4. What would make you change your mind (positive or negative)?

---

## OUTPUT REQUIREMENTS

1. Use proper Markdown with tables, headers, bullet points
2. Include specific data points from web searches
3. Cite sources where possible (company websites, review sites, articles)
4. Total length: 6000+ words
5. Be brutally honest - this report determines real decisions
6. Include TL;DR summary at the top
