import {
  WerewolfRole,
  NightPhase,
  ActionType,
  NightAction,
  ActionResult,
  WerewolfPlayer,
  WerewolfGameState,
} from '../types/werewolf-roles.types';

/**
 * Manager für die exakte Nacht-Phasen-Reihenfolge nach klassischer Werwolf-Anleitung
 */
export class WerewolfNightManager {
  private gameStates: Map<string, WerewolfGameState> = new Map();
  private pendingActions: Map<string, NightAction[]> = new Map();

  /**
   * Definiert die exakte Reihenfolge der Nacht-Phasen
   */
  private readonly NIGHT_PHASE_ORDER: Array<{
    phase: NightPhase;
    role: WerewolfRole;
    description: string;
    isOptional: boolean;
  }> = [
    {
      phase: NightPhase.CUPID_PHASE,
      role: WerewolfRole.CUPID,
      description: 'Amor bestimmt die Verliebten',
      isOptional: true, // Nur erste Nacht
    },
    {
      phase: NightPhase.SEER_PHASE,
      role: WerewolfRole.SEER,
      description: 'Seherin erwacht und erfährt eine Identität',
      isOptional: false,
    },
    {
      phase: NightPhase.WEREWOLF_PHASE,
      role: WerewolfRole.WEREWOLF,
      description: 'Werwölfe erwachen und bestimmen gemeinsam ein Opfer',
      isOptional: false,
    },
    {
      phase: NightPhase.WITCH_PHASE,
      role: WerewolfRole.WITCH,
      description: 'Hexe erwacht und erfährt das Opfer, kann heilen oder vergiften',
      isOptional: false,
    },
  ];

