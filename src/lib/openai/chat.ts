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

async function callWithFallback<T>(primaryFn: () => Promise<T>): Promise<T> {
  try {
    return await primaryFn();
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status;
    if (status === 429 || status === 404) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await primaryFn();
    }
    throw error;
  }
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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const systemPrompt = getSystemPrompt(jobType);
    const userMessage = buildUserPrompt(question, contexts);

    const response = await callWithFallback(() =>
      getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_completion_tokens: 600,
      }, {
        signal: controller.signal,
      })
    );

    return {
      answer: response.choices[0].message.content || 'No answer generated.',
      tokensUsed: response.usage?.total_tokens || 0,
    };
  } catch (err: unknown) {
    if ((err as Error).name === 'AbortError') {
      return { answer: 'Request timed out. Please try a simpler question.', tokensUsed: 0 };
    }
    return { answer: "Query failed. Please try again.", tokensUsed: 0 };
  } finally {
    clearTimeout(timeoutId);
  }
}
