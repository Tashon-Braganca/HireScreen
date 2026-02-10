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
- "documentId": string — The document_id provided in the context
- "filename": string — The source document filename

Rules:
1. Rank candidates from highest to lowest score
2. Only include candidates who have at least some relevance to the query (score > 30)
3. Provide 2-4 match reasons per candidate, each citing specific evidence from the resume
4. Be strict with scoring — a 90%+ score means nearly perfect match
5. If no candidates match, return {"candidates": []}
6. Never invent information not present in the resume text`;
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
