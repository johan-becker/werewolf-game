-- =============================================
-- SIMPLE CHAT MESSAGES SETUP
-- Copy and paste this entire script into Supabase SQL Editor
-- =============================================

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('LOBBY', 'DAY', 'NIGHT', 'DEAD', 'SYSTEM')),
  type TEXT NOT NULL DEFAULT 'TEXT' CHECK (type IN ('TEXT', 'SYSTEM', 'JOIN', 'LEAVE', 'DEATH', 'ROLE_REVEAL')),
  content TEXT NOT NULL,
  mentions TEXT[] DEFAULT '{}',
  edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_id ON chat_messages(game_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_channel ON chat_messages(game_id, channel);

-- Step 4: RLS Policies

-- Viewing messages policy
DROP POLICY IF EXISTS "Users can view chat messages from their games" ON chat_messages;
CREATE POLICY "Users can view chat messages from their games" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM players 
      WHERE players.game_id = chat_messages.game_id 
      AND players.user_id = auth.uid()
    )
    AND
    (
      channel IN ('LOBBY', 'SYSTEM')
      OR
      (channel = 'DAY' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = true
      ))
      OR
      (channel = 'NIGHT' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.role = 'werewolf'
      ))
      OR
      (channel = 'DEAD' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = false
      ))
    )
  );

-- Sending messages policy
DROP POLICY IF EXISTS "Users can send chat messages to appropriate channels" ON chat_messages;
CREATE POLICY "Users can send chat messages to appropriate channels" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND
    EXISTS (
      SELECT 1 FROM players 
      WHERE players.game_id = chat_messages.game_id 
      AND players.user_id = auth.uid()
    )
    AND
    (
      (channel = 'LOBBY')
      OR
      (channel = 'DAY' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = true
      ))
      OR
      (channel = 'NIGHT' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.role = 'werewolf'
      ))
      OR
      (channel = 'DEAD' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = false
      ))
      OR
      (channel = 'SYSTEM' AND type != 'TEXT')
    )
  );

-- Editing messages policy
DROP POLICY IF EXISTS "Users can edit their own text messages" ON chat_messages;
CREATE POLICY "Users can edit their own text messages" ON chat_messages
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND type = 'TEXT'
    AND channel != 'SYSTEM'
  )
  WITH CHECK (
    auth.uid() = user_id 
    AND type = 'TEXT'
    AND channel != 'SYSTEM'
  );

-- Deleting messages policy
DROP POLICY IF EXISTS "Users can delete appropriate chat messages" ON chat_messages;
CREATE POLICY "Users can delete appropriate chat messages" ON chat_messages
  FOR DELETE USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = chat_messages.game_id 
      AND games.creator_id = auth.uid()
    )
  );

-- Step 5: Helper functions

-- Get chat messages function
CREATE OR REPLACE FUNCTION get_chat_messages(
  game_id_param UUID,
  channel_param TEXT DEFAULT NULL,
  limit_param INTEGER DEFAULT 50,
  offset_param INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  game_id UUID,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  channel TEXT,
  type TEXT,
  content TEXT,
  mentions TEXT[],
  edited BOOLEAN,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM players 
    WHERE players.game_id = game_id_param 
    AND players.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'User is not in this game';
  END IF;

  RETURN QUERY
  SELECT 
    cm.id,
    cm.game_id,
    cm.user_id,
    p.username,
    p.avatar_url,
    cm.channel,
    cm.type,
    cm.content,
    cm.mentions,
    cm.edited,
    cm.edited_at,
    cm.created_at
  FROM chat_messages cm
  JOIN profiles p ON cm.user_id = p.id
  WHERE cm.game_id = game_id_param
    AND (channel_param IS NULL OR cm.channel = channel_param)
  ORDER BY cm.created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;

-- Send chat message function
CREATE OR REPLACE FUNCTION send_chat_message(
  game_id_param UUID,
  channel_param TEXT,
  type_param TEXT DEFAULT 'TEXT',
  content_param TEXT,
  mentions_param TEXT[] DEFAULT '{}'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  message_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User must be authenticated');
  END IF;

  IF content_param IS NULL OR trim(content_param) = '' THEN
    RETURN json_build_object('success', false, 'error', 'Message content cannot be empty');
  END IF;

  INSERT INTO chat_messages (game_id, user_id, channel, type, content, mentions)
  VALUES (game_id_param, auth.uid(), channel_param, type_param, content_param, mentions_param)
  RETURNING id INTO message_id;

  INSERT INTO game_logs (game_id, user_id, action, details)
  VALUES (game_id_param, auth.uid(), 'chat_message_sent', 
    json_build_object(
      'channel', channel_param,
      'type', type_param,
      'message_id', message_id
    )
  );

  RETURN json_build_object(
    'success', true, 
    'message_id', message_id,
    'message', 'Message sent successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Step 6: Grant permissions
GRANT EXECUTE ON FUNCTION get_chat_messages(UUID, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION send_chat_message(UUID, TEXT, TEXT, TEXT, TEXT[]) TO authenticated;

-- Step 7: Verification query
-- Run this to verify setup:
SELECT 
  'chat_messages table' as component,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'chat_messages' AND table_schema = 'public'
  ) THEN '✅ EXISTS' else '❌ MISSING' END as status

UNION ALL

SELECT 
  'RLS enabled' as component,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'chat_messages' AND rowsecurity = true
  ) THEN '✅ ENABLED' else '❌ DISABLED' END as status

UNION ALL

SELECT 
  'get_chat_messages function' as component,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'get_chat_messages' AND routine_schema = 'public'
  ) THEN '✅ EXISTS' else '❌ MISSING' END as status

UNION ALL

SELECT 
  'send_chat_message function' as component,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'send_chat_message' AND routine_schema = 'public'
  ) THEN '✅ EXISTS' else '❌ MISSING' END as status;