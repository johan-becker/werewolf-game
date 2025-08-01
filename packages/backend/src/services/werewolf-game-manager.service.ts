import { createClient } from '@supabase/supabase-js';
import { WerewolfRoleService } from './werewolf-role.service';
import { WerewolfNightManager } from './werewolf-night-manager.service';
import {
  WerewolfRole,
  Team,
  WinCondition,
  GameRoleConfig,
  ConfigValidationResult,
  WerewolfPlayer,
  WerewolfGameState,
  GameResult,
  ActionType,
  NightAction
} from '../types/werewolf-roles.types';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Haupt-Service für Werwolf-Spiel-Management mit Role Factory und Spielleiter-Konfiguration
 */
export class WerewolfGameManager {
  private roleService: WerewolfRoleService;
  private nightManager: WerewolfNightManager;
  private gameConfigs: Map<string, GameRoleConfig> = new Map();
  private gamePlayers: Map<string, WerewolfPlayer[]> = new Map();

  constructor() {
    this.roleService = new WerewolfRoleService();
    this.nightManager = new WerewolfNightManager();
  }

  // =================== SPIELLEITER KONFIGURATION ===================

  /**
   * Spielleiter konfiguriert die Rollen für das Spiel
   */
  async configureGameRoles(
    gameId: string,
    hostId: string,
    config: GameRoleConfig,
    totalPlayers: number
  ): Promise<{
    success: boolean;
    message: string;
    validation?: ConfigValidationResult;
  }> {
    try {
      // Prüfe ob Spieler Host ist
      const { data: game } = await supabaseAdmin
        .from('games')
        .select('creator_id, status')
        .eq('id', gameId)
        .single();

      if (!game || game.creator_id !== hostId) {
        return {
          success: false,
          message: 'Nur der Host kann die Rollen konfigurieren'
        };
      }

      if (game.status !== 'WAITING') {
        return {
          success: false,
          message: 'Rollen können nur vor Spielstart konfiguriert werden'
        };
      }

      // Validiere Konfiguration
      const validation = this.roleService.validateRoleConfig(config, totalPlayers);
      
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Ungültige Rollen-Konfiguration',
          validation
        };
      }

      // Speichere Konfiguration
      this.gameConfigs.set(gameId, config);

      // Speichere in Datenbank
      await supabaseAdmin
        .from('game_role_configs')
        .upsert({
          game_id: gameId,
          config: config,
          created_by: hostId,
          created_at: new Date().toISOString()
        });

