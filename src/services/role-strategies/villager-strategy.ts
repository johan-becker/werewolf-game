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
 * Dorfbewohner-Strategie - Basis-Rolle ohne spezielle Fähigkeiten
 */
export class VillagerStrategy extends BaseRoleStrategy {
  role = WerewolfRole.VILLAGER;

  /**
   * Dorfbewohner können nur abstimmen
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
   * Dorfbewohner haben keine Nacht-Aktionen
   */
  async executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    return {
      success: false,
      message: 'Dorfbewohner haben keine speziellen Aktionen'
    };
  }

  /**
   * Initialisiert Dorfbewohner
   */
  initializePlayer(playerId: string, gameId: string): Partial<WerewolfPlayer> {
    return {
      role: WerewolfRole.VILLAGER,
      team: Team.VILLAGE,
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
   * Dorfbewohner können nur abstimmen
   */
  protected validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    return action === ActionType.VILLAGE_VOTE && gameState.phase === 'DAY';
  }
}