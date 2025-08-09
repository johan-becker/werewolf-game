import { supabaseAdmin, hasSupabaseConfig } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  gameId?: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  channel: 'LOBBY' | 'DAY' | 'NIGHT' | 'DEAD' | 'SYSTEM';
  type: 'TEXT' | 'SYSTEM' | 'JOIN' | 'LEAVE' | 'DEATH' | 'ROLE_REVEAL';
  content: string;
  mentions: string[];
  edited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  channel: ChatMessage['channel'];
  gameId?: string;
  mentions?: string[];
}

export interface ChatPermissions {
  canRead: boolean;
  canWrite: boolean;
  reason?: string;
}

export class ChatService {
  private readonly MESSAGE_MAX_LENGTH = 1000;
  private readonly SPAM_THRESHOLD = 5; // messages per minute
  private readonly BAD_WORDS = ['spam', 'hack', 'cheat']; // Erweitere nach Bedarf

  /**
   * Send a chat message with validation and permissions
   */
  async sendMessage(userId: string, request: SendMessageRequest): Promise<ChatMessage> {
    // Validate message content
    this.validateMessage(request.content);

    // Check permissions
    const permissions = await this.getChannelPermissions(userId, request.channel, request.gameId);

    if (!permissions.canWrite) {
      throw new Error(permissions.reason || 'No permission to write in this channel');
    }

    // Check spam protection
    await this.checkSpamProtection(userId, request.channel, request.gameId);

    // Process mentions
    const mentions = this.extractMentions(request.content);

    // Filter bad words if enabled
    const filteredContent = this.filterContent(request.content);

    // Save to database
    const { data: message, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        game_id: request.gameId || null,
        user_id: userId,
        channel: request.channel,
        type: 'TEXT',
        content: filteredContent,
        mentions: mentions,
      })
      .select(
        `
        *,
        user:profiles!inner(username, avatar_url)
      `
      )
      .single();

    if (error) throw new Error(`Failed to send message: ${error.message}`);

