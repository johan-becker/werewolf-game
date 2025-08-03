import {
  WerewolfRole,
  RoleStrategy,
  WerewolfPlayer,
  NightAction,
  ActionResult,
  WerewolfGameState,
  ActionType
} from '../../types/werewolf-roles.types';

/**
 * Basis-Implementierung für Rollen-Strategien
 */
export abstract class BaseRoleStrategy implements RoleStrategy {
  abstract role: WerewolfRole;

  /**
   * Prüft ob eine Aktion durchführbar ist
   */
  canPerformAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean {
    // Basis-Validierung
    if (!player.isAlive) return false;
    
    // Rollen-spezifische Validierung
    return this.validateRoleSpecificAction(player, action, gameState);
  }

  /**
   * Führt eine Aktion aus
   */
  abstract executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult>;

  /**
   * Ermittelt verfügbare Aktionen
   */
  abstract getAvailableActions(
    player: WerewolfPlayer,
    gameState: WerewolfGameState
  ): ActionType[];

  /**
   * Initialisiert einen Spieler für diese Rolle
   */
  abstract initializePlayer(playerId: string, gameId: string): Partial<WerewolfPlayer>;

  /**
   * Behandelt Tod des Spielers
   */
  onDeath(
    _player: WerewolfPlayer,
    _allPlayers: WerewolfPlayer[],
    _gameState: WerewolfGameState
  ): Promise<ActionResult | null> {
    // Standard: Keine spezielle Aktion beim Tod
    return Promise.resolve(null);
  }

  /**
   * Rollen-spezifische Aktions-Validierung
   */
  protected abstract validateRoleSpecificAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean;

  /**
   * Hilfsmethode: Findet Spieler nach ID
   */
  protected findPlayer(allPlayers: WerewolfPlayer[], playerId: string): WerewolfPlayer | undefined {
    return allPlayers.find(p => p.id === playerId);
  }

  /**
   * Hilfsmethode: Findet lebende Spieler
   */
  protected getAlivePlayers(allPlayers: WerewolfPlayer[]): WerewolfPlayer[] {
    return allPlayers.filter(p => p.isAlive);
  }

  /**
   * Hilfsmethode: Prüft ob Nacht-Phase
   */
  protected isNightPhase(gameState: WerewolfGameState): boolean {
    return gameState.phase === 'NIGHT';
  }

  /**
   * Hilfsmethode: Prüft ob Tag-Phase
   */
  protected isDayPhase(gameState: WerewolfGameState): boolean {
    return gameState.phase === 'DAY';
  }
}