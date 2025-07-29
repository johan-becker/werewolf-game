-- Run this in Supabase SQL Editor to see ALL current policies
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

-- Also check RLS status
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'games' AND schemaname = 'public';