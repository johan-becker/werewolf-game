import {
  WerewolfPlayer,
  WerewolfRole,
  Team,
  ActionResult,
  WerewolfGameState,
} from '../types/werewolf-roles.types';

/**
 * Service für spezielle Werwolf-Mechaniken
 */
export class WerewolfMechanicsService {
  /**
   * Liebespaar-Mechanik: Behandelt Verliebte
   */
  async handleLoverDeath(
    deadPlayer: WerewolfPlayer,
    allPlayers: WerewolfPlayer[],
    _gameState: WerewolfGameState
  ): Promise<{
    additionalDeaths: string[];
    messages: string[];
  }> {
    const additionalDeaths: string[] = [];
    const messages: string[] = [];

    if (!deadPlayer.specialStates.loverId) {
      return { additionalDeaths, messages };
    }

    // Finde den geliebten Partner
    const lover = allPlayers.find(p => p.id === deadPlayer.specialStates.loverId);

    if (lover && lover.isAlive) {
      // Partner stirbt mit
      lover.isAlive = false;
      lover.eliminatedAt = new Date();
      additionalDeaths.push(lover.id);

      messages.push(`${lover.username} stirbt aus Liebe zu ${deadPlayer.username}`);

      // Prüfe Liebespaar-Sieg
      const alivePlayers = allPlayers.filter(p => p.isAlive);
      if (alivePlayers.length === 0) {
        messages.push('Das Liebespaar ist gemeinsam gestorben - tragisches Ende!');
      }
    }

    return { additionalDeaths, messages };
  }

  /**
   * Hexe-Spezialregeln
   */
  validateWitchAction(
    witch: WerewolfPlayer,
    actionType: 'HEAL' | 'POISON',
    targetId: string,
    werewolfTarget?: string
  ): {
    canPerform: boolean;
    reason?: string;
  } {
    switch (actionType) {
      case 'HEAL':
        if (!witch.specialStates.hasHealPotion) {
          return {
            canPerform: false,
            reason: 'Heiltrank bereits verwendet',
          };
        }

        // Hexe kann sich nicht selbst heilen
        if (targetId === witch.id) {
          return {
            canPerform: false,
            reason: 'Du kannst dich nicht selbst heilen',
          };
        }

        // Kann nur das Werwolf-Opfer heilen
        if (werewolfTarget && targetId !== werewolfTarget) {
          return {
            canPerform: false,
            reason: 'Du kannst nur das Opfer der Werwölfe heilen',
          };
        }

        return { canPerform: true };

      case 'POISON':
        if (!witch.specialStates.hasPoisonPotion) {
          return {
            canPerform: false,
            reason: 'Gifttrank bereits verwendet',
          };
        }

        return { canPerform: true };

      default:
        return {
          canPerform: false,
          reason: 'Unbekannte Aktion',
        };
    }
  }

  /**
   * Mädchen-Spionage mit Risiko-Berechnung
   */
  calculateSpyRisk(
    littleGirl: WerewolfPlayer,
    _spyAttempts: number
  ): {
    currentRisk: number;
    newRisk: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  } {
    const baseRisk = 10;
    const riskIncrease = 20;
    const currentRisk = littleGirl.specialStates.spyRisk || baseRisk;
    const newRisk = Math.min(95, currentRisk + riskIncrease);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
    if (newRisk <= 25) riskLevel = 'LOW';
    else if (newRisk <= 50) riskLevel = 'MEDIUM';
    else if (newRisk <= 75) riskLevel = 'HIGH';
    else riskLevel = 'EXTREME';

    return {
      currentRisk,
      newRisk,
      riskLevel,
    };
  }

  /**
   * Führt Mädchen-Spionage durch
   */
  performLittleGirlSpy(
    littleGirl: WerewolfPlayer,
    werewolves: WerewolfPlayer[]
  ): {
    success: boolean;
    spotted: boolean;
    werewolvesSpotted: string[];
    newRisk: number;
    died: boolean;
  } {
    const riskCalc = this.calculateSpyRisk(littleGirl, 1);
    const spotted = Math.random() * 100 < riskCalc.newRisk;

    // Update Risiko
    littleGirl.specialStates.spyRisk = riskCalc.newRisk;
    littleGirl.specialStates.hasSpied = true;

    if (spotted) {
      // Mädchen wurde entdeckt und stirbt
      littleGirl.isAlive = false;
      littleGirl.eliminatedAt = new Date();

      return {
        success: false,
        spotted: true,
        werewolvesSpotted: [],
        newRisk: riskCalc.newRisk,
        died: true,
      };
    } else {
      // Erfolgreich spioniert
      const werewolvesSpotted = werewolves.filter(w => w.isAlive).map(w => w.id);

      return {
        success: true,
        spotted: false,
        werewolvesSpotted,
        newRisk: riskCalc.newRisk,
        died: false,
      };
    }
  }

