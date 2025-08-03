import {
  GameRoleConfig,
  WerewolfRole,
  WerewolfPlayer,
  ConfigValidationResult
} from '../types/werewolf-roles.types';
import { WerewolfRoleService } from './werewolf-role.service';

/**
 * Factory für die Erstellung und Validierung von Rollenkonfigurationen
 */
export class RoleFactory {
  private static roleService = new WerewolfRoleService();

  /**
   * Erstellt und weist Rollen basierend auf Konfiguration zu
   */
  static createRolesFromConfig(
    config: GameRoleConfig, 
    players: WerewolfPlayer[]
  ): void {
    // Validierung der Konfiguration
    const validation = this.validateConfig(config, players.length);
    if (!validation.isValid) {
      throw new Error(`Ungültige Konfiguration: ${validation.errors.join(', ')}`);
    }

    // Spieler-IDs für Zuweisung sammeln
    const playerIds = players.map(p => p.id);
    
    // Rollen zuweisen mit automatischem Shuffling
    const assignments = this.roleService.assignRoles(playerIds, config);
    
    // Rollen zu Spielern zuweisen
    assignments.forEach(assignment => {
      const player = players.find(p => p.id === assignment.playerId);
      if (player) {
        player.role = assignment.role;
        player.team = this.roleService.getRoleTeam(assignment.role);
        
        // Rolle-spezifische Initialisierung
        // const roleInfo = this.roleService.getRoleInfo(assignment.role);
        this.initializePlayerForRole(player, assignment.role);
      }
    });
  }

  /**
   * Validiert eine Rollenkonfiguration
   */
  static validateConfig(
    config: GameRoleConfig,
    playerCount: number
  ): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Min/Max Checks
    if (playerCount < 4) {
      errors.push('Mindestens 4 Spieler erforderlich');
    }
    
    if (playerCount > 20) {
      errors.push('Maximal 20 Spieler unterstützt');
    }

    if (config.werewolves < 1) {
      errors.push('Mindestens 1 Werwolf erforderlich');
    }

    if (config.villagers < 1) {
      errors.push('Mindestens 1 Dorfbewohner erforderlich');
    }

    // Gesamtzahl prüfen
    const totalConfigured = this.getTotalPlayersFromConfig(config);
    if (totalConfigured !== playerCount) {
      errors.push(`Konfiguration für ${totalConfigured} Spieler, aber ${playerCount} im Spiel`);
    }

    // Balance-Warnungen
    const werewolfPercentage = (config.werewolves / playerCount) * 100;
    
    if (werewolfPercentage < 15) {
      warnings.push(`Nur ${werewolfPercentage.toFixed(1)}% Werwölfe - könnte zu einfach sein`);
      suggestions.push('Empfohlen: 20-30% Werwölfe für ausgewogenes Spiel');
    }
    
    if (werewolfPercentage > 40) {
      warnings.push(`${werewolfPercentage.toFixed(1)}% Werwölfe - könnte zu schwer sein`);
      suggestions.push('Empfohlen: 20-30% Werwölfe für ausgewogenes Spiel');
    }

    // Spezialrollen-Warnungen
    if (this.getSpecialRoleCount(config) > playerCount * 0.6) {
      warnings.push('Sehr viele Spezialrollen - könnte chaotisch werden');
    }

    if (!config.seer && playerCount > 6) {
      suggestions.push('Seherin empfohlen bei mehr als 6 Spielern');
    }

