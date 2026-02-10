-- ============================================================
-- COMPREHENSIVE FIX: Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- 1. Ensure all columns exist on document_chunks
alter table document_chunks add column if not exists page_number int;
alter table document_chunks add column if not exists chunk_index int;
alter table document_chunks add column if not exists embedding vector(1536);

-- 2. Ensure documents has all columns
alter table documents add column if not exists page_count int;
alter table documents add column if not exists text_content text;
alter table documents add column if not exists status text default 'processing';

-- 3. Ensure jobs has resume_count
alter table jobs add column if not exists resume_count int default 0;

-- 4. Fix match_document_chunks to ALSO return document_id (needed for ranking)
-- MUST DROP FIRST because return type changed (added document_id)
drop function if exists match_document_chunks(vector, double precision, integer, uuid);

create or replace function match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_job_id uuid
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float,
  filename text,
  page_number int
)
language plpgsql
as $$
begin
  return query
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity,
    documents.filename,
    document_chunks.page_number
  from document_chunks
  join documents on documents.id = document_chunks.document_id
  where 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  and document_chunks.job_id = filter_job_id
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. DELETE RLS policy for document_chunks (needed for cascade deletes)
drop policy if exists "Users can delete chunks for their jobs" on document_chunks;

create policy "Users can delete chunks for their jobs" on document_chunks for delete using (
  exists (select 1 from jobs where jobs.id = document_chunks.job_id and jobs.user_id = auth.uid())
);

-- 6. Decrement resume count function
create or replace function decrement_resume_count(job_id_input uuid)
returns void
language plpgsql
as $$
begin
  update jobs
  set resume_count = greatest(0, resume_count - 1)
  where id = job_id_input;
end;
$$;

-- 7. Increment resume count function (ensure it exists)
create or replace function increment_resume_count(job_id_input uuid)
returns void
language plpgsql
as $$
begin
  update jobs
  set resume_count = resume_count + 1
  where id = job_id_input;
end;
$$;
