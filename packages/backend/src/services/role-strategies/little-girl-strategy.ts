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
 * Mädchen-Strategie - Kann bei Werwolf-Phase spionieren (mit Risiko)
 */
export class LittleGirlStrategy extends BaseRoleStrategy {
  role = WerewolfRole.LITTLE_GIRL;

  private readonly SPY_RISK_BASE = 0.3; // 30% Basis-Risiko
  private readonly SPY_RISK_INCREMENT = 0.1; // +10% pro weiteres Spionieren

  /**
   * Mädchen kann während Werwolf-Phase spionieren
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
               gameState.currentNightPhase === NightPhase.WEREWOLF_PHASE) {
      actions.push(ActionType.LITTLE_GIRL_SPY);
      actions.push(ActionType.NO_ACTION); // Kann auch nicht spionieren
    }
    
    return actions;
  }

  /**
   * Führt Spionage-Aktion durch
   */
  async executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult> {
    switch (action.actionType) {
      case ActionType.LITTLE_GIRL_SPY:
        return this.executeSpy(player, action, allPlayers, gameState);
      
      case ActionType.NO_ACTION:
        return {
          success: true,
          message: 'Du hast dich entschieden, nicht zu spionieren'
        };
      
      default:
        return {
          success: false,
          message: 'Mädchen kann nur spionieren'
        };
    }
  }

  /**
   * Führt Spionage durch mit Entdeckungsrisiko
   */
  private async executeSpy(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    _gameState: WerewolfGameState
  ): Promise<ActionResult> {
    // Risiko berechnen
    const spyCount = player.specialStates.hasSpied ? 1 : 0;
    const currentRisk = this.SPY_RISK_BASE + (spyCount * this.SPY_RISK_INCREMENT);
    
    // Zufällige Entdeckung prüfen
    const isDiscovered = Math.random() < currentRisk;
    
    // Spionage-Status aktualisieren
    player.specialStates.hasSpied = true;
    player.specialStates.spyRisk = currentRisk;

    if (isDiscovered) {
      // Mädchen wurde entdeckt und stirbt
      return {
        success: false,
        message: 'Du wurdest von den Werwölfen entdeckt!',
        effects: {
          deaths: [player.id],
          protections: [],
          lovers: []
        }
      };
    }

    // Erfolgreiche Spionage - Werwolf-Identitäten erfahren
    const werewolves = this.getWerewolves(allPlayers);
    // const werewolfNames = werewolves.map(w => w.username).join(', ');

    return {
      success: true,
      message: `Du hast erfolgreich spioniert. Aktuelle Entdeckungschance: ${Math.round(currentRisk * 100)}%`,
      revealedInfo: {
        werewolves: werewolves.map(w => ({
          playerId: w.id,
          username: w.username
        })),
        spyRisk: currentRisk
      }
    };
  }

  /**
   * Initialisiert Mädchen
   */
  initializePlayer(_playerId: string, _gameId: string): Partial<WerewolfPlayer> {
    return {
      role: WerewolfRole.LITTLE_GIRL,
      team: Team.VILLAGE,
      specialStates: {
        hasHealPotion: false,
        hasPoisonPotion: false,
        canShoot: false,
        hasSpied: false,
        spyRisk: this.SPY_RISK_BASE,
        isProtected: false
      }
    };
  }

  /**
   * Mädchen kann während Werwolf-Phase spionieren oder tagsüber abstimmen
   */
  protected validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    switch (action) {
      case ActionType.LITTLE_GIRL_SPY:
        return gameState.phase === 'NIGHT' && gameState.currentNightPhase === NightPhase.WEREWOLF_PHASE;
      
      case ActionType.VILLAGE_VOTE:
        return gameState.phase === 'DAY';
      
      case ActionType.NO_ACTION:
        return gameState.phase === 'NIGHT' && gameState.currentNightPhase === NightPhase.WEREWOLF_PHASE;
      
      default:
        return false;
    }
  }

  /**
   * Hilfsmethode: Ermittelt alle lebenden Werwölfe
   */
  private getWerewolves(allPlayers: WerewolfPlayer[]): WerewolfPlayer[] {
    return allPlayers.filter(p => 
      p.role === WerewolfRole.WEREWOLF && p.isAlive
    );
  }

  /**
   * Hilfsmethode: Berechnet aktuelles Spionage-Risiko
   */
  getCurrentSpyRisk(player: WerewolfPlayer): number {
    const spyCount = player.specialStates.hasSpied ? 1 : 0;
    return this.SPY_RISK_BASE + (spyCount * this.SPY_RISK_INCREMENT);
  }
}
