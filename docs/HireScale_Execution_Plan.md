# HireScale: Execution & Outreach Plan (The "How")

## 1. The Strategy: "Sniper Outreach"
**Goal:** 30% signup growth in 60 days.
**Target Audience:** 
1.  **Small Recruitment Agencies:** They bill clients per hire. Time = Money. They are desperate to filter candidates faster.
2.  **Solo Founders/SMBs:** Posting on LinkedIn/Indeed and getting drowned in spam.
3.  **"High Volume" Roles:** Call centers, Customer Support, Data Entry, Sales Reps.

---

## 2. Who to Contact (Specific Avatars)

### Avatar A: The "Drowning" Founder
*   **Where:** Twitter/X, LinkedIn.
*   **Signal:** They just posted "We are hiring a VA/Sales Rep!"
*   **Pain:** "RIP my inbox."
*   **Pitch:** "I see you have 50 comments. I built a tool to scan those resumes for you. Free."

### Avatar B: The Boutique Recruiter
*   **Where:** LinkedIn (Search: "Agency Owner", "Talent Acquisition Consultant").
*   **Pain:** "I spend 4 hours a day reading PDFs."
*   **Pitch:** "I built an AI that ranks resumes against your JD. Want to whitelist it for your agency?"

---

## 3. Outreach Scripts (Copy & Paste)

### Script 1: The "Cold DM" to Founders (Twitter/LinkedIn)
> "Hey [Name], saw you're hiring for [Role].
> 
> Usually, that gets flooded with spam applications. I’m building a small AI tool that filters 100 resumes in seconds to find the top 5 matches.
> 
> I’d love to run your first batch of applicants through it for free, just to see if it saves you time. No catch.
> 
> Link: [https://hire-screen.vercel.app](https://hire-screen.vercel.app) (or I can do it for you)."

### Script 2: The "Agency" Email
> **Subject:** Saving 10+ hours on your [Role] search
>
> Hi [Name],
>
> I run a small AI tool called HireScale. We specialize in high-volume screening for agencies.
> 
> Instead of manually opening every PDF for your new [Role] position, our AI reads them and ranks them 0-100 based on your exact job description.
>
> We handle the "Easy Apply" spam so you only talk to qualified candidates.
> 
> Can I send you a 30-second demo?"

---

## 4. Payment Solution: Lemon Squeezy (Critical)
**Problem:** You cannot use Stripe in India easily for global SaaS without a private limited company/LUT.
**Solution:** **Lemon Squeezy** (Merchant of Record).
*   **Why:** They handle the taxes (GST/VAT). They act as the "Reseller". You just get a payout.
*   **Status:** You already have `@lemonsqueezy/lemonsqueezy.js` in your `package.json`.
*   **Action:**
    1.  Create Lemon Squeezy account.
    2.  Create a "Product" (e.g., "50 Credits" or "Pro Plan").
    3.  Copy the `Variant ID`.
    4.  Use the API to generate a "Checkout Link" when a user clicks "Upgrade".
    5.  **Do not build a complex cart.** Just redirect them to the Lemon Squeezy hosted checkout.

---

## 5. 14-Day Sprint (from "Zero" to "Sales")

### Week 1: Polish & Payments
*   **Day 1 (Mon):** Fix "Bulk Upload". Ensure dragging 20 PDFs works. (Critical).
*   **Day 2 (Tue):** Set up Lemon Squeezy. Create "100 Resume Credits" product ($9 USD).
*   **Day 3 (Wed):** Connect Lemon Squeezy Webhook to Supabase (to add credits to user account upon payment).
*   **Day 4 (Thu):** Refine the AI Prompt. Test with "Bad" resumes to ensure they get low scores.
*   **Day 5 (Fri):** Add "Demo Mode" (Pre-loaded data so users see how it works without uploading).
*   **Day 6 (Sat):** Write Landing Page Copy. Focus on: "Filter 100 candidates in 5 minutes."
*   **Day 7 (Sun):** Rest / deploy to Vercel Production.

### Week 2: Aggressive Marketing
*   **Day 8 (Mon):** Find 10 Founders on Twitter/LinkedIn hiring *today*. Send Script 1.
*   **Day 9 (Tue):** Post on Reddit (r/SideProject, r/SaaS): "I built a tool to kill Easy Apply spam."
*   **Day 10 (Wed):** Find 10 Recruitment Agencies on LinkedIn. Send Script 2.
*   **Day 11 (Thu):** Create a "Fake" Job Post on a free board. See the spam come in. Use that data for a "Case Study" blog post.
*   **Day 12 (Fri):** Direct Outreach follow-ups.
*   **Day 13 (Sat):** Fix bugs reported by first users.
*   **Day 14 (Sun):** Review metrics. Aim for 10 Signups.

---

## 6. Success Metrics (KPIs)
*   **North Star:** **Resumes Processed**. (If this goes up, value is being delivered).
*   **Leading Metric:** Outreach DMs sent (Target: 5/day).
*   **Lagging Metric:** $ revenue (Target: First $10 sale).

## 7. Immediate Next Steps (Your To-Do)
1.  **Code:** Verify `react-dropzone` is configured for multiple file uploads.
2.  **Code:** Implement the Lemon Squeezy `checkout-link` generation.
3.  **Sales:** Go to LinkedIn search -> "Hiring [Role]" -> Sort by "Past 24 hours" -> Message the author.
