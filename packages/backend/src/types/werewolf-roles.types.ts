// Klassische Werwolf-Rollen basierend auf der Original-Spielanleitung

export enum WerewolfRole {
  // Dorfbewohner-Team
  VILLAGER = 'VILLAGER', // Dorfbewohner
  SEER = 'SEER', // Seherin
  WITCH = 'WITCH', // Hexe
  HUNTER = 'HUNTER', // Jäger
  CUPID = 'CUPID', // Amor
  LITTLE_GIRL = 'LITTLE_GIRL', // Mädchen

  // Werwolf-Team
  WEREWOLF = 'WEREWOLF', // Werwolf
}

export enum Team {
  VILLAGE = 'VILLAGE', // Dorfbewohner-Team
  WEREWOLF = 'WEREWOLF', // Werwolf-Team
  LOVERS = 'LOVERS', // Verliebte (Sonderteam)
}

export enum WinCondition {
  VILLAGE_WINS = 'VILLAGE_WINS', // Alle Werwölfe eliminiert
  WEREWOLVES_WIN = 'WEREWOLVES_WIN', // Werwölfe >= Dorfbewohner
  LOVERS_WIN = 'LOVERS_WIN', // Nur Verliebte überleben
}

export enum NightPhase {
  SEER_PHASE = 'SEER_PHASE', // 1. Seherin erwacht
  WEREWOLF_PHASE = 'WEREWOLF_PHASE', // 2. Werwölfe erwachen (Mädchen kann spionieren)
  WITCH_PHASE = 'WITCH_PHASE', // 3. Hexe erwacht
  CUPID_PHASE = 'CUPID_PHASE', // Nur erste Nacht: Amor bestimmt Verliebte
}

export enum ActionType {
  // Nacht-Aktionen
  SEER_INVESTIGATE = 'SEER_INVESTIGATE', // Seherin untersucht
  WEREWOLF_KILL = 'WEREWOLF_KILL', // Werwölfe töten
  WITCH_HEAL = 'WITCH_HEAL', // Hexe heilt
  WITCH_POISON = 'WITCH_POISON', // Hexe vergiftet
  CUPID_LINK = 'CUPID_LINK', // Amor verkuppelt
  LITTLE_GIRL_SPY = 'LITTLE_GIRL_SPY', // Mädchen spioniert

  // Tag-Aktionen
  VILLAGE_VOTE = 'VILLAGE_VOTE', // Dorf-Abstimmung
  HUNTER_REVENGE = 'HUNTER_REVENGE', // Jäger schießt beim Tod

  // Passive Aktionen
  NO_ACTION = 'NO_ACTION', // Keine Aktion
}

// Rolle-Konfiguration für Spielleiter
export interface GameRoleConfig {
  villagers: number; // Anzahl normale Dorfbewohner
  werewolves: number; // Anzahl Werwölfe (min. 1)
  seer: boolean; // Seherin dabei? (0-1)
  witch: boolean; // Hexe dabei? (0-1)
  hunter: boolean; // Jäger dabei? (0-1)
  cupid: boolean; // Amor dabei? (0-1)
  littleGirl: boolean; // Mädchen dabei? (0-1)
}

// Nacht-Aktion
export interface NightAction {
  id: string;
  gameId: string;
  playerId: string;
  actorId: string; // Actor performing the action (for compatibility)
  actionType: ActionType;
  targetId: string; // Primäres Ziel (required, use empty string if not needed)
  secondTargetId?: string; // Zweites Ziel (für Amor)
  phase: NightPhase;
  dayNumber: number;
  timestamp: Date;
  resolved: boolean;
  result?: ActionResult;
}

// Aktion-Ergebnis
export interface ActionResult {
  success: boolean;
  message: string;
  requiresAction?: boolean; // Benötigt weitere Aktionen (z.B. Jäger-Schuss)
  availableActions?: ActionType[]; // Verfügbare Folge-Aktionen
  revealedInfo?: {
    targetId?: string;
    role?: WerewolfRole;
    team?: Team;
    werewolves?: Array<{
      // Für Mädchen-Spionage
      playerId: string;
      username: string;
    }>;
    spyRisk?: number; // Aktuelles Spionage-Risiko
  };
  effects?: {
    deaths: string[]; // Gestorbene Spieler
    protections: string[]; // Geschützte Spieler
    lovers: string[]; // Neu verliebte Spieler
    spyResult?: {
      // Mädchen-Spionage Ergebnis
      spotted: boolean; // Wurde sie entdeckt?
      werewolves: string[]; // Gesehene Werwölfe
    };
  };
}

// Spieler-Zustand
export interface WerewolfPlayer {
  id: string;
  gameId: string;
  userId: string;
  username: string;
  role: WerewolfRole;
  team: Team;
  isAlive: boolean;
  isHost: boolean;
  loverId?: string; // ID des geliebten Partners (top-level for compatibility)

