import { Server, Socket } from 'socket.io';
import { updateConnectionGame } from './middleware';

export class RoomManager {
  private userRooms = new Map<string, string>(); // userId -> gameId
  private roomUsers = new Map<string, Set<string>>(); // gameId -> Set<userId>
  private roomSockets = new Map<string, Set<Socket>>(); // gameId -> Set<Socket>
  
  // Reconnection grace period tracking
  private disconnectedUsers = new Map<string, { gameId: string; timestamp: number }>();
  private readonly GRACE_PERIOD = 30000; // 30 seconds

  /**
   * Join user to game room with automatic cleanup of previous rooms
   */
  async joinRoom(socket: Socket, gameId: string): Promise<void> {
    const userId = socket.data.userId;
    
    // Leave current room if any
    const previousGame = await this.leaveCurrentRoom(socket);
    
    // Clear any pending disconnect grace period
    this.disconnectedUsers.delete(userId);
    
    // Join new room
    const roomName = `game:${gameId}`;
    await socket.join(roomName);
    
    // Update mappings
    this.userRooms.set(userId, gameId);
    
    if (!this.roomUsers.has(gameId)) {
      this.roomUsers.set(gameId, new Set());
    }
    this.roomUsers.get(gameId)!.add(userId);
    
    if (!this.roomSockets.has(gameId)) {
      this.roomSockets.set(gameId, new Set());
    }
    this.roomSockets.get(gameId)!.add(socket);
    
    // Update socket and connection tracking
    socket.data.currentGame = gameId;
    updateConnectionGame(userId, gameId);
    
    console.log(`User ${socket.data.username} joined room game:${gameId}`);
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
    this.roomSockets.get(currentGame)?.delete(socket);
    
    // Clean up empty rooms
    if (this.roomUsers.get(currentGame)?.size === 0) {
      this.roomUsers.delete(currentGame);
      this.roomSockets.delete(currentGame);
    }
    
    // Update socket and connection tracking
    delete socket.data.currentGame;
    updateConnectionGame(userId, undefined);
    
    console.log(`User ${socket.data.username} left room game:${currentGame}`);
    
    return currentGame;
  }

  /**
   * Join lobby room for general game discovery
   */
  async joinLobby(socket: Socket): Promise<void> {
    await socket.join('lobby');
    console.log(`User ${socket.data.username} joined lobby`);
  }

  /**
   * Leave lobby room
   */
  async leaveLobby(socket: Socket): Promise<void> {
    await socket.leave('lobby');
    console.log(`User ${socket.data.username} left lobby`);
  }

  /**
   * Get users in a game room
   */
  getUsersInRoom(gameId: string): string[] {
    return Array.from(this.roomUsers.get(gameId) || []);
  }

  /**
   * Get active sockets in a game room
   */
  getSocketsInRoom(gameId: string): Socket[] {
    return Array.from(this.roomSockets.get(gameId) || []);
  }

  /**
   * Get user's current game
   */
  getUserGame(userId: string): string | undefined {
    return this.userRooms.get(userId);
  }

  /**
   * Check if user is in a specific game room
   */
  isUserInRoom(userId: string, gameId: string): boolean {
    return this.userRooms.get(userId) === gameId;
  }

  /**
   * Get room count for a game
   */
  getRoomSize(gameId: string): number {
    return this.roomUsers.get(gameId)?.size || 0;
  }

  /**
   * Handle disconnect with grace period for reconnection
   */
  handleDisconnect(userId: string): string | null {
    const gameId = this.userRooms.get(userId);
    
    if (gameId) {
      // Set grace period instead of immediate cleanup
      this.disconnectedUsers.set(userId, {
        gameId,
        timestamp: Date.now()
      });
      
      // Clean up after grace period
      setTimeout(() => {
        const disconnectedUser = this.disconnectedUsers.get(userId);
        if (disconnectedUser && disconnectedUser.gameId === gameId) {
          // User didn't reconnect within grace period
          this.forceLeaveRoom(userId, gameId);
          this.disconnectedUsers.delete(userId);
          console.log(`User ${userId} permanently left game ${gameId} after grace period`);
        }
      }, this.GRACE_PERIOD);
      
      console.log(`User ${userId} disconnected from game ${gameId}, grace period started`);
      return gameId;
    }
    
    return null;
  }

  /**
   * Force remove user from room (used after grace period)
   */
  private forceLeaveRoom(userId: string, gameId: string): void {
    this.userRooms.delete(userId);
    this.roomUsers.get(gameId)?.delete(userId);
    
    // Clean up empty rooms
    if (this.roomUsers.get(gameId)?.size === 0) {
      this.roomUsers.delete(gameId);
      this.roomSockets.delete(gameId);
    }
    
    updateConnectionGame(userId, undefined);
  }

  /**
   * Handle reconnection - restore user to previous room
   */
  async handleReconnection(socket: Socket): Promise<string | null> {
    const userId = socket.data.userId;
    const disconnectedUser = this.disconnectedUsers.get(userId);
    
    if (disconnectedUser) {
      const gameId = disconnectedUser.gameId;
      
      // Clear the disconnect timer
      this.disconnectedUsers.delete(userId);
      
      // Rejoin the room
      await this.joinRoom(socket, gameId);
      
      console.log(`User ${socket.data.username} reconnected to game ${gameId}`);
      return gameId;
    }
    
    return null;
  }

  /**
   * Broadcast to all users in a game room
   */
  broadcastToRoom(io: Server, gameId: string, event: string, data: any): void {
    io.to(`game:${gameId}`).emit(event, data);
  }

  /**
   * Broadcast to lobby
   */
  broadcastToLobby(io: Server, event: string, data: any): void {
    io.to('lobby').emit(event, data);
  }

  /**
   * Get all active rooms
   */
  getActiveRooms(): string[] {
    return Array.from(this.roomUsers.keys());
  }

  /**
   * Clean up expired disconnect entries
   */
  cleanupExpiredDisconnects(): void {
    const now = Date.now();
    const toDelete: string[] = [];
    
    this.disconnectedUsers.forEach((disconnectInfo, userId) => {
      if (now - disconnectInfo.timestamp > this.GRACE_PERIOD) {
        this.forceLeaveRoom(userId, disconnectInfo.gameId);
        toDelete.push(userId);
      }
    });
    
    toDelete.forEach(userId => this.disconnectedUsers.delete(userId));
  }
}