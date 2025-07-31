import { 
  NightAction, 
  ActionType, 
  PlayerState, 
  ActionResult,
  GamePhaseState 
} from '../types/roles.types';
import { RoleService } from './role.service';

export class NightActionService {
  private roleService: RoleService;
  private pendingActions: Map<string, NightAction[]> = new Map(); // gameId -> actions

  constructor() {
    this.roleService = new RoleService();
  }

  /**
   * Fügt eine Nacht-Aktion zur Warteschlange hinzu
   */
  async submitNightAction(
    gameId: string,
    action: NightAction,
    playerStates: PlayerState[]
  ): Promise<ActionResult> {
    const actor = playerStates.find(p => p.userId === action.actorId);
    if (!actor) {
      return {
        success: false,
        message: 'Spieler nicht gefunden'
      };
    }

    // Validiere Aktion
    if (!this.roleService.canPerformAction(actor, action.actionType, true)) {
      return {
        success: false,
        message: 'Aktion nicht verfügbar'
      };
    }

    // Füge zur Warteschlange hinzu
    if (!this.pendingActions.has(gameId)) {
      this.pendingActions.set(gameId, []);
    }

    const gameActions = this.pendingActions.get(gameId)!;
    
    // Entferne vorherige Aktion desselben Spielers (falls vorhanden)
    const existingIndex = gameActions.findIndex(a => 
      a.actorId === action.actorId && a.actionType === action.actionType
    );
    
    if (existingIndex >= 0) {
      gameActions.splice(existingIndex, 1);
    }

    gameActions.push(action);

    return {
      success: true,
      message: 'Aktion eingereicht'
    };
  }

  /**
   * Führt alle eingereichten Nacht-Aktionen aus
   */
  async resolveNightActions(
    gameId: string,
    playerStates: PlayerState[],
    gamePhase: GamePhaseState
  ): Promise<{
    results: ActionResult[];
    updatedPlayers: PlayerState[];
    deaths: string[];
    protections: string[];
  }> {
    const actions = this.pendingActions.get(gameId) || [];
    const results: ActionResult[] = [];
    const deaths: Set<string> = new Set();
    const protections: Set<string> = new Set();

    // Aktionen nach Priorität sortieren
    const sortedActions = this.sortActionsByPriority(actions);

    // Aktionen ausführen
    for (const action of sortedActions) {
      const actor = playerStates.find(p => p.userId === action.actorId);
      if (!actor || !actor.isAlive) continue;

      const result = await this.roleService.performAction(
        actor,
        action,
        playerStates,
        { phase: 'NIGHT', dayNumber: gamePhase.dayNumber }
      );

      results.push(result);

      // Effekte anwenden
      if (result.effects) {
        if (result.effects.deaths) {
          result.effects.deaths.forEach(playerId => deaths.add(playerId));
        }
        if (result.effects.protections) {
          result.effects.protections.forEach(playerId => protections.add(playerId));
        }
      }

      // Aktion als erledigt markieren
      action.resolved = true;
      actor.actionHistory.push(action);
    }

    // Schutz vor Tod anwenden
    const finalDeaths = Array.from(deaths).filter(playerId => !protections.has(playerId));

    // Spieler-Status aktualisieren
    const updatedPlayers = this.applyNightResults(
      playerStates,
      finalDeaths,
      Array.from(protections)
    );

    // Aktionen löschen
    this.pendingActions.delete(gameId);

    return {
      results,
      updatedPlayers,
      deaths: finalDeaths,
      protections: Array.from(protections)
    };
  }

