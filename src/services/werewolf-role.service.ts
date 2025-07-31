import { 
  WerewolfRole, 
  Team, 
  RoleInfo, 
  WinCondition, 
  ActionType,
  GameRoleConfig,
  ConfigValidationResult,
  WerewolfPlayer,
  RoleStrategy
} from '../types/werewolf-roles.types';

// Role Strategy Imports
import { VillagerStrategy } from './role-strategies/villager-strategy';
import { SeerStrategy } from './role-strategies/seer-strategy';
import { WitchStrategy } from './role-strategies/witch-strategy';
import { HunterStrategy } from './role-strategies/hunter-strategy';
import { CupidStrategy } from './role-strategies/cupid-strategy';
import { LittleGirlStrategy } from './role-strategies/little-girl-strategy';
import { WerewolfStrategy } from './role-strategies/werewolf-strategy';

/**
 * Service für klassische Werwolf-Rollen basierend auf der Original-Spielanleitung
 */
export class WerewolfRoleService {
  private roleStrategies: Map<WerewolfRole, RoleStrategy> = new Map();
  
  constructor() {
    this.initializeRoleStrategies();
  }

  /**
   * Initialisiert alle Rollen-Strategien
   */
  private initializeRoleStrategies(): void {
    this.roleStrategies.set(WerewolfRole.VILLAGER, new VillagerStrategy());
    this.roleStrategies.set(WerewolfRole.SEER, new SeerStrategy());
    this.roleStrategies.set(WerewolfRole.WITCH, new WitchStrategy());
    this.roleStrategies.set(WerewolfRole.HUNTER, new HunterStrategy());
    this.roleStrategies.set(WerewolfRole.CUPID, new CupidStrategy());
    this.roleStrategies.set(WerewolfRole.LITTLE_GIRL, new LittleGirlStrategy());
    this.roleStrategies.set(WerewolfRole.WEREWOLF, new WerewolfStrategy());
  }

