import OpenAI from 'openai';
import { getSystemPrompt, buildUserPrompt } from './prompts';
import type { JobType } from '@/types';

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

interface ChatContext {
  content: string;
  filename: string;
  page: number | null;
}

export async function generateAnswer(
  question: string,
  contexts: ChatContext[],
  jobType: JobType = 'job'
): Promise<{ answer: string; tokensUsed: number }> {
  try {
    const systemPrompt = getSystemPrompt(jobType);
    const userMessage = buildUserPrompt(question, contexts);

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_completion_tokens: 2000,
    }, {
      signal: AbortSignal.timeout(15000),
    });

    return {
      answer: response.choices[0].message.content || 'Unable to generate answer.',
      tokensUsed: response.usage?.total_tokens || 0,
    };
  } catch {
    return { answer: "Query failed. Please try again.", tokensUsed: 0 };
  }
}
