-- Enhancement migration for evidence_bookmarks table
-- Safe to re-run (all operations use IF NOT EXISTS / IF EXISTS guards)

-- 1. Add missing columns to evidence_bookmarks
ALTER TABLE evidence_bookmarks
ADD COLUMN IF NOT EXISTS chunk_id UUID REFERENCES document_chunks(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS filename TEXT,
ADD COLUMN IF NOT EXISTS page_number INT,
ADD COLUMN IF NOT EXISTS content TEXT;

-- 2. Add composite index for faster lookups by job + user
CREATE INDEX IF NOT EXISTS idx_evidence_bookmarks_user_job
ON evidence_bookmarks(user_id, job_id);

-- 3. Add index on document_id for cascade lookups
CREATE INDEX IF NOT EXISTS idx_evidence_bookmarks_document_id
ON evidence_bookmarks(document_id);

-- 4. Ensure RLS policies exist (drop+recreate to be safe)
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON evidence_bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON evidence_bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON evidence_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON evidence_bookmarks;

CREATE POLICY "Users can view their own bookmarks" ON evidence_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON evidence_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookmarks" ON evidence_bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON evidence_bookmarks FOR DELETE USING (auth.uid() = user_id);
