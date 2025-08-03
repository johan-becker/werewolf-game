import { faker } from '@faker-js/faker';
import { WerewolfRole } from '../../types/werewolf-roles.types';
import { ChatMessageType } from '../../types/chat.types';

/**
 * Factory functions for generating werewolf-themed test data
 * Ensures consistent and realistic test scenarios
 */

export class WerewolfUserFactory {
  static create(overrides: Partial<any> = {}): any {
    const werewolfNames = [
      'Fenrir_Shadowmane', 'Luna_Bloodfang', 'Remus_Nighthowl', 'Selene_Moonclaw',
      'Lycaon_Darkheart', 'Artemis_Silverpaw', 'Sirius_Ironjaw', 'Nyx_Ghostwolf',
      'Orion_Stormfang', 'Diana_Mistwalker'
    ];

    return {
      id: faker.string.uuid(),
      username: faker.helpers.arrayElement(werewolfNames),
      email: faker.internet.email(),
      display_name: faker.person.fullName(),
      avatar_url: `https://werewolf-avatars.test/${faker.string.uuid()}.png`,
      pack_affiliation: faker.helpers.arrayElement([
        'Shadow Pack', 'Blood Moon Clan', 'Silver Fang Alliance', 
        'Lone Wolves', 'Crimson Howlers', 'Moonlight Hunters'
      ]),
      werewolf_level: faker.number.int({ min: 1, max: 100 }),
      moon_phase_preference: faker.helpers.arrayElement([
        'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
        'full_moon', 'waning_gibbous', 'third_quarter', 'waning_crescent'
      ]),
      territory_claimed: faker.location.city(),
      transformation_count: faker.number.int({ min: 0, max: 50 }),
      pack_leadership_score: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
      created_at: faker.date.past({ years: 2 }),
      updated_at: faker.date.recent({ days: 7 }),
      ...overrides,
    };
  }

  static createBatch(count: number, overrides: Partial<any> = {}): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static createAlphaWerewolf(overrides: Partial<any> = {}): any {
    return this.create({
      pack_affiliation: 'Alpha Pack',
      werewolf_level: faker.number.int({ min: 80, max: 100 }),
      pack_leadership_score: faker.number.float({ min: 8, max: 10, fractionDigits: 2 }),
      transformation_count: faker.number.int({ min: 30, max: 50 }),
      ...overrides,
    });
  }

  static createNewWerewolf(overrides: Partial<any> = {}): any {
    return this.create({
      werewolf_level: faker.number.int({ min: 1, max: 10 }),
      pack_leadership_score: faker.number.float({ min: 0, max: 2, fractionDigits: 2 }),
      transformation_count: faker.number.int({ min: 0, max: 5 }),
      created_at: faker.date.recent({ days: 30 }),
      ...overrides,
    });
  }
}

export class WerewolfGameFactory {
  static create(overrides: Partial<any> = {}): any {
    const gameNames = [
      'Moonlit Village Massacre', 'Shadow Forest Hunt', 'Blood Moon Rising',
      'Silver Lake Settlement', 'Howling Hills Horror', 'Crimson Claw Manor',
      'Midnight Pack Territory', 'Werewolf\'s Den', 'Full Moon Gathering',
      'Alpha\'s Domain Challenge'
    ];

    return {
      id: faker.string.uuid(),
      code: this.generateWerewolfGameCode(),
      name: faker.helpers.arrayElement(gameNames),
      status: faker.helpers.arrayElement(['waiting', 'in_progress', 'finished']),
      max_players: faker.number.int({ min: 6, max: 20 }),
      current_phase: faker.helpers.arrayElement(['waiting', 'day', 'night', 'voting', 'finished']),
      phase_end_time: faker.date.future({ years: 0.01 }),
      creator_id: faker.string.uuid(),
      settings: {
        night_length_minutes: faker.number.int({ min: 3, max: 10 }),
        day_length_minutes: faker.number.int({ min: 5, max: 15 }),
        werewolf_ratio: faker.number.float({ min: 0.2, max: 0.4, fractionDigits: 2 }),
        special_roles_enabled: faker.datatype.boolean(0.8),
        pack_hunting_enabled: faker.datatype.boolean(0.6),
        moon_phase_effects: faker.datatype.boolean(0.7),
        territory_bonuses: faker.datatype.boolean(0.5),
        alpha_werewolf_enabled: faker.datatype.boolean(0.3),
        transformation_animations: faker.datatype.boolean(0.9),
      },
      moon_phase: faker.helpers.arrayElement([
        'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
        'full_moon', 'waning_gibbous', 'third_quarter', 'waning_crescent'
      ]),
      territory_type: faker.helpers.arrayElement([
        'forest', 'village', 'mountain', 'lakeside', 'desert', 'tundra'
      ]),
      difficulty_level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced', 'expert']),
      created_at: faker.date.past({ years: 1 }),
      ...overrides,
    };
  }