  /**
   * Gibt Rolle-Informationen zurück
   */
  getRoleInfo(role: WerewolfRole): RoleInfo {
    const roleInfoMap: Record<WerewolfRole, RoleInfo> = {
      [WerewolfRole.VILLAGER]: {
        role: WerewolfRole.VILLAGER,
        name: 'Dorfbewohner',
        description: 'Ein einfacher Dorfbewohner ohne besondere Fähigkeiten. Gewinnt, wenn alle Werwölfe eliminiert sind.',
        team: Team.VILLAGE,
        nightActions: [],
        dayActions: [ActionType.VILLAGE_VOTE],
        winConditions: [WinCondition.VILLAGE_WINS],
        specialRules: [
          'Keine besonderen Fähigkeiten',
          'Kann nur bei der Tagesabstimmung teilnehmen'
        ]
      },
      
      [WerewolfRole.SEER]: {
        role: WerewolfRole.SEER,
        name: 'Seherin',
        description: 'Kann jede Nacht die wahre Identität eines Spielers erfahren.',
        team: Team.VILLAGE,
        nightActions: [ActionType.SEER_INVESTIGATE],
        dayActions: [ActionType.VILLAGE_VOTE],
        winConditions: [WinCondition.VILLAGE_WINS],
        specialRules: [
          'Erwacht als erste in der Nacht',
          'Erfährt die exakte Rolle des untersuchten Spielers',
          'Information wird nur ihr mitgeteilt'
        ]
      },
      
      [WerewolfRole.WITCH]: {
        role: WerewolfRole.WITCH,
        name: 'Hexe',
        description: 'Hat einen Heiltrank und einen Gifttrank, jeweils einmal pro Spiel nutzbar.',
        team: Team.VILLAGE,
        nightActions: [ActionType.WITCH_HEAL, ActionType.WITCH_POISON],
        dayActions: [ActionType.VILLAGE_VOTE],
        winConditions: [WinCondition.VILLAGE_WINS],
        specialRules: [
          'Erfährt das Opfer der Werwölfe',
          'Kann das Opfer mit dem Heiltrank retten',
          'Kann mit dem Gifttrank zusätzlich jemanden töten',
          'Kann nicht sich selbst heilen',
          'Jeder Trank nur einmal pro Spiel verwendbar'
        ]
      },
      
      [WerewolfRole.HUNTER]: {
        role: WerewolfRole.HUNTER,
        name: 'Jäger',
        description: 'Wenn er stirbt, kann er einen anderen Spieler mit in den Tod reißen.',
        team: Team.VILLAGE,
        nightActions: [],
        dayActions: [ActionType.VILLAGE_VOTE, ActionType.HUNTER_SHOOT],
        winConditions: [WinCondition.VILLAGE_WINS],
        specialRules: [
          'Schießt sofort nach seinem Tod',
          'Kann jeden lebenden Spieler als Ziel wählen',
          'Schuss wird sofort ausgeführt (Tag oder Nacht)'
        ]
      },
      
      [WerewolfRole.CUPID]: {
        role: WerewolfRole.CUPID,
        name: 'Amor',
        description: 'Bestimmt in der ersten Nacht zwei Verliebte, die zusammen sterben.',
        team: Team.VILLAGE,
        nightActions: [ActionType.CUPID_LINK],
        dayActions: [ActionType.VILLAGE_VOTE],
        winConditions: [WinCondition.VILLAGE_WINS, WinCondition.LOVERS_WIN],
        specialRules: [
          'Handelt nur in der ersten Nacht',
          'Wählt zwei Spieler als Verliebte',
          'Wenn ein Verliebter stirbt, stirbt der andere sofort mit',
          'Verliebte können ein eigenes Gewinnerteam bilden'
        ]
      },
      
      [WerewolfRole.LITTLE_GIRL]: {
        role: WerewolfRole.LITTLE_GIRL,
        name: 'Mädchen',
        description: 'Kann während der Werwolf-Phase vorsichtig die Augen öffnen und spionieren.',
        team: Team.VILLAGE,
        nightActions: [ActionType.LITTLE_GIRL_SPY],
        dayActions: [ActionType.VILLAGE_VOTE],
        winConditions: [WinCondition.VILLAGE_WINS],
        specialRules: [
          'Kann während der Werwolf-Phase spionieren',
          'Risiko entdeckt zu werden steigt mit jeder Spionage',
          'Wenn entdeckt, wird sie sofort von den Werwölfen getötet',
          'Erfährt die Identitäten der aktiven Werwölfe'
        ]
      },
      
      [WerewolfRole.WEREWOLF]: {
        role: WerewolfRole.WEREWOLF,
        name: 'Werwolf',
        description: 'Erwacht nachts und eliminiert gemeinsam mit anderen Werwölfen ein Opfer.',
        team: Team.WEREWOLF,
        nightActions: [ActionType.WEREWOLF_KILL],
        dayActions: [ActionType.VILLAGE_VOTE],
        winConditions: [WinCondition.WEREWOLVES_WIN],
        specialRules: [
          'Kennt alle anderen Werwölfe',
          'Entscheidet gemeinsam über das nächtliche Opfer',
          'Muss sich tagsüber als Dorfbewohner tarnen'
        ]
      }
    };

    return roleInfoMap[role];
  }

  /**
   * Validiert eine Rollen-Konfiguration
   */
  validateRoleConfig(config: GameRoleConfig, totalPlayers: number): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basis-Validierung
    if (config.werewolves < 1) {
      errors.push('Mindestens 1 Werwolf erforderlich');
    }

    if (config.villagers < 1) {
      errors.push('Mindestens 1 Dorfbewohner erforderlich');
    }

    // Berechne Gesamtzahl
    const configuredPlayers = this.getTotalPlayersFromConfig(config);
    
    if (configuredPlayers !== totalPlayers) {
      errors.push(`Konfiguration für ${configuredPlayers} Spieler, aber ${totalPlayers} Spieler im Spiel`);
    }

    if (totalPlayers < 4) {
      errors.push('Mindestens 4 Spieler erforderlich');
    }

    if (totalPlayers > 20) {
      errors.push('Maximal 20 Spieler unterstützt');
    }

    // Balance-Prüfung
    const werewolfPercentage = (config.werewolves / totalPlayers) * 100;
    
    if (werewolfPercentage < 15) {
      warnings.push(`Nur ${werewolfPercentage.toFixed(1)}% Werwölfe - könnte zu einfach für Dorfbewohner sein`);
      suggestions.push('Empfohlen: 20-30% Werwölfe für ausgewogenes Spiel');
    }
    
    if (werewolfPercentage > 40) {
      warnings.push(`${werewolfPercentage.toFixed(1)}% Werwölfe - könnte zu schwer für Dorfbewohner sein`);
      suggestions.push('Empfohlen: 20-30% Werwölfe für ausgewogenes Spiel');
    }

