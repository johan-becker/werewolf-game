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
 * Amor-Strategie - Verbindet zwei Spieler in der ersten Nacht
 */
export class CupidStrategy extends BaseRoleStrategy {
  role = WerewolfRole.CUPID;

  /**
   * Amor kann nur in der ersten Nacht verlieben
   */
  getAvailableActions(
    player: WerewolfPlayer,
    gameState: WerewolfGameState
  ): ActionType[] {
    if (!player.isAlive) return [];
    
    const actions: ActionType[] = [];
    
    if (gameState.phase === 'DAY') {
      actions.push(ActionType.VILLAGE_VOTE);
    } else if (gameState.phase === 'NIGHT' && 
               gameState.currentNightPhase === NightPhase.CUPID_PHASE &&
               gameState.nightNumber === 1) {
      actions.push(ActionType.CUPID_LINK);
    }
    
    return actions;
  }

  /**
   * Führt Amor-Verkupplung durch
   */
  async executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    if (action.actionType !== ActionType.CUPID_LINK) {
      return {
        success: false,
        message: 'Amor kann nur Spieler verlieben'
      };
    }

    if (gameState.nightNumber !== 1) {
      return {
        success: false,
        message: 'Amor kann nur in der ersten Nacht agieren'
      };
    }

    if (!action.targetId || !action.secondTargetId) {
      return {
        success: false,
        message: 'Zwei Ziele erforderlich für Verkupplung'
      };
    }

    if (action.targetId === action.secondTargetId) {
      return {
        success: false,
        message: 'Kann nicht denselben Spieler zweimal auswählen'
      };
    }

    const target1 = this.findPlayer(allPlayers, action.targetId);
    const target2 = this.findPlayer(allPlayers, action.secondTargetId);
    
    if (!target1 || !target2) {
      return {
        success: false,
        message: 'Ein oder beide Ziele nicht gefunden'
      };
    }

    if (!target1.isAlive || !target2.isAlive) {
      return {
        success: false,
        message: 'Kann keine toten Spieler verlieben'
      };
    }

    // Verliebte verknüpfen
    return {
      success: true,
      message: `Du hast ${target1.username} und ${target2.username} verliebt`,
      effects: {
        deaths: [],
        protections: [],
        lovers: [target1.id, target2.id]
      }
    };
  }

  /**
   * Initialisiert Amor
   */
  initializePlayer(playerId: string, gameId: string): Partial<WerewolfPlayer> {
    return {
      role: WerewolfRole.CUPID,
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
   * Amor kann nur in der ersten Nacht verkuppeln oder tagsüber abstimmen
   */
  protected validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    switch (action) {
      case ActionType.CUPID_LINK:
        return gameState.phase === 'NIGHT' && 
               gameState.currentNightPhase === NightPhase.CUPID_PHASE &&
               gameState.nightNumber === 1;
      
      case ActionType.VILLAGE_VOTE:
        return gameState.phase === 'DAY';
      
      default:
        return false;
    }
  }

  /**
   * Hilfsmethode: Prüft ob bereits Verliebte existieren
   */
  private hasExistingLovers(allPlayers: WerewolfPlayer[]): boolean {
    return allPlayers.some(p => p.loverId !== null);
  }

  /**
   * Hilfsmethode: Ermittelt mögliche Ziele für Verkupplung
   */
  getPossibleTargets(player: WerewolfPlayer, allPlayers: WerewolfPlayer[]): WerewolfPlayer[] {
    return allPlayers.filter(p => 
      p.isAlive && 
      p.id !== player.id && // Amor kann sich nicht selbst verkuppeln
      !p.specialStates.loverId    // Bereits verliebte Spieler ausschließen
    );
  }
}
