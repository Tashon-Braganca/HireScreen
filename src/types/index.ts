export type SubscriptionStatus = 'free' | 'pro' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_status: SubscriptionStatus;
  subscription_id: string | null;
  queries_used: number;
  last_query_reset_date?: string;
  jobs_created: number;
  created_at: string;
  updated_at: string;
}

export type JobType = 'job' | 'internship';

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: JobType;
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
  file_path: string | null;
  page_count: number | null;
  text_content: string | null;
  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;
  status: 'processing' | 'ready' | 'failed';
  error_message?: string | null;
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
  score?: number;
  candidate_name?: string | null;
  candidate_email?: string | null;
  excerpt?: string;
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

export interface MatchReason {
  reason: string;
  page: number | null;
  filename: string;
}

export interface RankedCandidate {
  rank: number;
  name: string;
  score: number;
  matchReasons: MatchReason[];
  redFlags: MatchReason[];
  documentId: string;
  filename: string;
}

export type ExportFormat = 'csv' | 'clipboard';

export interface ImportedCandidate {
  id: string;
  job_id: string;
  user_id: string;
  name: string;
  email: string;
  resume_url: string | null;
  notes: string | null;
  created_at: string;
}

// --- Evidence Bookmarks ---

export interface EvidenceBookmark {
  id: string;
  user_id: string;
  job_id: string;
  document_id: string | null;
  chunk_id: string | null;
  citation_text: string;
  filename: string | null;
  page_number: number | null;
  content: string | null;
  comment: string | null;
  created_at: string;
}

// --- Compare ---

export interface CompareCriteria {
  label: string;
  scores: Record<string, number>; // documentId → score (0-100)
  notes: Record<string, string>;  // documentId → note
}

export interface CompareResult {
  candidates: CompareSummary[];
  criteria: CompareCriteria[];
  winner: string | null; // documentId
  reasoning: string;
}

export interface CompareSummary {
  documentId: string;
  name: string;
  filename: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  highlights: string[];
}

// --- Center Panel ---

export type CenterTab = 'ranked' | 'compare' | 'history' | 'import' | `pdf-${string}`;

// --- Filters ---

export interface FilterState {
  authorized: 'all' | 'authorized' | 'sponsorship';
  location: string;
  yoe: string;
  skills: string[];
}