  /**
   * Jäger-Rache-Mechanik
   */
  async handleHunterDeath(
    hunter: WerewolfPlayer,
    allPlayers: WerewolfPlayer[]
  ): Promise<{
    canShoot: boolean;
    availableTargets: string[];
    timeLimit: number; // Sekunden für Schuss-Entscheidung
  }> {
    if (!hunter.specialStates.canShoot) {
      return {
        canShoot: false,
        availableTargets: [],
        timeLimit: 0,
      };
    }

    // Alle lebenden Spieler (außer dem Jäger selbst) als Ziele
    const availableTargets = allPlayers.filter(p => p.isAlive && p.id !== hunter.id).map(p => p.id);

    return {
      canShoot: true,
      availableTargets,
      timeLimit: 30, // 30 Sekunden für Entscheidung
    };
  }

  /**
   * Führt Jäger-Schuss aus
   */
  async executeHunterShot(
    hunter: WerewolfPlayer,
    targetId: string,
    allPlayers: WerewolfPlayer[]
  ): Promise<ActionResult> {
    if (!hunter.specialStates.canShoot) {
      return {
        success: false,
        message: 'Jäger kann nicht mehr schießen',
      };
    }

    const target = allPlayers.find(p => p.id === targetId);
    if (!target || !target.isAlive) {
      return {
        success: false,
        message: 'Ungültiges Ziel',
      };
    }

    // Jäger verliert Schuss-Fähigkeit
    hunter.specialStates.canShoot = false;

    // Ziel stirbt
    target.isAlive = false;
    target.eliminatedAt = new Date();

    return {
      success: true,
      message: `Der Jäger ${hunter.username} nimmt ${target.username} mit in den Tod`,
      effects: {
        deaths: [target.id],
        protections: [],
        lovers: [],
      },
    };
  }

  /**
   * Amor-Verkupplungs-Mechanik
   */
  async performCupidLinking(
    target1: WerewolfPlayer,
    target2: WerewolfPlayer
  ): Promise<{
    success: boolean;
    message: string;
    specialWin: boolean; // Wenn Werwolf + Dorfbewohner verliebt
  }> {
    if (target1.id === target2.id) {
      return {
        success: false,
        message: 'Ein Spieler kann nicht mit sich selbst verliebt sein',
        specialWin: false,
      };
    }

    // Verkupple die beiden
    target1.specialStates.loverId = target2.id;
    target2.specialStates.loverId = target1.id;

    // Prüfe ob spezielles Gewinnerteam (Werwolf + Dorfbewohner)
    const hasWerewolf =
      target1.role === WerewolfRole.WEREWOLF || target2.role === WerewolfRole.WEREWOLF;
    const hasVillager = target1.team === Team.VILLAGE || target2.team === Team.VILLAGE;
    const specialWin = hasWerewolf && hasVillager;

    if (specialWin) {
      // Beide werden zum Liebespaar-Team
      target1.team = Team.LOVERS;
      target2.team = Team.LOVERS;
    }

    return {
      success: true,
      message: `${target1.username} und ${target2.username} sind nun verliebt`,
      specialWin,
    };
  }

  /**
   * Behandelt Schutz-Mechaniken (Hexe-Heilung, etc.)
   */
  applyProtection(
    protectedPlayers: string[],
    pendingDeaths: string[]
  ): {
    survivedDeaths: string[];
    finalDeaths: string[];
  } {
    const survivedDeaths: string[] = [];
    const finalDeaths: string[] = [];

    for (const playerId of pendingDeaths) {
      if (protectedPlayers.includes(playerId)) {
        survivedDeaths.push(playerId);
      } else {
        finalDeaths.push(playerId);
      }
    }

    return { survivedDeaths, finalDeaths };
  }

