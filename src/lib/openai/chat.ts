import OpenAI from 'openai';

// Lazy initialization to avoid build-time API key checks
let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

const SYSTEM_PROMPT = `You are a resume screening assistant for recruiters.

CONTEXT:
The user has uploaded multiple resumes for a job opening.
You will be given relevant excerpts from these resumes.

INSTRUCTIONS:
1. Answer the user's question based ONLY on the provided resume excerpts.
2. Be specific and cite your sources using this format: [Source: filename.pdf, Page X]
3. If asked to compare or rank candidates, provide a numbered list.
4. If the information is not in the resumes, say "I couldn't find this information in the uploaded resumes."
5. Never make up information that isn't in the documents.
6. Keep answers concise but complete.

FORMAT:
- Use bullet points for lists
- Always include at least one citation when information is found
- End with a confidence indicator: High/Medium/Low based on how well the excerpts match the question`;

interface ChatContext {
  content: string;
  filename: string;
  page: number | null;
}

export async function generateAnswer(
  question: string,
  contexts: ChatContext[]
): Promise<{ answer: string; tokensUsed: number }> {
  const contextText = contexts
    .map(
      (ctx, i) =>
        `[Document ${i + 1}: ${ctx.filename}${ctx.page ? `, Page ${ctx.page}` : ''}]\n${ctx.content}`
    )
    .join('\n\n---\n\n');

  const userMessage = `RESUME EXCERPTS:
---
${contextText}
---

USER QUESTION:
${question}

Provide a helpful, accurate answer with citations.`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4.1-nano',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  return {
    answer: response.choices[0].message.content || 'Unable to generate answer.',
    tokensUsed: response.usage?.total_tokens || 0,
  };
}
