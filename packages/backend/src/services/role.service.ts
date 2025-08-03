import { 
  PlayerRole, 
  BaseRole, 
  VillagerRole, 
  WerewolfRole, 
  SeerRole, 
  WitchRole, 
  HunterRole, 
  CupidRole,
  RoleAbility,
  WinCondition,
  PlayerState,
  ActionResult,
  NightAction,
  ActionType
} from '../types/roles.types';

export class RoleService {
  
  /**
   * Erstellt eine Rolle basierend auf dem PlayerRole Enum
   */
  createRole(roleType: PlayerRole): BaseRole {
    switch (roleType) {
      case PlayerRole.VILLAGER:
        return this.createVillagerRole();
      case PlayerRole.WEREWOLF:
        return this.createWerewolfRole();
      case PlayerRole.SEER:
        return this.createSeerRole();
      case PlayerRole.WITCH:
        return this.createWitchRole();
      case PlayerRole.HUNTER:
        return this.createHunterRole();
      case PlayerRole.CUPID:
        return this.createCupidRole();
      default:
        throw new Error(`Unknown role type: ${roleType}`);
    }
  }

  /**
   * Dorfbewohner - Basis-Rolle ohne spezielle Fähigkeiten
   */
  private createVillagerRole(): VillagerRole {
    return {
      role: PlayerRole.VILLAGER,
      team: 'VILLAGE',
      abilities: [],
      winConditions: [WinCondition.VILLAGERS_WIN],
      canVote: true,
      isRevealed: false
    };
  }

  /**
   * Werwolf - Tötet nachts gemeinsam ein Opfer
   */
  private createWerewolfRole(): WerewolfRole {
    const killAbility: RoleAbility = {
      name: 'Nächtliche Jagd',
      description: 'Tötet gemeinsam mit anderen Werwölfen nachts ein Opfer',
      canUseAtNight: true,
      canUseAtDay: false
    };

    return {
      role: PlayerRole.WEREWOLF,
      team: 'WEREWOLF',
      abilities: [killAbility],
      winConditions: [WinCondition.WEREWOLVES_WIN],
      canVote: true,
      isRevealed: false
    };
  }

  /**
   * Seher - Kann nachts die Rolle eines Spielers sehen
   */
  private createSeerRole(): SeerRole {
    const investigateAbility: RoleAbility = {
      name: 'Hellsehen',
      description: 'Darf jede Nacht die Rolle eines Spielers sehen',
      canUseAtNight: true,
      canUseAtDay: false
    };

    return {
      role: PlayerRole.SEER,
      team: 'VILLAGE',
      abilities: [investigateAbility],
      winConditions: [WinCondition.VILLAGERS_WIN],
      canVote: true,
      isRevealed: false
    };
  }

  /**
   * Hexe - Hat zwei Tränke (1x Leben retten, 1x töten)
   */
  private createWitchRole(): WitchRole {
    const healAbility: RoleAbility = {
      name: 'Heiltrank',
      description: 'Kann ein Opfer der Werwölfe retten',
      canUseAtNight: true,
      canUseAtDay: false,
      usesPerGame: 1,
      usesRemaining: 1
    };

    const poisonAbility: RoleAbility = {
      name: 'Gifttrank',
      description: 'Kann einen Spieler töten',
      canUseAtNight: true,
      canUseAtDay: false,
      usesPerGame: 1,
      usesRemaining: 1
    };

    return {
      role: PlayerRole.WITCH,
      team: 'VILLAGE',
      abilities: [healAbility, poisonAbility],
      winConditions: [WinCondition.VILLAGERS_WIN],
      canVote: true,
      isRevealed: false
    };
  }

  /**
   * Jäger - Darf beim Tod einen Spieler mit in den Tod reißen
   */
  private createHunterRole(): HunterRole {
    const revengeAbility: RoleAbility = {
      name: 'Letzter Schuss',
      description: 'Darf beim Tod einen Spieler mit in den Tod reißen',
      canUseAtNight: false,
      canUseAtDay: true,
      usesPerGame: 1,
      usesRemaining: 1
    };

    return {
      role: PlayerRole.HUNTER,
      team: 'VILLAGE',
      abilities: [revengeAbility],
      winConditions: [WinCondition.VILLAGERS_WIN],
      canVote: true,
      isRevealed: false
    };
  }

