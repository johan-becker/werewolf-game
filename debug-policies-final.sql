-- Debug: Check all current policies and RLS status
-- Run this in Supabase SQL Editor

-- 1. Check RLS is enabled
SELECT 
  schemaname,
  tablename, 
  rowsecurity
FROM pg_tables 
WHERE tablename = 'games' AND schemaname = 'public';

-- 2. List ALL policies on games table
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'games' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 3. Test RLS directly in SQL (should fail for non-owners)
-- This should work (you're admin):
UPDATE games SET name = 'SQL Admin Test' WHERE id = (SELECT id FROM games LIMIT 1);

-- 4. Check if there are any permissive policies that allow everything
SELECT 
  policyname,
  qual
FROM pg_policies 
WHERE tablename = 'games' 
  AND schemaname = 'public'
  AND cmd IN ('UPDATE', 'ALL')
  AND (qual = 'true' OR qual IS NULL OR qual = '');

-- 5. Force recreate the UPDATE policy
DROP POLICY IF EXISTS "Only creator can update game" ON games;

CREATE POLICY "Only creator can update game" 
  ON games FOR UPDATE 
  USING (auth.uid() IS NOT NULL AND auth.uid() = creator_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = creator_id);