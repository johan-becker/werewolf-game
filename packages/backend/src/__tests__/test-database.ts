import {
  PrismaClient,
  GameStatus,
  GamePhase,
  NightPhase,
  Team,
  WerewolfRole,
  ChatChannel,
  MessageType,
} from '../generated/prisma';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Test database configuration for werewolf game
export class TestDatabaseManager {
  private prisma: PrismaClient;
  private supabase: SupabaseClient;

  constructor() {
    // Mock Prisma client for tests to avoid database connection issues
    this.prisma = {
      chatMessage: { deleteMany: async () => ({}), create: async () => ({}) },
      gameLog: { deleteMany: async () => ({}) },
      player: {
        deleteMany: async () => ({}),
        create: async (data: any) => ({ ...data.data, id: 'test-id' }),
      },
      game: {
        deleteMany: async () => ({}),
        create: async (data: any) => ({ ...data.data, id: 'test-id' }),
      },
      profile: { deleteMany: async () => ({}), create: async (data: any) => ({ ...data.data }) },
      $disconnect: async () => {},
    } as any;

    this.supabase = createClient(
      process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
      process.env.TEST_SUPABASE_SERVICE_KEY || 'test-key'
    );
  }

  async setup(): Promise<void> {
    try {
      // Clean existing test data
      await this.cleanup();

      // Seed werewolf-themed test data
      await this.seedTestData();

      // eslint-disable-next-line no-console
      console.log('🌕 Test database setup completed with werewolf-themed data');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Test database setup failed:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      // Delete test data in correct order (respecting foreign key constraints)
      await this.prisma.chatMessage.deleteMany();
      await this.prisma.gameLog.deleteMany();
      await this.prisma.player.deleteMany();
      await this.prisma.game.deleteMany();
      await this.prisma.profile.deleteMany();

      // eslint-disable-next-line no-console
      console.log('🌑 Test database cleaned up');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Test database cleanup failed:', error);
      throw error;
    }
  }

  async seedTestData(): Promise<TestGameData> {
    // Create werewolf-themed test users
    const werewolfUsers = await this.createWerewolfUsers();

    // Create test games with different phases
    const games = await this.createTestGames(werewolfUsers);

    // Create players with werewolf roles
    const players = await this.createWerewolfPlayers(games, werewolfUsers);

    // Create werewolf-themed chat messages
    await this.createWerewolfChatMessages(games, players);

    return {
      users: werewolfUsers,
      games,
      players,
    };
  }

  private async createWerewolfUsers(): Promise<TestUser[]> {
    const werewolfNames = [
      'Luna_Nighthowl',
      'Shadow_Fang',
      'Crimson_Claw',
      'Moonlight_Hunter',
      'Silver_Bite',
      'Dark_Paw',
      'Blood_Moon',
      'Alpha_Storm',
      'Night_Stalker',
      'Howling_Wind',
      'Mystic_Wolf',
      'Savage_Tooth',
    ];

    const users: TestUser[] = [];

    for (const name of werewolfNames) {
      const user = await this.prisma.profile.create({
        data: {
          id: faker.string.uuid(),
          username: name,
          full_name: name.replace('_', ' '),
          avatar_url: `https://werewolf-avatars.test/${name}.png`,
          games_played: faker.number.int({ min: 0, max: 50 }),
          games_won: faker.number.int({ min: 0, max: 25 }),
          created_at: faker.date.recent({ days: 30 }),
          updated_at: new Date(),
        },
      });
      users.push(user);
    }

    return users;
  }

  private async createTestGames(users: TestUser[]): Promise<TestGame[]> {
    const gameScenarios = [
      { name: 'Moonlit Village', status: 'waiting', max_players: 8, current_players: 3 },
      { name: 'Howling Hills', status: 'in_progress', max_players: 12, current_players: 12 },
      { name: 'Shadow Forest', status: 'finished', max_players: 10, current_players: 10 },
      { name: 'Blood Moon Rising', status: 'waiting', max_players: 15, current_players: 5 },
      { name: 'Silver Lake Settlement', status: 'in_progress', max_players: 6, current_players: 6 },
    ];

    const games: TestGame[] = [];

    for (const scenario of gameScenarios) {
      const creator = faker.helpers.arrayElement(users);
      const game = await this.prisma.game.create({
        data: {
          code: this.generateWerewolfGameCode(),
          name: scenario.name,
          status:
            scenario.status === 'in_progress'
              ? GameStatus.IN_PROGRESS
              : scenario.status === 'finished'
                ? GameStatus.FINISHED
                : GameStatus.WAITING,
          phase:
            scenario.status === 'in_progress'
              ? faker.helpers.arrayElement([GamePhase.DAY, GamePhase.NIGHT])
              : null,
          night_phase:
            scenario.status === 'in_progress'
              ? faker.helpers.arrayElement([NightPhase.SEER_PHASE, NightPhase.WEREWOLF_PHASE])
              : null,
          day_number: scenario.status === 'in_progress' ? faker.number.int({ min: 1, max: 5 }) : 1,
          max_players: scenario.max_players,
          current_players: scenario.current_players || 0,
          creator_id: creator.id,
          game_settings: {
            night_length_minutes: 5,
            day_length_minutes: 10,
            werewolf_ratio: 0.25,
            special_roles_enabled: true,
            pack_hunting_enabled: true,
            moon_phase_effects: true,
            territory_bonuses: true,
          },
          created_at: faker.date.recent({ days: 7 }),
          started_at: scenario.status === 'in_progress' ? faker.date.recent({ days: 1 }) : null,
          finished_at: scenario.status === 'finished' ? faker.date.recent({ days: 1 }) : null,
        },
      });
      games.push(game);
    }

    return games;
  }

