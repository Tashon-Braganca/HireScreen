export type SubscriptionStatus = 'free' | 'pro' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_status: SubscriptionStatus;
  subscription_id: string | null;
  queries_used: number;
  jobs_created: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'active' | 'archived';
  resume_count: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  job_id: string;
  user_id: string;
  filename: string;
  file_size: number | null;
  page_count: number | null;
  text_content: string | null;
  status: 'processing' | 'ready' | 'failed';
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  job_id: string;
  chunk_index: number;
  content: string;
  page_number: number | null;
  embedding: number[];
  created_at: string;
}

export interface Query {
  id: string;
  job_id: string;
  user_id: string;
  question: string;
  answer: string;
  sources: QuerySource[];
  tokens_used: number | null;
  created_at: string;
}

export interface QuerySource {
  document_id: string;
  filename: string;
  page: number | null;
  snippet: string;
  similarity: number;
}

export interface UsageLimits {
  queriesUsed: number;
  queriesLimit: number;
  jobsCreated: number;
  jobsLimit: number;
  isPro: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}
