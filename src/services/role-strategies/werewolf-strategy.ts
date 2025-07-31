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
 * Werwolf-Strategie - Töten nachts gemeinsam ein Opfer
 */
export class WerewolfStrategy extends BaseRoleStrategy {
  role = WerewolfRole.WEREWOLF;

  /**
   * Werwolf kann nachts töten und tagsüber abstimmen
   */
  getAvailableActions(
    player: WerewolfPlayer,
    gameState: WerewolfGameState
  ): ActionType[] {
    if (!player.isAlive) return [];
    
    const actions: ActionType[] = [];
    
    if (gameState.phase === 'DAY') {
      actions.push(ActionType.VILLAGE_VOTE);
    } else if (gameState.phase === 'NIGHT' && gameState.currentNightPhase === NightPhase.WEREWOLF_PHASE) {
      actions.push(ActionType.WEREWOLF_KILL);
    }
    
    return actions;
  }

  /**
   * Führt Werwolf-Angriff durch
   */
  async executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    if (action.actionType !== ActionType.WEREWOLF_KILL) {
      return {
        success: false,
        message: 'Werwölfe können nur töten'
      };
    }

    if (!action.targetId) {
      return {
        success: false,
        message: 'Ziel erforderlich für Angriff'
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
        message: 'Kann keine toten Spieler angreifen'
      };
    }

    if (target.role === WerewolfRole.WEREWOLF) {
      return {
        success: false,
        message: 'Werwölfe greifen sich nicht gegenseitig an'
      };
    }

    // Erfolgreicher Angriff
    return {
      success: true,
      message: `Die Werwölfe haben ${target.username} angegriffen`,
      effects: {
        deaths: [target.id],
        protections: [],
        lovers: []
      }
    };
  }

  /**
   * Initialisiert Werwolf
   */
  initializePlayer(playerId: string, gameId: string): Partial<WerewolfPlayer> {
    return {
      role: WerewolfRole.WEREWOLF,
      team: Team.WEREWOLF,
      specialStates: {
        hasHealPotion: false,
        hasPoisonPotion: false,
        canShoot: false,
        hasSpied: false,
        spyRisk: 0,
        isProtected: false
      }
    };
  }

  /**
   * Werwolf kann nachts töten oder tagsüber abstimmen (tarnt sich)
   */
  protected validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    switch (action) {
      case ActionType.WEREWOLF_KILL:
        return gameState.phase === 'NIGHT' && gameState.currentNightPhase === NightPhase.WEREWOLF_PHASE;
      
      case ActionType.VILLAGE_VOTE:
        return gameState.phase === 'DAY'; // Werwolf tarnt sich tagsüber
      
      default:
        return false;
    }
  }

  /**
   * Hilfsmethode: Ermittelt alle anderen Werwölfe
   */
  getOtherWerewolves(player: WerewolfPlayer, allPlayers: WerewolfPlayer[]): WerewolfPlayer[] {
    return allPlayers.filter(p => 
      p.role === WerewolfRole.WEREWOLF && 
      p.isAlive && 
      p.id !== player.id
    );
  }

  /**
   * Hilfsmethode: Ermittelt mögliche Angriffsziele
   */
  getPossibleTargets(player: WerewolfPlayer, allPlayers: WerewolfPlayer[]): WerewolfPlayer[] {
    return allPlayers.filter(p => 
      p.isAlive && 
      p.role !== WerewolfRole.WEREWOLF // Werwölfe greifen sich nicht gegenseitig an
    );
  }
}