  /**
   * Sortiert Aktionen nach Ausführungspriorität
   */
  private sortActionsByPriority(actions: NightAction[]): NightAction[] {
    const priorityOrder: ActionType[] = [
      ActionType.CUPID_LINK,      // Muss zuerst ausgeführt werden
      ActionType.SEER_INVESTIGATE, // Information sammeln
      ActionType.WEREWOLF_KILL,   // Werwolf-Angriff
      ActionType.WITCH_HEAL,      // Schutz vor Werwolf-Angriff
      ActionType.WITCH_POISON     // Zusätzlicher Tod
    ];

    return actions.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.actionType);
      const bPriority = priorityOrder.indexOf(b.actionType);
      return aPriority - bPriority;
    });
  }

  /**
   * Wendet die Nacht-Ergebnisse auf die Spieler an
   */
  private applyNightResults(
    playerStates: PlayerState[],
    deaths: string[],
    protections: string[]
  ): PlayerState[] {
    return playerStates.map(player => {
      const updatedPlayer = { ...player };

      // Todesfälle anwenden
      if (deaths.includes(player.userId)) {
        updatedPlayer.isAlive = false;
        
        // Liebespaar-Mechanik: Partner stirbt mit
        if (player.specialStates.loverId) {
          const lover = playerStates.find(p => p.userId === player.specialStates.loverId);
          if (lover && lover.isAlive) {
            deaths.push(lover.userId);
          }
        }
      }

      // Schutz-Status zurücksetzen
      updatedPlayer.specialStates.isProtected = protections.includes(player.userId);

      return updatedPlayer;
    });
  }

  /**
   * Prüft, ob alle erforderlichen Nacht-Aktionen eingereicht wurden
   */
  areAllNightActionsSubmitted(gameId: string, playerStates: PlayerState[]): boolean {
    const actions = this.pendingActions.get(gameId) || [];
    
    // Prüfe für jeden lebenden Spieler mit Nacht-Fähigkeiten
    for (const player of playerStates) {
      if (!player.isAlive) continue;

      const requiredActions = this.getRequiredNightActions(player);
      
      for (const actionType of requiredActions) {
        const hasSubmitted = actions.some(a => 
          a.actorId === player.userId && a.actionType === actionType
        );
        
        if (!hasSubmitted) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Ermittelt erforderliche Nacht-Aktionen für einen Spieler
   */
  private getRequiredNightActions(player: PlayerState): ActionType[] {
    const required: ActionType[] = [];

    switch (player.role) {
      case 'WEREWOLF':
        required.push(ActionType.WEREWOLF_KILL);
        break;
      
      case 'SEER':
        required.push(ActionType.SEER_INVESTIGATE);
        break;
      
      // Hexe und andere Rollen sind optional - können wählen ob sie handeln
      
      case 'CUPID':
        // Nur in der ersten Nacht erforderlich
        const hasUsedCupid = player.actionHistory.some(a => a.actionType === ActionType.CUPID_LINK);
        if (!hasUsedCupid) {
          required.push(ActionType.CUPID_LINK);
        }
        break;
    }

    return required;
  }

  /**
   * Holt verfügbare Aktionen für einen Spieler
   */
  getAvailableActions(player: PlayerState, isNight: boolean): ActionType[] {
    if (!player.isAlive) return [];

    const available: ActionType[] = [];

    for (const actionType of Object.values(ActionType)) {
      if (this.roleService.canPerformAction(player, actionType, isNight)) {
        available.push(actionType);
      }
    }

    return available;
  }

  /**
   * Holt eingereichte Aktion eines Spielers
   */
  getPlayerAction(gameId: string, playerId: string, actionType: ActionType): NightAction | null {
    const actions = this.pendingActions.get(gameId) || [];
    return actions.find(a => a.actorId === playerId && a.actionType === actionType) || null;
  }

  /**
   * Holt alle eingereichten Aktionen für ein Spiel
   */
  getPendingActions(gameId: string): NightAction[] {
    return this.pendingActions.get(gameId) || [];
  }

  /**
   * Löscht alle Aktionen für ein Spiel
   */
  clearActions(gameId: string): void {
    this.pendingActions.delete(gameId);
  }

  /**
   * Erstellt eine "Keine Aktion" Einreichung
   */
  async submitNoAction(
    gameId: string,
    playerId: string,
    actionType: ActionType
  ): Promise<ActionResult> {
    const action: NightAction = {
      actionType,
      actorId: playerId,
      timestamp: new Date(),
      resolved: false
    };

    if (!this.pendingActions.has(gameId)) {
      this.pendingActions.set(gameId, []);
    }

    const gameActions = this.pendingActions.get(gameId)!;
    gameActions.push(action);

    return {
      success: true,
      message: 'Keine Aktion gewählt'
    };
  }

  /**
   * Holt Zusammenfassung der Nacht-Aktionen für den Spielleiter
   */
  getNightActionsSummary(gameId: string, playerStates: PlayerState[]): {
    submitted: Array<{
      playerId: string;
      playerName: string;
      role: string;
      actionType: ActionType;
      hasTarget: boolean;
    }>;
    missing: Array<{
      playerId: string;
      playerName: string;
      role: string;
      requiredActions: ActionType[];
    }>;
  } {
    const actions = this.pendingActions.get(gameId) || [];
    const submitted = actions.map(action => {
      const player = playerStates.find(p => p.userId === action.actorId);
      return {
        playerId: action.actorId,
        playerName: player?.userId || 'Unknown', // In einer echten Implementierung wäre hier der Username
        role: player?.role || 'Unknown',
        actionType: action.actionType,
        hasTarget: !!action.targetId
      };
    });

    const missing = playerStates
      .filter(p => p.isAlive)
      .map(player => {
        const requiredActions = this.getRequiredNightActions(player);
        const submittedActions = actions
          .filter(a => a.actorId === player.userId)
          .map(a => a.actionType);
        
        const missingActions = requiredActions.filter(a => !submittedActions.includes(a));
        
        return {
          playerId: player.userId,
          playerName: player.userId, // In einer echten Implementierung wäre hier der Username
          role: player.role,
          requiredActions: missingActions
        };
      })
      .filter(p => p.requiredActions.length > 0);

    return { submitted, missing };
  }
}