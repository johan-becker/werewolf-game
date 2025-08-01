// Chat message types for the werewolf game

export type ChatChannel = 'LOBBY' | 'DAY' | 'NIGHT' | 'DEAD' | 'SYSTEM';

export type ChatMessageType = 'TEXT' | 'SYSTEM' | 'JOIN' | 'LEAVE' | 'DEATH' | 'ROLE_REVEAL';

export interface ChatMessage {
  id: string;
  gameId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  channel: ChatChannel;
  type: ChatMessageType;
  content: string;
  mentions: string[];
  edited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface SendMessageDTO {
  gameId: string;
  channel: ChatChannel;
  type?: ChatMessageType;
  content: string;
  mentions?: string[];
}

export interface GetMessagesQuery {
  gameId: string;
  channel?: ChatChannel;
  limit?: number;
  offset?: number;
}

export interface ChatMessageResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}

// Socket.IO event types for chat
export interface ChatSocketEvents {
  // Client to server events
  'chat:join': (gameId: string) => void;
  'chat:leave': (gameId: string) => void;
  'chat:send': (data: SendMessageDTO) => void;
  'chat:edit': (data: { messageId: string; content: string }) => void;
  'chat:delete': (messageId: string) => void;
  'chat:typing': (data: { gameId: string; channel: ChatChannel }) => void;
  'chat:stop_typing': (data: { gameId: string; channel: ChatChannel }) => void;

  // Server to client events
  'chat:message': (message: ChatMessage) => void;
  'chat:message_edited': (message: ChatMessage) => void;
  'chat:message_deleted': (messageId: string) => void;
  'chat:user_typing': (data: { userId: string; username: string; channel: ChatChannel }) => void;
  'chat:user_stop_typing': (data: { userId: string; channel: ChatChannel }) => void;
  'chat:error': (error: { message: string; code?: string }) => void;
  'chat:history': (messages: ChatMessage[]) => void;
}

// Channel access based on player status
export interface ChatChannelAccess {
  canRead: boolean;
  canWrite: boolean;
  reason?: string;
}

export interface PlayerChatStatus {
  userId: string;
  isAlive: boolean;
  role: string;
  isHost: boolean;
  channels: {
    [K in ChatChannel]: ChatChannelAccess;
  };
}

// System message templates
export interface SystemMessageData {
  type: 'player_joined' | 'player_left' | 'game_started' | 'phase_changed' | 'player_died' | 'role_revealed';
  playerName?: string;
  role?: string;
  phase?: string;
  additionalData?: Record<string, any>;
}

// Chat service interface
export interface ChatService {
  // Message operations
  getMessages(query: GetMessagesQuery): Promise<ChatMessage[]>;
  sendMessage(data: SendMessageDTO): Promise<ChatMessageResponse>;
  editMessage(messageId: string, content: string): Promise<ChatMessageResponse>;
  deleteMessage(messageId: string): Promise<ChatMessageResponse>;
  
  // System messages
  sendSystemMessage(gameId: string, data: SystemMessageData): Promise<ChatMessageResponse>;
  
  // Channel access
  getChannelAccess(gameId: string, userId: string): Promise<PlayerChatStatus>;
  
  // Utilities
  mentionPlayer(content: string, userId: string, username: string): string;
  extractMentions(content: string): string[];
}

// Channel descriptions for UI
export const CHAT_CHANNEL_INFO: Record<ChatChannel, { name: string; description: string; color: string }> = {
  LOBBY: {
    name: 'Lobby',
    description: 'Pre-game chat for all players',
    color: '#6B7280'
  },
  DAY: {
    name: 'Day Chat',
    description: 'Daytime discussions for living players',
    color: '#F59E0B'
  },
  NIGHT: {
    name: 'Werewolf Chat',
    description: 'Private werewolf communication',
    color: '#EF4444'
  },
  DEAD: {
    name: 'Ghost Chat',
    description: 'Chat for eliminated players',
    color: '#9CA3AF'
  },
  SYSTEM: {
    name: 'System',
    description: 'Game announcements and notifications',
    color: '#3B82F6'
  }
};

// Validation helpers
export const validateChatMessage = (content: string): { valid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (content.length > 1000) {
    return { valid: false, error: 'Message too long (max 1000 characters)' };
  }
  
  return { valid: true };
};

export const canAccessChannel = (
  channel: ChatChannel,
  playerStatus: { isAlive: boolean; role: string; gamePhase: string }
): ChatChannelAccess => {
  const { isAlive, role, gamePhase } = playerStatus;
  
  switch (channel) {
    case 'LOBBY':
      return { 
        canRead: true, 
        canWrite: gamePhase === 'lobby' || gamePhase === 'waiting' 
      };
      
    case 'SYSTEM':
      return { 
        canRead: true, 
        canWrite: false,
        reason: 'System messages are read-only'
      };
      
    case 'DAY':
      if (!isAlive) {
        return { 
          canRead: false, 
          canWrite: false,
          reason: 'Only living players can participate in day chat'
        };
      }
      return { 
        canRead: true, 
        canWrite: gamePhase === 'day' || gamePhase === 'voting'
      };
      
    case 'NIGHT':
      if (role !== 'werewolf') {
        return { 
          canRead: false, 
          canWrite: false,
          reason: 'Only werewolves can access night chat'
        };
      }
      return { 
        canRead: true, 
        canWrite: gamePhase === 'night'
      };
      
    case 'DEAD':
      if (isAlive) {
        return { 
          canRead: false, 
          canWrite: false,
          reason: 'Only eliminated players can access ghost chat'
        };
      }
      return { canRead: true, canWrite: true };
      
    default:
      return { 
        canRead: false, 
        canWrite: false,
        reason: 'Unknown channel'
      };
  }
};