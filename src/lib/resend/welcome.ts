import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  email: string, 
  name: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[RESEND] No API key — skipping welcome email');
    return;
  }

  const firstName = name?.split(' ')[0] || 'there';

  try {
    const result = await resend.emails.send({
      from: 'CandidRank <onboarding@resend.dev>',
      to: email,
      subject: 'Your CandidRank account is ready',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;
                    padding:32px 24px;color:#111;background:#fff;">
          <h2 style="font-size:20px;margin:0 0 12px;">
            Welcome to CandidRank, ${firstName}.
          </h2>
          <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 20px;">
            AI resume screening built for technical hiring. 
            Get started in 3 steps:
          </p>
          <ol style="color:#333;font-size:14px;line-height:2.2;
                     padding-left:20px;margin:0 0 24px;">
            <li>Create a job — e.g. <em>"Senior Backend Engineer"</em></li>
            <li>Upload PDF resumes for that role</li>
            <li>Ask: <em>"Who has the strongest Node.js experience?"</em></li>
          </ol>
          <a href="https://candidrank.cc/dashboard"
             style="display:inline-block;padding:11px 22px;
                    background:#2563EB;color:#fff;border-radius:7px;
                    text-decoration:none;font-size:14px;font-weight:600;">
            Open Dashboard →
          </a>
          <p style="margin-top:32px;font-size:13px;color:#999;
                    border-top:1px solid #eee;padding-top:16px;">
            Questions? Reply to this email directly.<br/>
            — Tashon, Founder of CandidRank
          </p>
        </div>
      `,
    });
    console.log('[RESEND] Welcome email sent:', result);
  } catch (err) {
    console.error('[RESEND] Failed to send welcome email:', err);
  }
}