  /**
   * Amor - Verkuppelt in der ersten Nacht zwei Spieler
   */
  private createCupidRole(): CupidRole {
    const cupidAbility: RoleAbility = {
      name: 'Liebespfeil',
      description: 'Verkuppelt in der ersten Nacht zwei Spieler zu einem Liebespaar',
      canUseAtNight: true,
      canUseAtDay: false,
      usesPerGame: 1,
      usesRemaining: 1
    };

    return {
      role: PlayerRole.CUPID,
      team: 'VILLAGE',
      abilities: [cupidAbility],
      winConditions: [WinCondition.VILLAGERS_WIN, WinCondition.LOVERS_WIN],
      canVote: true,
      isRevealed: false
    };
  }

  /**
   * Initialisiert einen Spieler-Status mit seiner Rolle
   */
  initializePlayerState(userId: string, role: PlayerRole, isHost: boolean = false): PlayerState {
    const roleDefinition = this.createRole(role);
    
    const specialStates: PlayerState['specialStates'] = {};
    
    // Rollen-spezifische Initialisierung
    switch (role) {
      case PlayerRole.WITCH:
        specialStates.hasHealPotion = true;
        specialStates.hasPoisonPotion = true;
        break;
      case PlayerRole.HUNTER:
        specialStates.canRevenge = true;
        break;
    }

    return {
      userId,
      role,
      team: roleDefinition.team,
      isAlive: true,
      isHost,
      abilities: roleDefinition.abilities.map(ability => ({
        ...ability,
        usesRemaining: ability.usesRemaining ?? 0
      })),
      specialStates,
      actionHistory: []
    };
  }

  /**
   * Prüft, ob eine Aktion für einen Spieler verfügbar ist
   */
  canPerformAction(playerState: PlayerState, actionType: ActionType, isNight: boolean): boolean {
    if (!playerState.isAlive) return false;

    const ability = this.getAbilityForAction(playerState, actionType);
    if (!ability) return false;

    // Prüfe Tageszeit
    if (isNight && !ability.canUseAtNight) return false;
    if (!isNight && !ability.canUseAtDay) return false;

    // Prüfe verbleibende Nutzungen
    if (ability.usesRemaining !== undefined && ability.usesRemaining <= 0) return false;

    // Rollen-spezifische Checks
    switch (actionType) {
      case ActionType.WITCH_HEAL:
        return !!playerState.specialStates.hasHealPotion;
      case ActionType.WITCH_POISON:
        return !!playerState.specialStates.hasPoisonPotion;
      case ActionType.HUNTER_REVENGE:
        return !!playerState.specialStates.canRevenge;
      case ActionType.CUPID_LINK:
        // Nur in der ersten Nacht
        return playerState.actionHistory.filter(a => a.actionType === ActionType.CUPID_LINK).length === 0;
    }

    return true;
  }

  /**
   * Führt eine Aktion aus und gibt das Ergebnis zurück
   */
  async performAction(
    playerState: PlayerState, 
    action: NightAction,
    allPlayers: PlayerState[],
    gamePhase: { phase: 'DAY' | 'NIGHT'; dayNumber: number }
  ): Promise<ActionResult> {
    if (!this.canPerformAction(playerState, action.actionType, gamePhase.phase === 'NIGHT')) {
      return {
        success: false,
        message: 'Aktion nicht verfügbar'
      };
    }

    switch (action.actionType) {
      case ActionType.SEER_INVESTIGATE:
        return this.performSeerInvestigation(action, allPlayers);
      
      case ActionType.WITCH_HEAL:
        return this.performWitchHeal(playerState, action, allPlayers);
      
      case ActionType.WITCH_POISON:
        return this.performWitchPoison(playerState, action, allPlayers);
      
      case ActionType.HUNTER_REVENGE:
        return this.performHunterRevenge(playerState, action, allPlayers);
      
      case ActionType.CUPID_LINK:
        return this.performCupidLink(action, allPlayers);
      
      case ActionType.WEREWOLF_KILL:
        return this.performWerewolfKill(action, allPlayers);
      
      default:
        return {
          success: false,
          message: 'Unbekannte Aktion'
        };
    }
  }