  static createActiveGame(overrides: Partial<any> = {}): any {
    return this.create({
      status: 'in_progress',
      current_phase: faker.helpers.arrayElement(['day', 'night', 'voting']),
      phase_end_time: faker.date.future({ years: 0.01 }),
      ...overrides,
    });
  }

  static createWaitingGame(overrides: Partial<any> = {}): any {
    return this.create({
      status: 'waiting',
      current_phase: 'waiting',
      phase_end_time: null,
      ...overrides,
    });
  }

  static createFullMoonGame(overrides: Partial<any> = {}): any {
    return this.create({
      moon_phase: 'full_moon',
      settings: {
        ...this.create().settings,
        moon_phase_effects: true,
        werewolf_ratio: 0.35, // More werewolves during full moon
        pack_hunting_enabled: true,
      },
      ...overrides,
    });
  }

  private static generateWerewolfGameCode(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const prefixes = ['WOLF', 'MOON', 'PACK', 'HUNT', 'HOWL', 'FANG', 'CLAW'];
    const prefix = faker.helpers.arrayElement(prefixes);
    const suffix = Array.from({ length: 2 }, () => 
      chars.charAt(faker.number.int({ max: chars.length - 1 }))
    ).join('');
    return `${prefix}${suffix}`;
  }
}

export class WerewolfPlayerFactory {
  static create(overrides: Partial<any> = {}): any {
    const werewolfRoles: WerewolfRole[] = [
      WerewolfRole.VILLAGER, WerewolfRole.WEREWOLF, WerewolfRole.SEER, 
      WerewolfRole.WITCH, WerewolfRole.HUNTER, WerewolfRole.CUPID, 
      WerewolfRole.LITTLE_GIRL
    ];

    return {
      id: faker.string.uuid(),
      game_id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      role: faker.helpers.arrayElement(werewolfRoles),
      is_alive: faker.datatype.boolean(0.8),
      is_host: faker.datatype.boolean(0.1),
      position: faker.number.int({ min: 0, max: 19 }),
      night_action_target: null,
      werewolf_team: faker.helpers.arrayElement(['werewolf', 'villager']),
      pack_rank: faker.helpers.arrayElement(['alpha', 'beta', 'omega', null]),
      territory_bonus_active: faker.datatype.boolean(0.3),
      moon_phase_power_used: faker.datatype.boolean(0.2),
      transformation_progress: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      werewolf_abilities: {
        enhanced_senses: faker.datatype.boolean(0.4),
        pack_communication: faker.datatype.boolean(0.3),
        night_vision: faker.datatype.boolean(0.5),
        territorial_advantage: faker.datatype.boolean(0.2),
      },
      joined_at: faker.date.recent({ days: 1 }),
      ...overrides,
    };
  }

