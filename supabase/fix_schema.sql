-- FORCE UPDATES to ensure all columns exist
-- This script is safe to run even if you already ran the previous one.

-- 1. Ensure 'jobs' table has all columns
alter table jobs add column if not exists resume_count int default 0;

-- 2. Ensure 'documents' table has all columns
alter table documents add column if not exists page_count int;
alter table documents add column if not exists text_content text;
alter table documents add column if not exists status text default 'processing';

-- 3. Ensure 'document_chunks' table has all columns (This was the main error source!)
alter table document_chunks add column if not exists chunk_index int;
alter table document_chunks add column if not exists page_number int;
alter table document_chunks add column if not exists embedding vector(1536);

-- 4. Ensure 'queries' table has all columns
alter table queries add column if not exists tokens_used int;

-- 5. Re-create the search function to match the columns precisely
create or replace function match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_job_id uuid
)
returns table (
  id uuid,
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
