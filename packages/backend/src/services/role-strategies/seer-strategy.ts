import { BaseRoleStrategy } from './base-role-strategy';
import {
  WerewolfRole,
  WerewolfPlayer,
  NightAction,
  ActionResult,
  WerewolfGameState,
  ActionType,
  Team,
  NightPhase,
} from '../../types/werewolf-roles.types';

/**
 * Seherin-Strategie - Kann jede Nacht eine Identität erfahren
 */
export class SeerStrategy extends BaseRoleStrategy {
  role = WerewolfRole.SEER;

  /**
   * Seherin kann nachts untersuchen und tagsüber abstimmen
   */
  getAvailableActions(player: WerewolfPlayer, gameState: WerewolfGameState): ActionType[] {
    if (!player.isAlive) return [];

    const actions: ActionType[] = [];

    if (gameState.phase === 'DAY') {
      actions.push(ActionType.VILLAGE_VOTE);
    } else if (
      gameState.phase === 'NIGHT' &&
      gameState.currentNightPhase === NightPhase.SEER_PHASE
    ) {
      actions.push(ActionType.SEER_INVESTIGATE);
    }

    return actions;
  }

  /**
   * Führt Seherin-Untersuchung durch
   */
  async executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    _gameState: WerewolfGameState
  ): Promise<ActionResult> {
    if (action.actionType !== ActionType.SEER_INVESTIGATE) {
      return {
        success: false,
        message: 'Seherin kann nur untersuchen',
      };
    }

    if (!action.targetId) {
      return {
        success: false,
        message: 'Ziel erforderlich für Untersuchung',
      };
    }

    const target = this.findPlayer(allPlayers, action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden',
      };
    }

    if (!target.isAlive) {
      return {
        success: false,
        message: 'Kann keine toten Spieler untersuchen',
      };
    }

    if (target.id === player.id) {
      return {
        success: false,
        message: 'Du kannst dich nicht selbst untersuchen',
      };
    }

    // Erfolgreiche Untersuchung
    return {
      success: true,
      message: `Du hast ${target.username} untersucht`,
      revealedInfo: {
        targetId: target.id,
        role: target.role,
        team: target.team,
      },
    };
  }

  /**
   * Initialisiert Seherin
   */
  initializePlayer(_playerId: string, _gameId: string): Partial<WerewolfPlayer> {
    return {
      role: WerewolfRole.SEER,
      team: Team.VILLAGE,
      specialStates: {
        hasHealPotion: false,
        hasPoisonPotion: false,
        canShoot: false,
        hasSpied: false,
        spyRisk: 0,
        isProtected: false,
      },
    };
  }

  /**
   * Seherin kann nachts untersuchen oder tagsüber abstimmen
   */
  protected validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    switch (action) {
      case ActionType.SEER_INVESTIGATE:
        return gameState.phase === 'NIGHT' && gameState.currentNightPhase === NightPhase.SEER_PHASE;

      case ActionType.VILLAGE_VOTE:
        return gameState.phase === 'DAY';

      default:
        return false;
    }
  }
}
