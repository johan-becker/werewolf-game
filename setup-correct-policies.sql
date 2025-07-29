-- Setup Script: Ensure only correct 4 policies exist for games table
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing policies on games table
DROP POLICY IF EXISTS "Anyone can view games" ON games;
DROP POLICY IF EXISTS "Authenticated users can create games" ON games;  
DROP POLICY IF EXISTS "Only creator can update game" ON games;
DROP POLICY IF EXISTS "Only creator can delete game" ON games;

-- Drop any other policies that might exist
DROP POLICY IF EXISTS "Games sind für alle sichtbar" ON games;
DROP POLICY IF EXISTS "Angemeldete User können Spiele erstellen" ON games;
DROP POLICY IF EXISTS "Nur Creator kann Spiel updaten" ON games;
DROP POLICY IF EXISTS "Nur Creator kann Spiel löschen" ON games;
DROP POLICY IF EXISTS "Log all game access attempts" ON games;

-- Step 2: Ensure RLS is enabled
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Step 3: Create exactly these 4 policies

-- Policy 1: SELECT - Anyone can view games
CREATE POLICY "Anyone can view games" 
  ON games FOR SELECT 
  USING (true);

-- Policy 2: INSERT - Authenticated users can create games
CREATE POLICY "Authenticated users can create games" 
  ON games FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = creator_id
  );

-- Policy 3: UPDATE - Only creator can update game  
CREATE POLICY "Only creator can update game" 
  ON games FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL 
    AND auth.uid() = creator_id
  );

-- Policy 4: DELETE - Only creator can delete game
CREATE POLICY "Only creator can delete game" 
  ON games FOR DELETE 
  USING (
    auth.uid() IS NOT NULL 
    AND auth.uid() = creator_id
  );

-- Verification query - run this to confirm
SELECT 
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'games' AND schemaname = 'public'
ORDER BY cmd, policyname;