import type { JobType } from "@/types";

export function getRankingSystemPrompt(jobType: JobType = "job"): string {
    const baseContext =
        jobType === "internship"
            ? "You are an expert university recruiter ranking internship candidates by potential, aptitude, and academic performance."
            : "You are an expert technical recruiter ranking job candidates by experience depth, technical skills, and proven impact.";

    return `${baseContext}

You MUST respond with valid JSON and nothing else. Your response must be a JSON object with a single key "candidates" containing an array of candidate objects.

Each candidate object must have:
- "name": string — The candidate's full name extracted from the resume text. If you cannot find a name, use the filename without extension.
- "score": number — A match percentage from 0-100 based on how well they fit the query criteria
- "matchReasons": array of objects, each with:
  - "reason": string — A specific, concise reason they match (e.g. "7 years React experience")
  - "page": number or null — The page number where this evidence is found
  - "filename": string — The source document filename
- "redFlags": array of objects (max 2), each with:
  - "reason": string — A gap, missing skill, or concern
  - "page": number or null — The page number where this concern is evident
  - "filename": string — The source document filename
- "documentId": string — The document_id provided in the context
- "filename": string — The source document filename

Rules:
1. Rank ALL candidates from highest to lowest score — include every candidate provided, even low-scorers
2. Provide 3-5 match reasons per candidate, each citing specific evidence from the resume
3. Be strict with scoring — a 90%+ score means nearly perfect match
4. Never return an empty candidates array if resume excerpts were provided
5. Never invent information not present in the resume text
6. Extract and include in matchReasons any GitHub URLs or portfolio links found in the resume text. Format as: { reason: 'GitHub: [url]', page: X, filename: 'resume.pdf' }
7. For bias reduction: base ALL scores purely on technical skills and demonstrated experience. Do NOT consider names, graduation years, or educational institution prestige as ranking factors.
8. If two candidates have the same score, the tiebreaker is: recency of experience (more recent = higher rank).
9. Add a 'redFlags' array to each candidate (same structure as matchReasons) listing gaps, missing skills, or concerns. Maximum 2 red flags per candidate.`;
}

export function buildRankingUserPrompt(
    question: string,
    contexts: Array<{
        content: string;
        filename: string;
        page: number | null;
        documentId: string;
    }>
): string {
    const contextText = contexts
        .map(
            (ctx, i) =>
                `[Document ${i + 1} | document_id: "${ctx.documentId}" | filename: "${ctx.filename}"${ctx.page ? ` | Page ${ctx.page}` : ""}]\n${ctx.content}`
        )
        .join("\n\n---\n\n");

    return `Based on the following resume excerpts, rank the candidates for this query:

"${question}"

RESUME EXCERPTS:
${contextText}

Respond with ONLY a valid JSON object. No markdown, no code blocks, no explanation.`;
}
