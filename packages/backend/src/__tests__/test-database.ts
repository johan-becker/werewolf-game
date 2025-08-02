import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { WerewolfRole } from '../types/werewolf-roles.types';

// Test database configuration for werewolf game
export class TestDatabaseManager {
  private prisma: PrismaClient;
  private supabase: any;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/werewolf_test',
        },
      },
    });

    this.supabase = createClient(
      process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
      process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || 'test-key'
    );
  }

  async setup(): Promise<void> {
    try {
      // Clean existing test data
      await this.cleanup();
      
      // Seed werewolf-themed test data
      await this.seedTestData();
      
      console.log('🌕 Test database setup completed with werewolf-themed data');
    } catch (error) {
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
      
      console.log('🌑 Test database cleaned up');
    } catch (error) {
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
      'Luna_Nighthowl', 'Shadow_Fang', 'Crimson_Claw', 'Moonlight_Hunter',
      'Silver_Bite', 'Dark_Paw', 'Blood_Moon', 'Alpha_Storm',
      'Night_Stalker', 'Howling_Wind', 'Mystic_Wolf', 'Savage_Tooth'
    ];

    const users: TestUser[] = [];
    
    for (const name of werewolfNames) {
      const user = await this.prisma.profile.create({
        data: {
          id: faker.string.uuid(),
          username: name,
          email: `${name.toLowerCase()}@werewolf-test.com`,
          display_name: name.replace('_', ' '),
          avatar_url: `https://werewolf-avatars.test/${name}.png`,
          pack_affiliation: faker.helpers.arrayElement(['Shadow Pack', 'Blood Moon Clan', 'Silver Fang Alliance', 'Lone Wolves']),
          werewolf_level: faker.number.int({ min: 1, max: 50 }),
          moon_phase_preference: faker.helpers.arrayElement(['new_moon', 'waxing_crescent', 'full_moon', 'waning_gibbous']),
          territory_claimed: faker.location.city(),
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
      { name: 'Moonlit Village', status: 'waiting', max_players: 8 },
      { name: 'Howling Hills', status: 'in_progress', max_players: 12 },
      { name: 'Shadow Forest', status: 'finished', max_players: 10 },
      { name: 'Blood Moon Rising', status: 'waiting', max_players: 15 },
      { name: 'Silver Lake Settlement', status: 'in_progress', max_players: 6 },
    ];

    const games: TestGame[] = [];

    for (const scenario of gameScenarios) {
      const creator = faker.helpers.arrayElement(users);
      const game = await this.prisma.game.create({
        data: {
          code: this.generateWerewolfGameCode(),
          name: scenario.name,
          status: scenario.status as any,
          max_players: scenario.max_players,
          current_phase: scenario.status === 'in_progress' ? 
            faker.helpers.arrayElement(['day', 'night', 'voting']) : 'waiting',
          phase_end_time: scenario.status === 'in_progress' ? 
            faker.date.future({ years: 0.01 }) : null,
          creator_id: creator.id,
          settings: {
            night_length_minutes: 5,
            day_length_minutes: 10,
            werewolf_ratio: 0.25,
            special_roles_enabled: true,
            pack_hunting_enabled: true,
            moon_phase_effects: true,
            territory_bonuses: true,
          },
          created_at: faker.date.recent({ days: 7 }),
        },
      });
      games.push(game);
    }

    return games;
  }

  private async createWerewolfPlayers(games: TestGame[], users: TestUser[]): Promise<TestPlayer[]> {
    const werewolfRoles: WerewolfRole[] = [
      WerewolfRole.VILLAGER, WerewolfRole.WEREWOLF, WerewolfRole.SEER, 
      WerewolfRole.WITCH, WerewolfRole.HUNTER, WerewolfRole.CUPID, 
      WerewolfRole.LITTLE_GIRL
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
        const role = i === 0 ? WerewolfRole.WEREWOLF : faker.helpers.arrayElement(werewolfRoles);
        
        const player = await this.prisma.player.create({
          data: {
            game_id: game.id,
            user_id: user.id,
            role: role as any,
            is_alive: faker.datatype.boolean(0.8), // 80% chance of being alive
            is_host: i === 0,
            position: i,
            night_action_target: null,
            werewolf_team: role === WerewolfRole.WEREWOLF ? 'werewolf' : 'villager',
            pack_rank: role === WerewolfRole.WEREWOLF ? 
              faker.helpers.arrayElement(['alpha', 'beta', 'omega']) : null,
            territory_bonus_active: faker.datatype.boolean(0.3),
            moon_phase_power_used: faker.datatype.boolean(0.2),
            joined_at: faker.date.recent({ days: 1 }),
          },
        });
        players.push(player);
      }
    }

    return players;
  }

  private async createWerewolfChatMessages(games: TestGame[], players: TestPlayer[]): Promise<void> {
    const werewolfPhrases = [
      "The pack grows stronger under the full moon 🌕",
      "I sense something lurking in the shadows...",
      "The village elder speaks of ancient werewolf legends",
      "Blood moon tonight - perfect for hunting 🩸",
      "My werewolf instincts are tingling",
      "The alpha's howl echoes through the forest",
      "Silver bullets won't save you now!",
      "The hunt begins at midnight 🐺",
      "Pack loyalty above all else",
      "The moon reveals all secrets...",
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
            channel: faker.helpers.arrayElement(['LOBBY', 'DAY', 'NIGHT', 'DEAD']),
            message_type: 'PLAYER',
            is_system: false,
            mentions: [],
            werewolf_role_hint: sender.role === WerewolfRole.WEREWOLF ? 
              faker.datatype.boolean(0.1) : false, // 10% chance for werewolves to hint
            pack_communication: sender.role === WerewolfRole.WEREWOLF && 
              faker.datatype.boolean(0.3), // 30% chance for pack communication
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
  username: string;
  email: string;
  display_name: string;
  avatar_url: string;
  pack_affiliation: string;
  werewolf_level: number;
  moon_phase_preference: string;
  territory_claimed: string;
  created_at: Date;
  updated_at: Date;
}

export interface TestGame {
  id: string;
  code: string;
  name: string;
  status: string;
  max_players: number;
  current_phase: string;
  phase_end_time: Date | null;
  creator_id: string;
  settings: any;
  created_at: Date;
}

export interface TestPlayer {
  id: string;
  game_id: string;
  user_id: string;
  role: string;
  is_alive: boolean;
  is_host: boolean;
  position: number;
  werewolf_team: string;
  pack_rank: string | null;
  territory_bonus_active: boolean;
  moon_phase_power_used: boolean;
  joined_at: Date;
}

export interface TestGameData {
  users: TestUser[];
  games: TestGame[];
  players: TestPlayer[];
}

// Global test database instance
export const testDb = new TestDatabaseManager();