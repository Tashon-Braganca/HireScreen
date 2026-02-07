-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create tables only if they don't exist
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  type text check (type in ('job', 'internship')),
  status text check (status in ('active', 'archived')) default 'active',
  resume_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  filename text not null,
  file_size int,
  page_count int,
  text_content text,
  status text check (status in ('processing', 'ready', 'failed')) default 'processing',
  created_at timestamptz default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade not null,
  chunk_index int not null,
  content text not null,
  page_number int,
  embedding vector(1536), -- 1536 dimensions for text-embedding-3-small
  created_at timestamptz default now()
);

create table if not exists queries (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  question text not null,
  answer text not null,
  tokens_used int,
  created_at timestamptz default now()
);

-- ALWAYS run these function creations (OR REPLACE makes them safe)
-- Function to search for document chunks similar to a query embedding
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

-- Function to increment resume count
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

-- Enable Row Level Security (RLS) - Safe to run multiple times? No, idempotent check needed ideally, 
-- but simpler to just catch errors or ignore if already enabled.
-- Postgres doesn't have "ALTER TABLE IF EXISTS ... ENABLE RLS". 
-- But running "ENABLE ROW LEVEL SECURITY" multiple times is safe (it's a no-op if already enabled).
alter table jobs enable row level security;
alter table documents enable row level security;
alter table document_chunks enable row level security;
alter table queries enable row level security;

-- Drop policies first to avoid "policy already exists" errors, then recreate
drop policy if exists "Users can view their own jobs" on jobs;
drop policy if exists "Users can insert their own jobs" on jobs;
drop policy if exists "Users can update their own jobs" on jobs;

create policy "Users can view their own jobs" on jobs for select using (auth.uid() = user_id);
create policy "Users can insert their own jobs" on jobs for insert with check (auth.uid() = user_id);
create policy "Users can update their own jobs" on jobs for update using (auth.uid() = user_id);

drop policy if exists "Users can view their own documents" on documents;
drop policy if exists "Users can insert their own documents" on documents;
drop policy if exists "Users can update their own documents" on documents;
drop policy if exists "Users can delete their own documents" on documents;

create policy "Users can view their own documents" on documents for select using (auth.uid() = user_id);
create policy "Users can insert their own documents" on documents for insert with check (auth.uid() = user_id);
create policy "Users can update their own documents" on documents for update using (auth.uid() = user_id);
create policy "Users can delete their own documents" on documents for delete using (auth.uid() = user_id);

drop policy if exists "Users can view chunks for their jobs" on document_chunks;
drop policy if exists "Users can insert chunks for their jobs" on document_chunks;

create policy "Users can view chunks for their jobs" on document_chunks for select using (
  exists (select 1 from jobs where jobs.id = document_chunks.job_id and jobs.user_id = auth.uid())
);
create policy "Users can insert chunks for their jobs" on document_chunks for insert with check (
  exists (select 1 from jobs where jobs.id = document_chunks.job_id and jobs.user_id = auth.uid())
);

drop policy if exists "Users can view their own queries" on queries;
drop policy if exists "Users can insert their own queries" on queries;

create policy "Users can view their own queries" on queries for select using (auth.uid() = user_id);
create policy "Users can insert their own queries" on queries for insert with check (auth.uid() = user_id);
