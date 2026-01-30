-- Add last_query_reset_date to profiles for tracking monthly usage windows
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_query_reset_date TIMESTAMPTZ DEFAULT NOW();

-- Function to check and reset query limits
CREATE OR REPLACE FUNCTION check_and_reset_query_limit(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  v_last_reset TIMESTAMPTZ;
  v_interval INTERVAL := INTERVAL '1 month';
BEGIN
  SELECT last_query_reset_date INTO v_last_reset
  FROM profiles
  WHERE id = user_id_param;

  -- If null (shouldn't be due to default) or older than 1 month, reset
  IF v_last_reset IS NULL OR v_last_reset < NOW() - v_interval THEN
    UPDATE profiles
    SET 
      queries_used = 0,
      last_query_reset_date = NOW()
    WHERE id = user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