  static createWerewolf(overrides: Partial<any> = {}): any {
    return this.create({
      role: WerewolfRole.WEREWOLF,
      werewolf_team: 'werewolf',
      pack_rank: faker.helpers.arrayElement(['alpha', 'beta', 'omega']),
      werewolf_abilities: {
        enhanced_senses: true,
        pack_communication: true,
        night_vision: true,
        territorial_advantage: faker.datatype.boolean(0.8),
      },
      ...overrides,
    });
  }

  static createVillager(overrides: Partial<any> = {}): any {
    return this.create({
      role: WerewolfRole.VILLAGER,
      werewolf_team: 'villager',
      pack_rank: null,
      werewolf_abilities: {
        enhanced_senses: faker.datatype.boolean(0.1),
        pack_communication: false,
        night_vision: faker.datatype.boolean(0.1),
        territorial_advantage: faker.datatype.boolean(0.3),
      },
      ...overrides,
    });
  }

  static createAlphaWerewolf(overrides: Partial<any> = {}): any {
    return this.create({
      role: WerewolfRole.WEREWOLF,
      werewolf_team: 'werewolf',
      pack_rank: 'alpha',
      werewolf_abilities: {
        enhanced_senses: true,
        pack_communication: true,
        night_vision: true,
        territorial_advantage: true,
      },
      transformation_progress: faker.number.float({ min: 0.8, max: 1, fractionDigits: 2 }),
      ...overrides,
    });
  }

  static createGamePlayers(gameId: string, count: number): any[] {
    const players = [];
    
    // Ensure at least one werewolf and one villager
    players.push(this.createWerewolf({ game_id: gameId, position: 0 }));
    players.push(this.createVillager({ game_id: gameId, position: 1, is_host: true }));
    
    // Fill remaining positions
    for (let i = 2; i < count; i++) {
      players.push(this.create({ 
        game_id: gameId, 
        position: i,
        user_id: faker.string.uuid(),
      }));
    }
    
    return players;
  }
}

export class WerewolfChatFactory {
  static create(overrides: Partial<any> = {}): any {
    const werewolfMessages = [
      "The moon calls to us tonight 🌕",
      "I can smell fear in the air...",
      "The pack grows restless",
      "Silver bullets? You'll need more than that!",
      "The hunt begins at midnight 🐺",
      "My werewolf senses are tingling",
      "The alpha's howl echoes through the forest",
      "Blood moon tonight - perfect for the hunt",
      "Pack loyalty above all else",
      "The transformation is beginning...",
      "I see you hiding in the shadows",
      "The full moon reveals all secrets",
    ];

    return {
      id: faker.string.uuid(),
      game_id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      content: faker.helpers.arrayElement(werewolfMessages),
      channel: faker.helpers.arrayElement(['LOBBY', 'DAY', 'NIGHT', 'DEAD', 'WEREWOLF']),
      message_type: faker.helpers.arrayElement(['PLAYER', 'SYSTEM', 'ACTION']),
      is_system: faker.datatype.boolean(0.1),
      mentions: [],
      werewolf_role_hint: faker.datatype.boolean(0.1),
      pack_communication: faker.datatype.boolean(0.2),
      moon_phase_bonus: faker.datatype.boolean(0.15),
      territory_message: faker.datatype.boolean(0.1),
      created_at: faker.date.recent({ days: 1 }),
      edited_at: faker.datatype.boolean(0.1) ? faker.date.recent({ days: 1/24 }) : null,
      ...overrides,
    };
  }

  static createPackMessage(overrides: Partial<any> = {}): any {
    const packMessages = [
      "Fellow wolves, the time has come to strike",
      "Coordinate the attack - target the seer first",
      "The villagers suspect nothing... yet",
      "Stay in character during the day phase",
      "Remember, we hunt as one pack",
    ];

    return this.create({
      content: faker.helpers.arrayElement(packMessages),
      channel: 'WEREWOLF',
      pack_communication: true,
      werewolf_role_hint: true,
      ...overrides,
    });
  }