  // Spezielle Zustände
  specialStates: {
    // Verliebte
    loverId?: string; // ID des geliebten Partners

    // Hexe
    hasHealPotion: boolean; // Hat noch Heiltrank
    hasPoisonPotion: boolean; // Hat noch Gifttrank

    // Jäger
    canShoot: boolean; // Kann noch schießen

    // Mädchen
    hasSpied: boolean; // Hat schon spioniert
    spyRisk: number; // Risiko beim Spionieren (0-100)

    // Schutz-Status
    isProtected: boolean; // Schutz vor Tod in dieser Nacht
  };

  joinedAt: Date;
  eliminatedAt?: Date;
}

// Spiel-Zustand
export interface WerewolfGameState {
  gameId: string;
  phase: 'DAY' | 'NIGHT';
  dayNumber: number;
  nightNumber: number;
  currentNightPhase?: NightPhase;
  timeRemaining?: number;

  // Aktionen
  pendingActions: NightAction[];
  completedActions: NightAction[];

  // Abstimmung
  votingInProgress: boolean;
  votes: Array<{
    voterId: string;
    targetId: string;
    timestamp: Date;
  }>;

  // Nächte Ereignisse
  lastNightResults: {
    deaths: string[];
    protections: string[];
    investigations: Array<{
      investigatorId: string;
      targetId: string;
      result: WerewolfRole;
    }>;
  };
}

// Rolle-Information
export interface RoleInfo {
  role: WerewolfRole;
  name: string; // Deutscher Name
  description: string; // Rollenbeschreibung
  team: Team;
  nightActions: ActionType[]; // Verfügbare Nacht-Aktionen
  dayActions: ActionType[]; // Verfügbare Tag-Aktionen
  winConditions: WinCondition[];
  specialRules: string[]; // Besondere Regeln
}

// Rolle-Strategie Interface (Strategy Pattern)
export interface RoleStrategy {
  role: WerewolfRole;

  // Aktions-Validierung
  canPerformAction(
    player: WerewolfPlayer,
    action: ActionType,
    gameState: WerewolfGameState
  ): boolean;

  // Aktion ausführen
  executeAction(
    player: WerewolfPlayer,
    action: NightAction,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult>;

  // Verfügbare Aktionen ermitteln
  getAvailableActions(player: WerewolfPlayer, gameState: WerewolfGameState): ActionType[];

  // Rolle-spezifische Initialisierung
  initializePlayer(playerId: string, gameId: string): Partial<WerewolfPlayer>;

  // Bei Tod ausgelöste Aktionen
  onDeath(
    player: WerewolfPlayer,
    allPlayers: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): Promise<ActionResult | null>;
}

// Spielkonfiguration-Validierung
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  totalPlayers: number;
  werewolfPercentage: number;
}

// Spiel-Ergebnis
export interface GameResult {
  winner: WinCondition;
  winnerTeam: Team;
  survivors: WerewolfPlayer[];
  gameStats: {
    totalDays: number;
    totalNights: number;
    totalDeaths: number;
    actionsPerformed: number;
    longestPhase: string;
  };
  roleDistribution: Record<WerewolfRole, number>;
}

// Event-Typen für Socket.IO
export interface WerewolfSocketEvents {
  // Spielleiter-Events
  'game:configureRoles': (config: GameRoleConfig, callback: (result: any) => void) => void;
  'game:validateConfig': (
    config: GameRoleConfig,
    callback: (result: ConfigValidationResult) => void
  ) => void;
  'game:startWithRoles': (callback: (result: any) => void) => void;

  // Spieler-Events
  'game:performNightAction': (
    action: Omit<NightAction, 'id' | 'timestamp' | 'resolved'>,
    callback: (result: ActionResult) => void
  ) => void;
  'game:vote': (targetId: string, callback: (result: any) => void) => void;
  'game:hunterShoot': (targetId: string, callback: (result: ActionResult) => void) => void;

  // Info-Events
  'game:getRoleInfo': (callback: (roleInfo: RoleInfo) => void) => void;
  'game:getAvailableActions': (callback: (actions: ActionType[]) => void) => void;
  'game:getGameState': (callback: (state: WerewolfGameState) => void) => void;
}

// Server-zu-Client Events
export interface WerewolfServerEvents {
  // Spiel-Status
  'game:rolesAssigned': (
    assignments: Array<{ playerId: string; role: WerewolfRole; roleInfo: RoleInfo }>
  ) => void;
  'game:phaseChanged': (
    phase: 'DAY' | 'NIGHT',
    nightPhase?: NightPhase,
    dayNumber?: number
  ) => void;
  'game:nightPhaseChanged': (phase: NightPhase, activeRole: WerewolfRole) => void;

  // Ereignisse
  'game:playerDied': (
    playerId: string,
    cause: 'WEREWOLF' | 'WITCH' | 'VOTE' | 'HUNTER' | 'LOVE'
  ) => void;
  'game:playersLinked': (lover1Id: string, lover2Id: string) => void;
  'game:investigationResult': (targetId: string, role: WerewolfRole, team: Team) => void;
  'game:spyResult': (werewolves: string[], spotted: boolean) => void;

  // Spiel-Ende
  'game:gameEnded': (result: GameResult) => void;

  // Abstimmung
  'game:votingStarted': (candidates: string[], timeLimit: number) => void;
  'game:votingEnded': (eliminatedPlayer: string, votes: Record<string, number>) => void;
}
