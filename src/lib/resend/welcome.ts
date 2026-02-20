import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[RESEND] RESEND_API_KEY not set, skipping welcome email");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const firstName = name?.split(" ")[0] || "there";

  try {
    const { data, error } = await resend.emails.send({
      from: "CandidRank <hello@candidrank.cc>",
      to: email,
      subject: "Your CandidRank account is ready 🎯",
      text: `Hi ${firstName},

Welcome to CandidRank — AI resume screening built for technical hiring.

Here's how to get started in 3 minutes:
1. Create a job (e.g., 'Senior Backend Engineer')
2. Upload up to 5 resumes as PDFs
3. Ask: 'Who has the strongest Node.js and system design experience?'

That's it. You'll get ranked candidates with cited proof from their resumes.

Questions? Reply to this email.

— Tashon, Founder of CandidRank`,
    });

    if (error) {
      console.error("[RESEND] Error sending welcome email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[RESEND] Exception sending welcome email:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
