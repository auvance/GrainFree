-- Create saved_meals table matching the app's expected schema.
-- Run this entire file once in Supabase Dashboard → SQL Editor.
-- (Dropping first ensures correct columns even if the table existed with a different schema.)

DROP TABLE IF EXISTS saved_meals;

CREATE TABLE saved_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id bigint NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, meal_id)
);

-- Optional: add these if you want to store image and calories later
-- ALTER TABLE saved_meals ADD COLUMN IF NOT EXISTS image text;
-- ALTER TABLE saved_meals ADD COLUMN IF NOT EXISTS calories numeric;

-- Enable Row Level Security so users only see their own rows
ALTER TABLE saved_meals ENABLE ROW LEVEL SECURITY;

-- Policy: users can select/insert/update/delete only their own rows
DROP POLICY IF EXISTS "Users can manage own saved_meals" ON saved_meals;
CREATE POLICY "Users can manage own saved_meals"
  ON saved_meals
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant usage to anon and authenticated (Supabase default roles)
GRANT ALL ON saved_meals TO authenticated;
GRANT ALL ON saved_meals TO service_role;