    // Rollen-spezifische Validierung
    if (config.cupid && config.littleGirl && totalPlayers < 6) {
      warnings.push('Amor und Mädchen bei wenigen Spielern kann unausgewogen sein');
    }

    if (!config.seer && totalPlayers > 6) {
      suggestions.push('Seherin empfohlen bei mehr als 6 Spielern');
    }

    if (config.witch && config.hunter && config.seer && totalPlayers < 8) {
      warnings.push('Viele Spezialrollen bei wenigen Spielern');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      totalPlayers: configuredPlayers,
      werewolfPercentage
    };
  }

  /**
   * Erstellt eine Standard-Konfiguration basierend auf Spieleranzahl
   */
  generateDefaultConfig(totalPlayers: number): GameRoleConfig {
    // Empfohlene Werwolf-Anzahl (25% der Spieler, minimum 1)
    const werewolves = Math.max(1, Math.floor(totalPlayers * 0.25));
    
    // Basis-Rollen
    const config: GameRoleConfig = {
      werewolves,
      villagers: totalPlayers - werewolves,
      seer: false,
      witch: false,
      hunter: false,
      cupid: false,
      littleGirl: false
    };

    // Spezialrollen basierend auf Spieleranzahl hinzufügen
    if (totalPlayers >= 5) {
      config.seer = true;
      config.villagers--;
    }

    if (totalPlayers >= 7) {
      config.witch = true;
      config.villagers--;
    }

    if (totalPlayers >= 8) {
      config.hunter = true;
      config.villagers--;
    }

    if (totalPlayers >= 10) {
      config.cupid = true;
      config.villagers--;
    }

    if (totalPlayers >= 12) {
      config.littleGirl = true;
      config.villagers--;
    }

    return config;
  }

  /**
   * Verteilt Rollen basierend auf Konfiguration
   */
  assignRoles(playerIds: string[], config: GameRoleConfig): Array<{ playerId: string; role: WerewolfRole }> {
    const assignments: Array<{ playerId: string; role: WerewolfRole }> = [];
    const availablePlayerIds = [...playerIds];

    // Helper function für zufällige Auswahl
    const selectRandomPlayer = (): string => {
      const index = Math.floor(Math.random() * availablePlayerIds.length);
      return availablePlayerIds.splice(index, 1)[0];
    };

    // 1. Werwölfe zuweisen
    for (let i = 0; i < config.werewolves; i++) {
      assignments.push({
        playerId: selectRandomPlayer(),
        role: WerewolfRole.WEREWOLF
      });
    }

    // 2. Spezialrollen zuweisen
    if (config.seer) {
      assignments.push({
        playerId: selectRandomPlayer(),
        role: WerewolfRole.SEER
      });
    }

    if (config.witch) {
      assignments.push({
        playerId: selectRandomPlayer(),
        role: WerewolfRole.WITCH
      });
    }

    if (config.hunter) {
      assignments.push({
        playerId: selectRandomPlayer(),
        role: WerewolfRole.HUNTER
      });
    }

    if (config.cupid) {
      assignments.push({
        playerId: selectRandomPlayer(),
        role: WerewolfRole.CUPID
      });
    }

    if (config.littleGirl) {
      assignments.push({
        playerId: selectRandomPlayer(),
        role: WerewolfRole.LITTLE_GIRL
      });
    }

    // 3. Restliche Spieler als Dorfbewohner
    while (availablePlayerIds.length > 0) {
      assignments.push({
        playerId: selectRandomPlayer(),
        role: WerewolfRole.VILLAGER
      });
    }

    return assignments;
  }

  /**
   * Erstellt einen neuen Spieler mit Rolle
   */
  createPlayer(
    playerId: string, 
    gameId: string, 
    userId: string, 
    username: string, 
    role: WerewolfRole,
    isHost: boolean = false
  ): WerewolfPlayer {
    const basePlayer: WerewolfPlayer = {
      id: playerId,
      gameId,
      userId,
      username,
      role,
      team: this.getRoleTeam(role),
      isAlive: true,
      isHost,
      specialStates: {
        hasHealPotion: role === WerewolfRole.WITCH,
        hasPoisonPotion: role === WerewolfRole.WITCH,
        canShoot: role === WerewolfRole.HUNTER,
        hasSpied: false,
        spyRisk: 10, // Basis-Risiko für Mädchen
        isProtected: false
      },
      joinedAt: new Date()
    };

    // Rolle-spezifische Initialisierung über Strategy Pattern
    const strategy = this.roleStrategies.get(role);
    if (strategy) {
      const roleSpecificData = strategy.initializePlayer(playerId, gameId);
      Object.assign(basePlayer, roleSpecificData);
    }

    return basePlayer;
  }

  /**
   * Ermittelt das Team einer Rolle
   */
  getRoleTeam(role: WerewolfRole): Team {
    return role === WerewolfRole.WEREWOLF ? Team.WEREWOLF : Team.VILLAGE;
  }

  /**
   * Prüft Sieg-Bedingungen
   */
  checkWinCondition(players: WerewolfPlayer[]): WinCondition | null {
    const alivePlayers = players.filter(p => p.isAlive);
    const aliveWerewolves = alivePlayers.filter(p => p.role === WerewolfRole.WEREWOLF);
    const aliveVillagers = alivePlayers.filter(p => p.team === Team.VILLAGE);
    const aliveLovers = alivePlayers.filter(p => p.specialStates.loverId);

    // 1. Liebespaar-Sieg: Nur noch das Liebespaar lebt
    if (aliveLovers.length === 2 && alivePlayers.length === 2) {
      const lover1 = aliveLovers[0];
      const lover2 = aliveLovers[1];
      
      // Prüfe ob sie tatsächlich ein Paar sind
      if (lover1.specialStates.loverId === lover2.id && 
          lover2.specialStates.loverId === lover1.id) {
        
        // Liebespaar gewinnt nur wenn ein Dorfbewohner und ein Werwolf verliebt sind
        const hasWerewolf = aliveLovers.some(p => p.role === WerewolfRole.WEREWOLF);
        const hasVillager = aliveLovers.some(p => p.team === Team.VILLAGE);
        
        if (hasWerewolf && hasVillager) {
          return WinCondition.LOVERS_WIN;
        }
      }
    }

    // 2. Dorfbewohner-Sieg: Alle Werwölfe eliminiert
    if (aliveWerewolves.length === 0) {
      return WinCondition.VILLAGE_WINS;
    }

    // 3. Werwolf-Sieg: Werwölfe >= Dorfbewohner
    if (aliveWerewolves.length >= aliveVillagers.length) {
      return WinCondition.WEREWOLVES_WIN;
    }

    return null; // Spiel geht weiter
  }

  /**
   * Ermittelt die Reihenfolge der Nacht-Phasen
   */
  getNightPhaseOrder(): WerewolfRole[] {
    return [
      WerewolfRole.SEER,        // 1. Seherin erwacht
      WerewolfRole.WEREWOLF,    // 2. Werwölfe erwachen (Mädchen kann spionieren)
      WerewolfRole.WITCH        // 3. Hexe erwacht
    ];
  }

  /**
   * Berechnet Gesamtspieleranzahl aus Konfiguration
   */
  private getTotalPlayersFromConfig(config: GameRoleConfig): number {
    return config.villagers + 
           config.werewolves + 
           (config.seer ? 1 : 0) +
           (config.witch ? 1 : 0) +
           (config.hunter ? 1 : 0) +
           (config.cupid ? 1 : 0) +
           (config.littleGirl ? 1 : 0);
  }

  /**
   * Registriert eine neue Rollen-Strategie
   */
  registerRoleStrategy(role: WerewolfRole, strategy: RoleStrategy): void {
    this.roleStrategies.set(role, strategy);
  }

  /**
   * Ermittelt verfügbare Aktionen für einen Spieler
   */
  getAvailableActions(player: WerewolfPlayer, isNight: boolean): ActionType[] {
    const strategy = this.roleStrategies.get(player.role);
    if (strategy) {
      // Hier würde der GameState übergeben werden
      return strategy.getAvailableActions(player, {} as any);
    }

    // Fallback: Basis-Aktionen
    const roleInfo = this.getRoleInfo(player.role);
    return isNight ? roleInfo.nightActions : roleInfo.dayActions;
  }

  /**
   * Führt eine Aktion aus
   */
  async executeAction(
    player: WerewolfPlayer, 
    action: any, 
    allPlayers: WerewolfPlayer[]
  ): Promise<any> {
    const strategy = this.roleStrategies.get(player.role);
    if (strategy) {
      return await strategy.executeAction(player, action, allPlayers, {} as any);
    }

    throw new Error(`No strategy found for role: ${player.role}`);
  }
}