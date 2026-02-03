-- Add type column to jobs table for distinguishing jobs vs internships
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'job' CHECK (type IN ('job', 'internship'));

-- Update any existing jobs that don't have a type set
UPDATE jobs SET type = 'job' WHERE type IS NULL;

-- Create index for filtering by type
CREATE INDEX IF NOT EXISTS jobs_type_idx ON jobs(type);