  /**
   * Seher-Untersuchung: Zeigt die Rolle des Ziels
   */
  private performSeerInvestigation(action: NightAction, allPlayers: PlayerState[]): ActionResult {
    const target = allPlayers.find(p => p.userId === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden'
      };
    }

    return {
      success: true,
      message: `Du hast ${target.userId} untersucht`,
      revealedInfo: {
        targetId: target.userId,
        role: target.role,
        isWerewolf: target.role === PlayerRole.WEREWOLF
      }
    };
  }

  /**
   * Hexe Heilung: Rettet ein Opfer der Werwölfe
   */
  private performWitchHeal(playerState: PlayerState, action: NightAction, allPlayers: PlayerState[]): ActionResult {
    if (!playerState.specialStates.hasHealPotion) {
      return {
        success: false,
        message: 'Heiltrank bereits verwendet'
      };
    }

    const target = allPlayers.find(p => p.userId === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden'
      };
    }

    // Heiltrank verbrauchen
    playerState.specialStates.hasHealPotion = false;
    
    return {
      success: true,
      message: `Du hast ${target.userId} geheilt`,
      effects: {
        protections: [target.userId]
      }
    };
  }

  /**
   * Hexe Gift: Tötet einen Spieler
   */
  private performWitchPoison(playerState: PlayerState, action: NightAction, allPlayers: PlayerState[]): ActionResult {
    if (!playerState.specialStates.hasPoisonPotion) {
      return {
        success: false,
        message: 'Gifttrank bereits verwendet'
      };
    }

    const target = allPlayers.find(p => p.userId === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden'
      };
    }

    // Gifttrank verbrauchen
    playerState.specialStates.hasPoisonPotion = false;

    return {
      success: true,
      message: `Du hast ${target.userId} vergiftet`,
      effects: {
        deaths: [target.userId]
      }
    };
  }

  /**
   * Jäger Rache: Tötet einen Spieler beim eigenen Tod
   */
  private performHunterRevenge(playerState: PlayerState, action: NightAction, allPlayers: PlayerState[]): ActionResult {
    if (!playerState.specialStates.canRevenge) {
      return {
        success: false,
        message: 'Rache bereits verwendet'
      };
    }

    const target = allPlayers.find(p => p.userId === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden'
      };
    }

    // Rache verbrauchen
    playerState.specialStates.canRevenge = false;

    return {
      success: true,
      message: `Du nimmst ${target.userId} mit in den Tod`,
      effects: {
        deaths: [target.userId]
      }
    };
  }

  /**
   * Cupid Verkupplung: Verbindet zwei Spieler als Liebespaar
   */
  private performCupidLink(action: NightAction, allPlayers: PlayerState[]): ActionResult {
    if (!action.targetId || !action.secondTargetId) {
      return {
        success: false,
        message: 'Zwei Ziele erforderlich'
      };
    }

    const target1 = allPlayers.find(p => p.userId === action.targetId);
    const target2 = allPlayers.find(p => p.userId === action.secondTargetId);

    if (!target1 || !target2) {
      return {
        success: false,
        message: 'Ein oder beide Ziele nicht gefunden'
      };
    }

    // Liebespaar verbinden
    target1.specialStates.loverId = target2.userId;
    target2.specialStates.loverId = target1.userId;
    
    // Bei Liebespaar kann das Team sich ändern
    target1.team = 'LOVERS';
    target2.team = 'LOVERS';

    return {
      success: true,
      message: `Du hast ${target1.userId} und ${target2.userId} verkuppelt`,
      effects: {
        revelations: [
          {
            playerId: target1.userId,
            info: 'Du bist nun Teil eines Liebespaares'
          },
          {
            playerId: target2.userId,
            info: 'Du bist nun Teil eines Liebespaares'
          }
        ]
      }
    };
  }

  /**
   * Werwolf-Angriff: Tötet ein Ziel
   */
  private performWerewolfKill(action: NightAction, allPlayers: PlayerState[]): ActionResult {
    const target = allPlayers.find(p => p.userId === action.targetId);
    if (!target) {
      return {
        success: false,
        message: 'Ziel nicht gefunden'
      };
    }

    return {
      success: true,
      message: `Die Werwölfe haben ${target.userId} angegriffen`,
      effects: {
        deaths: [target.userId]
      }
    };
  }

  /**
   * Hilfsfunktion: Findet die entsprechende Fähigkeit für eine Aktion
   */
  private getAbilityForAction(playerState: PlayerState, actionType: ActionType): RoleAbility | undefined {
    const abilityMap: Record<ActionType, string> = {
      [ActionType.WEREWOLF_KILL]: 'Nächtliche Jagd',
      [ActionType.SEER_INVESTIGATE]: 'Hellsehen',
      [ActionType.WITCH_HEAL]: 'Heiltrank',
      [ActionType.WITCH_POISON]: 'Gifttrank',
      [ActionType.HUNTER_REVENGE]: 'Letzter Schuss',
      [ActionType.CUPID_LINK]: 'Liebespfeil',
      [ActionType.VILLAGE_VOTE]: '', // Voting ist keine Rollen-Fähigkeit
      [ActionType.LITTLE_GIRL_SPY]: 'Spionage',
      [ActionType.NO_ACTION]: 'Keine Aktion'
    };

    const abilityName = abilityMap[actionType];
    return playerState.abilities.find(ability => ability.name === abilityName);
  }

  /**
   * Prüft Siegbedingungen und gibt den Gewinner zurück
   */
  checkWinConditions(alivePlayers: PlayerState[]): WinCondition | null {
    const aliveWerewolves = alivePlayers.filter(p => p.role === PlayerRole.WEREWOLF);
    const aliveVillagers = alivePlayers.filter(p => p.team === 'VILLAGE');
    const aliveLovers = alivePlayers.filter(p => p.team === 'LOVERS' && p.specialStates.loverId);

    // Liebespaar-Sieg: Nur noch das Liebespaar lebt
    if (aliveLovers.length === 2 && alivePlayers.length === 2) {
      const lover1 = aliveLovers[0];
      const lover2 = aliveLovers[1];
      if (lover1 && lover2) {
        if (lover1.specialStates.loverId === lover2.userId) {
          return WinCondition.LOVERS_WIN;
        }
      }
    }

    // Werwolf-Sieg: Keine Werwölfe mehr oder Werwölfe >= Dorfbewohner
    if (aliveWerewolves.length === 0) {
      return WinCondition.VILLAGERS_WIN;
    }

    if (aliveWerewolves.length >= aliveVillagers.length) {
      return WinCondition.WEREWOLVES_WIN;
    }

    return null; // Spiel geht weiter
  }

  /**
   * Generiert eine ausgewogene Rollenvergabe für eine gegebene Spieleranzahl  
   */
  generateRoleDistribution(playerCount: number): PlayerRole[] {
    if (playerCount < 4) throw new Error('Mindestens 4 Spieler erforderlich');

    const roles: PlayerRole[] = [];
    
    // Basis: 1 Werwolf pro 3-4 Spieler
    const werewolfCount = Math.floor(playerCount / 3);
    
    for (let i = 0; i < werewolfCount; i++) {
      roles.push(PlayerRole.WEREWOLF);
    }

    // Spezialrollen je nach Spieleranzahl
    if (playerCount >= 5) roles.push(PlayerRole.SEER);
    if (playerCount >= 7) roles.push(PlayerRole.WITCH);
    if (playerCount >= 8) roles.push(PlayerRole.HUNTER);
    if (playerCount >= 10) roles.push(PlayerRole.CUPID);

    // Rest mit Dorfbewohnern füllen
    while (roles.length < playerCount) {
      roles.push(PlayerRole.VILLAGER);
    }

    // Rollen mischen
    return this.shuffleArray(roles);
  }

  /**
   * Hilfsfunktion: Array mischen
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}