    return this.formatMessage(message);
  }

  /**
   * Send system message
   */
  async sendSystemMessage(
    gameId: string | null,
    type: ChatMessage['type'],
    content: string,
    channel: ChatMessage['channel'] = 'SYSTEM'
  ): Promise<ChatMessage> {
    const { data: message, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        game_id: gameId,
        user_id: '00000000-0000-0000-0000-000000000000', // System user ID
        channel,
        type,
        content,
      })
      .select(
        `
        *,
        user:profiles!inner(username, avatar_url)
      `
      )
      .single();

    if (error) throw new Error(`Failed to send system message: ${error.message}`);

    return this.formatMessage(message);
  }

  /**
   * Get chat history for a channel
   */
  async getChatHistory(
    userId: string,
    channel: ChatMessage['channel'],
    gameId?: string,
    limit: number = 50,
    before?: string
  ): Promise<ChatMessage[]> {
    // Check read permissions
    const permissions = await this.getChannelPermissions(userId, channel, gameId);
    if (!permissions.canRead) {
      throw new Error(permissions.reason || 'No permission to read this channel');
    }

    let query = supabaseAdmin
      .from('chat_messages')
      .select(
        `
        *,
        user:profiles!inner(username, avatar_url)
      `
      )
      .eq('channel', channel)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by game if specified
    if (gameId) {
      query = query.eq('game_id', gameId);
    } else {
      query = query.is('game_id', null);
    }

    // Pagination
    if (before) {
      query = query.lt('created_at', before);
    }

    const { data: messages, error } = await query;

    if (error) throw new Error(`Failed to get chat history: ${error.message}`);

    return (messages || []).reverse().map(msg => this.formatMessage(msg));
  }

  /**
   * Get channel permissions for user
   */
  async getChannelPermissions(
    userId: string,
    channel: ChatMessage['channel'],
    gameId?: string
  ): Promise<ChatPermissions> {
    switch (channel) {
      case 'LOBBY':
        return { canRead: true, canWrite: true };

      case 'SYSTEM':
        return { canRead: true, canWrite: false, reason: 'System channel is read-only' };

      case 'DAY':
      case 'NIGHT':
      case 'DEAD': {
        if (!gameId) {
          return { canRead: false, canWrite: false, reason: 'Game ID required for game channels' };
        }

        // Get player info
        const { data: player } = await supabaseAdmin
          .from('players')
          .select('is_alive, role')
          .eq('game_id', gameId)
          .eq('user_id', userId)
          .single();

        if (!player) {
          return { canRead: false, canWrite: false, reason: 'Not a player in this game' };
        }

        // Get game info
        const { data: game } = await supabaseAdmin
          .from('games')
          .select('status, phase')
          .eq('id', gameId)
          .single();

        if (!game || game.status !== 'IN_PROGRESS') {
          return { canRead: false, canWrite: false, reason: 'Game not in progress' };
        }

        return this.getGameChannelPermissions(channel, player, game);
      }

      default:
        return { canRead: false, canWrite: false, reason: 'Unknown channel' };
    }
  }

  /**
   * Get permissions for game-specific channels
   */
  private getGameChannelPermissions(
    channel: ChatMessage['channel'],
    player: { is_alive?: boolean; role?: string },
    game: { phase?: string }
  ): ChatPermissions {
    switch (channel) {
      case 'DAY':
        return {
          canRead: true,
          canWrite: (player.is_alive ?? true) && game.phase === 'DAY',
        };

      case 'NIGHT':
        if (player.role !== 'WEREWOLF') {
          return {
            canRead: false,
            canWrite: false,
            reason: 'Only werewolves can access night chat',
          };
        }
        return {
          canRead: true,
          canWrite: (player.is_alive ?? true) && game.phase === 'NIGHT',
        };

      case 'DEAD':
        return {
          canRead: !player.is_alive,
          canWrite: !player.is_alive,
        };

      default:
        return { canRead: false, canWrite: false };
    }
  }

  /**
   * Validate message content
   */
  private validateMessage(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (content.length > this.MESSAGE_MAX_LENGTH) {
      throw new Error(`Message too long. Maximum ${this.MESSAGE_MAX_LENGTH} characters`);
    }
  }

  /**
   * Check spam protection
   */
  private async checkSpamProtection(
    userId: string,
    channel: ChatMessage['channel'],
    gameId?: string
  ): Promise<void> {
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();

    let query = supabaseAdmin
      .from('chat_messages')
      .select('id')
      .eq('user_id', userId)
      .eq('channel', channel)
      .gte('created_at', oneMinuteAgo);

    if (gameId) {
      query = query.eq('game_id', gameId);
    }

    const { data: recentMessages, error } = await query;

    if (error) throw new Error('Failed to check spam protection');

    if (recentMessages && recentMessages.length >= this.SPAM_THRESHOLD) {
      throw new Error('Too many messages. Please slow down.');
    }
  }

  /**
   * Extract @mentions from message content
   */
  private extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const username = match[1];
      if (username && !mentions.includes(username)) {
        mentions.push(username);
      }
    }

    return mentions;
  }

  /**
   * Filter bad words from content (basic implementation)
   */
  private filterContent(content: string): string {
    let filteredContent = content;

    for (const badWord of this.BAD_WORDS) {
      const regex = new RegExp(badWord, 'gi');
      filteredContent = filteredContent.replace(regex, '*'.repeat(badWord.length));
    }

    return filteredContent;
  }

  /**
   * Format database message to ChatMessage interface
   */
  private formatMessage(dbMessage: {
    id: string;
    game_id?: string;
    user_id: string;
    user?: { username?: string; avatar_url?: string };
    channel: ChatMessage['channel'];
    type: ChatMessage['type'];
    content: string;
    mentions?: string[];
    edited: boolean;
    edited_at?: string;
    created_at: string;
  }): ChatMessage {
    const message: ChatMessage = {
      id: dbMessage.id,
      userId: dbMessage.user_id,
      username: dbMessage.user?.username || 'System',
      channel: dbMessage.channel,
      type: dbMessage.type,
      content: dbMessage.content,
      mentions: dbMessage.mentions || [],
      edited: dbMessage.edited,
      createdAt: dbMessage.created_at,
    };

    if (dbMessage.game_id) {
      message.gameId = dbMessage.game_id;
    }

    if (dbMessage.user?.avatar_url) {
      message.avatarUrl = dbMessage.user.avatar_url;
    }

    if (dbMessage.edited_at) {
      message.editedAt = dbMessage.edited_at;
    }

    return message;
  }

  /**
   * Delete message (moderation)
   */
  async deleteMessage(messageId: string, _moderatorId: string): Promise<void> {
    // Hier könntest du zusätzliche Moderator-Checks implementieren
    const { error } = await supabaseAdmin.from('chat_messages').delete().eq('id', messageId);

    if (error) throw new Error(`Failed to delete message: ${error.message}`);
  }

  /**
   * Edit message
   */
  async editMessage(messageId: string, userId: string, newContent: string): Promise<ChatMessage> {
    this.validateMessage(newContent);

    const filteredContent = this.filterContent(newContent);
    const mentions = this.extractMentions(filteredContent);

    const { data: message, error } = await supabaseAdmin
      .from('chat_messages')
      .update({
        content: filteredContent,
        mentions: mentions,
        edited: true,
        edited_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('user_id', userId) // Only owner can edit
      .select(
        `
        *,
        user:profiles!inner(username, avatar_url)
      `
      )
      .single();

    if (error) throw new Error(`Failed to edit message: ${error.message}`);

    return this.formatMessage(message);
  }
}
