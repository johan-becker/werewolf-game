import { Server, Socket } from 'socket.io';

export class RoomManager {
  private userRooms = new Map<string, string>(); // userId -> gameId
  private roomUsers = new Map<string, Set<string>>(); // gameId -> Set<userId>

  /**
   * Join user to game room
   */
  async joinRoom(socket: Socket, gameId: string): Promise<void> {
    const userId = socket.data.userId;
    
    // Leave current room if any
    await this.leaveCurrentRoom(socket);
    
    // Join new room
    const roomName = `game:${gameId}`;
    await socket.join(roomName);
    
    // Update mappings
    this.userRooms.set(userId, gameId);
    
    if (!this.roomUsers.has(gameId)) {
      this.roomUsers.set(gameId, new Set());
    }
    this.roomUsers.get(gameId)!.add(userId);
    
    socket.data.currentGame = gameId;
  }

  /**
   * Remove user from current room
   */
  async leaveCurrentRoom(socket: Socket): Promise<string | null> {
    const userId = socket.data.userId;
    const currentGame = this.userRooms.get(userId);
    
    if (!currentGame) return null;
    
    // Leave socket room
    const roomName = `game:${currentGame}`;
    await socket.leave(roomName);
    
    // Update mappings
    this.userRooms.delete(userId);
    this.roomUsers.get(currentGame)?.delete(userId);
    
    // Clean up empty rooms
    if (this.roomUsers.get(currentGame)?.size === 0) {
      this.roomUsers.delete(currentGame);
    }
    
    delete socket.data.currentGame;
    
    return currentGame;
  }

  /**
   * Get users in a game room
   */
  getUsersInRoom(gameId: string): string[] {
    return Array.from(this.roomUsers.get(gameId) || []);
  }

  /**
   * Get user's current game
   */
  getUserGame(userId: string): string | undefined {
    return this.userRooms.get(userId);
  }

  /**
   * Handle disconnect - clean up rooms
   */
  handleDisconnect(userId: string): string | null {
    const gameId = this.userRooms.get(userId);
    
    if (gameId) {
      this.userRooms.delete(userId);
      this.roomUsers.get(gameId)?.delete(userId);
      
      if (this.roomUsers.get(gameId)?.size === 0) {
        this.roomUsers.delete(gameId);
      }
      return gameId;
    }
    
    return null;
  }
}