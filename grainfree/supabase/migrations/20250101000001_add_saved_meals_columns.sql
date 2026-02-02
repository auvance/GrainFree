-- Add missing columns to your existing saved_meals table.
-- Your table has: id, user_id, title, description, created_at.
-- The app needs meal_id (Spoonacular recipe id for "View" link), and optionally image + calories.
-- Run this once in Supabase Dashboard → SQL Editor.

ALTER TABLE saved_meals ADD COLUMN IF NOT EXISTS meal_id bigint;
ALTER TABLE saved_meals ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE saved_meals ADD COLUMN IF NOT EXISTS calories numeric;

-- Prevent duplicate saves of the same recipe per user (optional)
-- CREATE UNIQUE INDEX IF NOT EXISTS saved_meals_user_meal_key ON saved_meals (user_id, meal_id) WHERE meal_id IS NOT NULL;
