-- 1. Add Candidate Details to Documents
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS candidate_name TEXT,
ADD COLUMN IF NOT EXISTS candidate_email TEXT,
ADD COLUMN IF NOT EXISTS candidate_phone TEXT;

-- 2. Create Evidence Bookmarks Table
CREATE TABLE IF NOT EXISTS evidence_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  citation_text TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_evidence_bookmarks_job_id ON evidence_bookmarks(job_id);

-- Enable RLS for bookmarks
ALTER TABLE evidence_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" ON evidence_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON evidence_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookmarks" ON evidence_bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON evidence_bookmarks FOR DELETE USING (auth.uid() = user_id);


-- 3. Update match_document_chunks to support filtering by specific documents
-- We drop the old one (if signature changes, we might need DROP FUNCTION explicit signature, but CREATE OR REPLACE works if name/args match, if args change we need DROP)
-- Since we are adding an argument, we overload it or replace it. To be safe/clean, we can just create the new one.
-- Postgres supports function overloading. If we add an arg, it's a new function signature.
-- But Supabase RPC calls might be ambiguous if we don't drop the old one?
-- Let's try to DROP the old signature first to avoid confusion.

DROP FUNCTION IF EXISTS match_document_chunks(vector(1536), float, int, uuid);

CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_job_id uuid,
  filter_document_ids uuid[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float,
  filename text,
  page_number int
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity,
    documents.filename,
    document_chunks.page_number
  FROM document_chunks
  JOIN documents ON documents.id = document_chunks.document_id
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  AND document_chunks.job_id = filter_job_id
  AND (filter_document_ids IS NULL OR document_chunks.document_id = ANY(filter_document_ids))
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
