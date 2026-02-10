/**
 * Extract candidate contact info (name, email, phone) from resume text.
 * Uses lightweight regex heuristics — no AI calls needed.
 */

export interface ContactInfo {
    name: string | null;
    email: string | null;
    phone: string | null;
}

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

const PHONE_RE =
    /(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/;

// Words that indicate a line is NOT a name
const SKIP_WORDS = new Set([
    "resume",
    "curriculum",
    "vitae",
    "cv",
    "objective",
    "summary",
    "experience",
    "education",
    "skills",
    "address",
    "phone",
    "email",
    "linkedin",
    "github",
    "portfolio",
    "references",
    "page",
    "http",
    "www",
    "dear",
    "hiring",
    "manager",
]);

export function extractContactInfo(text: string): ContactInfo {
    const result: ContactInfo = { name: null, email: null, phone: null };

    // --- Email ---
    const emailMatch = text.match(EMAIL_RE);
    if (emailMatch) {
        result.email = emailMatch[0].toLowerCase();
    }

    // --- Phone ---
    // Search first 1500 chars (phone is usually near the top)
    const phoneSection = text.slice(0, 1500);
    const phoneMatch = phoneSection.match(PHONE_RE);
    if (phoneMatch) {
        const cleaned = phoneMatch[0].replace(/[\s\-().]/g, "");
        // Only accept if it has 7-15 digits (valid phone range)
        if (cleaned.replace(/\D/g, "").length >= 7 && cleaned.replace(/\D/g, "").length <= 15) {
            result.phone = phoneMatch[0].trim();
        }
    }

    // --- Name ---
    // Heuristic: first non-empty line in the first 500 chars that:
    // - is 2-50 chars long
    // - doesn't contain @ or http
    // - doesn't start with a skip word
    // - looks like a name (mostly letters and spaces)
    const lines = text.slice(0, 500).split(/\n/);
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line.length < 2 || line.length > 50) continue;
        if (line.includes("@") || line.includes("http")) continue;

        const lower = line.toLowerCase();
        const hasSkipWord = Array.from(SKIP_WORDS).some(
            (w) => lower === w || lower.startsWith(w + " ") || lower.startsWith(w + ":")
        );
        if (hasSkipWord) continue;

        // Must be mostly letters/spaces (allow periods, hyphens for names like J. Smith or Mary-Jane)
        const letterRatio =
            line.replace(/[^a-zA-Z\s.\-']/g, "").length / line.length;
        if (letterRatio < 0.75) continue;

        // Must have at least 2 words (first + last name)
        const words = line.split(/\s+/).filter((w) => w.length > 0);
        if (words.length < 2 || words.length > 5) continue;

        // Capitalize properly
        result.name = words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        break;
    }

    return result;
}