    if (config.cupid && config.littleGirl && playerCount < 6) {
      warnings.push('Amor und Mädchen bei wenigen Spielern kann unausgewogen sein');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      totalPlayers: totalConfigured,
      werewolfPercentage
    };
  }

  /**
   * Erstellt optimale Standard-Konfiguration
   */
  static createOptimalConfig(playerCount: number): GameRoleConfig {
    // Werwolf-Anzahl (25% der Spieler, minimum 1)
    const werewolves = Math.max(1, Math.floor(playerCount * 0.25));
    
    const config: GameRoleConfig = {
      werewolves,
      villagers: playerCount - werewolves,
      seer: false,
      witch: false,
      hunter: false,
      cupid: false,
      littleGirl: false
    };

    // Spezialrollen basierend auf Spieleranzahl
    const specialRoles = this.getRecommendedSpecialRoles(playerCount);
    
    specialRoles.forEach(role => {
      switch (role) {
        case WerewolfRole.SEER:
          config.seer = true;
          config.villagers--;
          break;
        case WerewolfRole.WITCH:
          config.witch = true;
          config.villagers--;
          break;
        case WerewolfRole.HUNTER:
          config.hunter = true;
          config.villagers--;
          break;
        case WerewolfRole.CUPID:
          config.cupid = true;
          config.villagers--;
          break;
        case WerewolfRole.LITTLE_GIRL:
          config.littleGirl = true;
          config.villagers--;
          break;
      }
    });

    return config;
  }

  /**
   * Ermittelt empfohlene Spezialrollen basierend auf Spieleranzahl
   */
  private static getRecommendedSpecialRoles(playerCount: number): WerewolfRole[] {
    const roles: WerewolfRole[] = [];

    if (playerCount >= 5) roles.push(WerewolfRole.SEER);
    if (playerCount >= 7) roles.push(WerewolfRole.WITCH);
    if (playerCount >= 8) roles.push(WerewolfRole.HUNTER);
    if (playerCount >= 10) roles.push(WerewolfRole.CUPID);
    if (playerCount >= 12) roles.push(WerewolfRole.LITTLE_GIRL);

    return roles;
  }

  /**
   * Berechnet Gesamtspieleranzahl aus Konfiguration
   */
  private static getTotalPlayersFromConfig(config: GameRoleConfig): number {
    return config.villagers + 
           config.werewolves + 
           (config.seer ? 1 : 0) +
           (config.witch ? 1 : 0) +
           (config.hunter ? 1 : 0) +
           (config.cupid ? 1 : 0) +
           (config.littleGirl ? 1 : 0);
  }

  /**
   * Zählt Spezialrollen in Konfiguration
   */
  private static getSpecialRoleCount(config: GameRoleConfig): number {
    return (config.seer ? 1 : 0) +
           (config.witch ? 1 : 0) +
           (config.hunter ? 1 : 0) +
           (config.cupid ? 1 : 0) +
           (config.littleGirl ? 1 : 0);
  }

  /**
   * Initialisiert Spieler für spezifische Rolle
   */
  private static initializePlayerForRole(player: WerewolfPlayer, role: WerewolfRole): void {
    // Rolle-spezifische Initialisierung
    switch (role) {
      case WerewolfRole.WITCH:
        player.specialStates.hasHealPotion = true;
        player.specialStates.hasPoisonPotion = true;
        break;
      
      case WerewolfRole.HUNTER:
        player.specialStates.canShoot = true;
        break;
      
      case WerewolfRole.LITTLE_GIRL:
        player.specialStates.spyRisk = 30; // 30% Basis-Risiko
        break;
      
      default:
        // Alle anderen Rollen haben Standard-Initialisierung
        break;
    }
  }

  /**
   * Erstellt Konfiguration mit bestimmten Einschränkungen
   */
  static createBalancedConfig(
    playerCount: number,
    preferences: Partial<GameRoleConfig> = {}
  ): GameRoleConfig {
    const baseConfig = this.createOptimalConfig(playerCount);
    
    // Präferenzen anwenden
    const config = { ...baseConfig, ...preferences };
    
    // Balance sicherstellen
    const totalConfigured = this.getTotalPlayersFromConfig(config);
    if (totalConfigured !== playerCount) {
      // Dorfbewohner anpassen
      config.villagers = playerCount - config.werewolves - this.getSpecialRoleCount(config);
    }
    
    // Minimum-Validierung
    if (config.villagers < 1) {
      throw new Error('Zu viele Spezialrollen für diese Spieleranzahl');
    }
    
    return config;
  }
}
