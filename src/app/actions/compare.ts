"use server";

import { createClient } from "@/lib/supabase/server";
import type { CompareResult, CompareSummary, CompareCriteria } from "@/types";
import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiInstance;
}

// --- Compare candidates ---

export async function compareCandidates(
  documentIds: string[],
  jobId: string
): Promise<{ success: boolean; result?: CompareResult; error?: string }> {
  try {
    if (documentIds.length < 2 || documentIds.length > 4) {
      return { success: false, error: "Select 2-4 candidates to compare" };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // Verify job ownership
    const { data: job } = await supabase
      .from("jobs")
      .select("id, title, description")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (!job) return { success: false, error: "Job not found" };

    // Fetch documents with their text content
    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("id, filename, candidate_name, candidate_email, text_content")
      .in("id", documentIds)
      .eq("job_id", jobId);

    if (docsError || !documents || documents.length < 2) {
      return { success: false, error: "Could not load candidate documents" };
    }

    // Also fetch top chunks per document for richer context
    const chunkPromises = documentIds.map(async (docId) => {
      const { data } = await supabase
        .from("document_chunks")
        .select("content, page_number")
        .eq("document_id", docId)
        .eq("job_id", jobId)
        .order("chunk_index", { ascending: true })
        .limit(8);
      return { docId, chunks: data ?? [] };
    });

    const chunkResults = await Promise.all(chunkPromises);
    const chunkMap = new Map(chunkResults.map((r) => [r.docId, r.chunks]));

    // Build compare prompt
    const candidateProfiles = documents.map((doc: { id: string; filename: string; candidate_name: string | null; candidate_email: string | null; text_content: string | null }) => {
      const chunks = chunkMap.get(doc.id) ?? [];
      const chunkText = chunks
        .map((c: { content: string; page_number: number | null }, i: number) => `[Chunk ${i + 1}${c.page_number ? `, p${c.page_number}` : ""}]: ${c.content}`)
        .join("\n");

      return `## Candidate: ${doc.candidate_name || doc.filename}
Document ID: ${doc.id}
Filename: ${doc.filename}
${doc.candidate_email ? `Email: ${doc.candidate_email}` : ""}

### Resume Content:
${doc.text_content ? doc.text_content.slice(0, 3000) : chunkText}
`;
    });

    const systemPrompt = `You are an expert hiring comparison assistant for CandidRank. 
Compare candidates objectively based on their resumes. Be fair, fact-based, and avoid bias.

You must return a valid JSON object with this exact structure:
{
  "candidates": [
    {
      "documentId": "uuid",
      "name": "Candidate Name",
      "filename": "file.pdf",
      "overallScore": 0-100,
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1"],
      "highlights": ["notable achievement or skill"]
    }
  ],
  "criteria": [
    {
      "label": "Technical Skills",
      "scores": { "docId1": 85, "docId2": 70 },
      "notes": { "docId1": "Strong in React", "docId2": "Good Python skills" }
    }
  ],
  "winner": "documentId of best candidate or null if too close",
  "reasoning": "Brief explanation of comparison outcome"
}

Use these standard criteria: Technical Skills, Experience Level, Education, Communication/Soft Skills, Role Fit.
Score each candidate 0-100 on each criterion.`;

    const userPrompt = `Compare these ${documents.length} candidates for the role: "${job.title}"
${job.description ? `\nJob Description: ${job.description.slice(0, 1000)}` : ""}

${candidateProfiles.join("\n---\n")}

Return ONLY the JSON object, no markdown fences, no explanation outside JSON.`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { success: false, error: "No response from AI" };

    let parsed: CompareResult;
    try {
      parsed = JSON.parse(raw) as CompareResult;
    } catch {
      console.error("[compare] Failed to parse LLM response:", raw);
      return { success: false, error: "Failed to parse comparison result" };
    }

    // Validate structure
    if (!parsed.candidates || !Array.isArray(parsed.candidates)) {
      return { success: false, error: "Invalid comparison result structure" };
    }

    // Ensure all expected fields
    const result: CompareResult = {
      candidates: parsed.candidates.map((c: CompareSummary) => ({
        documentId: c.documentId || "",
        name: c.name || "Unknown",
        filename: c.filename || "",
        overallScore: typeof c.overallScore === "number" ? c.overallScore : 0,
        strengths: Array.isArray(c.strengths) ? c.strengths : [],
        weaknesses: Array.isArray(c.weaknesses) ? c.weaknesses : [],
        highlights: Array.isArray(c.highlights) ? c.highlights : [],
      })),
      criteria: (parsed.criteria || []).map((cr: CompareCriteria) => ({
        label: cr.label || "",
        scores: cr.scores || {},
        notes: cr.notes || {},
      })),
      winner: parsed.winner || null,
      reasoning: parsed.reasoning || "",
    };

    return { success: true, result };
  } catch (err) {
    console.error("[compare] compareCandidates exception:", err);
    return { success: false, error: "Comparison failed. Please try again." };
  }
}
