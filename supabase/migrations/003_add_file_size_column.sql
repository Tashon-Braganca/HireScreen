-- Add file_size column to documents table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'file_size') THEN
        ALTER TABLE documents ADD COLUMN file_size INTEGER;
    END IF;
END $$;

-- Force schema cache reload by notifying pgrst
NOTIFY pgrst, 'reload config';