      return {
        success: true,
        message: 'Rollen-Konfiguration gespeichert',
        validation
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Fehler beim Konfigurieren: ${error.message}`
      };
    }
  }

  /**
   * Validiert eine Rollen-Konfiguration ohne zu speichern
   */
  validateRoleConfiguration(
    config: GameRoleConfig,
    totalPlayers: number
  ): ConfigValidationResult {
    return this.roleService.validateRoleConfig(config, totalPlayers);
  }

  /**
   * Erstellt Standard-Konfiguration basierend auf Spieleranzahl
   */
  generateDefaultConfiguration(totalPlayers: number): {
    config: GameRoleConfig;
    validation: ConfigValidationResult;
  } {
    const config = this.roleService.generateDefaultConfig(totalPlayers);
    const validation = this.roleService.validateRoleConfig(config, totalPlayers);
    
    return { config, validation };
  }

  // =================== SPIEL-START UND ROLLEN-VERGABE ===================

  /**
   * Startet das Spiel mit konfigurierten Rollen
   */
  async startGameWithConfiguredRoles(
    gameId: string,
    hostId: string
  ): Promise<{
    success: boolean;
    message: string;
    roleAssignments?: Array<{ playerId: string; role: WerewolfRole; roleInfo: any }>;
    gameState?: WerewolfGameState;
  }> {
    try {
      // Hole Spiel-Daten
      const { data: game } = await supabaseAdmin
        .from('games')
        .select(`
          *,
          players!inner(
            user_id,
            is_host,
            profiles!inner(username)
          )
        `)
        .eq('id', gameId)
        .single();

      if (!game || game.creator_id !== hostId) {
        return {
          success: false,
          message: 'Nur der Host kann das Spiel starten'
        };
      }

      if (game.status !== 'WAITING') {
        return {
          success: false,
          message: 'Spiel kann nicht gestartet werden'
        };
      }

      // Hole oder erstelle Konfiguration
      let config = this.gameConfigs.get(gameId);
      if (!config) {
        // Erstelle Standard-Konfiguration
        config = this.roleService.generateDefaultConfig(game.players.length);
        this.gameConfigs.set(gameId, config);
      }

      // Validiere nochmals
      const validation = this.roleService.validateRoleConfig(config, game.players.length);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Ungültige Konfiguration: ${validation.errors.join(', ')}`
        };
      }

      // Vergebe Rollen
      const playerIds = game.players.map((p: any) => p.user_id);
      const roleAssignments = this.roleService.assignRoles(playerIds, config);

      // Erstelle WerewolfPlayer Objekte
      const werewolfPlayers: WerewolfPlayer[] = [];

      for (const assignment of roleAssignments) {
        const playerData = game.players.find((p: any) => p.user_id === assignment.playerId);
        if (!playerData) continue;

        const werewolfPlayer = this.roleService.createPlayer(
          assignment.playerId,
          gameId,
          assignment.playerId,
          playerData.profiles.username,
          assignment.role,
          playerData.is_host
        );

        werewolfPlayers.push(werewolfPlayer);

        // Update Datenbank mit Rolle
        await supabaseAdmin
          .from('players')
          .update({ 
            role: assignment.role,
            team: this.roleService.getRoleTeam(assignment.role)
          })
          .eq('game_id', gameId)
          .eq('user_id', assignment.playerId);
      }

      // Speichere Spieler
      this.gamePlayers.set(gameId, werewolfPlayers);

      // Update Spiel-Status
      await supabaseAdmin
        .from('games')
        .update({
          status: 'IN_PROGRESS',
          phase: 'NIGHT',
          started_at: new Date().toISOString()
        })
        .eq('id', gameId);

      // Starte erste Nacht
      const nightResult = await this.nightManager.startNightPhase(gameId, 1, werewolfPlayers);

      // Erstelle Antwort mit Rolle-Informationen
      const roleAssignmentsWithInfo = roleAssignments.map(assignment => ({
        playerId: assignment.playerId,
        role: assignment.role,
        roleInfo: this.roleService.getRoleInfo(assignment.role)
      }));

      const gameState = this.nightManager.getGameState(gameId);

      return {
        success: true,
        message: 'Spiel gestartet und Rollen vergeben',
        roleAssignments: roleAssignmentsWithInfo,
        gameState
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Fehler beim Starten: ${error.message}`
      };
    }
  }

  // =================== NACHT-AKTIONEN ===================

  /**
   * Führt eine Nacht-Aktion durch
   */
  async performNightAction(
    gameId: string,
    playerId: string,
    actionData: {
      actionType: ActionType;
      targetId?: string;
      secondTargetId?: string;
    }
  ): Promise<{
    success: boolean;
    message: string;
    revealedInfo?: any;
    canProceed?: boolean;
  }> {
    try {
      const players = this.gamePlayers.get(gameId);
      const gameState = this.nightManager.getGameState(gameId);

      if (!players || !gameState) {
        return {
          success: false,
          message: 'Spiel nicht gefunden'
        };
      }

      if (gameState.phase !== 'NIGHT') {
        return {
          success: false,
          message: 'Keine Nacht-Phase aktiv'
        };
      }

      const player = players.find(p => p.id === playerId);
      if (!player || !player.isAlive) {
        return {
          success: false,
          message: 'Spieler nicht gefunden oder tot'
        };
      }

      // Prüfe verfügbare Aktionen
      const availableActions = this.roleService.getAvailableActions(player, true);
      if (!availableActions.includes(actionData.actionType)) {
        return {
          success: false,
          message: 'Aktion nicht verfügbar'
        };
      }

      // Erstelle Nacht-Aktion
      const action: Omit<NightAction, 'id' | 'timestamp' | 'resolved'> = {
        gameId,
        playerId,
        actionType: actionData.actionType,
        targetId: actionData.targetId || '',
        secondTargetId: actionData.secondTargetId || undefined,
        phase: gameState.currentNightPhase!,
        dayNumber: gameState.dayNumber
      };

      // Führe Aktion durch Night Manager aus
      const result = await this.nightManager.performNightAction(gameId, action);

      // Prüfe ob Phase automatisch weitergeht
      const canProceed = this.canProceedToNextPhase(gameId);

      return {
        success: result.success,
        message: result.message,
        revealedInfo: result.revealedInfo,
        canProceed
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Fehler bei Nacht-Aktion: ${error.message}`
      };
    }
  }

  /**
   * Löst die aktuelle Nacht-Phase auf
   */
  async resolveCurrentNightPhase(gameId: string): Promise<{
    success: boolean;
    message: string;
    results: any[];
    nextPhase: string | null;
    nextRole: WerewolfRole | null;
    nightCompleted: boolean;
    gameEnded: boolean;
    winner?: WinCondition;
  }> {
    try {
      const players = this.gamePlayers.get(gameId);
      if (!players) {
        return {
          success: false,
          message: 'Spiel nicht gefunden',
          results: [],
          nextPhase: null,
          nextRole: null,
          nightCompleted: false,
          gameEnded: false
        };
      }

      // Löse Phase über Night Manager auf
      const resolution = await this.nightManager.resolveCurrentPhase(gameId, players);

      // Wende Effekte auf Spieler an
      await this.applyNightEffects(gameId, resolution.results);

      // Prüfe Sieg-Bedingungen
      const winner = this.roleService.checkWinCondition(players);
      let gameEnded = false;

      if (winner) {
        gameEnded = true;
        await this.endGame(gameId, winner);
      }

      return {
        success: resolution.success,
        message: resolution.message,
        results: resolution.results,
        nextPhase: resolution.nextPhase,
        nextRole: resolution.nextRole,
        nightCompleted: resolution.nightCompleted,
        gameEnded,
        winner
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Fehler bei Phasen-Auflösung: ${error.message}`,
        results: [],
        nextPhase: null,
        nextRole: null,
        nightCompleted: false,
        gameEnded: false
      };
    }
  }

  // =================== TAG-PHASE UND ABSTIMMUNG ===================

  /**
   * Startet die Tag-Phase
   */
  async startDayPhase(gameId: string): Promise<{
    success: boolean;
    message: string;
    survivors: string[];
    nightDeaths: string[];
  }> {
    try {
      const players = this.gamePlayers.get(gameId);
      const gameState = this.nightManager.getGameState(gameId);

      if (!players || !gameState) {
        return {
          success: false,
          message: 'Spiel nicht gefunden',
          survivors: [],
          nightDeaths: []
        };
      }

      const survivors = players.filter(p => p.isAlive).map(p => p.id);
      const nightDeaths = gameState.lastNightResults.deaths;

      return {
        success: true,
        message: 'Tag-Phase gestartet',
        survivors,
        nightDeaths
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Fehler beim Starten der Tag-Phase: ${error.message}`,
        survivors: [],
        nightDeaths: []
      };
    }
  }

  /**
   * Führt Dorf-Abstimmung durch
   */
  async performVillageVote(
    gameId: string,
    votes: Array<{ voterId: string; targetId: string }>
  ): Promise<{
    success: boolean;
    message: string;
    eliminatedPlayer?: string;
    votes: Record<string, number>;
    gameEnded: boolean;
    winner?: WinCondition;
  }> {
    try {
      const players = this.gamePlayers.get(gameId);
      if (!players) {
        return {
          success: false,
          message: 'Spiel nicht gefunden',
          votes: {},
          gameEnded: false
        };
      }

      // Zähle Stimmen
      const voteCount: Record<string, number> = {};
      votes.forEach(vote => {
        voteCount[vote.targetId] = (voteCount[vote.targetId] || 0) + 1;
      });

      // Finde Spieler mit meisten Stimmen
      let maxVotes = 0;
      let eliminatedPlayerId: string | undefined;

      Object.entries(voteCount).forEach(([playerId, voteNum]) => {
        if (voteNum > maxVotes) {
          maxVotes = voteNum;
          eliminatedPlayerId = playerId;
        }
      });

      if (!eliminatedPlayerId || maxVotes === 0) {
        return {
          success: false,
          message: 'Keine gültigen Stimmen',
          votes: voteCount,
          gameEnded: false
        };
      }

      // Eliminiere Spieler
      await this.eliminatePlayer(gameId, eliminatedPlayerId, 'VOTE');

      // Prüfe Sieg-Bedingungen
      const winner = this.roleService.checkWinCondition(players);
      let gameEnded = false;

      if (winner) {
        gameEnded = true;
        await this.endGame(gameId, winner);
      }

      return {
        success: true,
        message: `Spieler eliminiert durch Abstimmung`,
        eliminatedPlayer: eliminatedPlayerId,
        votes: voteCount,
        gameEnded,
        winner
      };

    } catch (error: any) {
      return {
        success: false,
        message: `Fehler bei Abstimmung: ${error.message}`,
        votes: {},
        gameEnded: false
      };
    }
  }

  // =================== HILFSMETHODEN ===================

  /**
   * Wendet Nacht-Effekte auf Spieler an
   */
  private async applyNightEffects(gameId: string, results: any[]): Promise<void> {
    const players = this.gamePlayers.get(gameId);
    if (!players) return;

    const allDeaths = new Set<string>();
    const allProtections = new Set<string>();

    // Sammle alle Effekte
    for (const result of results) {
      if (result.effects) {
        if (result.effects.deaths) {
          result.effects.deaths.forEach((id: string) => allDeaths.add(id));
        }
        if (result.effects.protections) {
          result.effects.protections.forEach((id: string) => allProtections.add(id));
        }
      }
    }

    // Wende Schutz vor Tod an
    const finalDeaths = Array.from(allDeaths).filter(id => !allProtections.has(id));

    // Eliminiere Spieler
    for (const playerId of finalDeaths) {
      await this.eliminatePlayer(gameId, playerId, 'WEREWOLF');
    }
  }

  /**
   * Eliminiert einen Spieler und behandelt spezielle Effekte
   */
  private async eliminatePlayer(
    gameId: string,
    playerId: string,
    cause: 'WEREWOLF' | 'WITCH' | 'VOTE' | 'HUNTER' | 'LOVE'
  ): Promise<void> {
    const players = this.gamePlayers.get(gameId);
    if (!players) return;

    const player = players.find(p => p.id === playerId);
    if (!player || !player.isAlive) return;

    // Markiere als tot
    player.isAlive = false;
    player.eliminatedAt = new Date();

    // Update Datenbank
    await supabaseAdmin
      .from('players')
      .update({
        is_alive: false,
        eliminated_at: new Date().toISOString()
      })
      .eq('game_id', gameId)
      .eq('user_id', playerId);

    // Liebespaar-Mechanik: Partner stirbt mit
    if (player.specialStates.loverId) {
      const lover = players.find(p => p.id === player.specialStates.loverId);
      if (lover && lover.isAlive && cause !== 'LOVE') {
        await this.eliminatePlayer(gameId, lover.id, 'LOVE');
      }
    }

    // Jäger-Mechanik: Wird in einem separaten Event gehandhabt
    // Das wird über die Socket-Events gesteuert
  }

  /**
   * Beendet das Spiel
   */
  private async endGame(gameId: string, winner: WinCondition): Promise<void> {
    await supabaseAdmin
      .from('games')
      .update({
        status: 'FINISHED',
        finished_at: new Date().toISOString(),
        winner: winner
      })
      .eq('id', gameId);

    // Cleanup
    this.gameConfigs.delete(gameId);
    this.gamePlayers.delete(gameId);
    this.nightManager.clearGameState(gameId);
  }

  /**
   * Prüft ob zur nächsten Phase gewechselt werden kann
   */
  private canProceedToNextPhase(gameId: string): boolean {
    // Hier würde geprüft werden ob alle erforderlichen Aktionen eingereicht wurden
    // Das ist komplex und hängt von der aktuellen Phase ab
    return false; // Erstmal manuell durch Host gesteuert
  }

  // =================== PUBLIC API ===================

  getGameConfig(gameId: string): GameRoleConfig | null {
    return this.gameConfigs.get(gameId) || null;
  }

  getGamePlayers(gameId: string): WerewolfPlayer[] | null {
    return this.gamePlayers.get(gameId) || null;
  }

  getGameState(gameId: string): WerewolfGameState | null {
    return this.nightManager.getGameState(gameId);
  }

  getRoleInfo(role: WerewolfRole): any {
    return this.roleService.getRoleInfo(role);
  }

  getPlayerRole(gameId: string, playerId: string): WerewolfRole | null {
    const players = this.gamePlayers.get(gameId);
    if (!players) return null;

    const player = players.find(p => p.id === playerId);
    return player?.role || null;
  }

  getAvailableActions(gameId: string, playerId: string): ActionType[] {
    const players = this.gamePlayers.get(gameId);
    const gameState = this.nightManager.getGameState(gameId);
    
    if (!players || !gameState) return [];

    const player = players.find(p => p.id === playerId);
    if (!player) return [];

    return this.roleService.getAvailableActions(player, gameState.phase === 'NIGHT');
  }
}