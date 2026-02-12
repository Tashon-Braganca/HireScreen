import OpenAI from 'openai';
import { getSystemPrompt, buildUserPrompt } from './prompts';
import type { JobType } from '@/types';

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
  const systemPrompt = getSystemPrompt(jobType);
  const userMessage = buildUserPrompt(question, contexts);

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_completion_tokens: 2000,
  });

  return {
    answer: response.choices[0].message.content || 'Unable to generate answer.',
    tokensUsed: response.usage?.total_tokens || 0,
  };
}