  private async createWerewolfPlayers(games: TestGame[], users: TestUser[]): Promise<TestPlayer[]> {
    const werewolfRoles: WerewolfRole[] = [
      WerewolfRole.VILLAGER,
      WerewolfRole.WEREWOLF,
      WerewolfRole.SEER,
      WerewolfRole.WITCH,
      WerewolfRole.HUNTER,
      WerewolfRole.CUPID,
      WerewolfRole.LITTLE_GIRL,
    ];

    const players: TestPlayer[] = [];

    for (const game of games) {
      const playerCount = Math.min(
        faker.number.int({ min: 4, max: game.max_players }),
        users.length
      );

      const gameUsers = faker.helpers.arrayElements(users, playerCount);

      for (let i = 0; i < gameUsers.length; i++) {
        const user = gameUsers[i];
        if (!user?.id) {
          throw new Error(`User at index ${i} is missing or has no id`);
        }

        const role = i === 0 ? WerewolfRole.WEREWOLF : faker.helpers.arrayElement(werewolfRoles);

        const player = await this.prisma.player.create({
          data: {
            game_id: game.id,
            user_id: user.id,
            role: role,
            team: role === WerewolfRole.WEREWOLF ? Team.WEREWOLF : Team.VILLAGE,
            is_alive: faker.datatype.boolean(0.8), // 80% chance of being alive
            is_host: i === 0,
            joined_at: faker.date.recent({ days: 1 }),
            eliminated_at: faker.datatype.boolean(0.2) ? faker.date.recent({ days: 1 }) : null,
            votes_cast: faker.number.int({ min: 0, max: 5 }),
            lover_id: null, // Will be set by Cupid logic
            has_heal_potion: role === WerewolfRole.WITCH,
            has_poison_potion: role === WerewolfRole.WITCH,
            can_shoot: role === WerewolfRole.HUNTER,
            has_spied: role === WerewolfRole.LITTLE_GIRL && faker.datatype.boolean(0.3),
            spy_risk:
              role === WerewolfRole.LITTLE_GIRL ? faker.number.int({ min: 5, max: 15 }) : 10,
            is_protected: faker.datatype.boolean(0.1),
          },
        });
        players.push(player);
      }
    }

    return players;
  }

  private async createWerewolfChatMessages(
    games: TestGame[],
    players: TestPlayer[]
  ): Promise<void> {
    const werewolfPhrases = [
      'The pack grows stronger under the full moon 🌕',
      'I sense something lurking in the shadows...',
      'The village elder speaks of ancient werewolf legends',
      'Blood moon tonight - perfect for hunting 🩸',
      'My werewolf instincts are tingling',
      "The alpha's howl echoes through the forest",
      "Silver bullets won't save you now!",
      'The hunt begins at midnight 🐺',
      'Pack loyalty above all else',
      'The moon reveals all secrets...',
    ];

    for (const game of games) {
      const gamePlayers = players.filter(p => p.game_id === game.id);
      const messageCount = faker.number.int({ min: 10, max: 50 });

      for (let i = 0; i < messageCount; i++) {
        const sender = faker.helpers.arrayElement(gamePlayers);

        await this.prisma.chatMessage.create({
          data: {
            game_id: game.id,
            user_id: sender.user_id,
            content: faker.helpers.arrayElement(werewolfPhrases),
            channel: faker.helpers.arrayElement([
              ChatChannel.LOBBY,
              ChatChannel.DAY,
              ChatChannel.NIGHT,
              ChatChannel.DEAD,
            ]),
            type: MessageType.TEXT,
            mentions: [],
            edited: faker.datatype.boolean(0.05), // 5% chance of being edited
            edited_at: faker.datatype.boolean(0.05) ? faker.date.recent({ days: 1 }) : null,
            created_at: faker.date.recent({ days: 1 }),
          },
        });
      }
    }
  }

  private generateWerewolfGameCode(): string {
    const werewolfChars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // Exclude confusing characters
    const prefixes = ['WOLF', 'MOON', 'PACK', 'HUNT', 'HOWL'];
    const prefix = faker.helpers.arrayElement(prefixes);
    const suffix = Array.from({ length: 2 }, () =>
      werewolfChars.charAt(faker.number.int({ max: werewolfChars.length - 1 }))
    ).join('');
    return `${prefix}${suffix}`;
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Type definitions for test data
export interface TestUser {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  games_played: number;
  games_won: number;
  created_at: Date;
  updated_at: Date | null;
}

export interface TestGame {
  id: string;
  code: string;
  name: string;
  status: GameStatus;
  phase: GamePhase | null;
  night_phase: NightPhase | null;
  day_number: number;
  max_players: number;
  current_players: number;
  game_settings: string | number | boolean | null | Record<string, unknown> | unknown[]; // JsonValue from Prisma
  winner: string | null;
  creator_id: string;
  created_at: Date;
  started_at: Date | null;
  finished_at: Date | null;
  updated_at: Date;
}

export interface TestPlayer {
  user_id: string;
  game_id: string;
  role: WerewolfRole | null;
  team: Team | null;
  is_alive: boolean;
  is_host: boolean;
  joined_at: Date;
  eliminated_at: Date | null;
  votes_cast: number;
  lover_id: string | null;
  has_heal_potion: boolean;
  has_poison_potion: boolean;
  can_shoot: boolean;
  has_spied: boolean;
  spy_risk: number;
  is_protected: boolean;
}

export interface TestGameData {
  users: TestUser[];
  games: TestGame[];
  players: TestPlayer[];
}

// Global test database instance
export const testDb = new TestDatabaseManager();
