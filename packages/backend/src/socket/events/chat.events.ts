import { Socket, Server } from 'socket.io';
import { ChatService } from '../../services/chat.service';
import { RoomManager } from '../rooms';

// Typing indicator tracking
const typingUsers = new Map<
  string,
  {
    userId: string;
    username: string;
    channel: string;
    gameId?: string;
    timeout: NodeJS.Timeout;
  }
>();

export function handleChatEvents(socket: Socket, io: Server, roomManager: RoomManager) {
  const chatService = new ChatService();

  // Send chat message
  socket.on('chat:send', async (data, callback) => {
    try {
      const { content, channel, gameId } = data;

      if (!content || !channel) {
        return callback({ success: false, error: 'Content and channel are required' });
      }

      // Send message via service (includes validation and permissions)
      const message = await chatService.sendMessage(socket.data.userId, {
        content,
        channel,
        gameId,
      });

      // Broadcast message to appropriate recipients
      await broadcastMessage(io, roomManager, message);

      callback({ success: true, message });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Get chat history
  socket.on('chat:history', async (data, callback) => {
    try {
      const { channel, gameId, limit = 50, before } = data;

      if (!channel) {
        return callback({ success: false, error: 'Channel is required' });
      }

      const messages = await chatService.getChatHistory(
        socket.data.userId,
        channel,
        gameId,
        limit,
        before
      );

      callback({
        success: true,
        messages,
        hasMore: messages.length === limit,
      });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Start typing indicator
  socket.on('chat:typing:start', data => {
    try {
      const { channel, gameId } = data;
      const typingKey = `${socket.data.userId}:${channel}:${gameId || 'lobby'}`;

      // Clear existing timeout if any
      const existing = typingUsers.get(typingKey);
      if (existing) {
        clearTimeout(existing.timeout);
      }

      // Set new typing indicator with auto-clear timeout
      const timeout = setTimeout(() => {
        typingUsers.delete(typingKey);
        broadcastTyping(
          io,
          roomManager,
          socket.data.userId,
          socket.data.username,
          channel,
          gameId,
          false
        );
      }, 3000); // Auto-clear after 3 seconds

      typingUsers.set(typingKey, {
        userId: socket.data.userId,
        username: socket.data.username,
        channel,
        gameId,
        timeout,
      });

      // Broadcast typing start
      broadcastTyping(
        io,
        roomManager,
        socket.data.userId,
        socket.data.username,
        channel,
        gameId,
        true
      );
    } catch (error) {
      // Chat typing start error handled
    }
  });

  // Stop typing indicator
  socket.on('chat:typing:stop', data => {
    try {
      const { channel, gameId } = data;
      const typingKey = `${socket.data.userId}:${channel}:${gameId || 'lobby'}`;

      const existing = typingUsers.get(typingKey);
      if (existing) {
        clearTimeout(existing.timeout);
        typingUsers.delete(typingKey);

        // Broadcast typing stop
        broadcastTyping(
          io,
          roomManager,
          socket.data.userId,
          socket.data.username,
          channel,
          gameId,
          false
        );
      }
    } catch (error) {
      // Chat typing stop error handled
    }
  });

  // Edit message
  socket.on('chat:edit', async (data, callback) => {
    try {
      const { messageId, content } = data;

      if (!messageId || !content) {
        return callback({ success: false, error: 'Message ID and content are required' });
      }

      const editedMessage = await chatService.editMessage(messageId, socket.data.userId, content);

      // Broadcast edit to appropriate recipients
      await broadcastMessageEdit(io, roomManager, editedMessage);

      callback({ success: true, message: editedMessage });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Delete message (moderation)
  socket.on('chat:delete', async (data, callback) => {
    try {
      const { messageId } = data;

      if (!messageId) {
        return callback({ success: false, error: 'Message ID is required' });
      }

      await chatService.deleteMessage(messageId, socket.data.userId);

      // Broadcast deletion
      // Note: You might want to add channel/game info to determine broadcast scope
      io.emit('chat:messageDeleted', { messageId });

      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Clean up typing indicators on disconnect
  socket.on('disconnect', () => {
    // Remove all typing indicators for this user
    for (const [key, typing] of typingUsers.entries()) {
      if (typing.userId === socket.data.userId) {
        clearTimeout(typing.timeout);
        typingUsers.delete(key);

        // Broadcast typing stop
        broadcastTyping(
          io,
          roomManager,
          typing.userId,
          typing.username,
          typing.channel,
          typing.gameId,
          false
        );
      }
    }
  });
}

/**
 * Broadcast message to appropriate recipients based on channel and permissions
 */
async function broadcastMessage(io: Server, roomManager: RoomManager, message: any): Promise<void> {
  const { channel, gameId } = message;

  switch (channel) {
    case 'LOBBY':
      // Broadcast to all users in lobby
      roomManager.broadcastToLobby(io, 'chat:message', message);
      break;

    case 'DAY':
    case 'SYSTEM':
      // Broadcast to all players in the game
      if (gameId) {
        roomManager.broadcastToRoom(io, gameId, 'chat:message', message);
      }
      break;

    case 'NIGHT':
      // Broadcast only to werewolves in the game
      if (gameId) {
        await broadcastToWerewolves(io, roomManager, gameId, message);
      }
      break;

    case 'DEAD':
      // Broadcast only to dead players in the game
      if (gameId) {
        await broadcastToDeadPlayers(io, roomManager, gameId, message);
      }
      break;
  }
}

/**
 * Broadcast typing indicator
 */
function broadcastTyping(
  io: Server,
  roomManager: RoomManager,
  userId: string,
  username: string,
  channel: string,
  gameId: string | undefined,
  isTyping: boolean
): void {
  const typingData = {
    userId,
    username,
    channel,
    gameId,
    isTyping,
  };

  switch (channel) {
    case 'LOBBY':
      roomManager.broadcastToLobby(io, 'chat:typing', typingData);
      break;

    case 'DAY':
    case 'NIGHT':
    case 'DEAD':
      if (gameId) {
        roomManager.broadcastToRoom(io, gameId, 'chat:typing', typingData);
      }
      break;
  }
}

/**
 * Broadcast message edit
 */
async function broadcastMessageEdit(
  io: Server,
  roomManager: RoomManager,
  message: any
): Promise<void> {
  const editData = {
    messageId: message.id,
    content: message.content,
    editedAt: message.editedAt,
  };

  // Same logic as broadcastMessage, but send edit event
  switch (message.channel) {
    case 'LOBBY':
      roomManager.broadcastToLobby(io, 'chat:messageEdited', editData);
      break;

    case 'DAY':
    case 'SYSTEM':
      if (message.gameId) {
        roomManager.broadcastToRoom(io, message.gameId, 'chat:messageEdited', editData);
      }
      break;

    case 'NIGHT':
      if (message.gameId) {
        await broadcastToWerewolves(
          io,
          roomManager,
          message.gameId,
          editData,
          'chat:messageEdited'
        );
      }
      break;

    case 'DEAD':
      if (message.gameId) {
        await broadcastToDeadPlayers(
          io,
          roomManager,
          message.gameId,
          editData,
          'chat:messageEdited'
        );
      }
      break;
  }
}

/**
 * Broadcast to werewolves only
 */
async function broadcastToWerewolves(
  io: Server,
  roomManager: RoomManager,
  gameId: string,
  data: any,
  event: string = 'chat:message'
): Promise<void> {
  const sockets = roomManager.getSocketsInRoom(gameId);

  // This would need to be implemented with actual game state
  // For now, broadcast to all players in the room
  // In a real implementation, you'd filter by player role
  sockets.forEach(socket => {
    // TODO: Check if socket.data.userId is a werewolf in this game
    socket.emit(event, data);
  });
}

/**
 * Broadcast to dead players only
 */
async function broadcastToDeadPlayers(
  io: Server,
  roomManager: RoomManager,
  gameId: string,
  data: any,
  event: string = 'chat:message'
): Promise<void> {
  const sockets = roomManager.getSocketsInRoom(gameId);

  // This would need to be implemented with actual game state
  // For now, broadcast to all players in the room
  // In a real implementation, you'd filter by player alive status
  sockets.forEach(socket => {
    // TODO: Check if socket.data.userId is dead in this game
    socket.emit(event, data);
  });
}
