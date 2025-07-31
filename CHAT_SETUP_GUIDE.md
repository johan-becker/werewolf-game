# Chat Messages Setup Guide

This guide provides step-by-step instructions to set up the chat_messages table in your Supabase database.

## Overview

The chat system supports different channels based on game phases:
- **LOBBY**: Pre-game chat visible to all players
- **DAY**: Day phase discussions for living players
- **NIGHT**: Werewolf private chat during night phase  
- **DEAD**: Ghost chat for eliminated players
- **SYSTEM**: Automated game messages

## Step 1: Create the Table and Basic Setup

Copy and paste this SQL into the Supabase SQL Editor:

```sql
-- Create the chat_messages table
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

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_id ON chat_messages(game_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_channel ON chat_messages(game_id, channel);
```

## Step 2: Set Up Row Level Security Policies  

```sql
-- Policy for viewing chat messages
-- Users can view messages from games they are in, with channel restrictions
CREATE POLICY "Users can view chat messages from their games" ON chat_messages
  FOR SELECT USING (
    -- User must be in the game
    EXISTS (
      SELECT 1 FROM players 
      WHERE players.game_id = chat_messages.game_id 
      AND players.user_id = auth.uid()
    )
    AND
    -- Channel-specific access rules
    (
      -- LOBBY and SYSTEM messages: all players can see
      channel IN ('LOBBY', 'SYSTEM')
      OR
      -- DAY messages: only alive players can see
      (channel = 'DAY' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = true
      ))
      OR
      -- NIGHT messages: only werewolves can see
      (channel = 'NIGHT' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.role = 'werewolf'
      ))
      OR
      -- DEAD messages: only dead players can see
      (channel = 'DEAD' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = false
      ))
    )
  );

-- Policy for inserting chat messages
CREATE POLICY "Users can send chat messages to appropriate channels" ON chat_messages
  FOR INSERT WITH CHECK (
    -- User must be authenticated
    auth.uid() = user_id
    AND
    -- User must be in the game
    EXISTS (
      SELECT 1 FROM players 
      WHERE players.game_id = chat_messages.game_id 
      AND players.user_id = auth.uid()
    )
    AND
    -- Channel-specific send rules
    (
      -- LOBBY messages: all players can send (typically only during waiting phase)
      (channel = 'LOBBY')
      OR
      -- DAY messages: only alive players can send
      (channel = 'DAY' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = true
      ))
      OR
      -- NIGHT messages: only werewolves can send
      (channel = 'NIGHT' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.role = 'werewolf'
      ))
      OR
      -- DEAD messages: only dead players can send
      (channel = 'DEAD' AND EXISTS (
        SELECT 1 FROM players 
        WHERE players.game_id = chat_messages.game_id 
        AND players.user_id = auth.uid() 
        AND players.is_alive = false
      ))
      OR
      -- SYSTEM messages: only allow if type is SYSTEM (typically server-generated)
      (channel = 'SYSTEM' AND type != 'TEXT')
    )
  );

-- Policy for updating chat messages
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

-- Policy for deleting chat messages  
CREATE POLICY "Users can delete appropriate chat messages" ON chat_messages
  FOR DELETE USING (
    -- Users can delete their own messages
    auth.uid() = user_id
    OR
    -- Game creators can delete any message in their games
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = chat_messages.game_id 
      AND games.creator_id = auth.uid()
    )
  );
```

## Step 3: Add Helper Functions

```sql
-- Function to get chat messages for a specific game and channel
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
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Check if user is in the game
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

-- Function to send a chat message
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
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User must be authenticated');
  END IF;

  -- Validate content
  IF content_param IS NULL OR trim(content_param) = '' THEN
    RETURN json_build_object('success', false, 'error', 'Message content cannot be empty');
  END IF;

  -- Insert the message (RLS policies will handle access control)
  INSERT INTO chat_messages (game_id, user_id, channel, type, content, mentions)
  VALUES (game_id_param, auth.uid(), channel_param, type_param, content_param, mentions_param)
  RETURNING id INTO message_id;

  -- Log the message in game logs for audit trail
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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_chat_messages(UUID, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION send_chat_message(UUID, TEXT, TEXT, TEXT, TEXT[]) TO authenticated;
```

## Step 4: Test the Setup

Run this test query to verify everything is working:

```sql
-- Test that the table exists and RLS is working
SELECT COUNT(*) FROM chat_messages; -- Should fail with permission denied if RLS is properly configured

-- Test the helper functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_chat_messages', 'send_chat_message')
  AND routine_schema = 'public';
```

## Next Steps

1. **Update TypeScript Types**: Add ChatMessage interface to your types
2. **Create Service Layer**: Implement service methods for chat operations  
3. **Add Socket.IO Events**: Create real-time chat event handlers
4. **Frontend Integration**: Build chat UI components
5. **Testing**: Create comprehensive tests for chat functionality

## Usage Examples

### TypeScript Service Methods

```typescript
// Get messages for a game channel
const messages = await supabase.rpc('get_chat_messages', {
  game_id_param: gameId,
  channel_param: 'DAY',
  limit_param: 50
});

// Send a chat message
const result = await supabase.rpc('send_chat_message', {
  game_id_param: gameId,
  channel_param: 'DAY', 
  content_param: 'Hello everyone!',
  mentions_param: ['user-id-1', 'user-id-2']
});
```

### Socket.IO Events

```typescript
// Listen for new messages
socket.on('chat:message', (message) => {
  // Handle new chat message
});

// Send a message
socket.emit('chat:send', {
  gameId,
  channel: 'DAY',
  content: 'Hello!',
  mentions: []
});
```

## Security Notes

- RLS policies automatically restrict access based on game membership and player status
- Dead players can only see DEAD channel after elimination  
- Werewolves can see NIGHT channel for private discussions
- Game creators can moderate (delete) messages in their games
- SYSTEM messages are protected from user editing/deletion