  /**
   * Startet eine neue Nacht-Phase
   */
  async startNightPhase(
    gameId: string,
    dayNumber: number,
    players: WerewolfPlayer[]
  ): Promise<{
    success: boolean;
    message: string;
    firstPhase: NightPhase | null;
    activeRole: WerewolfRole | null;
  }> {
    try {
      // Initialisiere Game State für diese Nacht
      const gameState: WerewolfGameState = {
        gameId,
        phase: 'NIGHT',
        dayNumber,
        nightNumber: dayNumber,
        currentNightPhase: 'SEER_PHASE' as NightPhase,
        pendingActions: [],
        completedActions: [],
        votingInProgress: false,
        votes: [],
        lastNightResults: {
          deaths: [],
          protections: [],
          investigations: [],
        },
      };

      this.gameStates.set(gameId, gameState);
      this.pendingActions.set(gameId, []);

      // Bestimme erste Phase
      const firstPhase = this.getNextNightPhase(gameId, players, null);

      if (firstPhase) {
        gameState.currentNightPhase = firstPhase.phase;
        this.gameStates.set(gameId, gameState);

        return {
          success: true,
          message: `Nacht ${dayNumber} beginnt mit ${firstPhase.description}`,
          firstPhase: firstPhase.phase,
          activeRole: firstPhase.role,
        };
      } else {
        return {
          success: false,
          message: 'Keine aktiven Nacht-Rollen gefunden',
          firstPhase: null,
          activeRole: null,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Fehler beim Starten der Nacht: ${error.message}`,
        firstPhase: null,
        activeRole: null,
      };
    }
  }

  /**
   * Führt eine Nacht-Aktion aus
   */
  async performNightAction(
    gameId: string,
    action: Omit<NightAction, 'id' | 'timestamp' | 'resolved'>
  ): Promise<ActionResult> {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) {
      return {
        success: false,
        message: 'Spiel nicht gefunden',
      };
    }

    if (gameState.phase !== 'NIGHT') {
      return {
        success: false,
        message: 'Keine Nacht-Phase aktiv',
      };
    }

    // Validiere Aktion für aktuelle Phase
    const currentPhase = this.getCurrentPhaseInfo(gameState.currentNightPhase);
    if (!currentPhase) {
      return {
        success: false,
        message: 'Keine aktive Nacht-Phase',
      };
    }

    // Prüfe ob Aktion zur aktuellen Phase passt
    if (!this.isActionValidForPhase(action.actionType, currentPhase.phase)) {
      return {
        success: false,
        message: `Aktion ${action.actionType} nicht gültig für Phase ${currentPhase.phase}`,
      };
    }

    // Erstelle vollständige Aktion
    const fullAction: NightAction = {
      ...action,
      id: this.generateActionId(),
      timestamp: new Date(),
      resolved: false,
    };

    // Füge zur Warteschlange hinzu
    const actions = this.pendingActions.get(gameId) || [];

    // Entferne vorherige Aktion desselben Spielers für diese Phase
    const filteredActions = actions.filter(
      a => !(a.playerId === action.playerId && a.phase === action.phase)
    );

    filteredActions.push(fullAction);
    this.pendingActions.set(gameId, filteredActions);

    return {
      success: true,
      message: 'Aktion eingereicht',
    };
  }

  /**
   * Löst die aktuelle Nacht-Phase auf und wechselt zur nächsten
   */
  async resolveCurrentPhase(
    gameId: string,
    players: WerewolfPlayer[]
  ): Promise<{
    success: boolean;
    message: string;
    results: ActionResult[];
    nextPhase: NightPhase | null;
    nextRole: WerewolfRole | null;
    nightCompleted: boolean;
  }> {
    const gameState = this.gameStates.get(gameId);
    if (!gameState || !gameState.currentNightPhase) {
      return {
        success: false,
        message: 'Keine aktive Nacht-Phase',
        results: [],
        nextPhase: null,
        nextRole: null,
        nightCompleted: false,
      };
    }

    // Führe Aktionen der aktuellen Phase aus
    const results = await this.executePhaseActions(gameId, gameState.currentNightPhase, players);

    // Aktualisiere Game State mit Ergebnissen
    this.updateGameStateWithResults(gameState, results);

    // Bestimme nächste Phase
    const nextPhase = this.getNextNightPhase(gameId, players, gameState.currentNightPhase);

    if (nextPhase) {
      // Wechsle zur nächsten Phase
      gameState.currentNightPhase = nextPhase.phase;
      this.gameStates.set(gameId, gameState);

      return {
        success: true,
        message: `Phase aufgelöst. Nächste Phase: ${nextPhase.description}`,
        results,
        nextPhase: nextPhase.phase,
        nextRole: nextPhase.role,
        nightCompleted: false,
      };
    } else {
      // Nacht ist beendet
      gameState.phase = 'DAY';
      delete gameState.currentNightPhase;
      this.gameStates.set(gameId, gameState);

      return {
        success: true,
        message: 'Nacht-Phase beendet',
        results,
        nextPhase: null,
        nextRole: null,
        nightCompleted: true,
      };
    }
  }

  /**
   * Führt alle Aktionen einer spezifischen Phase aus
   */
  private async executePhaseActions(
    gameId: string,
    phase: NightPhase,
    players: WerewolfPlayer[]
  ): Promise<ActionResult[]> {
    const actions = this.pendingActions.get(gameId) || [];
    const phaseActions = actions.filter(a => a.phase === phase);
    const results: ActionResult[] = [];

    for (const action of phaseActions) {
      try {
        const result = await this.executeSpecificAction(action, players);
        results.push(result);

        // Markiere als ausgeführt
        action.resolved = true;
        action.result = result;
      } catch (error: any) {
        results.push({
          success: false,
          message: `Fehler bei Aktion: ${error.message}`,
        });
      }
    }

    // Entferne ausgeführte Aktionen
    const remainingActions = actions.filter(a => !a.resolved);
    this.pendingActions.set(gameId, remainingActions);

    return results;
  }

  /**
   * Führt eine spezifische Aktion aus
   */
  private async executeSpecificAction(
    action: NightAction,
    players: WerewolfPlayer[]
  ): Promise<ActionResult> {
    const actor = players.find(p => p.id === action.playerId);
    if (!actor || !actor.isAlive) {
      return {
        success: false,
        message: 'Spieler nicht gefunden oder tot',
      };
    }

    switch (action.actionType) {
      case ActionType.SEER_INVESTIGATE:
        return this.executeSeerInvestigation(action, players);

      case ActionType.WEREWOLF_KILL:
        return this.executeWerewolfKill(action, players);

      case ActionType.WITCH_HEAL:
        return this.executeWitchHeal(action, players, actor);

      case ActionType.WITCH_POISON:
        return this.executeWitchPoison(action, players, actor);

      case ActionType.CUPID_LINK:
        return this.executeCupidLink(action, players);

      case ActionType.LITTLE_GIRL_SPY:
        return this.executeLittleGirlSpy(action, players, actor);

      default:
        return {
          success: false,
          message: 'Unbekannte Aktion',
        };
    }
  }

  /**
   * Seherin-Untersuchung
   */
  private executeSeerInvestigation(action: NightAction, players: WerewolfPlayer[]): ActionResult {
    const target = players.find(p => p.id === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden',
      };
    }

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
   * Werwolf-Angriff
   */
  private executeWerewolfKill(action: NightAction, players: WerewolfPlayer[]): ActionResult {
    const target = players.find(p => p.id === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden',
      };
    }

    return {
      success: true,
      message: `Die Werwölfe haben ${target.username} angegriffen`,
      effects: {
        deaths: [target.id],
        protections: [],
        lovers: [],
      },
    };
  }

  /**
   * Hexe heilt
   */
  private executeWitchHeal(
    action: NightAction,
    players: WerewolfPlayer[],
    witch: WerewolfPlayer
  ): ActionResult {
    if (!witch.specialStates.hasHealPotion) {
      return {
        success: false,
        message: 'Heiltrank bereits verwendet',
      };
    }

    const target = players.find(p => p.id === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden',
      };
    }

    // Hexe kann sich nicht selbst heilen
    if (target.id === witch.id) {
      return {
        success: false,
        message: 'Du kannst dich nicht selbst heilen',
      };
    }

    // Heiltrank verbrauchen
    witch.specialStates.hasHealPotion = false;

    return {
      success: true,
      message: `Du hast ${target.username} geheilt`,
      effects: {
        deaths: [],
        protections: [target.id],
        lovers: [],
      },
    };
  }

  /**
   * Hexe vergiftet
   */
  private executeWitchPoison(
    action: NightAction,
    players: WerewolfPlayer[],
    witch: WerewolfPlayer
  ): ActionResult {
    if (!witch.specialStates.hasPoisonPotion) {
      return {
        success: false,
        message: 'Gifttrank bereits verwendet',
      };
    }

    const target = players.find(p => p.id === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden',
      };
    }

    // Gifttrank verbrauchen
    witch.specialStates.hasPoisonPotion = false;

    return {
      success: true,
      message: `Du hast ${target.username} vergiftet`,
      effects: {
        deaths: [target.id],
        protections: [],
        lovers: [],
      },
    };
  }

  /**
   * Amor verkuppelt
   */
  private executeCupidLink(action: NightAction, players: WerewolfPlayer[]): ActionResult {
    if (!action.targetId || !action.secondTargetId) {
      return {
        success: false,
        message: 'Zwei Ziele erforderlich',
      };
    }

    const target1 = players.find(p => p.id === action.targetId);
    const target2 = players.find(p => p.id === action.secondTargetId);

    if (!target1 || !target2) {
      return {
        success: false,
        message: 'Ein oder beide Ziele nicht gefunden',
      };
    }

    if (target1.id === target2.id) {
      return {
        success: false,
        message: 'Spieler kann nicht mit sich selbst verkuppelt werden',
      };
    }

    // Verliebte verbinden
    target1.specialStates.loverId = target2.id;
    target2.specialStates.loverId = target1.id;

    return {
      success: true,
      message: `Du hast ${target1.username} und ${target2.username} verkuppelt`,
      effects: {
        deaths: [],
        protections: [],
        lovers: [target1.id, target2.id],
      },
    };
  }

  /**
   * Mädchen spioniert
   */
  private executeLittleGirlSpy(
    action: NightAction,
    players: WerewolfPlayer[],
    littleGirl: WerewolfPlayer
  ): ActionResult {
    const werewolves = players.filter(p => p.role === WerewolfRole.WEREWOLF && p.isAlive);

    // Erhöhe Spionage-Risiko
    littleGirl.specialStates.spyRisk += 20;

    // Prüfe ob entdeckt
    const discovered = Math.random() * 100 < littleGirl.specialStates.spyRisk;

    if (discovered) {
      return {
        success: true,
        message: 'Du hast spioniert, wurdest aber entdeckt!',
        effects: {
          deaths: [littleGirl.id], // Wird sofort getötet
          protections: [],
          lovers: [],
          spyResult: {
            spotted: true,
            werewolves: werewolves.map(w => w.id),
          },
        },
      };
    } else {
      littleGirl.specialStates.hasSpied = true;

      return {
        success: true,
        message: 'Du hast erfolgreich spioniert',
        effects: {
          deaths: [],
          protections: [],
          lovers: [],
          spyResult: {
            spotted: false,
            werewolves: werewolves.map(w => w.id),
          },
        },
      };
    }
  }

  /**
   * Ermittelt die nächste Nacht-Phase
   */
  private getNextNightPhase(
    gameId: string,
    players: WerewolfPlayer[],
    currentPhase: NightPhase | null
  ): { phase: NightPhase; role: WerewolfRole; description: string } | null {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) return null;

    const currentIndex = currentPhase
      ? this.NIGHT_PHASE_ORDER.findIndex(p => p.phase === currentPhase)
      : -1;

    // Suche nächste verfügbare Phase
    for (let i = currentIndex + 1; i < this.NIGHT_PHASE_ORDER.length; i++) {
      const phaseInfo = this.NIGHT_PHASE_ORDER[i];

      if (!phaseInfo) continue;

      // Prüfe ob Phase verfügbar ist
      if (this.isPhaseAvailable(phaseInfo, players, gameState)) {
        return {
          phase: phaseInfo.phase,
          role: phaseInfo.role,
          description: phaseInfo.description,
        };
      }
    }

    return null;
  }

  /**
   * Prüft ob eine Phase verfügbar ist
   */
  private isPhaseAvailable(
    phaseInfo: (typeof this.NIGHT_PHASE_ORDER)[0],
    players: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): boolean {
    // Prüfe ob entsprechende Rolle im Spiel und am Leben ist
    const hasRole = players.some(p => p.role === phaseInfo.role && p.isAlive);
    if (!hasRole) return false;

    // Spezielle Regeln
    switch (phaseInfo.phase) {
      case NightPhase.CUPID_PHASE:
        // Nur in der ersten Nacht
        return gameState.dayNumber === 1;

      default:
        return true;
    }
  }

  /**
   * Hilfsfunktionen
   */
  private getCurrentPhaseInfo(
    phase: NightPhase | undefined
  ): (typeof this.NIGHT_PHASE_ORDER)[0] | null {
    if (!phase) return null;
    return this.NIGHT_PHASE_ORDER.find(p => p.phase === phase) || null;
  }

  private isActionValidForPhase(actionType: ActionType, phase: NightPhase): boolean {
    const validActions: Record<NightPhase, ActionType[]> = {
      [NightPhase.SEER_PHASE]: [ActionType.SEER_INVESTIGATE],
      [NightPhase.WEREWOLF_PHASE]: [ActionType.WEREWOLF_KILL, ActionType.LITTLE_GIRL_SPY],
      [NightPhase.WITCH_PHASE]: [ActionType.WITCH_HEAL, ActionType.WITCH_POISON],
      [NightPhase.CUPID_PHASE]: [ActionType.CUPID_LINK],
    };

    return validActions[phase]?.includes(actionType) || false;
  }

  private generateActionId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateGameStateWithResults(gameState: WerewolfGameState, results: ActionResult[]): void {
    for (const result of results) {
      if (result.effects) {
        if (result.effects.deaths) {
          gameState.lastNightResults.deaths.push(...result.effects.deaths);
        }
        if (result.effects.protections) {
          gameState.lastNightResults.protections.push(...result.effects.protections);
        }
        if (result.revealedInfo && result.revealedInfo.targetId && result.revealedInfo.role) {
          gameState.lastNightResults.investigations.push({
            investigatorId: '', // Müsste aus der Aktion geholt werden
            targetId: result.revealedInfo.targetId,
            result: result.revealedInfo.role,
          });
        }
      }
    }
  }

  /**
   * Public API
   */
  getGameState(gameId: string): WerewolfGameState | null {
    return this.gameStates.get(gameId) || null;
  }

  getCurrentPhase(gameId: string): NightPhase | null {
    const gameState = this.gameStates.get(gameId);
    return gameState?.currentNightPhase || null;
  }

  getPendingActions(gameId: string): NightAction[] {
    return this.pendingActions.get(gameId) || [];
  }

  clearGameState(gameId: string): void {
    this.gameStates.delete(gameId);
    this.pendingActions.delete(gameId);
  }
}
