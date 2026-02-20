"use server";

import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { getRankingSystemPrompt, buildRankingUserPrompt } from "@/lib/openai/ranking-prompt";
import { checkUserRateLimit } from "@/lib/ratelimit";
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
): Promise<{ success: boolean; candidates?: RankedCandidate[]; error?: string; warning?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const rateLimit = checkUserRateLimit(user.id);
    if (!rateLimit.allowed) {
        return {
            success: false,
            error: `Too many requests. Please wait ${rateLimit.resetInSeconds} seconds.`,
        };
    }

    try {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[RANK] Generating embedding for: "${query}"`);
        }
        const queryEmbedding = await createEmbedding(query);
        if (process.env.NODE_ENV === 'development') {
            console.log(`[RANK] Query embedding dimension: ${queryEmbedding.length}`);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[RANK] Searching chunks for job ${jobId} with threshold 0.25...`);
        }
        const { data: chunks, error: searchError } = await supabase.rpc(
            "match_document_chunks",
            {
                query_embedding: `[${queryEmbedding.join(',')}]`,
                match_threshold: 0.25,
                match_count: 60,
                filter_job_id: jobId,
            }
        );

        if (searchError) {
            if (process.env.NODE_ENV === 'development') {
                console.error("[RANK] Search RPC error:", searchError);
            }
            return { success: false, error: `Search failed: ${searchError.message}` };
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[RANK] Found ${chunks?.length || 0} matching chunks`);
        }

        if (!chunks || chunks.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                const { data: debugChunks, error: debugError } = await supabase
                    .from("document_chunks")
                    .select("id, document_id, chunk_index")
                    .eq("job_id", jobId)
                    .limit(5);

                console.log(`[RANK] DEBUG: Total chunks in job: ${debugChunks?.length || 0}`, debugError || '');

                if (debugChunks && debugChunks.length > 0) {
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
            }

            return { success: true, candidates: [] };
        }

        // Deduplicate by document_id - keep top 3 highest-similarity chunks per document
        const chunksByDoc = new Map<string, Array<{ chunk: typeof chunks[0]; similarity: number }>>();
        for (const chunk of chunks) {
            const docId = chunk.document_id;
            if (!chunksByDoc.has(docId)) {
                chunksByDoc.set(docId, []);
            }
            chunksByDoc.get(docId)!.push({ chunk, similarity: chunk.similarity });
        }

        const deduplicatedChunks: typeof chunks = [];
        const docChunksArray = Array.from(chunksByDoc.values());
        for (const docChunks of docChunksArray) {
            docChunks.sort((a, b) => b.similarity - a.similarity);
            const topChunks = docChunks.slice(0, 3).map(dc => dc.chunk);
            deduplicatedChunks.push(...topChunks);
        }

        if (process.env.NODE_ENV === 'development') {
            const topSimilarities = deduplicatedChunks.slice(0, 3).map((c: { similarity: number; filename: string }) =>
                `${c.filename}: ${c.similarity.toFixed(3)}`
            );
            console.log(`[RANK] Top 3 similarities after dedup: ${topSimilarities.join(', ')}`);
        }

        // Pre-check: if chunks.length > 0 but all unique document_ids < 2, return warning
        const uniqueDocIds = new Set(deduplicatedChunks.map((c: { document_id: string }) => c.document_id));
        if (deduplicatedChunks.length > 0 && uniqueDocIds.size < 2) {
            return { 
                success: true, 
                candidates: [], 
                warning: "Only 1 resume found. Upload more resumes to compare." 
            };
        }

        const contexts = deduplicatedChunks.map(
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

        const { data: job } = await supabase
            .from("jobs")
            .select("type")
            .eq("id", jobId)
            .single();

        const systemPrompt = getRankingSystemPrompt(job?.type || "job");
        const userMessage = buildRankingUserPrompt(query, contexts);
        if (process.env.NODE_ENV === 'development') {
            console.log(`[RANK] Calling GPT-4o-mini with ${contexts.length} contexts...`);
        }
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            temperature: 0.2,
            max_completion_tokens: 2000,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            return { success: false, error: "No response from AI" };
        }

        const parsed = JSON.parse(content);
        const rawCandidates = parsed.candidates || [];
        if (process.env.NODE_ENV === 'development') {
            console.log(`[RANK] GPT returned ${rawCandidates.length} candidates`);
        }

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
                    redFlags?: Array<{
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
                redFlags: (c.redFlags || []).map((r) => ({
                    reason: r.reason || "",
                    page: r.page || null,
                    filename: r.filename || "",
                })),
                documentId: c.documentId || "",
                filename: c.filename || "",
            })
        );

        await supabase.from("queries").insert({
            job_id: jobId,
            user_id: user.id,
            question: query,
            answer: JSON.stringify(candidates),
            tokens_used: response.usage?.total_tokens || 0,
        });

        if (process.env.NODE_ENV === 'development') {
            console.log(`[RANK] ✅ Done: ${candidates.length} candidates ranked`);
        }
        return { success: true, candidates };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        if (process.env.NODE_ENV === 'development') {
            console.error("[RANK] ❌ Error:", error);
        }
        return { success: false, error: errorMessage };
    }
}
