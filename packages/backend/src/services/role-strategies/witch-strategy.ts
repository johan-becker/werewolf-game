import { BaseRoleStrategy } from './base-role-strategy';
import {
  WerewolfRole,
  WerewolfPlayer,
  NightAction,
  ActionResult,
  WerewolfGameState,
  ActionType,
  Team,
  NightPhase
} from '../../types/werewolf-roles.types';

/**
 * Hexen-Strategie - Hat Heiltrank und Gifttrank (je 1x pro Spiel)
 */
export class WitchStrategy extends BaseRoleStrategy {
  role = WerewolfRole.WITCH;

  /**
   * Hexe kann nachts heilen/vergiften und tagsüber abstimmen
   */
  getAvailableActions(
    player: WerewolfPlayer,
    gameState: WerewolfGameState
  ): ActionType[] {
    if (!player.isAlive) return [];
    
    const actions: ActionType[] = [];
    
    if (gameState.phase === 'DAY') {
      actions.push(ActionType.VILLAGE_VOTE);
    } else if (gameState.phase === 'NIGHT' && gameState.currentNightPhase === NightPhase.WITCH_PHASE) {
      // Heiltrank verfügbar?
      if (player.specialStates.hasHealPotion) {
        actions.push(ActionType.WITCH_HEAL);
      }
      
      // Gifttrank verfügbar?
      if (player.specialStates.hasPoisonPotion) {
        actions.push(ActionType.WITCH_POISON);
      }
      
      // Keine Aktion auch möglich
      actions.push(ActionType.NO_ACTION);
    }
    
    return actions;
  }

  /**
   * Führt Hexen-Aktion durch
   */
  async executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    switch (action.actionType) {
      case ActionType.WITCH_HEAL:
        return this.executeHeal(player, action, allPlayers, gameState);
      
      case ActionType.WITCH_POISON:
        return this.executePoison(player, action, allPlayers, gameState);
      
      case ActionType.NO_ACTION:
        return {
          success: true,
          message: 'Du hast keine Aktion gewählt'
        };
      
      default:
        return {
          success: false,
          message: 'Ungültige Aktion für Hexe'
        };
    }
  }

  /**
   * Heiltrank verwenden
   */
  private async executeHeal(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    if (!player.specialStates.hasHealPotion) {
      return {
        success: false,
        message: 'Heiltrank bereits verwendet'
      };
    }

    if (!action.targetId) {
      return {
        success: false,
        message: 'Ziel erforderlich für Heilung'
      };
    }

    const target = this.findPlayer(allPlayers, action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden'
      };
    }

    // Hexe kann sich nicht selbst heilen
    if (target.id === player.id) {
      return {
        success: false,
        message: 'Du kannst dich nicht selbst heilen'
      };
    }

    // Kann nur das Werwolf-Opfer heilen (müsste aus gameState.lastNightResults kommen)
    // TODO: Implementierung abhängig von Werwolf-Opfer

    // Heiltrank verbrauchen
    player.specialStates.hasHealPotion = false;

    return {
      success: true,
      message: `Du hast ${target.username} geheilt`,
      effects: {
        deaths: [],
        protections: [target.id],
        lovers: []
      }
    };
  }

  /**
   * Gifttrank verwenden
   */
  private async executePoison(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    if (!player.specialStates.hasPoisonPotion) {
      return {
        success: false,
        message: 'Gifttrank bereits verwendet'
      };
    }

    if (!action.targetId) {
      return {
        success: false,
        message: 'Ziel erforderlich für Vergiftung'
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
        message: 'Kann keine toten Spieler vergiften'
      };
    }

    // Gifttrank verbrauchen
    player.specialStates.hasPoisonPotion = false;

    return {
      success: true,
      message: `Du hast ${target.username} vergiftet`,
      effects: {
        deaths: [target.id],
        protections: [],
        lovers: []
      }
    };
  }

  /**
   * Initialisiert Hexe mit beiden Tränken
   */
  initializePlayer(playerId: string, gameId: string): Partial<WerewolfPlayer> {
    return {
      role: WerewolfRole.WITCH,
      team: Team.VILLAGE,
      specialStates: {
        hasHealPotion: true,  // Startet mit Heiltrank
        hasPoisonPotion: true, // Startet mit Gifttrank
        canShoot: false,
        hasSpied: false,
        spyRisk: 0,
        isProtected: false
      }
    };
  }

  /**
   * Hexe kann in ihrer Phase heilen/vergiften oder tagsüber abstimmen
   */
  protected validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    switch (action) {
      case ActionType.WITCH_HEAL:
        return gameState.phase === 'NIGHT' && 
               gameState.currentNightPhase === NightPhase.WITCH_PHASE &&
               player.specialStates.hasHealPotion;
      
      case ActionType.WITCH_POISON:
        return gameState.phase === 'NIGHT' && 
               gameState.currentNightPhase === NightPhase.WITCH_PHASE &&
               player.specialStates.hasPoisonPotion;
      
      case ActionType.VILLAGE_VOTE:
        return gameState.phase === 'DAY';
      
      case ActionType.NO_ACTION:
        return gameState.phase === 'NIGHT' && gameState.currentNightPhase === NightPhase.WITCH_PHASE;
      
      default:
        return false;
    }
  }
}