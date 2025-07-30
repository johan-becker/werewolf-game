export interface GameSettings {
  dayDuration: number;      // seconds
  nightDuration: number;    // seconds
  discussionTime: number;   // seconds
  roles?: {
    werewolf: number;
    villager: number;
    seer?: number;
    hunter?: number;
    witch?: number;
  };
}

export interface CreateGameDTO {
  name: string;
  maxPlayers: number;
  settings?: GameSettings;
}

export interface GameListQuery {
  limit?: number;
  offset?: number;
  status?: 'waiting' | 'in_progress' | 'finished';
}

export interface GameResponse {
  id: string;
  name: string;
  code: string;
  status: string;
  creatorId: string;
  maxPlayers: number;
  currentPlayers: number;
  createdAt: string;
  players?: PlayerResponse[];
}

export interface PlayerResponse {
  userId: string;
  username: string;
  avatarUrl?: string;
  isHost: boolean;
  isAlive: boolean;
  joinedAt: string;
}