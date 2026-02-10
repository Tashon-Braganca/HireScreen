"use server";

import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { getRankingSystemPrompt, buildRankingUserPrompt } from "@/lib/openai/ranking-prompt";
import type { RankedCandidate } from "@/types";
import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;
function getOpenAI(): OpenAI {
    if (!openaiInstance) {
        openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openaiInstance;
}

export async function rankCandidates(
    query: string,
    jobId: string
): Promise<{ success: boolean; candidates?: RankedCandidate[]; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Embed the query
        const queryEmbedding = await createEmbedding(query);

        // 2. Search for relevant chunks (broader search for ranking)
        const { data: chunks, error: searchError } = await supabase.rpc(
            "match_document_chunks",
            {
                query_embedding: queryEmbedding,
                match_threshold: 0.35,
                match_count: 30,
                filter_job_id: jobId,
            }
        );

        if (searchError) {
            console.error("Search error:", searchError);
            return { success: false, error: `Search failed: ${searchError.message}` };
        }

        if (!chunks || chunks.length === 0) {
            return { success: true, candidates: [] };
        }

        // 3. Format contexts with document IDs for the ranking prompt
        const contexts = chunks.map(
            (chunk: {
                content: string;
                filename?: string;
                page_number: number;
                document_id: string;
            }) => ({
                content: chunk.content,
                filename: chunk.filename || "Unknown",
                page: chunk.page_number,
                documentId: chunk.document_id,
            })
        );

        // 4. Get job details for type-specific prompting
        const { data: job } = await supabase
            .from("jobs")
            .select("type")
            .eq("id", jobId)
            .single();

        const systemPrompt = getRankingSystemPrompt(job?.type || "job");
        const userMessage = buildRankingUserPrompt(query, contexts);

        // 5. Call GPT with JSON mode
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            temperature: 0.2,
            max_tokens: 2000,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            return { success: false, error: "No response from AI" };
        }

        // 6. Parse and validate
        const parsed = JSON.parse(content);
        const rawCandidates = parsed.candidates || [];

        const candidates: RankedCandidate[] = rawCandidates.map(
            (
                c: {
                    name?: string;
                    score?: number;
                    matchReasons?: Array<{
                        reason?: string;
                        page?: number | null;
                        filename?: string;
                    }>;
                    documentId?: string;
                    filename?: string;
                },
                i: number
            ) => ({
                rank: i + 1,
                name: c.name || "Unknown Candidate",
                score: Math.min(100, Math.max(0, c.score || 0)),
                matchReasons: (c.matchReasons || []).map((r) => ({
                    reason: r.reason || "",
                    page: r.page || null,
                    filename: r.filename || "",
                })),
                documentId: c.documentId || "",
                filename: c.filename || "",
            })
        );

        // 7. Save query for history
        await supabase.from("queries").insert({
            job_id: jobId,
            user_id: user.id,
            question: query,
            answer: JSON.stringify(candidates),
            tokens_used: response.usage?.total_tokens || 0,
        });

        return { success: true, candidates };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Rank Action Error:", error);
        return { success: false, error: errorMessage };
    }
}
