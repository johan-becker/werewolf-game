import { BaseRoleStrategy } from './base-role-strategy';
import {
  WerewolfRole,
  WerewolfPlayer,
  NightAction,
  ActionResult,
  WerewolfGameState,
  ActionType,
  Team
} from '../../types/werewolf-roles.types';

/**
 * Jäger-Strategie - Schießt beim Tod auf jemanden
 */
export class HunterStrategy extends BaseRoleStrategy {
  role = WerewolfRole.HUNTER;

  /**
   * Jäger kann tagsüber abstimmen
   */
  getAvailableActions(
    player: WerewolfPlayer,
    gameState: WerewolfGameState
  ): ActionType[] {
    if (!player.isAlive) return [];
    
    if (gameState.phase === 'DAY') {
      return [ActionType.VILLAGE_VOTE];
    }
    
    return []; // Nachts keine Aktionen
  }

  /**
   * Jäger hat keine normalen Nacht-Aktionen
   */
  async executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    if (action.actionType === ActionType.HUNTER_SHOOT) {
      return this.executeShoot(player, action, allPlayers, gameState);
    }
    
    return {
      success: false,
      message: 'Jäger kann nur beim Tod schießen'
    };
  }

  /**
   * Jäger schießt beim Tod
   */
  async onDeath(
    player: WerewolfPlayer,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult | null> {
    if (!player.specialStates.canShoot) {
      return null; // Bereits geschossen oder durch Gift gestorben
    }

    // Jäger kann beim Tod schießen - Aktion erforderlich
    return {
      success: true,
      message: 'Der Jäger kann beim Tod noch jemanden erschießen',
      requiresAction: true,
      availableActions: [ActionType.HUNTER_SHOOT]
    };
  }

  /**
   * Führt Jäger-Schuss durch
   */
  private async executeShoot(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    if (!player.specialStates.canShoot) {
      return {
        success: false,
        message: 'Kann nicht mehr schießen'
      };
    }

    if (!action.targetId) {
      return {
        success: false,
        message: 'Ziel erforderlich für Schuss'
      };
    }

    const target = this.findPlayer(allPlayers, action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden'
      };
    }

    if (!target.isAlive) {
      return {
        success: false,
        message: 'Kann keine toten Spieler erschießen'
      };
    }

    if (target.id === player.id) {
      return {
        success: false,
        message: 'Jäger kann sich nicht selbst erschießen'
      };
    }

    // Schuss verbrauchen
    player.specialStates.canShoot = false;

    return {
      success: true,
      message: `Der Jäger hat ${target.username} erschossen`,
      effects: {
        deaths: [target.id],
        protections: [],
        lovers: []
      }
    };
  }

  /**
   * Initialisiert Jäger mit Schuss-Fähigkeit
   */
  initializePlayer(playerId: string, gameId: string): Partial<WerewolfPlayer> {
    return {
      role: WerewolfRole.HUNTER,
      team: Team.VILLAGE,
      specialStates: {
        hasHealPotion: false,
        hasPoisonPotion: false,
        canShoot: true, // Jäger startet mit Schuss
        hasSpied: false,
        spyRisk: 0,
        isProtected: false
      }
    };
  }

  /**
   * Jäger kann tagsüber abstimmen oder beim Tod schießen
   */
  protected validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    switch (action) {
      case ActionType.VILLAGE_VOTE:
        return gameState.phase === 'DAY';
      
      case ActionType.HUNTER_SHOOT:
        return !player.isAlive && player.specialStates.canShoot; // Nur beim Tod
      
      default:
        return false;
    }
  }
}