  /**
   * Berechnet Spiel-Balance
   */
  calculateGameBalance(players: WerewolfPlayer[]): {
    aliveWerewolves: number;
    aliveVillagers: number;
    aliveLovers: number;
    balance: 'WEREWOLF_ADVANTAGE' | 'VILLAGE_ADVANTAGE' | 'BALANCED' | 'LOVERS_ACTIVE';
    turnsToEnd: number; // Geschätzte Runden bis Spielende
  } {
    const alivePlayers = players.filter(p => p.isAlive);
    const aliveWerewolves = alivePlayers.filter(p => p.role === WerewolfRole.WEREWOLF).length;
    const aliveVillagers = alivePlayers.filter(p => p.team === 'VILLAGE').length;
    const aliveLovers = alivePlayers.filter(p => p.team === 'LOVERS').length;

    let balance: 'WEREWOLF_ADVANTAGE' | 'VILLAGE_ADVANTAGE' | 'BALANCED' | 'LOVERS_ACTIVE';
    let turnsToEnd: number;

    if (aliveLovers >= 2) {
      balance = 'LOVERS_ACTIVE';
      turnsToEnd = Math.max(1, alivePlayers.length - 2); // Bis nur Liebespaar übrig
    } else if (aliveWerewolves >= aliveVillagers) {
      balance = 'WEREWOLF_ADVANTAGE';
      turnsToEnd = Math.max(1, aliveVillagers); // Werwölfe müssen Dorfbewohner eliminieren
    } else if (aliveWerewolves === 0) {
      balance = 'VILLAGE_ADVANTAGE';
      turnsToEnd = 0; // Spiel bereits entschieden
    } else {
      const ratio = aliveVillagers / aliveWerewolves;
      if (ratio > 3) {
        balance = 'VILLAGE_ADVANTAGE';
        turnsToEnd = aliveWerewolves * 2; // Dorfbewohner müssen Werwölfe finden
      } else {
        balance = 'BALANCED';
        turnsToEnd = Math.ceil((aliveWerewolves + aliveVillagers) / 3); // Ausgewogenes Spiel
      }
    }

    return {
      aliveWerewolves,
      aliveVillagers,
      aliveLovers,
      balance,
      turnsToEnd,
    };
  }

  /**
   * Validiert Team-Konsistenz
   */
  validateTeamConsistency(players: WerewolfPlayer[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Prüfe Liebespaar-Konsistenz
    const loversMap: Record<string, string> = {};
    players.forEach(p => {
      if (p.specialStates.loverId) {
        loversMap[p.id] = p.specialStates.loverId;
      }
    });

    Object.entries(loversMap).forEach(([playerId, loverId]) => {
      const reciprocal = loversMap[loverId];
      if (reciprocal !== playerId) {
        errors.push(`Liebespaar-Inkonsistenz: ${playerId} liebt ${loverId}, aber nicht umgekehrt`);
      }
    });

    // Prüfe Team-Konsistenz bei Verliebten
    Object.keys(loversMap).forEach(playerId => {
      const player = players.find(p => p.id === playerId);
      const lover = players.find(p => p.id === loversMap[playerId]);

      if (player && lover) {
        // Wenn Werwolf + Dorfbewohner verliebt, sollten beide LOVERS Team haben
        const hasWerewolf =
          player.role === WerewolfRole.WEREWOLF || lover.role === WerewolfRole.WEREWOLF;
        const hasVillager = player.team === 'VILLAGE' || lover.team === 'VILLAGE';

        if (hasWerewolf && hasVillager) {
          if (player.team !== 'LOVERS' || lover.team !== 'LOVERS') {
            warnings.push(
              `Gemischtes Liebespaar sollte LOVERS Team haben: ${player.username} & ${lover.username}`
            );
          }
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Erstellt detaillierte Spiel-Statistiken
   */
  generateGameStats(
    players: WerewolfPlayer[],
    gameState: WerewolfGameState
  ): {
    playerStats: Array<{
      playerId: string;
      username: string;
      role: WerewolfRole;
      team: string;
      isAlive: boolean;
      specialStates: any;
      survivalTime: number; // Tage überlebt
    }>;
    teamStats: {
      werewolves: { alive: number; total: number };
      villagers: { alive: number; total: number };
      lovers: { alive: number; total: number };
    };
    gameProgress: {
      currentDay: number;
      phase: string;
      estimatedEnd: number;
      balance: string;
    };
  } {
    // const alivePlayers = players.filter(p => p.isAlive);
    const balance = this.calculateGameBalance(players);

    const playerStats = players.map(p => ({
      playerId: p.id,
      username: p.username,
      role: p.role,
      team: p.team,
      isAlive: p.isAlive,
      specialStates: p.specialStates,
      survivalTime: p.isAlive
        ? gameState.dayNumber
        : p.eliminatedAt
          ? Math.floor((p.eliminatedAt.getTime() - p.joinedAt.getTime()) / (1000 * 60 * 60 * 24))
          : 0,
    }));

    const teamStats = {
      werewolves: {
        alive: balance.aliveWerewolves,
        total: players.filter(p => p.role === WerewolfRole.WEREWOLF).length,
      },
      villagers: {
        alive: balance.aliveVillagers,
        total: players.filter(p => p.team === 'VILLAGE').length,
      },
      lovers: {
        alive: balance.aliveLovers,
        total: players.filter(p => p.specialStates.loverId).length,
      },
    };

    const gameProgress = {
      currentDay: gameState.dayNumber,
      phase: gameState.phase,
      estimatedEnd: balance.turnsToEnd,
      balance: balance.balance,
    };

    return {
      playerStats,
      teamStats,
      gameProgress,
    };
  }
}
