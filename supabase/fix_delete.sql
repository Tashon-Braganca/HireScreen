-- Fix: Add DELETE policy for document_chunks (CASCADE from documents needs this)
drop policy if exists "Users can delete chunks for their jobs" on document_chunks;

create policy "Users can delete chunks for their jobs" on document_chunks for delete using (
  exists (select 1 from jobs where jobs.id = document_chunks.job_id and jobs.user_id = auth.uid())
);

-- Fix: Add decrement_resume_count function
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
