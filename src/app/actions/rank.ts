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
        console.log(`[RANK] Generating embedding for: "${query}"`);
        const queryEmbedding = await createEmbedding(query);
        console.log(`[RANK] Query embedding dimension: ${queryEmbedding.length}`);

        // 2. Search for relevant chunks (broader search for ranking)
        console.log(`[RANK] Searching chunks for job ${jobId} with threshold 0.25...`);
        const { data: chunks, error: searchError } = await supabase.rpc(
            "match_document_chunks",
            {
                query_embedding: queryEmbedding,
                match_threshold: 0.1, // Lowered to catch more results
                match_count: 50,
                filter_job_id: jobId,
            }
        );

        if (searchError) {
            console.error("[RANK] Search RPC error:", searchError);
            return { success: false, error: `Search failed: ${searchError.message}` };
        }

        console.log(`[RANK] Found ${chunks?.length || 0} matching chunks`);

        if (!chunks || chunks.length === 0) {
            // Debug: Check if any chunks exist for this job at all
            const { data: debugChunks, error: debugError } = await supabase
                .from("document_chunks")
                .select("id, document_id, chunk_index")
                .eq("job_id", jobId)
                .limit(5);

            console.log(`[RANK] DEBUG: Total chunks in job: ${debugChunks?.length || 0}`, debugError || '');

            if (debugChunks && debugChunks.length > 0) {
                // Check if embeddings are null
                const { data: embCheck } = await supabase
                    .from("document_chunks")
                    .select("id, embedding")
                    .eq("job_id", jobId)
                    .limit(1);

                const hasEmbedding = embCheck && embCheck.length > 0 && embCheck[0].embedding !== null;
                console.log(`[RANK] DEBUG: Chunks have embeddings: ${hasEmbedding}`);

                if (!hasEmbedding) {
                    return { success: false, error: "Chunks exist but have no embeddings. Try re-uploading." };
                }
            } else {
                console.log("[RANK] DEBUG: No chunks found for this job at all");
            }

            return { success: true, candidates: [] };
        }

        // Log top similarities
        const topSimilarities = chunks.slice(0, 3).map((c: { similarity: number; filename: string }) =>
            `${c.filename}: ${c.similarity.toFixed(3)}`
        );
        console.log(`[RANK] Top 3 similarities: ${topSimilarities.join(', ')}`);

        // 3. Format contexts with document IDs for the ranking prompt
        const contexts = chunks.map(
            (chunk: {
                content: string;
                filename?: string;
                page_number?: number;
                document_id: string;
            }) => ({
                content: chunk.content,
                filename: chunk.filename || "Unknown",
                page: chunk.page_number ?? null,
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
        console.log(`[RANK] Calling GPT-4o-mini with ${contexts.length} contexts...`);
        const response = await getOpenAI().chat.completions.create({
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
            if(!content) {
                return { success: false, error: "No response from AI" };
            }

        // 6. Parse and validate
        const parsed = JSON.parse(content);
            const rawCandidates = parsed.candidates || [];
            console.log(`[RANK] GPT returned ${rawCandidates.length} candidates`);

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

            console.log(`[RANK] ✅ Done: ${candidates.length} candidates ranked`);
            return { success: true, candidates };
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            console.error("[RANK] ❌ Error:", error);
            return { success: false, error: errorMessage };
        }
    }