  static createSystemMessage(gameId: string, overrides: Partial<any> = {}): any {
    const systemMessages = [
      "The sun sets and darkness falls over the village...",
      "🌙 Night phase begins. Werewolves, choose your target.",
      "☀️ Dawn breaks. The village awakens to discover...",
      "⚰️ The victim has been found. The hunt continues.",
      "🗳️ Voting phase begins. Discuss and choose wisely.",
      "🎯 The werewolves have made their choice...",
      "🔮 The seer peers into the unknown...",
      "⚗️ The witch prepares her potions...",
    ];

    return this.create({
      game_id: gameId,
      user_id: null,
      content: faker.helpers.arrayElement(systemMessages),
      channel: 'SYSTEM',
      message_type: 'SYSTEM',
      is_system: true,
      pack_communication: false,
      werewolf_role_hint: false,
      ...overrides,
    });
  }

  static createChatHistory(gameId: string, messageCount: number = 20): any[] {
    const messages = [];
    
    // Add some system messages
    for (let i = 0; i < Math.floor(messageCount * 0.2); i++) {
      messages.push(this.createSystemMessage(gameId));
    }
    
    // Add player messages
    for (let i = 0; i < Math.floor(messageCount * 0.8); i++) {
      messages.push(this.create({ game_id: gameId }));
    }
    
    // Sort by creation time
    return messages.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }
}

export class WerewolfGameLogFactory {
  static create(overrides: Partial<any> = {}): any {
    const logActions = [
      'game_created', 'player_joined', 'player_left', 'game_started',
      'phase_changed', 'werewolf_kill', 'seer_vision', 'witch_heal',
      'witch_poison', 'hunter_revenge', 'voting_started', 'player_voted',
      'player_eliminated', 'game_ended', 'pack_communication',
      'transformation_triggered', 'moon_phase_bonus', 'territory_claimed'
    ];

    return {
      id: faker.string.uuid(),
      game_id: faker.string.uuid(),
      action: faker.helpers.arrayElement(logActions),
      actor_id: faker.string.uuid(),
      target_id: faker.string.uuid(),
      details: {
        moon_phase: faker.helpers.arrayElement(['new_moon', 'full_moon', 'waxing_crescent']),
        territory: faker.location.city(),
        pack_bonus: faker.datatype.boolean(0.3),
        werewolf_ability_used: faker.datatype.boolean(0.2),
      },
      created_at: faker.date.recent({ days: 1 }),
      ...overrides,
    };
  }

  static createGameSequence(gameId: string): any[] {
    const logs = [];
    
    // Game creation
    logs.push(this.create({
      game_id: gameId,
      action: 'game_created',
      created_at: faker.date.past({ years: 0.1 }),
    }));
    
    // Players joining
    for (let i = 0; i < faker.number.int({ min: 4, max: 8 }); i++) {
      logs.push(this.create({
        game_id: gameId,
        action: 'player_joined',
        created_at: faker.date.recent({ days: 1 }),
      }));
    }
    
    // Game phases
    logs.push(this.create({
      game_id: gameId,
      action: 'game_started',
      created_at: faker.date.recent({ days: 2/24 }),
    }));
    
    return logs.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }
}

// Export all factories as a unified interface
export const WerewolfFactories = {
  User: WerewolfUserFactory,
  Game: WerewolfGameFactory,
  Player: WerewolfPlayerFactory,
  Chat: WerewolfChatFactory,
  GameLog: WerewolfGameLogFactory,
};

// Simple test to satisfy Jest requirement
describe('Werewolf Factories', () => {
  it('should create werewolf user with valid properties', () => {
    const user = WerewolfUserFactory.create();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('pack_affiliation');
  });

  it('should create werewolf game with valid properties', () => {
    const game = WerewolfGameFactory.createActiveGame();
    expect(game).toHaveProperty('id');
    expect(game).toHaveProperty('status');
  });
});