
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Game
 * 
 */
export type Game = $Result.DefaultSelection<Prisma.$GamePayload>
/**
 * Model Player
 * 
 */
export type Player = $Result.DefaultSelection<Prisma.$PlayerPayload>
/**
 * Model GameLog
 * 
 */
export type GameLog = $Result.DefaultSelection<Prisma.$GameLogPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model GameRoleConfig
 * 
 */
export type GameRoleConfig = $Result.DefaultSelection<Prisma.$GameRoleConfigPayload>
/**
 * Model NightAction
 * 
 */
export type NightAction = $Result.DefaultSelection<Prisma.$NightActionPayload>
/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const GameStatus: {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED'
};

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus]


export const GamePhase: {
  DAY: 'DAY',
  NIGHT: 'NIGHT'
};

export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase]


export const WerewolfRole: {
  VILLAGER: 'VILLAGER',
  SEER: 'SEER',
  WITCH: 'WITCH',
  HUNTER: 'HUNTER',
  CUPID: 'CUPID',
  LITTLE_GIRL: 'LITTLE_GIRL',
  WEREWOLF: 'WEREWOLF'
};

export type WerewolfRole = (typeof WerewolfRole)[keyof typeof WerewolfRole]


export const Team: {
  VILLAGE: 'VILLAGE',
  WEREWOLF: 'WEREWOLF',
  LOVERS: 'LOVERS'
};

export type Team = (typeof Team)[keyof typeof Team]


export const NightPhase: {
  CUPID_PHASE: 'CUPID_PHASE',
  SEER_PHASE: 'SEER_PHASE',
  WEREWOLF_PHASE: 'WEREWOLF_PHASE',
  WITCH_PHASE: 'WITCH_PHASE'
};

export type NightPhase = (typeof NightPhase)[keyof typeof NightPhase]


export const ActionType: {
  SEER_INVESTIGATE: 'SEER_INVESTIGATE',
  WEREWOLF_KILL: 'WEREWOLF_KILL',
  WITCH_HEAL: 'WITCH_HEAL',
  WITCH_POISON: 'WITCH_POISON',
  CUPID_LINK: 'CUPID_LINK',
  LITTLE_GIRL_SPY: 'LITTLE_GIRL_SPY',
  VILLAGE_VOTE: 'VILLAGE_VOTE',
  HUNTER_SHOOT: 'HUNTER_SHOOT',
  NO_ACTION: 'NO_ACTION'
};

export type ActionType = (typeof ActionType)[keyof typeof ActionType]


export const ChatChannel: {
  LOBBY: 'LOBBY',
  DAY: 'DAY',
  NIGHT: 'NIGHT',
  DEAD: 'DEAD',
  SYSTEM: 'SYSTEM'
};

export type ChatChannel = (typeof ChatChannel)[keyof typeof ChatChannel]


export const MessageType: {
  TEXT: 'TEXT',
  SYSTEM: 'SYSTEM',
  JOIN: 'JOIN',
  LEAVE: 'LEAVE',
  DEATH: 'DEATH',
  ROLE_REVEAL: 'ROLE_REVEAL'
};

export type MessageType = (typeof MessageType)[keyof typeof MessageType]

}

export type GameStatus = $Enums.GameStatus

export const GameStatus: typeof $Enums.GameStatus

export type GamePhase = $Enums.GamePhase

export const GamePhase: typeof $Enums.GamePhase

export type WerewolfRole = $Enums.WerewolfRole

export const WerewolfRole: typeof $Enums.WerewolfRole

export type Team = $Enums.Team

export const Team: typeof $Enums.Team

export type NightPhase = $Enums.NightPhase

export const NightPhase: typeof $Enums.NightPhase

export type ActionType = $Enums.ActionType

export const ActionType: typeof $Enums.ActionType

export type ChatChannel = $Enums.ChatChannel

export const ChatChannel: typeof $Enums.ChatChannel

export type MessageType = $Enums.MessageType

export const MessageType: typeof $Enums.MessageType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Games
 * const games = await prisma.game.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Games
   * const games = await prisma.game.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.game`: Exposes CRUD operations for the **Game** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Games
    * const games = await prisma.game.findMany()
    * ```
    */
  get game(): Prisma.GameDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.PlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameLog`: Exposes CRUD operations for the **GameLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameLogs
    * const gameLogs = await prisma.gameLog.findMany()
    * ```
    */
  get gameLog(): Prisma.GameLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameRoleConfig`: Exposes CRUD operations for the **GameRoleConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameRoleConfigs
    * const gameRoleConfigs = await prisma.gameRoleConfig.findMany()
    * ```
    */
  get gameRoleConfig(): Prisma.GameRoleConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.nightAction`: Exposes CRUD operations for the **NightAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NightActions
    * const nightActions = await prisma.nightAction.findMany()
    * ```
    */
  get nightAction(): Prisma.NightActionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Game: 'Game',
    Player: 'Player',
    GameLog: 'GameLog',
    ChatMessage: 'ChatMessage',
    GameRoleConfig: 'GameRoleConfig',
    NightAction: 'NightAction',
    Profile: 'Profile'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "game" | "player" | "gameLog" | "chatMessage" | "gameRoleConfig" | "nightAction" | "profile"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Game: {
        payload: Prisma.$GamePayload<ExtArgs>
        fields: Prisma.GameFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findFirst: {
            args: Prisma.GameFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findMany: {
            args: Prisma.GameFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          create: {
            args: Prisma.GameCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          createMany: {
            args: Prisma.GameCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          delete: {
            args: Prisma.GameDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          update: {
            args: Prisma.GameUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          deleteMany: {
            args: Prisma.GameDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          upsert: {
            args: Prisma.GameUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          aggregate: {
            args: Prisma.GameAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGame>
          }
          groupBy: {
            args: Prisma.GameGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameCountArgs<ExtArgs>
            result: $Utils.Optional<GameCountAggregateOutputType> | number
          }
        }
      }
      Player: {
        payload: Prisma.$PlayerPayload<ExtArgs>
        fields: Prisma.PlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findFirst: {
            args: Prisma.PlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findMany: {
            args: Prisma.PlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          create: {
            args: Prisma.PlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          createMany: {
            args: Prisma.PlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          delete: {
            args: Prisma.PlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          update: {
            args: Prisma.PlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          deleteMany: {
            args: Prisma.PlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          upsert: {
            args: Prisma.PlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.PlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
          }
        }
      }
      GameLog: {
        payload: Prisma.$GameLogPayload<ExtArgs>
        fields: Prisma.GameLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>
          }
          findFirst: {
            args: Prisma.GameLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>
          }
          findMany: {
            args: Prisma.GameLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>[]
          }
          create: {
            args: Prisma.GameLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>
          }
          createMany: {
            args: Prisma.GameLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>[]
          }
          delete: {
            args: Prisma.GameLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>
          }
          update: {
            args: Prisma.GameLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>
          }
          deleteMany: {
            args: Prisma.GameLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>[]
          }
          upsert: {
            args: Prisma.GameLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameLogPayload>
          }
          aggregate: {
            args: Prisma.GameLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameLog>
          }
          groupBy: {
            args: Prisma.GameLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameLogCountArgs<ExtArgs>
            result: $Utils.Optional<GameLogCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      GameRoleConfig: {
        payload: Prisma.$GameRoleConfigPayload<ExtArgs>
        fields: Prisma.GameRoleConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameRoleConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameRoleConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>
          }
          findFirst: {
            args: Prisma.GameRoleConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameRoleConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>
          }
          findMany: {
            args: Prisma.GameRoleConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>[]
          }
          create: {
            args: Prisma.GameRoleConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>
          }
          createMany: {
            args: Prisma.GameRoleConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameRoleConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>[]
          }
          delete: {
            args: Prisma.GameRoleConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>
          }
          update: {
            args: Prisma.GameRoleConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>
          }
          deleteMany: {
            args: Prisma.GameRoleConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameRoleConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameRoleConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>[]
          }
          upsert: {
            args: Prisma.GameRoleConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoleConfigPayload>
          }
          aggregate: {
            args: Prisma.GameRoleConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameRoleConfig>
          }
          groupBy: {
            args: Prisma.GameRoleConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameRoleConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameRoleConfigCountArgs<ExtArgs>
            result: $Utils.Optional<GameRoleConfigCountAggregateOutputType> | number
          }
        }
      }
      NightAction: {
        payload: Prisma.$NightActionPayload<ExtArgs>
        fields: Prisma.NightActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NightActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NightActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>
          }
          findFirst: {
            args: Prisma.NightActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NightActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>
          }
          findMany: {
            args: Prisma.NightActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>[]
          }
          create: {
            args: Prisma.NightActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>
          }
          createMany: {
            args: Prisma.NightActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NightActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>[]
          }
          delete: {
            args: Prisma.NightActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>
          }
          update: {
            args: Prisma.NightActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>
          }
          deleteMany: {
            args: Prisma.NightActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NightActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NightActionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>[]
          }
          upsert: {
            args: Prisma.NightActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NightActionPayload>
          }
          aggregate: {
            args: Prisma.NightActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNightAction>
          }
          groupBy: {
            args: Prisma.NightActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<NightActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.NightActionCountArgs<ExtArgs>
            result: $Utils.Optional<NightActionCountAggregateOutputType> | number
          }
        }
      }
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    game?: GameOmit
    player?: PlayerOmit
    gameLog?: GameLogOmit
    chatMessage?: ChatMessageOmit
    gameRoleConfig?: GameRoleConfigOmit
    nightAction?: NightActionOmit
    profile?: ProfileOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type GameCountOutputType
   */

  export type GameCountOutputType = {
    players: number
    game_logs: number
    chat_messages: number
    night_actions: number
  }

  export type GameCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | GameCountOutputTypeCountPlayersArgs
    game_logs?: boolean | GameCountOutputTypeCountGame_logsArgs
    chat_messages?: boolean | GameCountOutputTypeCountChat_messagesArgs
    night_actions?: boolean | GameCountOutputTypeCountNight_actionsArgs
  }

  // Custom InputTypes
  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameCountOutputType
     */
    select?: GameCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeCountGame_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameLogWhereInput
  }

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeCountChat_messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeCountNight_actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NightActionWhereInput
  }


  /**
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    game_logs: number
    night_actions: number
  }

  export type PlayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game_logs?: boolean | PlayerCountOutputTypeCountGame_logsArgs
    night_actions?: boolean | PlayerCountOutputTypeCountNight_actionsArgs
  }

  // Custom InputTypes
  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountGame_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameLogWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountNight_actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NightActionWhereInput
  }


  /**
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    created_games: number
    players: number
    game_logs: number
    chat_messages: number
    role_configs: number
  }

  export type ProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    created_games?: boolean | ProfileCountOutputTypeCountCreated_gamesArgs
    players?: boolean | ProfileCountOutputTypeCountPlayersArgs
    game_logs?: boolean | ProfileCountOutputTypeCountGame_logsArgs
    chat_messages?: boolean | ProfileCountOutputTypeCountChat_messagesArgs
    role_configs?: boolean | ProfileCountOutputTypeCountRole_configsArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountCreated_gamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountGame_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameLogWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountChat_messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountRole_configsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameRoleConfigWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Game
   */

  export type AggregateGame = {
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  export type GameAvgAggregateOutputType = {
    day_number: number | null
    max_players: number | null
    current_players: number | null
  }

  export type GameSumAggregateOutputType = {
    day_number: number | null
    max_players: number | null
    current_players: number | null
  }

  export type GameMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    status: $Enums.GameStatus | null
    phase: $Enums.GamePhase | null
    night_phase: $Enums.NightPhase | null
    day_number: number | null
    max_players: number | null
    current_players: number | null
    winner: string | null
    creator_id: string | null
    created_at: Date | null
    started_at: Date | null
    finished_at: Date | null
    updated_at: Date | null
  }

  export type GameMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    status: $Enums.GameStatus | null
    phase: $Enums.GamePhase | null
    night_phase: $Enums.NightPhase | null
    day_number: number | null
    max_players: number | null
    current_players: number | null
    winner: string | null
    creator_id: string | null
    created_at: Date | null
    started_at: Date | null
    finished_at: Date | null
    updated_at: Date | null
  }

  export type GameCountAggregateOutputType = {
    id: number
    name: number
    code: number
    status: number
    phase: number
    night_phase: number
    day_number: number
    max_players: number
    current_players: number
    game_settings: number
    winner: number
    creator_id: number
    created_at: number
    started_at: number
    finished_at: number
    updated_at: number
    _all: number
  }


  export type GameAvgAggregateInputType = {
    day_number?: true
    max_players?: true
    current_players?: true
  }

  export type GameSumAggregateInputType = {
    day_number?: true
    max_players?: true
    current_players?: true
  }

  export type GameMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    status?: true
    phase?: true
    night_phase?: true
    day_number?: true
    max_players?: true
    current_players?: true
    winner?: true
    creator_id?: true
    created_at?: true
    started_at?: true
    finished_at?: true
    updated_at?: true
  }

  export type GameMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    status?: true
    phase?: true
    night_phase?: true
    day_number?: true
    max_players?: true
    current_players?: true
    winner?: true
    creator_id?: true
    created_at?: true
    started_at?: true
    finished_at?: true
    updated_at?: true
  }

  export type GameCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    status?: true
    phase?: true
    night_phase?: true
    day_number?: true
    max_players?: true
    current_players?: true
    game_settings?: true
    winner?: true
    creator_id?: true
    created_at?: true
    started_at?: true
    finished_at?: true
    updated_at?: true
    _all?: true
  }

  export type GameAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Game to aggregate.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Games
    **/
    _count?: true | GameCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameMaxAggregateInputType
  }

  export type GetGameAggregateType<T extends GameAggregateArgs> = {
        [P in keyof T & keyof AggregateGame]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGame[P]>
      : GetScalarType<T[P], AggregateGame[P]>
  }




  export type GameGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
    orderBy?: GameOrderByWithAggregationInput | GameOrderByWithAggregationInput[]
    by: GameScalarFieldEnum[] | GameScalarFieldEnum
    having?: GameScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameCountAggregateInputType | true
    _avg?: GameAvgAggregateInputType
    _sum?: GameSumAggregateInputType
    _min?: GameMinAggregateInputType
    _max?: GameMaxAggregateInputType
  }

  export type GameGroupByOutputType = {
    id: string
    name: string
    code: string
    status: $Enums.GameStatus
    phase: $Enums.GamePhase | null
    night_phase: $Enums.NightPhase | null
    day_number: number
    max_players: number
    current_players: number
    game_settings: JsonValue
    winner: string | null
    creator_id: string
    created_at: Date
    started_at: Date | null
    finished_at: Date | null
    updated_at: Date
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  type GetGameGroupByPayload<T extends GameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameGroupByOutputType[P]>
            : GetScalarType<T[P], GameGroupByOutputType[P]>
        }
      >
    >


  export type GameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    status?: boolean
    phase?: boolean
    night_phase?: boolean
    day_number?: boolean
    max_players?: boolean
    current_players?: boolean
    game_settings?: boolean
    winner?: boolean
    creator_id?: boolean
    created_at?: boolean
    started_at?: boolean
    finished_at?: boolean
    updated_at?: boolean
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
    players?: boolean | Game$playersArgs<ExtArgs>
    game_logs?: boolean | Game$game_logsArgs<ExtArgs>
    chat_messages?: boolean | Game$chat_messagesArgs<ExtArgs>
    role_config?: boolean | Game$role_configArgs<ExtArgs>
    night_actions?: boolean | Game$night_actionsArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    status?: boolean
    phase?: boolean
    night_phase?: boolean
    day_number?: boolean
    max_players?: boolean
    current_players?: boolean
    game_settings?: boolean
    winner?: boolean
    creator_id?: boolean
    created_at?: boolean
    started_at?: boolean
    finished_at?: boolean
    updated_at?: boolean
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    status?: boolean
    phase?: boolean
    night_phase?: boolean
    day_number?: boolean
    max_players?: boolean
    current_players?: boolean
    game_settings?: boolean
    winner?: boolean
    creator_id?: boolean
    created_at?: boolean
    started_at?: boolean
    finished_at?: boolean
    updated_at?: boolean
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    status?: boolean
    phase?: boolean
    night_phase?: boolean
    day_number?: boolean
    max_players?: boolean
    current_players?: boolean
    game_settings?: boolean
    winner?: boolean
    creator_id?: boolean
    created_at?: boolean
    started_at?: boolean
    finished_at?: boolean
    updated_at?: boolean
  }

  export type GameOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "code" | "status" | "phase" | "night_phase" | "day_number" | "max_players" | "current_players" | "game_settings" | "winner" | "creator_id" | "created_at" | "started_at" | "finished_at" | "updated_at", ExtArgs["result"]["game"]>
  export type GameInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
    players?: boolean | Game$playersArgs<ExtArgs>
    game_logs?: boolean | Game$game_logsArgs<ExtArgs>
    chat_messages?: boolean | Game$chat_messagesArgs<ExtArgs>
    role_config?: boolean | Game$role_configArgs<ExtArgs>
    night_actions?: boolean | Game$night_actionsArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type GameIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $GamePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Game"
    objects: {
      creator: Prisma.$ProfilePayload<ExtArgs>
      players: Prisma.$PlayerPayload<ExtArgs>[]
      game_logs: Prisma.$GameLogPayload<ExtArgs>[]
      chat_messages: Prisma.$ChatMessagePayload<ExtArgs>[]
      role_config: Prisma.$GameRoleConfigPayload<ExtArgs> | null
      night_actions: Prisma.$NightActionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      status: $Enums.GameStatus
      phase: $Enums.GamePhase | null
      night_phase: $Enums.NightPhase | null
      day_number: number
      max_players: number
      current_players: number
      game_settings: Prisma.JsonValue
      winner: string | null
      creator_id: string
      created_at: Date
      started_at: Date | null
      finished_at: Date | null
      updated_at: Date
    }, ExtArgs["result"]["game"]>
    composites: {}
  }

  type GameGetPayload<S extends boolean | null | undefined | GameDefaultArgs> = $Result.GetResult<Prisma.$GamePayload, S>

  type GameCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameCountAggregateInputType | true
    }

  export interface GameDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Game'], meta: { name: 'Game' } }
    /**
     * Find zero or one Game that matches the filter.
     * @param {GameFindUniqueArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameFindUniqueArgs>(args: SelectSubset<T, GameFindUniqueArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Game that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameFindUniqueOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameFindUniqueOrThrowArgs>(args: SelectSubset<T, GameFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameFindFirstArgs>(args?: SelectSubset<T, GameFindFirstArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameFindFirstOrThrowArgs>(args?: SelectSubset<T, GameFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Games that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Games
     * const games = await prisma.game.findMany()
     * 
     * // Get first 10 Games
     * const games = await prisma.game.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameWithIdOnly = await prisma.game.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameFindManyArgs>(args?: SelectSubset<T, GameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Game.
     * @param {GameCreateArgs} args - Arguments to create a Game.
     * @example
     * // Create one Game
     * const Game = await prisma.game.create({
     *   data: {
     *     // ... data to create a Game
     *   }
     * })
     * 
     */
    create<T extends GameCreateArgs>(args: SelectSubset<T, GameCreateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Games.
     * @param {GameCreateManyArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameCreateManyArgs>(args?: SelectSubset<T, GameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Games and returns the data saved in the database.
     * @param {GameCreateManyAndReturnArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameCreateManyAndReturnArgs>(args?: SelectSubset<T, GameCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Game.
     * @param {GameDeleteArgs} args - Arguments to delete one Game.
     * @example
     * // Delete one Game
     * const Game = await prisma.game.delete({
     *   where: {
     *     // ... filter to delete one Game
     *   }
     * })
     * 
     */
    delete<T extends GameDeleteArgs>(args: SelectSubset<T, GameDeleteArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Game.
     * @param {GameUpdateArgs} args - Arguments to update one Game.
     * @example
     * // Update one Game
     * const game = await prisma.game.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameUpdateArgs>(args: SelectSubset<T, GameUpdateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Games.
     * @param {GameDeleteManyArgs} args - Arguments to filter Games to delete.
     * @example
     * // Delete a few Games
     * const { count } = await prisma.game.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameDeleteManyArgs>(args?: SelectSubset<T, GameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameUpdateManyArgs>(args: SelectSubset<T, GameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games and returns the data updated in the database.
     * @param {GameUpdateManyAndReturnArgs} args - Arguments to update many Games.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameUpdateManyAndReturnArgs>(args: SelectSubset<T, GameUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Game.
     * @param {GameUpsertArgs} args - Arguments to update or create a Game.
     * @example
     * // Update or create a Game
     * const game = await prisma.game.upsert({
     *   create: {
     *     // ... data to create a Game
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Game we want to update
     *   }
     * })
     */
    upsert<T extends GameUpsertArgs>(args: SelectSubset<T, GameUpsertArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameCountArgs} args - Arguments to filter Games to count.
     * @example
     * // Count the number of Games
     * const count = await prisma.game.count({
     *   where: {
     *     // ... the filter for the Games we want to count
     *   }
     * })
    **/
    count<T extends GameCountArgs>(
      args?: Subset<T, GameCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameAggregateArgs>(args: Subset<T, GameAggregateArgs>): Prisma.PrismaPromise<GetGameAggregateType<T>>

    /**
     * Group by Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameGroupByArgs['orderBy'] }
        : { orderBy?: GameGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Game model
   */
  readonly fields: GameFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Game.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    players<T extends Game$playersArgs<ExtArgs> = {}>(args?: Subset<T, Game$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    game_logs<T extends Game$game_logsArgs<ExtArgs> = {}>(args?: Subset<T, Game$game_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chat_messages<T extends Game$chat_messagesArgs<ExtArgs> = {}>(args?: Subset<T, Game$chat_messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    role_config<T extends Game$role_configArgs<ExtArgs> = {}>(args?: Subset<T, Game$role_configArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    night_actions<T extends Game$night_actionsArgs<ExtArgs> = {}>(args?: Subset<T, Game$night_actionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Game model
   */
  interface GameFieldRefs {
    readonly id: FieldRef<"Game", 'String'>
    readonly name: FieldRef<"Game", 'String'>
    readonly code: FieldRef<"Game", 'String'>
    readonly status: FieldRef<"Game", 'GameStatus'>
    readonly phase: FieldRef<"Game", 'GamePhase'>
    readonly night_phase: FieldRef<"Game", 'NightPhase'>
    readonly day_number: FieldRef<"Game", 'Int'>
    readonly max_players: FieldRef<"Game", 'Int'>
    readonly current_players: FieldRef<"Game", 'Int'>
    readonly game_settings: FieldRef<"Game", 'Json'>
    readonly winner: FieldRef<"Game", 'String'>
    readonly creator_id: FieldRef<"Game", 'String'>
    readonly created_at: FieldRef<"Game", 'DateTime'>
    readonly started_at: FieldRef<"Game", 'DateTime'>
    readonly finished_at: FieldRef<"Game", 'DateTime'>
    readonly updated_at: FieldRef<"Game", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Game findUnique
   */
  export type GameFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findUniqueOrThrow
   */
  export type GameFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findFirst
   */
  export type GameFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findFirstOrThrow
   */
  export type GameFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findMany
   */
  export type GameFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Games to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game create
   */
  export type GameCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to create a Game.
     */
    data: XOR<GameCreateInput, GameUncheckedCreateInput>
  }

  /**
   * Game createMany
   */
  export type GameCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Game createManyAndReturn
   */
  export type GameCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game update
   */
  export type GameUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to update a Game.
     */
    data: XOR<GameUpdateInput, GameUncheckedUpdateInput>
    /**
     * Choose, which Game to update.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game updateMany
   */
  export type GameUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
  }

  /**
   * Game updateManyAndReturn
   */
  export type GameUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game upsert
   */
  export type GameUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The filter to search for the Game to update in case it exists.
     */
    where: GameWhereUniqueInput
    /**
     * In case the Game found by the `where` argument doesn't exist, create a new Game with this data.
     */
    create: XOR<GameCreateInput, GameUncheckedCreateInput>
    /**
     * In case the Game was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameUpdateInput, GameUncheckedUpdateInput>
  }

  /**
   * Game delete
   */
  export type GameDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter which Game to delete.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game deleteMany
   */
  export type GameDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Games to delete
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to delete.
     */
    limit?: number
  }

  /**
   * Game.players
   */
  export type Game$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Game.game_logs
   */
  export type Game$game_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    where?: GameLogWhereInput
    orderBy?: GameLogOrderByWithRelationInput | GameLogOrderByWithRelationInput[]
    cursor?: GameLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameLogScalarFieldEnum | GameLogScalarFieldEnum[]
  }

  /**
   * Game.chat_messages
   */
  export type Game$chat_messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * Game.role_config
   */
  export type Game$role_configArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    where?: GameRoleConfigWhereInput
  }

  /**
   * Game.night_actions
   */
  export type Game$night_actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    where?: NightActionWhereInput
    orderBy?: NightActionOrderByWithRelationInput | NightActionOrderByWithRelationInput[]
    cursor?: NightActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NightActionScalarFieldEnum | NightActionScalarFieldEnum[]
  }

  /**
   * Game without action
   */
  export type GameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
  }


  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerAvgAggregateOutputType = {
    votes_cast: number | null
    spy_risk: number | null
  }

  export type PlayerSumAggregateOutputType = {
    votes_cast: number | null
    spy_risk: number | null
  }

  export type PlayerMinAggregateOutputType = {
    user_id: string | null
    game_id: string | null
    role: $Enums.WerewolfRole | null
    team: $Enums.Team | null
    is_alive: boolean | null
    is_host: boolean | null
    joined_at: Date | null
    eliminated_at: Date | null
    votes_cast: number | null
    lover_id: string | null
    has_heal_potion: boolean | null
    has_poison_potion: boolean | null
    can_shoot: boolean | null
    has_spied: boolean | null
    spy_risk: number | null
    is_protected: boolean | null
  }

  export type PlayerMaxAggregateOutputType = {
    user_id: string | null
    game_id: string | null
    role: $Enums.WerewolfRole | null
    team: $Enums.Team | null
    is_alive: boolean | null
    is_host: boolean | null
    joined_at: Date | null
    eliminated_at: Date | null
    votes_cast: number | null
    lover_id: string | null
    has_heal_potion: boolean | null
    has_poison_potion: boolean | null
    can_shoot: boolean | null
    has_spied: boolean | null
    spy_risk: number | null
    is_protected: boolean | null
  }

  export type PlayerCountAggregateOutputType = {
    user_id: number
    game_id: number
    role: number
    team: number
    is_alive: number
    is_host: number
    joined_at: number
    eliminated_at: number
    votes_cast: number
    lover_id: number
    has_heal_potion: number
    has_poison_potion: number
    can_shoot: number
    has_spied: number
    spy_risk: number
    is_protected: number
    _all: number
  }


  export type PlayerAvgAggregateInputType = {
    votes_cast?: true
    spy_risk?: true
  }

  export type PlayerSumAggregateInputType = {
    votes_cast?: true
    spy_risk?: true
  }

  export type PlayerMinAggregateInputType = {
    user_id?: true
    game_id?: true
    role?: true
    team?: true
    is_alive?: true
    is_host?: true
    joined_at?: true
    eliminated_at?: true
    votes_cast?: true
    lover_id?: true
    has_heal_potion?: true
    has_poison_potion?: true
    can_shoot?: true
    has_spied?: true
    spy_risk?: true
    is_protected?: true
  }

  export type PlayerMaxAggregateInputType = {
    user_id?: true
    game_id?: true
    role?: true
    team?: true
    is_alive?: true
    is_host?: true
    joined_at?: true
    eliminated_at?: true
    votes_cast?: true
    lover_id?: true
    has_heal_potion?: true
    has_poison_potion?: true
    can_shoot?: true
    has_spied?: true
    spy_risk?: true
    is_protected?: true
  }

  export type PlayerCountAggregateInputType = {
    user_id?: true
    game_id?: true
    role?: true
    team?: true
    is_alive?: true
    is_host?: true
    joined_at?: true
    eliminated_at?: true
    votes_cast?: true
    lover_id?: true
    has_heal_potion?: true
    has_poison_potion?: true
    can_shoot?: true
    has_spied?: true
    spy_risk?: true
    is_protected?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type PlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithAggregationInput | PlayerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: PlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _avg?: PlayerAvgAggregateInputType
    _sum?: PlayerSumAggregateInputType
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    user_id: string
    game_id: string
    role: $Enums.WerewolfRole | null
    team: $Enums.Team | null
    is_alive: boolean
    is_host: boolean
    joined_at: Date
    eliminated_at: Date | null
    votes_cast: number
    lover_id: string | null
    has_heal_potion: boolean
    has_poison_potion: boolean
    can_shoot: boolean
    has_spied: boolean
    spy_risk: number
    is_protected: boolean
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type PlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    game_id?: boolean
    role?: boolean
    team?: boolean
    is_alive?: boolean
    is_host?: boolean
    joined_at?: boolean
    eliminated_at?: boolean
    votes_cast?: boolean
    lover_id?: boolean
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: boolean
    is_protected?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    game?: boolean | GameDefaultArgs<ExtArgs>
    game_logs?: boolean | Player$game_logsArgs<ExtArgs>
    night_actions?: boolean | Player$night_actionsArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    game_id?: boolean
    role?: boolean
    team?: boolean
    is_alive?: boolean
    is_host?: boolean
    joined_at?: boolean
    eliminated_at?: boolean
    votes_cast?: boolean
    lover_id?: boolean
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: boolean
    is_protected?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    game?: boolean | GameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    game_id?: boolean
    role?: boolean
    team?: boolean
    is_alive?: boolean
    is_host?: boolean
    joined_at?: boolean
    eliminated_at?: boolean
    votes_cast?: boolean
    lover_id?: boolean
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: boolean
    is_protected?: boolean
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    game?: boolean | GameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectScalar = {
    user_id?: boolean
    game_id?: boolean
    role?: boolean
    team?: boolean
    is_alive?: boolean
    is_host?: boolean
    joined_at?: boolean
    eliminated_at?: boolean
    votes_cast?: boolean
    lover_id?: boolean
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: boolean
    is_protected?: boolean
  }

  export type PlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "game_id" | "role" | "team" | "is_alive" | "is_host" | "joined_at" | "eliminated_at" | "votes_cast" | "lover_id" | "has_heal_potion" | "has_poison_potion" | "can_shoot" | "has_spied" | "spy_risk" | "is_protected", ExtArgs["result"]["player"]>
  export type PlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    game?: boolean | GameDefaultArgs<ExtArgs>
    game_logs?: boolean | Player$game_logsArgs<ExtArgs>
    night_actions?: boolean | Player$night_actionsArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    game?: boolean | GameDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ProfileDefaultArgs<ExtArgs>
    game?: boolean | GameDefaultArgs<ExtArgs>
  }

  export type $PlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Player"
    objects: {
      user: Prisma.$ProfilePayload<ExtArgs>
      game: Prisma.$GamePayload<ExtArgs>
      game_logs: Prisma.$GameLogPayload<ExtArgs>[]
      night_actions: Prisma.$NightActionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: string
      game_id: string
      role: $Enums.WerewolfRole | null
      team: $Enums.Team | null
      is_alive: boolean
      is_host: boolean
      joined_at: Date
      eliminated_at: Date | null
      votes_cast: number
      lover_id: string | null
      has_heal_potion: boolean
      has_poison_potion: boolean
      can_shoot: boolean
      has_spied: boolean
      spy_risk: number
      is_protected: boolean
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = $Result.GetResult<Prisma.$PlayerPayload, S>

  type PlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface PlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Player'], meta: { name: 'Player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const playerWithUser_idOnly = await prisma.player.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends PlayerFindManyArgs>(args?: SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends PlayerCreateArgs>(args: SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerCreateManyArgs>(args?: SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {PlayerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `user_id`
     * const playerWithUser_idOnly = await prisma.player.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends PlayerDeleteArgs>(args: SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerUpdateArgs>(args: SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players and returns the data updated in the database.
     * @param {PlayerUpdateManyAndReturnArgs} args - Arguments to update many Players.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Players and only return the `user_id`
     * const playerWithUser_idOnly = await prisma.player.updateManyAndReturn({
     *   select: { user_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs['orderBy'] }
        : { orderBy?: PlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Player model
   */
  readonly fields: PlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    game<T extends GameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameDefaultArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    game_logs<T extends Player$game_logsArgs<ExtArgs> = {}>(args?: Subset<T, Player$game_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    night_actions<T extends Player$night_actionsArgs<ExtArgs> = {}>(args?: Subset<T, Player$night_actionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Player model
   */
  interface PlayerFieldRefs {
    readonly user_id: FieldRef<"Player", 'String'>
    readonly game_id: FieldRef<"Player", 'String'>
    readonly role: FieldRef<"Player", 'WerewolfRole'>
    readonly team: FieldRef<"Player", 'Team'>
    readonly is_alive: FieldRef<"Player", 'Boolean'>
    readonly is_host: FieldRef<"Player", 'Boolean'>
    readonly joined_at: FieldRef<"Player", 'DateTime'>
    readonly eliminated_at: FieldRef<"Player", 'DateTime'>
    readonly votes_cast: FieldRef<"Player", 'Int'>
    readonly lover_id: FieldRef<"Player", 'String'>
    readonly has_heal_potion: FieldRef<"Player", 'Boolean'>
    readonly has_poison_potion: FieldRef<"Player", 'Boolean'>
    readonly can_shoot: FieldRef<"Player", 'Boolean'>
    readonly has_spied: FieldRef<"Player", 'Boolean'>
    readonly spy_risk: FieldRef<"Player", 'Int'>
    readonly is_protected: FieldRef<"Player", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Player findUnique
   */
  export type PlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findFirst
   */
  export type PlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player create
   */
  export type PlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
  }

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player createManyAndReturn
   */
  export type PlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player update
   */
  export type PlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player updateManyAndReturn
   */
  export type PlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
  }

  /**
   * Player delete
   */
  export type PlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to delete.
     */
    limit?: number
  }

  /**
   * Player.game_logs
   */
  export type Player$game_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    where?: GameLogWhereInput
    orderBy?: GameLogOrderByWithRelationInput | GameLogOrderByWithRelationInput[]
    cursor?: GameLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameLogScalarFieldEnum | GameLogScalarFieldEnum[]
  }

  /**
   * Player.night_actions
   */
  export type Player$night_actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    where?: NightActionWhereInput
    orderBy?: NightActionOrderByWithRelationInput | NightActionOrderByWithRelationInput[]
    cursor?: NightActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NightActionScalarFieldEnum | NightActionScalarFieldEnum[]
  }

  /**
   * Player without action
   */
  export type PlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
  }


  /**
   * Model GameLog
   */

  export type AggregateGameLog = {
    _count: GameLogCountAggregateOutputType | null
    _avg: GameLogAvgAggregateOutputType | null
    _sum: GameLogSumAggregateOutputType | null
    _min: GameLogMinAggregateOutputType | null
    _max: GameLogMaxAggregateOutputType | null
  }

  export type GameLogAvgAggregateOutputType = {
    day_number: number | null
  }

  export type GameLogSumAggregateOutputType = {
    day_number: number | null
  }

  export type GameLogMinAggregateOutputType = {
    id: string | null
    game_id: string | null
    user_id: string | null
    player_id: string | null
    action: string | null
    phase: $Enums.GamePhase | null
    day_number: number | null
    created_at: Date | null
  }

  export type GameLogMaxAggregateOutputType = {
    id: string | null
    game_id: string | null
    user_id: string | null
    player_id: string | null
    action: string | null
    phase: $Enums.GamePhase | null
    day_number: number | null
    created_at: Date | null
  }

  export type GameLogCountAggregateOutputType = {
    id: number
    game_id: number
    user_id: number
    player_id: number
    action: number
    details: number
    phase: number
    day_number: number
    created_at: number
    _all: number
  }


  export type GameLogAvgAggregateInputType = {
    day_number?: true
  }

  export type GameLogSumAggregateInputType = {
    day_number?: true
  }

  export type GameLogMinAggregateInputType = {
    id?: true
    game_id?: true
    user_id?: true
    player_id?: true
    action?: true
    phase?: true
    day_number?: true
    created_at?: true
  }

  export type GameLogMaxAggregateInputType = {
    id?: true
    game_id?: true
    user_id?: true
    player_id?: true
    action?: true
    phase?: true
    day_number?: true
    created_at?: true
  }

  export type GameLogCountAggregateInputType = {
    id?: true
    game_id?: true
    user_id?: true
    player_id?: true
    action?: true
    details?: true
    phase?: true
    day_number?: true
    created_at?: true
    _all?: true
  }

  export type GameLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameLog to aggregate.
     */
    where?: GameLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameLogs to fetch.
     */
    orderBy?: GameLogOrderByWithRelationInput | GameLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameLogs
    **/
    _count?: true | GameLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameLogMaxAggregateInputType
  }

  export type GetGameLogAggregateType<T extends GameLogAggregateArgs> = {
        [P in keyof T & keyof AggregateGameLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameLog[P]>
      : GetScalarType<T[P], AggregateGameLog[P]>
  }




  export type GameLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameLogWhereInput
    orderBy?: GameLogOrderByWithAggregationInput | GameLogOrderByWithAggregationInput[]
    by: GameLogScalarFieldEnum[] | GameLogScalarFieldEnum
    having?: GameLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameLogCountAggregateInputType | true
    _avg?: GameLogAvgAggregateInputType
    _sum?: GameLogSumAggregateInputType
    _min?: GameLogMinAggregateInputType
    _max?: GameLogMaxAggregateInputType
  }

  export type GameLogGroupByOutputType = {
    id: string
    game_id: string
    user_id: string | null
    player_id: string | null
    action: string
    details: JsonValue | null
    phase: $Enums.GamePhase | null
    day_number: number | null
    created_at: Date
    _count: GameLogCountAggregateOutputType | null
    _avg: GameLogAvgAggregateOutputType | null
    _sum: GameLogSumAggregateOutputType | null
    _min: GameLogMinAggregateOutputType | null
    _max: GameLogMaxAggregateOutputType | null
  }

  type GetGameLogGroupByPayload<T extends GameLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameLogGroupByOutputType[P]>
            : GetScalarType<T[P], GameLogGroupByOutputType[P]>
        }
      >
    >


  export type GameLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    player_id?: boolean
    action?: boolean
    details?: boolean
    phase?: boolean
    day_number?: boolean
    created_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | GameLog$userArgs<ExtArgs>
    player?: boolean | GameLog$playerArgs<ExtArgs>
  }, ExtArgs["result"]["gameLog"]>

  export type GameLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    player_id?: boolean
    action?: boolean
    details?: boolean
    phase?: boolean
    day_number?: boolean
    created_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | GameLog$userArgs<ExtArgs>
    player?: boolean | GameLog$playerArgs<ExtArgs>
  }, ExtArgs["result"]["gameLog"]>

  export type GameLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    player_id?: boolean
    action?: boolean
    details?: boolean
    phase?: boolean
    day_number?: boolean
    created_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | GameLog$userArgs<ExtArgs>
    player?: boolean | GameLog$playerArgs<ExtArgs>
  }, ExtArgs["result"]["gameLog"]>

  export type GameLogSelectScalar = {
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    player_id?: boolean
    action?: boolean
    details?: boolean
    phase?: boolean
    day_number?: boolean
    created_at?: boolean
  }

  export type GameLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "game_id" | "user_id" | "player_id" | "action" | "details" | "phase" | "day_number" | "created_at", ExtArgs["result"]["gameLog"]>
  export type GameLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | GameLog$userArgs<ExtArgs>
    player?: boolean | GameLog$playerArgs<ExtArgs>
  }
  export type GameLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | GameLog$userArgs<ExtArgs>
    player?: boolean | GameLog$playerArgs<ExtArgs>
  }
  export type GameLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    user?: boolean | GameLog$userArgs<ExtArgs>
    player?: boolean | GameLog$playerArgs<ExtArgs>
  }

  export type $GameLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameLog"
    objects: {
      game: Prisma.$GamePayload<ExtArgs>
      user: Prisma.$ProfilePayload<ExtArgs> | null
      player: Prisma.$PlayerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      game_id: string
      user_id: string | null
      player_id: string | null
      action: string
      details: Prisma.JsonValue | null
      phase: $Enums.GamePhase | null
      day_number: number | null
      created_at: Date
    }, ExtArgs["result"]["gameLog"]>
    composites: {}
  }

  type GameLogGetPayload<S extends boolean | null | undefined | GameLogDefaultArgs> = $Result.GetResult<Prisma.$GameLogPayload, S>

  type GameLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameLogCountAggregateInputType | true
    }

  export interface GameLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameLog'], meta: { name: 'GameLog' } }
    /**
     * Find zero or one GameLog that matches the filter.
     * @param {GameLogFindUniqueArgs} args - Arguments to find a GameLog
     * @example
     * // Get one GameLog
     * const gameLog = await prisma.gameLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameLogFindUniqueArgs>(args: SelectSubset<T, GameLogFindUniqueArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameLogFindUniqueOrThrowArgs} args - Arguments to find a GameLog
     * @example
     * // Get one GameLog
     * const gameLog = await prisma.gameLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameLogFindUniqueOrThrowArgs>(args: SelectSubset<T, GameLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameLogFindFirstArgs} args - Arguments to find a GameLog
     * @example
     * // Get one GameLog
     * const gameLog = await prisma.gameLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameLogFindFirstArgs>(args?: SelectSubset<T, GameLogFindFirstArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameLogFindFirstOrThrowArgs} args - Arguments to find a GameLog
     * @example
     * // Get one GameLog
     * const gameLog = await prisma.gameLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameLogFindFirstOrThrowArgs>(args?: SelectSubset<T, GameLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameLogs
     * const gameLogs = await prisma.gameLog.findMany()
     * 
     * // Get first 10 GameLogs
     * const gameLogs = await prisma.gameLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameLogWithIdOnly = await prisma.gameLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameLogFindManyArgs>(args?: SelectSubset<T, GameLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameLog.
     * @param {GameLogCreateArgs} args - Arguments to create a GameLog.
     * @example
     * // Create one GameLog
     * const GameLog = await prisma.gameLog.create({
     *   data: {
     *     // ... data to create a GameLog
     *   }
     * })
     * 
     */
    create<T extends GameLogCreateArgs>(args: SelectSubset<T, GameLogCreateArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameLogs.
     * @param {GameLogCreateManyArgs} args - Arguments to create many GameLogs.
     * @example
     * // Create many GameLogs
     * const gameLog = await prisma.gameLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameLogCreateManyArgs>(args?: SelectSubset<T, GameLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameLogs and returns the data saved in the database.
     * @param {GameLogCreateManyAndReturnArgs} args - Arguments to create many GameLogs.
     * @example
     * // Create many GameLogs
     * const gameLog = await prisma.gameLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameLogs and only return the `id`
     * const gameLogWithIdOnly = await prisma.gameLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameLogCreateManyAndReturnArgs>(args?: SelectSubset<T, GameLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameLog.
     * @param {GameLogDeleteArgs} args - Arguments to delete one GameLog.
     * @example
     * // Delete one GameLog
     * const GameLog = await prisma.gameLog.delete({
     *   where: {
     *     // ... filter to delete one GameLog
     *   }
     * })
     * 
     */
    delete<T extends GameLogDeleteArgs>(args: SelectSubset<T, GameLogDeleteArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameLog.
     * @param {GameLogUpdateArgs} args - Arguments to update one GameLog.
     * @example
     * // Update one GameLog
     * const gameLog = await prisma.gameLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameLogUpdateArgs>(args: SelectSubset<T, GameLogUpdateArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameLogs.
     * @param {GameLogDeleteManyArgs} args - Arguments to filter GameLogs to delete.
     * @example
     * // Delete a few GameLogs
     * const { count } = await prisma.gameLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameLogDeleteManyArgs>(args?: SelectSubset<T, GameLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameLogs
     * const gameLog = await prisma.gameLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameLogUpdateManyArgs>(args: SelectSubset<T, GameLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameLogs and returns the data updated in the database.
     * @param {GameLogUpdateManyAndReturnArgs} args - Arguments to update many GameLogs.
     * @example
     * // Update many GameLogs
     * const gameLog = await prisma.gameLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameLogs and only return the `id`
     * const gameLogWithIdOnly = await prisma.gameLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameLogUpdateManyAndReturnArgs>(args: SelectSubset<T, GameLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameLog.
     * @param {GameLogUpsertArgs} args - Arguments to update or create a GameLog.
     * @example
     * // Update or create a GameLog
     * const gameLog = await prisma.gameLog.upsert({
     *   create: {
     *     // ... data to create a GameLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameLog we want to update
     *   }
     * })
     */
    upsert<T extends GameLogUpsertArgs>(args: SelectSubset<T, GameLogUpsertArgs<ExtArgs>>): Prisma__GameLogClient<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameLogCountArgs} args - Arguments to filter GameLogs to count.
     * @example
     * // Count the number of GameLogs
     * const count = await prisma.gameLog.count({
     *   where: {
     *     // ... the filter for the GameLogs we want to count
     *   }
     * })
    **/
    count<T extends GameLogCountArgs>(
      args?: Subset<T, GameLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameLogAggregateArgs>(args: Subset<T, GameLogAggregateArgs>): Prisma.PrismaPromise<GetGameLogAggregateType<T>>

    /**
     * Group by GameLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameLogGroupByArgs['orderBy'] }
        : { orderBy?: GameLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameLog model
   */
  readonly fields: GameLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    game<T extends GameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameDefaultArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends GameLog$userArgs<ExtArgs> = {}>(args?: Subset<T, GameLog$userArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    player<T extends GameLog$playerArgs<ExtArgs> = {}>(args?: Subset<T, GameLog$playerArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameLog model
   */
  interface GameLogFieldRefs {
    readonly id: FieldRef<"GameLog", 'String'>
    readonly game_id: FieldRef<"GameLog", 'String'>
    readonly user_id: FieldRef<"GameLog", 'String'>
    readonly player_id: FieldRef<"GameLog", 'String'>
    readonly action: FieldRef<"GameLog", 'String'>
    readonly details: FieldRef<"GameLog", 'Json'>
    readonly phase: FieldRef<"GameLog", 'GamePhase'>
    readonly day_number: FieldRef<"GameLog", 'Int'>
    readonly created_at: FieldRef<"GameLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameLog findUnique
   */
  export type GameLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * Filter, which GameLog to fetch.
     */
    where: GameLogWhereUniqueInput
  }

  /**
   * GameLog findUniqueOrThrow
   */
  export type GameLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * Filter, which GameLog to fetch.
     */
    where: GameLogWhereUniqueInput
  }

  /**
   * GameLog findFirst
   */
  export type GameLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * Filter, which GameLog to fetch.
     */
    where?: GameLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameLogs to fetch.
     */
    orderBy?: GameLogOrderByWithRelationInput | GameLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameLogs.
     */
    cursor?: GameLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameLogs.
     */
    distinct?: GameLogScalarFieldEnum | GameLogScalarFieldEnum[]
  }

  /**
   * GameLog findFirstOrThrow
   */
  export type GameLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * Filter, which GameLog to fetch.
     */
    where?: GameLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameLogs to fetch.
     */
    orderBy?: GameLogOrderByWithRelationInput | GameLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameLogs.
     */
    cursor?: GameLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameLogs.
     */
    distinct?: GameLogScalarFieldEnum | GameLogScalarFieldEnum[]
  }

  /**
   * GameLog findMany
   */
  export type GameLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * Filter, which GameLogs to fetch.
     */
    where?: GameLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameLogs to fetch.
     */
    orderBy?: GameLogOrderByWithRelationInput | GameLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameLogs.
     */
    cursor?: GameLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameLogs.
     */
    skip?: number
    distinct?: GameLogScalarFieldEnum | GameLogScalarFieldEnum[]
  }

  /**
   * GameLog create
   */
  export type GameLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * The data needed to create a GameLog.
     */
    data: XOR<GameLogCreateInput, GameLogUncheckedCreateInput>
  }

  /**
   * GameLog createMany
   */
  export type GameLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameLogs.
     */
    data: GameLogCreateManyInput | GameLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameLog createManyAndReturn
   */
  export type GameLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * The data used to create many GameLogs.
     */
    data: GameLogCreateManyInput | GameLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameLog update
   */
  export type GameLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * The data needed to update a GameLog.
     */
    data: XOR<GameLogUpdateInput, GameLogUncheckedUpdateInput>
    /**
     * Choose, which GameLog to update.
     */
    where: GameLogWhereUniqueInput
  }

  /**
   * GameLog updateMany
   */
  export type GameLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameLogs.
     */
    data: XOR<GameLogUpdateManyMutationInput, GameLogUncheckedUpdateManyInput>
    /**
     * Filter which GameLogs to update
     */
    where?: GameLogWhereInput
    /**
     * Limit how many GameLogs to update.
     */
    limit?: number
  }

  /**
   * GameLog updateManyAndReturn
   */
  export type GameLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * The data used to update GameLogs.
     */
    data: XOR<GameLogUpdateManyMutationInput, GameLogUncheckedUpdateManyInput>
    /**
     * Filter which GameLogs to update
     */
    where?: GameLogWhereInput
    /**
     * Limit how many GameLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameLog upsert
   */
  export type GameLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * The filter to search for the GameLog to update in case it exists.
     */
    where: GameLogWhereUniqueInput
    /**
     * In case the GameLog found by the `where` argument doesn't exist, create a new GameLog with this data.
     */
    create: XOR<GameLogCreateInput, GameLogUncheckedCreateInput>
    /**
     * In case the GameLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameLogUpdateInput, GameLogUncheckedUpdateInput>
  }

  /**
   * GameLog delete
   */
  export type GameLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    /**
     * Filter which GameLog to delete.
     */
    where: GameLogWhereUniqueInput
  }

  /**
   * GameLog deleteMany
   */
  export type GameLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameLogs to delete
     */
    where?: GameLogWhereInput
    /**
     * Limit how many GameLogs to delete.
     */
    limit?: number
  }

  /**
   * GameLog.user
   */
  export type GameLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * GameLog.player
   */
  export type GameLog$playerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
  }

  /**
   * GameLog without action
   */
  export type GameLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    game_id: string | null
    user_id: string | null
    channel: $Enums.ChatChannel | null
    type: $Enums.MessageType | null
    content: string | null
    edited: boolean | null
    edited_at: Date | null
    created_at: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    game_id: string | null
    user_id: string | null
    channel: $Enums.ChatChannel | null
    type: $Enums.MessageType | null
    content: string | null
    edited: boolean | null
    edited_at: Date | null
    created_at: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    game_id: number
    user_id: number
    channel: number
    type: number
    content: number
    mentions: number
    edited: number
    edited_at: number
    created_at: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    game_id?: true
    user_id?: true
    channel?: true
    type?: true
    content?: true
    edited?: true
    edited_at?: true
    created_at?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    game_id?: true
    user_id?: true
    channel?: true
    type?: true
    content?: true
    edited?: true
    edited_at?: true
    created_at?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    game_id?: true
    user_id?: true
    channel?: true
    type?: true
    content?: true
    mentions?: true
    edited?: true
    edited_at?: true
    created_at?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    game_id: string | null
    user_id: string
    channel: $Enums.ChatChannel
    type: $Enums.MessageType
    content: string
    mentions: string[]
    edited: boolean
    edited_at: Date | null
    created_at: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    channel?: boolean
    type?: boolean
    content?: boolean
    mentions?: boolean
    edited?: boolean
    edited_at?: boolean
    created_at?: boolean
    game?: boolean | ChatMessage$gameArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    channel?: boolean
    type?: boolean
    content?: boolean
    mentions?: boolean
    edited?: boolean
    edited_at?: boolean
    created_at?: boolean
    game?: boolean | ChatMessage$gameArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    channel?: boolean
    type?: boolean
    content?: boolean
    mentions?: boolean
    edited?: boolean
    edited_at?: boolean
    created_at?: boolean
    game?: boolean | ChatMessage$gameArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    game_id?: boolean
    user_id?: boolean
    channel?: boolean
    type?: boolean
    content?: boolean
    mentions?: boolean
    edited?: boolean
    edited_at?: boolean
    created_at?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "game_id" | "user_id" | "channel" | "type" | "content" | "mentions" | "edited" | "edited_at" | "created_at", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | ChatMessage$gameArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | ChatMessage$gameArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | ChatMessage$gameArgs<ExtArgs>
    user?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      game: Prisma.$GamePayload<ExtArgs> | null
      user: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      game_id: string | null
      user_id: string
      channel: $Enums.ChatChannel
      type: $Enums.MessageType
      content: string
      mentions: string[]
      edited: boolean
      edited_at: Date | null
      created_at: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    game<T extends ChatMessage$gameArgs<ExtArgs> = {}>(args?: Subset<T, ChatMessage$gameArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly game_id: FieldRef<"ChatMessage", 'String'>
    readonly user_id: FieldRef<"ChatMessage", 'String'>
    readonly channel: FieldRef<"ChatMessage", 'ChatChannel'>
    readonly type: FieldRef<"ChatMessage", 'MessageType'>
    readonly content: FieldRef<"ChatMessage", 'String'>
    readonly mentions: FieldRef<"ChatMessage", 'String[]'>
    readonly edited: FieldRef<"ChatMessage", 'Boolean'>
    readonly edited_at: FieldRef<"ChatMessage", 'DateTime'>
    readonly created_at: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage.game
   */
  export type ChatMessage$gameArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model GameRoleConfig
   */

  export type AggregateGameRoleConfig = {
    _count: GameRoleConfigCountAggregateOutputType | null
    _avg: GameRoleConfigAvgAggregateOutputType | null
    _sum: GameRoleConfigSumAggregateOutputType | null
    _min: GameRoleConfigMinAggregateOutputType | null
    _max: GameRoleConfigMaxAggregateOutputType | null
  }

  export type GameRoleConfigAvgAggregateOutputType = {
    villagers: number | null
    werewolves: number | null
  }

  export type GameRoleConfigSumAggregateOutputType = {
    villagers: number | null
    werewolves: number | null
  }

  export type GameRoleConfigMinAggregateOutputType = {
    id: string | null
    game_id: string | null
    villagers: number | null
    werewolves: number | null
    seer: boolean | null
    witch: boolean | null
    hunter: boolean | null
    cupid: boolean | null
    little_girl: boolean | null
    created_by: string | null
    created_at: Date | null
  }

  export type GameRoleConfigMaxAggregateOutputType = {
    id: string | null
    game_id: string | null
    villagers: number | null
    werewolves: number | null
    seer: boolean | null
    witch: boolean | null
    hunter: boolean | null
    cupid: boolean | null
    little_girl: boolean | null
    created_by: string | null
    created_at: Date | null
  }

  export type GameRoleConfigCountAggregateOutputType = {
    id: number
    game_id: number
    villagers: number
    werewolves: number
    seer: number
    witch: number
    hunter: number
    cupid: number
    little_girl: number
    created_by: number
    created_at: number
    _all: number
  }


  export type GameRoleConfigAvgAggregateInputType = {
    villagers?: true
    werewolves?: true
  }

  export type GameRoleConfigSumAggregateInputType = {
    villagers?: true
    werewolves?: true
  }

  export type GameRoleConfigMinAggregateInputType = {
    id?: true
    game_id?: true
    villagers?: true
    werewolves?: true
    seer?: true
    witch?: true
    hunter?: true
    cupid?: true
    little_girl?: true
    created_by?: true
    created_at?: true
  }

  export type GameRoleConfigMaxAggregateInputType = {
    id?: true
    game_id?: true
    villagers?: true
    werewolves?: true
    seer?: true
    witch?: true
    hunter?: true
    cupid?: true
    little_girl?: true
    created_by?: true
    created_at?: true
  }

  export type GameRoleConfigCountAggregateInputType = {
    id?: true
    game_id?: true
    villagers?: true
    werewolves?: true
    seer?: true
    witch?: true
    hunter?: true
    cupid?: true
    little_girl?: true
    created_by?: true
    created_at?: true
    _all?: true
  }

  export type GameRoleConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRoleConfig to aggregate.
     */
    where?: GameRoleConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRoleConfigs to fetch.
     */
    orderBy?: GameRoleConfigOrderByWithRelationInput | GameRoleConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameRoleConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRoleConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRoleConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameRoleConfigs
    **/
    _count?: true | GameRoleConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameRoleConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameRoleConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameRoleConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameRoleConfigMaxAggregateInputType
  }

  export type GetGameRoleConfigAggregateType<T extends GameRoleConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateGameRoleConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameRoleConfig[P]>
      : GetScalarType<T[P], AggregateGameRoleConfig[P]>
  }




  export type GameRoleConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameRoleConfigWhereInput
    orderBy?: GameRoleConfigOrderByWithAggregationInput | GameRoleConfigOrderByWithAggregationInput[]
    by: GameRoleConfigScalarFieldEnum[] | GameRoleConfigScalarFieldEnum
    having?: GameRoleConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameRoleConfigCountAggregateInputType | true
    _avg?: GameRoleConfigAvgAggregateInputType
    _sum?: GameRoleConfigSumAggregateInputType
    _min?: GameRoleConfigMinAggregateInputType
    _max?: GameRoleConfigMaxAggregateInputType
  }

  export type GameRoleConfigGroupByOutputType = {
    id: string
    game_id: string
    villagers: number
    werewolves: number
    seer: boolean
    witch: boolean
    hunter: boolean
    cupid: boolean
    little_girl: boolean
    created_by: string
    created_at: Date
    _count: GameRoleConfigCountAggregateOutputType | null
    _avg: GameRoleConfigAvgAggregateOutputType | null
    _sum: GameRoleConfigSumAggregateOutputType | null
    _min: GameRoleConfigMinAggregateOutputType | null
    _max: GameRoleConfigMaxAggregateOutputType | null
  }

  type GetGameRoleConfigGroupByPayload<T extends GameRoleConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameRoleConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameRoleConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameRoleConfigGroupByOutputType[P]>
            : GetScalarType<T[P], GameRoleConfigGroupByOutputType[P]>
        }
      >
    >


  export type GameRoleConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    villagers?: boolean
    werewolves?: boolean
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_by?: boolean
    created_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRoleConfig"]>

  export type GameRoleConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    villagers?: boolean
    werewolves?: boolean
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_by?: boolean
    created_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRoleConfig"]>

  export type GameRoleConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    villagers?: boolean
    werewolves?: boolean
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_by?: boolean
    created_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRoleConfig"]>

  export type GameRoleConfigSelectScalar = {
    id?: boolean
    game_id?: boolean
    villagers?: boolean
    werewolves?: boolean
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_by?: boolean
    created_at?: boolean
  }

  export type GameRoleConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "game_id" | "villagers" | "werewolves" | "seer" | "witch" | "hunter" | "cupid" | "little_girl" | "created_by" | "created_at", ExtArgs["result"]["gameRoleConfig"]>
  export type GameRoleConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type GameRoleConfigIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type GameRoleConfigIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    creator?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $GameRoleConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameRoleConfig"
    objects: {
      game: Prisma.$GamePayload<ExtArgs>
      creator: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      game_id: string
      villagers: number
      werewolves: number
      seer: boolean
      witch: boolean
      hunter: boolean
      cupid: boolean
      little_girl: boolean
      created_by: string
      created_at: Date
    }, ExtArgs["result"]["gameRoleConfig"]>
    composites: {}
  }

  type GameRoleConfigGetPayload<S extends boolean | null | undefined | GameRoleConfigDefaultArgs> = $Result.GetResult<Prisma.$GameRoleConfigPayload, S>

  type GameRoleConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameRoleConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameRoleConfigCountAggregateInputType | true
    }

  export interface GameRoleConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameRoleConfig'], meta: { name: 'GameRoleConfig' } }
    /**
     * Find zero or one GameRoleConfig that matches the filter.
     * @param {GameRoleConfigFindUniqueArgs} args - Arguments to find a GameRoleConfig
     * @example
     * // Get one GameRoleConfig
     * const gameRoleConfig = await prisma.gameRoleConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameRoleConfigFindUniqueArgs>(args: SelectSubset<T, GameRoleConfigFindUniqueArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameRoleConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameRoleConfigFindUniqueOrThrowArgs} args - Arguments to find a GameRoleConfig
     * @example
     * // Get one GameRoleConfig
     * const gameRoleConfig = await prisma.gameRoleConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameRoleConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, GameRoleConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRoleConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoleConfigFindFirstArgs} args - Arguments to find a GameRoleConfig
     * @example
     * // Get one GameRoleConfig
     * const gameRoleConfig = await prisma.gameRoleConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameRoleConfigFindFirstArgs>(args?: SelectSubset<T, GameRoleConfigFindFirstArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRoleConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoleConfigFindFirstOrThrowArgs} args - Arguments to find a GameRoleConfig
     * @example
     * // Get one GameRoleConfig
     * const gameRoleConfig = await prisma.gameRoleConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameRoleConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, GameRoleConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameRoleConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoleConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameRoleConfigs
     * const gameRoleConfigs = await prisma.gameRoleConfig.findMany()
     * 
     * // Get first 10 GameRoleConfigs
     * const gameRoleConfigs = await prisma.gameRoleConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameRoleConfigWithIdOnly = await prisma.gameRoleConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameRoleConfigFindManyArgs>(args?: SelectSubset<T, GameRoleConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameRoleConfig.
     * @param {GameRoleConfigCreateArgs} args - Arguments to create a GameRoleConfig.
     * @example
     * // Create one GameRoleConfig
     * const GameRoleConfig = await prisma.gameRoleConfig.create({
     *   data: {
     *     // ... data to create a GameRoleConfig
     *   }
     * })
     * 
     */
    create<T extends GameRoleConfigCreateArgs>(args: SelectSubset<T, GameRoleConfigCreateArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameRoleConfigs.
     * @param {GameRoleConfigCreateManyArgs} args - Arguments to create many GameRoleConfigs.
     * @example
     * // Create many GameRoleConfigs
     * const gameRoleConfig = await prisma.gameRoleConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameRoleConfigCreateManyArgs>(args?: SelectSubset<T, GameRoleConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameRoleConfigs and returns the data saved in the database.
     * @param {GameRoleConfigCreateManyAndReturnArgs} args - Arguments to create many GameRoleConfigs.
     * @example
     * // Create many GameRoleConfigs
     * const gameRoleConfig = await prisma.gameRoleConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameRoleConfigs and only return the `id`
     * const gameRoleConfigWithIdOnly = await prisma.gameRoleConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameRoleConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, GameRoleConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameRoleConfig.
     * @param {GameRoleConfigDeleteArgs} args - Arguments to delete one GameRoleConfig.
     * @example
     * // Delete one GameRoleConfig
     * const GameRoleConfig = await prisma.gameRoleConfig.delete({
     *   where: {
     *     // ... filter to delete one GameRoleConfig
     *   }
     * })
     * 
     */
    delete<T extends GameRoleConfigDeleteArgs>(args: SelectSubset<T, GameRoleConfigDeleteArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameRoleConfig.
     * @param {GameRoleConfigUpdateArgs} args - Arguments to update one GameRoleConfig.
     * @example
     * // Update one GameRoleConfig
     * const gameRoleConfig = await prisma.gameRoleConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameRoleConfigUpdateArgs>(args: SelectSubset<T, GameRoleConfigUpdateArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameRoleConfigs.
     * @param {GameRoleConfigDeleteManyArgs} args - Arguments to filter GameRoleConfigs to delete.
     * @example
     * // Delete a few GameRoleConfigs
     * const { count } = await prisma.gameRoleConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameRoleConfigDeleteManyArgs>(args?: SelectSubset<T, GameRoleConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRoleConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoleConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameRoleConfigs
     * const gameRoleConfig = await prisma.gameRoleConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameRoleConfigUpdateManyArgs>(args: SelectSubset<T, GameRoleConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRoleConfigs and returns the data updated in the database.
     * @param {GameRoleConfigUpdateManyAndReturnArgs} args - Arguments to update many GameRoleConfigs.
     * @example
     * // Update many GameRoleConfigs
     * const gameRoleConfig = await prisma.gameRoleConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameRoleConfigs and only return the `id`
     * const gameRoleConfigWithIdOnly = await prisma.gameRoleConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameRoleConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, GameRoleConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameRoleConfig.
     * @param {GameRoleConfigUpsertArgs} args - Arguments to update or create a GameRoleConfig.
     * @example
     * // Update or create a GameRoleConfig
     * const gameRoleConfig = await prisma.gameRoleConfig.upsert({
     *   create: {
     *     // ... data to create a GameRoleConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameRoleConfig we want to update
     *   }
     * })
     */
    upsert<T extends GameRoleConfigUpsertArgs>(args: SelectSubset<T, GameRoleConfigUpsertArgs<ExtArgs>>): Prisma__GameRoleConfigClient<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameRoleConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoleConfigCountArgs} args - Arguments to filter GameRoleConfigs to count.
     * @example
     * // Count the number of GameRoleConfigs
     * const count = await prisma.gameRoleConfig.count({
     *   where: {
     *     // ... the filter for the GameRoleConfigs we want to count
     *   }
     * })
    **/
    count<T extends GameRoleConfigCountArgs>(
      args?: Subset<T, GameRoleConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameRoleConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameRoleConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoleConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameRoleConfigAggregateArgs>(args: Subset<T, GameRoleConfigAggregateArgs>): Prisma.PrismaPromise<GetGameRoleConfigAggregateType<T>>

    /**
     * Group by GameRoleConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoleConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameRoleConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameRoleConfigGroupByArgs['orderBy'] }
        : { orderBy?: GameRoleConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameRoleConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameRoleConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameRoleConfig model
   */
  readonly fields: GameRoleConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameRoleConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameRoleConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    game<T extends GameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameDefaultArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    creator<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameRoleConfig model
   */
  interface GameRoleConfigFieldRefs {
    readonly id: FieldRef<"GameRoleConfig", 'String'>
    readonly game_id: FieldRef<"GameRoleConfig", 'String'>
    readonly villagers: FieldRef<"GameRoleConfig", 'Int'>
    readonly werewolves: FieldRef<"GameRoleConfig", 'Int'>
    readonly seer: FieldRef<"GameRoleConfig", 'Boolean'>
    readonly witch: FieldRef<"GameRoleConfig", 'Boolean'>
    readonly hunter: FieldRef<"GameRoleConfig", 'Boolean'>
    readonly cupid: FieldRef<"GameRoleConfig", 'Boolean'>
    readonly little_girl: FieldRef<"GameRoleConfig", 'Boolean'>
    readonly created_by: FieldRef<"GameRoleConfig", 'String'>
    readonly created_at: FieldRef<"GameRoleConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameRoleConfig findUnique
   */
  export type GameRoleConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * Filter, which GameRoleConfig to fetch.
     */
    where: GameRoleConfigWhereUniqueInput
  }

  /**
   * GameRoleConfig findUniqueOrThrow
   */
  export type GameRoleConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * Filter, which GameRoleConfig to fetch.
     */
    where: GameRoleConfigWhereUniqueInput
  }

  /**
   * GameRoleConfig findFirst
   */
  export type GameRoleConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * Filter, which GameRoleConfig to fetch.
     */
    where?: GameRoleConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRoleConfigs to fetch.
     */
    orderBy?: GameRoleConfigOrderByWithRelationInput | GameRoleConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRoleConfigs.
     */
    cursor?: GameRoleConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRoleConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRoleConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRoleConfigs.
     */
    distinct?: GameRoleConfigScalarFieldEnum | GameRoleConfigScalarFieldEnum[]
  }

  /**
   * GameRoleConfig findFirstOrThrow
   */
  export type GameRoleConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * Filter, which GameRoleConfig to fetch.
     */
    where?: GameRoleConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRoleConfigs to fetch.
     */
    orderBy?: GameRoleConfigOrderByWithRelationInput | GameRoleConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRoleConfigs.
     */
    cursor?: GameRoleConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRoleConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRoleConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRoleConfigs.
     */
    distinct?: GameRoleConfigScalarFieldEnum | GameRoleConfigScalarFieldEnum[]
  }

  /**
   * GameRoleConfig findMany
   */
  export type GameRoleConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * Filter, which GameRoleConfigs to fetch.
     */
    where?: GameRoleConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRoleConfigs to fetch.
     */
    orderBy?: GameRoleConfigOrderByWithRelationInput | GameRoleConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameRoleConfigs.
     */
    cursor?: GameRoleConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRoleConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRoleConfigs.
     */
    skip?: number
    distinct?: GameRoleConfigScalarFieldEnum | GameRoleConfigScalarFieldEnum[]
  }

  /**
   * GameRoleConfig create
   */
  export type GameRoleConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a GameRoleConfig.
     */
    data: XOR<GameRoleConfigCreateInput, GameRoleConfigUncheckedCreateInput>
  }

  /**
   * GameRoleConfig createMany
   */
  export type GameRoleConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameRoleConfigs.
     */
    data: GameRoleConfigCreateManyInput | GameRoleConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameRoleConfig createManyAndReturn
   */
  export type GameRoleConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * The data used to create many GameRoleConfigs.
     */
    data: GameRoleConfigCreateManyInput | GameRoleConfigCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameRoleConfig update
   */
  export type GameRoleConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a GameRoleConfig.
     */
    data: XOR<GameRoleConfigUpdateInput, GameRoleConfigUncheckedUpdateInput>
    /**
     * Choose, which GameRoleConfig to update.
     */
    where: GameRoleConfigWhereUniqueInput
  }

  /**
   * GameRoleConfig updateMany
   */
  export type GameRoleConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameRoleConfigs.
     */
    data: XOR<GameRoleConfigUpdateManyMutationInput, GameRoleConfigUncheckedUpdateManyInput>
    /**
     * Filter which GameRoleConfigs to update
     */
    where?: GameRoleConfigWhereInput
    /**
     * Limit how many GameRoleConfigs to update.
     */
    limit?: number
  }

  /**
   * GameRoleConfig updateManyAndReturn
   */
  export type GameRoleConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * The data used to update GameRoleConfigs.
     */
    data: XOR<GameRoleConfigUpdateManyMutationInput, GameRoleConfigUncheckedUpdateManyInput>
    /**
     * Filter which GameRoleConfigs to update
     */
    where?: GameRoleConfigWhereInput
    /**
     * Limit how many GameRoleConfigs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameRoleConfig upsert
   */
  export type GameRoleConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the GameRoleConfig to update in case it exists.
     */
    where: GameRoleConfigWhereUniqueInput
    /**
     * In case the GameRoleConfig found by the `where` argument doesn't exist, create a new GameRoleConfig with this data.
     */
    create: XOR<GameRoleConfigCreateInput, GameRoleConfigUncheckedCreateInput>
    /**
     * In case the GameRoleConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameRoleConfigUpdateInput, GameRoleConfigUncheckedUpdateInput>
  }

  /**
   * GameRoleConfig delete
   */
  export type GameRoleConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    /**
     * Filter which GameRoleConfig to delete.
     */
    where: GameRoleConfigWhereUniqueInput
  }

  /**
   * GameRoleConfig deleteMany
   */
  export type GameRoleConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRoleConfigs to delete
     */
    where?: GameRoleConfigWhereInput
    /**
     * Limit how many GameRoleConfigs to delete.
     */
    limit?: number
  }

  /**
   * GameRoleConfig without action
   */
  export type GameRoleConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
  }


  /**
   * Model NightAction
   */

  export type AggregateNightAction = {
    _count: NightActionCountAggregateOutputType | null
    _avg: NightActionAvgAggregateOutputType | null
    _sum: NightActionSumAggregateOutputType | null
    _min: NightActionMinAggregateOutputType | null
    _max: NightActionMaxAggregateOutputType | null
  }

  export type NightActionAvgAggregateOutputType = {
    day_number: number | null
  }

  export type NightActionSumAggregateOutputType = {
    day_number: number | null
  }

  export type NightActionMinAggregateOutputType = {
    id: string | null
    game_id: string | null
    player_id: string | null
    action_type: $Enums.ActionType | null
    target_id: string | null
    second_target_id: string | null
    phase: $Enums.NightPhase | null
    day_number: number | null
    resolved: boolean | null
    success: boolean | null
    result_message: string | null
    created_at: Date | null
    resolved_at: Date | null
  }

  export type NightActionMaxAggregateOutputType = {
    id: string | null
    game_id: string | null
    player_id: string | null
    action_type: $Enums.ActionType | null
    target_id: string | null
    second_target_id: string | null
    phase: $Enums.NightPhase | null
    day_number: number | null
    resolved: boolean | null
    success: boolean | null
    result_message: string | null
    created_at: Date | null
    resolved_at: Date | null
  }

  export type NightActionCountAggregateOutputType = {
    id: number
    game_id: number
    player_id: number
    action_type: number
    target_id: number
    second_target_id: number
    phase: number
    day_number: number
    resolved: number
    success: number
    result_message: number
    revealed_info: number
    effects: number
    created_at: number
    resolved_at: number
    _all: number
  }


  export type NightActionAvgAggregateInputType = {
    day_number?: true
  }

  export type NightActionSumAggregateInputType = {
    day_number?: true
  }

  export type NightActionMinAggregateInputType = {
    id?: true
    game_id?: true
    player_id?: true
    action_type?: true
    target_id?: true
    second_target_id?: true
    phase?: true
    day_number?: true
    resolved?: true
    success?: true
    result_message?: true
    created_at?: true
    resolved_at?: true
  }

  export type NightActionMaxAggregateInputType = {
    id?: true
    game_id?: true
    player_id?: true
    action_type?: true
    target_id?: true
    second_target_id?: true
    phase?: true
    day_number?: true
    resolved?: true
    success?: true
    result_message?: true
    created_at?: true
    resolved_at?: true
  }

  export type NightActionCountAggregateInputType = {
    id?: true
    game_id?: true
    player_id?: true
    action_type?: true
    target_id?: true
    second_target_id?: true
    phase?: true
    day_number?: true
    resolved?: true
    success?: true
    result_message?: true
    revealed_info?: true
    effects?: true
    created_at?: true
    resolved_at?: true
    _all?: true
  }

  export type NightActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NightAction to aggregate.
     */
    where?: NightActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NightActions to fetch.
     */
    orderBy?: NightActionOrderByWithRelationInput | NightActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NightActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NightActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NightActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NightActions
    **/
    _count?: true | NightActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NightActionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NightActionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NightActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NightActionMaxAggregateInputType
  }

  export type GetNightActionAggregateType<T extends NightActionAggregateArgs> = {
        [P in keyof T & keyof AggregateNightAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNightAction[P]>
      : GetScalarType<T[P], AggregateNightAction[P]>
  }




  export type NightActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NightActionWhereInput
    orderBy?: NightActionOrderByWithAggregationInput | NightActionOrderByWithAggregationInput[]
    by: NightActionScalarFieldEnum[] | NightActionScalarFieldEnum
    having?: NightActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NightActionCountAggregateInputType | true
    _avg?: NightActionAvgAggregateInputType
    _sum?: NightActionSumAggregateInputType
    _min?: NightActionMinAggregateInputType
    _max?: NightActionMaxAggregateInputType
  }

  export type NightActionGroupByOutputType = {
    id: string
    game_id: string
    player_id: string
    action_type: $Enums.ActionType
    target_id: string | null
    second_target_id: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved: boolean
    success: boolean | null
    result_message: string | null
    revealed_info: JsonValue | null
    effects: JsonValue | null
    created_at: Date
    resolved_at: Date | null
    _count: NightActionCountAggregateOutputType | null
    _avg: NightActionAvgAggregateOutputType | null
    _sum: NightActionSumAggregateOutputType | null
    _min: NightActionMinAggregateOutputType | null
    _max: NightActionMaxAggregateOutputType | null
  }

  type GetNightActionGroupByPayload<T extends NightActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NightActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NightActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NightActionGroupByOutputType[P]>
            : GetScalarType<T[P], NightActionGroupByOutputType[P]>
        }
      >
    >


  export type NightActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    player_id?: boolean
    action_type?: boolean
    target_id?: boolean
    second_target_id?: boolean
    phase?: boolean
    day_number?: boolean
    resolved?: boolean
    success?: boolean
    result_message?: boolean
    revealed_info?: boolean
    effects?: boolean
    created_at?: boolean
    resolved_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    performer?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nightAction"]>

  export type NightActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    player_id?: boolean
    action_type?: boolean
    target_id?: boolean
    second_target_id?: boolean
    phase?: boolean
    day_number?: boolean
    resolved?: boolean
    success?: boolean
    result_message?: boolean
    revealed_info?: boolean
    effects?: boolean
    created_at?: boolean
    resolved_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    performer?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nightAction"]>

  export type NightActionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game_id?: boolean
    player_id?: boolean
    action_type?: boolean
    target_id?: boolean
    second_target_id?: boolean
    phase?: boolean
    day_number?: boolean
    resolved?: boolean
    success?: boolean
    result_message?: boolean
    revealed_info?: boolean
    effects?: boolean
    created_at?: boolean
    resolved_at?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
    performer?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nightAction"]>

  export type NightActionSelectScalar = {
    id?: boolean
    game_id?: boolean
    player_id?: boolean
    action_type?: boolean
    target_id?: boolean
    second_target_id?: boolean
    phase?: boolean
    day_number?: boolean
    resolved?: boolean
    success?: boolean
    result_message?: boolean
    revealed_info?: boolean
    effects?: boolean
    created_at?: boolean
    resolved_at?: boolean
  }

  export type NightActionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "game_id" | "player_id" | "action_type" | "target_id" | "second_target_id" | "phase" | "day_number" | "resolved" | "success" | "result_message" | "revealed_info" | "effects" | "created_at" | "resolved_at", ExtArgs["result"]["nightAction"]>
  export type NightActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    performer?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type NightActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    performer?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type NightActionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
    performer?: boolean | PlayerDefaultArgs<ExtArgs>
  }

  export type $NightActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NightAction"
    objects: {
      game: Prisma.$GamePayload<ExtArgs>
      performer: Prisma.$PlayerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      game_id: string
      player_id: string
      action_type: $Enums.ActionType
      target_id: string | null
      second_target_id: string | null
      phase: $Enums.NightPhase
      day_number: number
      resolved: boolean
      success: boolean | null
      result_message: string | null
      revealed_info: Prisma.JsonValue | null
      effects: Prisma.JsonValue | null
      created_at: Date
      resolved_at: Date | null
    }, ExtArgs["result"]["nightAction"]>
    composites: {}
  }

  type NightActionGetPayload<S extends boolean | null | undefined | NightActionDefaultArgs> = $Result.GetResult<Prisma.$NightActionPayload, S>

  type NightActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NightActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NightActionCountAggregateInputType | true
    }

  export interface NightActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NightAction'], meta: { name: 'NightAction' } }
    /**
     * Find zero or one NightAction that matches the filter.
     * @param {NightActionFindUniqueArgs} args - Arguments to find a NightAction
     * @example
     * // Get one NightAction
     * const nightAction = await prisma.nightAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NightActionFindUniqueArgs>(args: SelectSubset<T, NightActionFindUniqueArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NightAction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NightActionFindUniqueOrThrowArgs} args - Arguments to find a NightAction
     * @example
     * // Get one NightAction
     * const nightAction = await prisma.nightAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NightActionFindUniqueOrThrowArgs>(args: SelectSubset<T, NightActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NightAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NightActionFindFirstArgs} args - Arguments to find a NightAction
     * @example
     * // Get one NightAction
     * const nightAction = await prisma.nightAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NightActionFindFirstArgs>(args?: SelectSubset<T, NightActionFindFirstArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NightAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NightActionFindFirstOrThrowArgs} args - Arguments to find a NightAction
     * @example
     * // Get one NightAction
     * const nightAction = await prisma.nightAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NightActionFindFirstOrThrowArgs>(args?: SelectSubset<T, NightActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NightActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NightActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NightActions
     * const nightActions = await prisma.nightAction.findMany()
     * 
     * // Get first 10 NightActions
     * const nightActions = await prisma.nightAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nightActionWithIdOnly = await prisma.nightAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NightActionFindManyArgs>(args?: SelectSubset<T, NightActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NightAction.
     * @param {NightActionCreateArgs} args - Arguments to create a NightAction.
     * @example
     * // Create one NightAction
     * const NightAction = await prisma.nightAction.create({
     *   data: {
     *     // ... data to create a NightAction
     *   }
     * })
     * 
     */
    create<T extends NightActionCreateArgs>(args: SelectSubset<T, NightActionCreateArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NightActions.
     * @param {NightActionCreateManyArgs} args - Arguments to create many NightActions.
     * @example
     * // Create many NightActions
     * const nightAction = await prisma.nightAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NightActionCreateManyArgs>(args?: SelectSubset<T, NightActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NightActions and returns the data saved in the database.
     * @param {NightActionCreateManyAndReturnArgs} args - Arguments to create many NightActions.
     * @example
     * // Create many NightActions
     * const nightAction = await prisma.nightAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NightActions and only return the `id`
     * const nightActionWithIdOnly = await prisma.nightAction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NightActionCreateManyAndReturnArgs>(args?: SelectSubset<T, NightActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NightAction.
     * @param {NightActionDeleteArgs} args - Arguments to delete one NightAction.
     * @example
     * // Delete one NightAction
     * const NightAction = await prisma.nightAction.delete({
     *   where: {
     *     // ... filter to delete one NightAction
     *   }
     * })
     * 
     */
    delete<T extends NightActionDeleteArgs>(args: SelectSubset<T, NightActionDeleteArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NightAction.
     * @param {NightActionUpdateArgs} args - Arguments to update one NightAction.
     * @example
     * // Update one NightAction
     * const nightAction = await prisma.nightAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NightActionUpdateArgs>(args: SelectSubset<T, NightActionUpdateArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NightActions.
     * @param {NightActionDeleteManyArgs} args - Arguments to filter NightActions to delete.
     * @example
     * // Delete a few NightActions
     * const { count } = await prisma.nightAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NightActionDeleteManyArgs>(args?: SelectSubset<T, NightActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NightActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NightActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NightActions
     * const nightAction = await prisma.nightAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NightActionUpdateManyArgs>(args: SelectSubset<T, NightActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NightActions and returns the data updated in the database.
     * @param {NightActionUpdateManyAndReturnArgs} args - Arguments to update many NightActions.
     * @example
     * // Update many NightActions
     * const nightAction = await prisma.nightAction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NightActions and only return the `id`
     * const nightActionWithIdOnly = await prisma.nightAction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NightActionUpdateManyAndReturnArgs>(args: SelectSubset<T, NightActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NightAction.
     * @param {NightActionUpsertArgs} args - Arguments to update or create a NightAction.
     * @example
     * // Update or create a NightAction
     * const nightAction = await prisma.nightAction.upsert({
     *   create: {
     *     // ... data to create a NightAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NightAction we want to update
     *   }
     * })
     */
    upsert<T extends NightActionUpsertArgs>(args: SelectSubset<T, NightActionUpsertArgs<ExtArgs>>): Prisma__NightActionClient<$Result.GetResult<Prisma.$NightActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NightActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NightActionCountArgs} args - Arguments to filter NightActions to count.
     * @example
     * // Count the number of NightActions
     * const count = await prisma.nightAction.count({
     *   where: {
     *     // ... the filter for the NightActions we want to count
     *   }
     * })
    **/
    count<T extends NightActionCountArgs>(
      args?: Subset<T, NightActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NightActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NightAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NightActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NightActionAggregateArgs>(args: Subset<T, NightActionAggregateArgs>): Prisma.PrismaPromise<GetNightActionAggregateType<T>>

    /**
     * Group by NightAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NightActionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NightActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NightActionGroupByArgs['orderBy'] }
        : { orderBy?: NightActionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NightActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNightActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NightAction model
   */
  readonly fields: NightActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NightAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NightActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    game<T extends GameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameDefaultArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    performer<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NightAction model
   */
  interface NightActionFieldRefs {
    readonly id: FieldRef<"NightAction", 'String'>
    readonly game_id: FieldRef<"NightAction", 'String'>
    readonly player_id: FieldRef<"NightAction", 'String'>
    readonly action_type: FieldRef<"NightAction", 'ActionType'>
    readonly target_id: FieldRef<"NightAction", 'String'>
    readonly second_target_id: FieldRef<"NightAction", 'String'>
    readonly phase: FieldRef<"NightAction", 'NightPhase'>
    readonly day_number: FieldRef<"NightAction", 'Int'>
    readonly resolved: FieldRef<"NightAction", 'Boolean'>
    readonly success: FieldRef<"NightAction", 'Boolean'>
    readonly result_message: FieldRef<"NightAction", 'String'>
    readonly revealed_info: FieldRef<"NightAction", 'Json'>
    readonly effects: FieldRef<"NightAction", 'Json'>
    readonly created_at: FieldRef<"NightAction", 'DateTime'>
    readonly resolved_at: FieldRef<"NightAction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NightAction findUnique
   */
  export type NightActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * Filter, which NightAction to fetch.
     */
    where: NightActionWhereUniqueInput
  }

  /**
   * NightAction findUniqueOrThrow
   */
  export type NightActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * Filter, which NightAction to fetch.
     */
    where: NightActionWhereUniqueInput
  }

  /**
   * NightAction findFirst
   */
  export type NightActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * Filter, which NightAction to fetch.
     */
    where?: NightActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NightActions to fetch.
     */
    orderBy?: NightActionOrderByWithRelationInput | NightActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NightActions.
     */
    cursor?: NightActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NightActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NightActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NightActions.
     */
    distinct?: NightActionScalarFieldEnum | NightActionScalarFieldEnum[]
  }

  /**
   * NightAction findFirstOrThrow
   */
  export type NightActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * Filter, which NightAction to fetch.
     */
    where?: NightActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NightActions to fetch.
     */
    orderBy?: NightActionOrderByWithRelationInput | NightActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NightActions.
     */
    cursor?: NightActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NightActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NightActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NightActions.
     */
    distinct?: NightActionScalarFieldEnum | NightActionScalarFieldEnum[]
  }

  /**
   * NightAction findMany
   */
  export type NightActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * Filter, which NightActions to fetch.
     */
    where?: NightActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NightActions to fetch.
     */
    orderBy?: NightActionOrderByWithRelationInput | NightActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NightActions.
     */
    cursor?: NightActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NightActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NightActions.
     */
    skip?: number
    distinct?: NightActionScalarFieldEnum | NightActionScalarFieldEnum[]
  }

  /**
   * NightAction create
   */
  export type NightActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * The data needed to create a NightAction.
     */
    data: XOR<NightActionCreateInput, NightActionUncheckedCreateInput>
  }

  /**
   * NightAction createMany
   */
  export type NightActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NightActions.
     */
    data: NightActionCreateManyInput | NightActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NightAction createManyAndReturn
   */
  export type NightActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * The data used to create many NightActions.
     */
    data: NightActionCreateManyInput | NightActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NightAction update
   */
  export type NightActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * The data needed to update a NightAction.
     */
    data: XOR<NightActionUpdateInput, NightActionUncheckedUpdateInput>
    /**
     * Choose, which NightAction to update.
     */
    where: NightActionWhereUniqueInput
  }

  /**
   * NightAction updateMany
   */
  export type NightActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NightActions.
     */
    data: XOR<NightActionUpdateManyMutationInput, NightActionUncheckedUpdateManyInput>
    /**
     * Filter which NightActions to update
     */
    where?: NightActionWhereInput
    /**
     * Limit how many NightActions to update.
     */
    limit?: number
  }

  /**
   * NightAction updateManyAndReturn
   */
  export type NightActionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * The data used to update NightActions.
     */
    data: XOR<NightActionUpdateManyMutationInput, NightActionUncheckedUpdateManyInput>
    /**
     * Filter which NightActions to update
     */
    where?: NightActionWhereInput
    /**
     * Limit how many NightActions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NightAction upsert
   */
  export type NightActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * The filter to search for the NightAction to update in case it exists.
     */
    where: NightActionWhereUniqueInput
    /**
     * In case the NightAction found by the `where` argument doesn't exist, create a new NightAction with this data.
     */
    create: XOR<NightActionCreateInput, NightActionUncheckedCreateInput>
    /**
     * In case the NightAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NightActionUpdateInput, NightActionUncheckedUpdateInput>
  }

  /**
   * NightAction delete
   */
  export type NightActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
    /**
     * Filter which NightAction to delete.
     */
    where: NightActionWhereUniqueInput
  }

  /**
   * NightAction deleteMany
   */
  export type NightActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NightActions to delete
     */
    where?: NightActionWhereInput
    /**
     * Limit how many NightActions to delete.
     */
    limit?: number
  }

  /**
   * NightAction without action
   */
  export type NightActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NightAction
     */
    select?: NightActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NightAction
     */
    omit?: NightActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NightActionInclude<ExtArgs> | null
  }


  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileAvgAggregateOutputType = {
    games_played: number | null
    games_won: number | null
  }

  export type ProfileSumAggregateOutputType = {
    games_played: number | null
    games_won: number | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    username: string | null
    full_name: string | null
    avatar_url: string | null
    updated_at: Date | null
    created_at: Date | null
    games_played: number | null
    games_won: number | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    username: string | null
    full_name: string | null
    avatar_url: string | null
    updated_at: Date | null
    created_at: Date | null
    games_played: number | null
    games_won: number | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    username: number
    full_name: number
    avatar_url: number
    updated_at: number
    created_at: number
    games_played: number
    games_won: number
    _all: number
  }


  export type ProfileAvgAggregateInputType = {
    games_played?: true
    games_won?: true
  }

  export type ProfileSumAggregateInputType = {
    games_played?: true
    games_won?: true
  }

  export type ProfileMinAggregateInputType = {
    id?: true
    username?: true
    full_name?: true
    avatar_url?: true
    updated_at?: true
    created_at?: true
    games_played?: true
    games_won?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    username?: true
    full_name?: true
    avatar_url?: true
    updated_at?: true
    created_at?: true
    games_played?: true
    games_won?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    username?: true
    full_name?: true
    avatar_url?: true
    updated_at?: true
    created_at?: true
    games_played?: true
    games_won?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _avg?: ProfileAvgAggregateInputType
    _sum?: ProfileSumAggregateInputType
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    updated_at: Date | null
    created_at: Date
    games_played: number
    games_won: number
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    full_name?: boolean
    avatar_url?: boolean
    updated_at?: boolean
    created_at?: boolean
    games_played?: boolean
    games_won?: boolean
    created_games?: boolean | Profile$created_gamesArgs<ExtArgs>
    players?: boolean | Profile$playersArgs<ExtArgs>
    game_logs?: boolean | Profile$game_logsArgs<ExtArgs>
    chat_messages?: boolean | Profile$chat_messagesArgs<ExtArgs>
    role_configs?: boolean | Profile$role_configsArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    full_name?: boolean
    avatar_url?: boolean
    updated_at?: boolean
    created_at?: boolean
    games_played?: boolean
    games_won?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    full_name?: boolean
    avatar_url?: boolean
    updated_at?: boolean
    created_at?: boolean
    games_played?: boolean
    games_won?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    username?: boolean
    full_name?: boolean
    avatar_url?: boolean
    updated_at?: boolean
    created_at?: boolean
    games_played?: boolean
    games_won?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "full_name" | "avatar_url" | "updated_at" | "created_at" | "games_played" | "games_won", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    created_games?: boolean | Profile$created_gamesArgs<ExtArgs>
    players?: boolean | Profile$playersArgs<ExtArgs>
    game_logs?: boolean | Profile$game_logsArgs<ExtArgs>
    chat_messages?: boolean | Profile$chat_messagesArgs<ExtArgs>
    role_configs?: boolean | Profile$role_configsArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      created_games: Prisma.$GamePayload<ExtArgs>[]
      players: Prisma.$PlayerPayload<ExtArgs>[]
      game_logs: Prisma.$GameLogPayload<ExtArgs>[]
      chat_messages: Prisma.$ChatMessagePayload<ExtArgs>[]
      role_configs: Prisma.$GameRoleConfigPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string | null
      full_name: string | null
      avatar_url: string | null
      updated_at: Date | null
      created_at: Date
      games_played: number
      games_won: number
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    created_games<T extends Profile$created_gamesArgs<ExtArgs> = {}>(args?: Subset<T, Profile$created_gamesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    players<T extends Profile$playersArgs<ExtArgs> = {}>(args?: Subset<T, Profile$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    game_logs<T extends Profile$game_logsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$game_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chat_messages<T extends Profile$chat_messagesArgs<ExtArgs> = {}>(args?: Subset<T, Profile$chat_messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    role_configs<T extends Profile$role_configsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$role_configsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoleConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly username: FieldRef<"Profile", 'String'>
    readonly full_name: FieldRef<"Profile", 'String'>
    readonly avatar_url: FieldRef<"Profile", 'String'>
    readonly updated_at: FieldRef<"Profile", 'DateTime'>
    readonly created_at: FieldRef<"Profile", 'DateTime'>
    readonly games_played: FieldRef<"Profile", 'Int'>
    readonly games_won: FieldRef<"Profile", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile.created_games
   */
  export type Profile$created_gamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Profile.players
   */
  export type Profile$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Profile.game_logs
   */
  export type Profile$game_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameLog
     */
    select?: GameLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameLog
     */
    omit?: GameLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameLogInclude<ExtArgs> | null
    where?: GameLogWhereInput
    orderBy?: GameLogOrderByWithRelationInput | GameLogOrderByWithRelationInput[]
    cursor?: GameLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameLogScalarFieldEnum | GameLogScalarFieldEnum[]
  }

  /**
   * Profile.chat_messages
   */
  export type Profile$chat_messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * Profile.role_configs
   */
  export type Profile$role_configsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoleConfig
     */
    select?: GameRoleConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoleConfig
     */
    omit?: GameRoleConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoleConfigInclude<ExtArgs> | null
    where?: GameRoleConfigWhereInput
    orderBy?: GameRoleConfigOrderByWithRelationInput | GameRoleConfigOrderByWithRelationInput[]
    cursor?: GameRoleConfigWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameRoleConfigScalarFieldEnum | GameRoleConfigScalarFieldEnum[]
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const GameScalarFieldEnum: {
    id: 'id',
    name: 'name',
    code: 'code',
    status: 'status',
    phase: 'phase',
    night_phase: 'night_phase',
    day_number: 'day_number',
    max_players: 'max_players',
    current_players: 'current_players',
    game_settings: 'game_settings',
    winner: 'winner',
    creator_id: 'creator_id',
    created_at: 'created_at',
    started_at: 'started_at',
    finished_at: 'finished_at',
    updated_at: 'updated_at'
  };

  export type GameScalarFieldEnum = (typeof GameScalarFieldEnum)[keyof typeof GameScalarFieldEnum]


  export const PlayerScalarFieldEnum: {
    user_id: 'user_id',
    game_id: 'game_id',
    role: 'role',
    team: 'team',
    is_alive: 'is_alive',
    is_host: 'is_host',
    joined_at: 'joined_at',
    eliminated_at: 'eliminated_at',
    votes_cast: 'votes_cast',
    lover_id: 'lover_id',
    has_heal_potion: 'has_heal_potion',
    has_poison_potion: 'has_poison_potion',
    can_shoot: 'can_shoot',
    has_spied: 'has_spied',
    spy_risk: 'spy_risk',
    is_protected: 'is_protected'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const GameLogScalarFieldEnum: {
    id: 'id',
    game_id: 'game_id',
    user_id: 'user_id',
    player_id: 'player_id',
    action: 'action',
    details: 'details',
    phase: 'phase',
    day_number: 'day_number',
    created_at: 'created_at'
  };

  export type GameLogScalarFieldEnum = (typeof GameLogScalarFieldEnum)[keyof typeof GameLogScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    game_id: 'game_id',
    user_id: 'user_id',
    channel: 'channel',
    type: 'type',
    content: 'content',
    mentions: 'mentions',
    edited: 'edited',
    edited_at: 'edited_at',
    created_at: 'created_at'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const GameRoleConfigScalarFieldEnum: {
    id: 'id',
    game_id: 'game_id',
    villagers: 'villagers',
    werewolves: 'werewolves',
    seer: 'seer',
    witch: 'witch',
    hunter: 'hunter',
    cupid: 'cupid',
    little_girl: 'little_girl',
    created_by: 'created_by',
    created_at: 'created_at'
  };

  export type GameRoleConfigScalarFieldEnum = (typeof GameRoleConfigScalarFieldEnum)[keyof typeof GameRoleConfigScalarFieldEnum]


  export const NightActionScalarFieldEnum: {
    id: 'id',
    game_id: 'game_id',
    player_id: 'player_id',
    action_type: 'action_type',
    target_id: 'target_id',
    second_target_id: 'second_target_id',
    phase: 'phase',
    day_number: 'day_number',
    resolved: 'resolved',
    success: 'success',
    result_message: 'result_message',
    revealed_info: 'revealed_info',
    effects: 'effects',
    created_at: 'created_at',
    resolved_at: 'resolved_at'
  };

  export type NightActionScalarFieldEnum = (typeof NightActionScalarFieldEnum)[keyof typeof NightActionScalarFieldEnum]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    username: 'username',
    full_name: 'full_name',
    avatar_url: 'avatar_url',
    updated_at: 'updated_at',
    created_at: 'created_at',
    games_played: 'games_played',
    games_won: 'games_won'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'GameStatus'
   */
  export type EnumGameStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameStatus'>
    


  /**
   * Reference to a field of type 'GameStatus[]'
   */
  export type ListEnumGameStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameStatus[]'>
    


  /**
   * Reference to a field of type 'GamePhase'
   */
  export type EnumGamePhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GamePhase'>
    


  /**
   * Reference to a field of type 'GamePhase[]'
   */
  export type ListEnumGamePhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GamePhase[]'>
    


  /**
   * Reference to a field of type 'NightPhase'
   */
  export type EnumNightPhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NightPhase'>
    


  /**
   * Reference to a field of type 'NightPhase[]'
   */
  export type ListEnumNightPhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NightPhase[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'WerewolfRole'
   */
  export type EnumWerewolfRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WerewolfRole'>
    


  /**
   * Reference to a field of type 'WerewolfRole[]'
   */
  export type ListEnumWerewolfRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WerewolfRole[]'>
    


  /**
   * Reference to a field of type 'Team'
   */
  export type EnumTeamFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Team'>
    


  /**
   * Reference to a field of type 'Team[]'
   */
  export type ListEnumTeamFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Team[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ChatChannel'
   */
  export type EnumChatChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatChannel'>
    


  /**
   * Reference to a field of type 'ChatChannel[]'
   */
  export type ListEnumChatChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatChannel[]'>
    


  /**
   * Reference to a field of type 'MessageType'
   */
  export type EnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType'>
    


  /**
   * Reference to a field of type 'MessageType[]'
   */
  export type ListEnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType[]'>
    


  /**
   * Reference to a field of type 'ActionType'
   */
  export type EnumActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionType'>
    


  /**
   * Reference to a field of type 'ActionType[]'
   */
  export type ListEnumActionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type GameWhereInput = {
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    id?: UuidFilter<"Game"> | string
    name?: StringFilter<"Game"> | string
    code?: StringFilter<"Game"> | string
    status?: EnumGameStatusFilter<"Game"> | $Enums.GameStatus
    phase?: EnumGamePhaseNullableFilter<"Game"> | $Enums.GamePhase | null
    night_phase?: EnumNightPhaseNullableFilter<"Game"> | $Enums.NightPhase | null
    day_number?: IntFilter<"Game"> | number
    max_players?: IntFilter<"Game"> | number
    current_players?: IntFilter<"Game"> | number
    game_settings?: JsonFilter<"Game">
    winner?: StringNullableFilter<"Game"> | string | null
    creator_id?: UuidFilter<"Game"> | string
    created_at?: DateTimeFilter<"Game"> | Date | string
    started_at?: DateTimeNullableFilter<"Game"> | Date | string | null
    finished_at?: DateTimeNullableFilter<"Game"> | Date | string | null
    updated_at?: DateTimeFilter<"Game"> | Date | string
    creator?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    players?: PlayerListRelationFilter
    game_logs?: GameLogListRelationFilter
    chat_messages?: ChatMessageListRelationFilter
    role_config?: XOR<GameRoleConfigNullableScalarRelationFilter, GameRoleConfigWhereInput> | null
    night_actions?: NightActionListRelationFilter
  }

  export type GameOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    status?: SortOrder
    phase?: SortOrderInput | SortOrder
    night_phase?: SortOrderInput | SortOrder
    day_number?: SortOrder
    max_players?: SortOrder
    current_players?: SortOrder
    game_settings?: SortOrder
    winner?: SortOrderInput | SortOrder
    creator_id?: SortOrder
    created_at?: SortOrder
    started_at?: SortOrderInput | SortOrder
    finished_at?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    creator?: ProfileOrderByWithRelationInput
    players?: PlayerOrderByRelationAggregateInput
    game_logs?: GameLogOrderByRelationAggregateInput
    chat_messages?: ChatMessageOrderByRelationAggregateInput
    role_config?: GameRoleConfigOrderByWithRelationInput
    night_actions?: NightActionOrderByRelationAggregateInput
  }

  export type GameWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    name?: StringFilter<"Game"> | string
    status?: EnumGameStatusFilter<"Game"> | $Enums.GameStatus
    phase?: EnumGamePhaseNullableFilter<"Game"> | $Enums.GamePhase | null
    night_phase?: EnumNightPhaseNullableFilter<"Game"> | $Enums.NightPhase | null
    day_number?: IntFilter<"Game"> | number
    max_players?: IntFilter<"Game"> | number
    current_players?: IntFilter<"Game"> | number
    game_settings?: JsonFilter<"Game">
    winner?: StringNullableFilter<"Game"> | string | null
    creator_id?: UuidFilter<"Game"> | string
    created_at?: DateTimeFilter<"Game"> | Date | string
    started_at?: DateTimeNullableFilter<"Game"> | Date | string | null
    finished_at?: DateTimeNullableFilter<"Game"> | Date | string | null
    updated_at?: DateTimeFilter<"Game"> | Date | string
    creator?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    players?: PlayerListRelationFilter
    game_logs?: GameLogListRelationFilter
    chat_messages?: ChatMessageListRelationFilter
    role_config?: XOR<GameRoleConfigNullableScalarRelationFilter, GameRoleConfigWhereInput> | null
    night_actions?: NightActionListRelationFilter
  }, "id" | "code">

  export type GameOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    status?: SortOrder
    phase?: SortOrderInput | SortOrder
    night_phase?: SortOrderInput | SortOrder
    day_number?: SortOrder
    max_players?: SortOrder
    current_players?: SortOrder
    game_settings?: SortOrder
    winner?: SortOrderInput | SortOrder
    creator_id?: SortOrder
    created_at?: SortOrder
    started_at?: SortOrderInput | SortOrder
    finished_at?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    _count?: GameCountOrderByAggregateInput
    _avg?: GameAvgOrderByAggregateInput
    _max?: GameMaxOrderByAggregateInput
    _min?: GameMinOrderByAggregateInput
    _sum?: GameSumOrderByAggregateInput
  }

  export type GameScalarWhereWithAggregatesInput = {
    AND?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    OR?: GameScalarWhereWithAggregatesInput[]
    NOT?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Game"> | string
    name?: StringWithAggregatesFilter<"Game"> | string
    code?: StringWithAggregatesFilter<"Game"> | string
    status?: EnumGameStatusWithAggregatesFilter<"Game"> | $Enums.GameStatus
    phase?: EnumGamePhaseNullableWithAggregatesFilter<"Game"> | $Enums.GamePhase | null
    night_phase?: EnumNightPhaseNullableWithAggregatesFilter<"Game"> | $Enums.NightPhase | null
    day_number?: IntWithAggregatesFilter<"Game"> | number
    max_players?: IntWithAggregatesFilter<"Game"> | number
    current_players?: IntWithAggregatesFilter<"Game"> | number
    game_settings?: JsonWithAggregatesFilter<"Game">
    winner?: StringNullableWithAggregatesFilter<"Game"> | string | null
    creator_id?: UuidWithAggregatesFilter<"Game"> | string
    created_at?: DateTimeWithAggregatesFilter<"Game"> | Date | string
    started_at?: DateTimeNullableWithAggregatesFilter<"Game"> | Date | string | null
    finished_at?: DateTimeNullableWithAggregatesFilter<"Game"> | Date | string | null
    updated_at?: DateTimeWithAggregatesFilter<"Game"> | Date | string
  }

  export type PlayerWhereInput = {
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    user_id?: UuidFilter<"Player"> | string
    game_id?: UuidFilter<"Player"> | string
    role?: EnumWerewolfRoleNullableFilter<"Player"> | $Enums.WerewolfRole | null
    team?: EnumTeamNullableFilter<"Player"> | $Enums.Team | null
    is_alive?: BoolFilter<"Player"> | boolean
    is_host?: BoolFilter<"Player"> | boolean
    joined_at?: DateTimeFilter<"Player"> | Date | string
    eliminated_at?: DateTimeNullableFilter<"Player"> | Date | string | null
    votes_cast?: IntFilter<"Player"> | number
    lover_id?: UuidNullableFilter<"Player"> | string | null
    has_heal_potion?: BoolFilter<"Player"> | boolean
    has_poison_potion?: BoolFilter<"Player"> | boolean
    can_shoot?: BoolFilter<"Player"> | boolean
    has_spied?: BoolFilter<"Player"> | boolean
    spy_risk?: IntFilter<"Player"> | number
    is_protected?: BoolFilter<"Player"> | boolean
    user?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    game_logs?: GameLogListRelationFilter
    night_actions?: NightActionListRelationFilter
  }

  export type PlayerOrderByWithRelationInput = {
    user_id?: SortOrder
    game_id?: SortOrder
    role?: SortOrderInput | SortOrder
    team?: SortOrderInput | SortOrder
    is_alive?: SortOrder
    is_host?: SortOrder
    joined_at?: SortOrder
    eliminated_at?: SortOrderInput | SortOrder
    votes_cast?: SortOrder
    lover_id?: SortOrderInput | SortOrder
    has_heal_potion?: SortOrder
    has_poison_potion?: SortOrder
    can_shoot?: SortOrder
    has_spied?: SortOrder
    spy_risk?: SortOrder
    is_protected?: SortOrder
    user?: ProfileOrderByWithRelationInput
    game?: GameOrderByWithRelationInput
    game_logs?: GameLogOrderByRelationAggregateInput
    night_actions?: NightActionOrderByRelationAggregateInput
  }

  export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    user_id_game_id?: PlayerUser_idGame_idCompoundUniqueInput
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    user_id?: UuidFilter<"Player"> | string
    game_id?: UuidFilter<"Player"> | string
    role?: EnumWerewolfRoleNullableFilter<"Player"> | $Enums.WerewolfRole | null
    team?: EnumTeamNullableFilter<"Player"> | $Enums.Team | null
    is_alive?: BoolFilter<"Player"> | boolean
    is_host?: BoolFilter<"Player"> | boolean
    joined_at?: DateTimeFilter<"Player"> | Date | string
    eliminated_at?: DateTimeNullableFilter<"Player"> | Date | string | null
    votes_cast?: IntFilter<"Player"> | number
    lover_id?: UuidNullableFilter<"Player"> | string | null
    has_heal_potion?: BoolFilter<"Player"> | boolean
    has_poison_potion?: BoolFilter<"Player"> | boolean
    can_shoot?: BoolFilter<"Player"> | boolean
    has_spied?: BoolFilter<"Player"> | boolean
    spy_risk?: IntFilter<"Player"> | number
    is_protected?: BoolFilter<"Player"> | boolean
    user?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    game_logs?: GameLogListRelationFilter
    night_actions?: NightActionListRelationFilter
  }, "user_id_game_id">

  export type PlayerOrderByWithAggregationInput = {
    user_id?: SortOrder
    game_id?: SortOrder
    role?: SortOrderInput | SortOrder
    team?: SortOrderInput | SortOrder
    is_alive?: SortOrder
    is_host?: SortOrder
    joined_at?: SortOrder
    eliminated_at?: SortOrderInput | SortOrder
    votes_cast?: SortOrder
    lover_id?: SortOrderInput | SortOrder
    has_heal_potion?: SortOrder
    has_poison_potion?: SortOrder
    can_shoot?: SortOrder
    has_spied?: SortOrder
    spy_risk?: SortOrder
    is_protected?: SortOrder
    _count?: PlayerCountOrderByAggregateInput
    _avg?: PlayerAvgOrderByAggregateInput
    _max?: PlayerMaxOrderByAggregateInput
    _min?: PlayerMinOrderByAggregateInput
    _sum?: PlayerSumOrderByAggregateInput
  }

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    OR?: PlayerScalarWhereWithAggregatesInput[]
    NOT?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    user_id?: UuidWithAggregatesFilter<"Player"> | string
    game_id?: UuidWithAggregatesFilter<"Player"> | string
    role?: EnumWerewolfRoleNullableWithAggregatesFilter<"Player"> | $Enums.WerewolfRole | null
    team?: EnumTeamNullableWithAggregatesFilter<"Player"> | $Enums.Team | null
    is_alive?: BoolWithAggregatesFilter<"Player"> | boolean
    is_host?: BoolWithAggregatesFilter<"Player"> | boolean
    joined_at?: DateTimeWithAggregatesFilter<"Player"> | Date | string
    eliminated_at?: DateTimeNullableWithAggregatesFilter<"Player"> | Date | string | null
    votes_cast?: IntWithAggregatesFilter<"Player"> | number
    lover_id?: UuidNullableWithAggregatesFilter<"Player"> | string | null
    has_heal_potion?: BoolWithAggregatesFilter<"Player"> | boolean
    has_poison_potion?: BoolWithAggregatesFilter<"Player"> | boolean
    can_shoot?: BoolWithAggregatesFilter<"Player"> | boolean
    has_spied?: BoolWithAggregatesFilter<"Player"> | boolean
    spy_risk?: IntWithAggregatesFilter<"Player"> | number
    is_protected?: BoolWithAggregatesFilter<"Player"> | boolean
  }

  export type GameLogWhereInput = {
    AND?: GameLogWhereInput | GameLogWhereInput[]
    OR?: GameLogWhereInput[]
    NOT?: GameLogWhereInput | GameLogWhereInput[]
    id?: UuidFilter<"GameLog"> | string
    game_id?: UuidFilter<"GameLog"> | string
    user_id?: UuidNullableFilter<"GameLog"> | string | null
    player_id?: UuidNullableFilter<"GameLog"> | string | null
    action?: StringFilter<"GameLog"> | string
    details?: JsonNullableFilter<"GameLog">
    phase?: EnumGamePhaseNullableFilter<"GameLog"> | $Enums.GamePhase | null
    day_number?: IntNullableFilter<"GameLog"> | number | null
    created_at?: DateTimeFilter<"GameLog"> | Date | string
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    user?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    player?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
  }

  export type GameLogOrderByWithRelationInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    player_id?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    phase?: SortOrderInput | SortOrder
    day_number?: SortOrderInput | SortOrder
    created_at?: SortOrder
    game?: GameOrderByWithRelationInput
    user?: ProfileOrderByWithRelationInput
    player?: PlayerOrderByWithRelationInput
  }

  export type GameLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameLogWhereInput | GameLogWhereInput[]
    OR?: GameLogWhereInput[]
    NOT?: GameLogWhereInput | GameLogWhereInput[]
    game_id?: UuidFilter<"GameLog"> | string
    user_id?: UuidNullableFilter<"GameLog"> | string | null
    player_id?: UuidNullableFilter<"GameLog"> | string | null
    action?: StringFilter<"GameLog"> | string
    details?: JsonNullableFilter<"GameLog">
    phase?: EnumGamePhaseNullableFilter<"GameLog"> | $Enums.GamePhase | null
    day_number?: IntNullableFilter<"GameLog"> | number | null
    created_at?: DateTimeFilter<"GameLog"> | Date | string
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    user?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    player?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
  }, "id">

  export type GameLogOrderByWithAggregationInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    player_id?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    phase?: SortOrderInput | SortOrder
    day_number?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: GameLogCountOrderByAggregateInput
    _avg?: GameLogAvgOrderByAggregateInput
    _max?: GameLogMaxOrderByAggregateInput
    _min?: GameLogMinOrderByAggregateInput
    _sum?: GameLogSumOrderByAggregateInput
  }

  export type GameLogScalarWhereWithAggregatesInput = {
    AND?: GameLogScalarWhereWithAggregatesInput | GameLogScalarWhereWithAggregatesInput[]
    OR?: GameLogScalarWhereWithAggregatesInput[]
    NOT?: GameLogScalarWhereWithAggregatesInput | GameLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GameLog"> | string
    game_id?: UuidWithAggregatesFilter<"GameLog"> | string
    user_id?: UuidNullableWithAggregatesFilter<"GameLog"> | string | null
    player_id?: UuidNullableWithAggregatesFilter<"GameLog"> | string | null
    action?: StringWithAggregatesFilter<"GameLog"> | string
    details?: JsonNullableWithAggregatesFilter<"GameLog">
    phase?: EnumGamePhaseNullableWithAggregatesFilter<"GameLog"> | $Enums.GamePhase | null
    day_number?: IntNullableWithAggregatesFilter<"GameLog"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"GameLog"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: UuidFilter<"ChatMessage"> | string
    game_id?: UuidNullableFilter<"ChatMessage"> | string | null
    user_id?: UuidFilter<"ChatMessage"> | string
    channel?: EnumChatChannelFilter<"ChatMessage"> | $Enums.ChatChannel
    type?: EnumMessageTypeFilter<"ChatMessage"> | $Enums.MessageType
    content?: StringFilter<"ChatMessage"> | string
    mentions?: StringNullableListFilter<"ChatMessage">
    edited?: BoolFilter<"ChatMessage"> | boolean
    edited_at?: DateTimeNullableFilter<"ChatMessage"> | Date | string | null
    created_at?: DateTimeFilter<"ChatMessage"> | Date | string
    game?: XOR<GameNullableScalarRelationFilter, GameWhereInput> | null
    user?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    game_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    type?: SortOrder
    content?: SortOrder
    mentions?: SortOrder
    edited?: SortOrder
    edited_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    game?: GameOrderByWithRelationInput
    user?: ProfileOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    game_id?: UuidNullableFilter<"ChatMessage"> | string | null
    user_id?: UuidFilter<"ChatMessage"> | string
    channel?: EnumChatChannelFilter<"ChatMessage"> | $Enums.ChatChannel
    type?: EnumMessageTypeFilter<"ChatMessage"> | $Enums.MessageType
    content?: StringFilter<"ChatMessage"> | string
    mentions?: StringNullableListFilter<"ChatMessage">
    edited?: BoolFilter<"ChatMessage"> | boolean
    edited_at?: DateTimeNullableFilter<"ChatMessage"> | Date | string | null
    created_at?: DateTimeFilter<"ChatMessage"> | Date | string
    game?: XOR<GameNullableScalarRelationFilter, GameWhereInput> | null
    user?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    game_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    type?: SortOrder
    content?: SortOrder
    mentions?: SortOrder
    edited?: SortOrder
    edited_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ChatMessage"> | string
    game_id?: UuidNullableWithAggregatesFilter<"ChatMessage"> | string | null
    user_id?: UuidWithAggregatesFilter<"ChatMessage"> | string
    channel?: EnumChatChannelWithAggregatesFilter<"ChatMessage"> | $Enums.ChatChannel
    type?: EnumMessageTypeWithAggregatesFilter<"ChatMessage"> | $Enums.MessageType
    content?: StringWithAggregatesFilter<"ChatMessage"> | string
    mentions?: StringNullableListFilter<"ChatMessage">
    edited?: BoolWithAggregatesFilter<"ChatMessage"> | boolean
    edited_at?: DateTimeNullableWithAggregatesFilter<"ChatMessage"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type GameRoleConfigWhereInput = {
    AND?: GameRoleConfigWhereInput | GameRoleConfigWhereInput[]
    OR?: GameRoleConfigWhereInput[]
    NOT?: GameRoleConfigWhereInput | GameRoleConfigWhereInput[]
    id?: UuidFilter<"GameRoleConfig"> | string
    game_id?: UuidFilter<"GameRoleConfig"> | string
    villagers?: IntFilter<"GameRoleConfig"> | number
    werewolves?: IntFilter<"GameRoleConfig"> | number
    seer?: BoolFilter<"GameRoleConfig"> | boolean
    witch?: BoolFilter<"GameRoleConfig"> | boolean
    hunter?: BoolFilter<"GameRoleConfig"> | boolean
    cupid?: BoolFilter<"GameRoleConfig"> | boolean
    little_girl?: BoolFilter<"GameRoleConfig"> | boolean
    created_by?: UuidFilter<"GameRoleConfig"> | string
    created_at?: DateTimeFilter<"GameRoleConfig"> | Date | string
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    creator?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type GameRoleConfigOrderByWithRelationInput = {
    id?: SortOrder
    game_id?: SortOrder
    villagers?: SortOrder
    werewolves?: SortOrder
    seer?: SortOrder
    witch?: SortOrder
    hunter?: SortOrder
    cupid?: SortOrder
    little_girl?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    game?: GameOrderByWithRelationInput
    creator?: ProfileOrderByWithRelationInput
  }

  export type GameRoleConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    game_id?: string
    AND?: GameRoleConfigWhereInput | GameRoleConfigWhereInput[]
    OR?: GameRoleConfigWhereInput[]
    NOT?: GameRoleConfigWhereInput | GameRoleConfigWhereInput[]
    villagers?: IntFilter<"GameRoleConfig"> | number
    werewolves?: IntFilter<"GameRoleConfig"> | number
    seer?: BoolFilter<"GameRoleConfig"> | boolean
    witch?: BoolFilter<"GameRoleConfig"> | boolean
    hunter?: BoolFilter<"GameRoleConfig"> | boolean
    cupid?: BoolFilter<"GameRoleConfig"> | boolean
    little_girl?: BoolFilter<"GameRoleConfig"> | boolean
    created_by?: UuidFilter<"GameRoleConfig"> | string
    created_at?: DateTimeFilter<"GameRoleConfig"> | Date | string
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    creator?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id" | "game_id">

  export type GameRoleConfigOrderByWithAggregationInput = {
    id?: SortOrder
    game_id?: SortOrder
    villagers?: SortOrder
    werewolves?: SortOrder
    seer?: SortOrder
    witch?: SortOrder
    hunter?: SortOrder
    cupid?: SortOrder
    little_girl?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    _count?: GameRoleConfigCountOrderByAggregateInput
    _avg?: GameRoleConfigAvgOrderByAggregateInput
    _max?: GameRoleConfigMaxOrderByAggregateInput
    _min?: GameRoleConfigMinOrderByAggregateInput
    _sum?: GameRoleConfigSumOrderByAggregateInput
  }

  export type GameRoleConfigScalarWhereWithAggregatesInput = {
    AND?: GameRoleConfigScalarWhereWithAggregatesInput | GameRoleConfigScalarWhereWithAggregatesInput[]
    OR?: GameRoleConfigScalarWhereWithAggregatesInput[]
    NOT?: GameRoleConfigScalarWhereWithAggregatesInput | GameRoleConfigScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GameRoleConfig"> | string
    game_id?: UuidWithAggregatesFilter<"GameRoleConfig"> | string
    villagers?: IntWithAggregatesFilter<"GameRoleConfig"> | number
    werewolves?: IntWithAggregatesFilter<"GameRoleConfig"> | number
    seer?: BoolWithAggregatesFilter<"GameRoleConfig"> | boolean
    witch?: BoolWithAggregatesFilter<"GameRoleConfig"> | boolean
    hunter?: BoolWithAggregatesFilter<"GameRoleConfig"> | boolean
    cupid?: BoolWithAggregatesFilter<"GameRoleConfig"> | boolean
    little_girl?: BoolWithAggregatesFilter<"GameRoleConfig"> | boolean
    created_by?: UuidWithAggregatesFilter<"GameRoleConfig"> | string
    created_at?: DateTimeWithAggregatesFilter<"GameRoleConfig"> | Date | string
  }

  export type NightActionWhereInput = {
    AND?: NightActionWhereInput | NightActionWhereInput[]
    OR?: NightActionWhereInput[]
    NOT?: NightActionWhereInput | NightActionWhereInput[]
    id?: UuidFilter<"NightAction"> | string
    game_id?: UuidFilter<"NightAction"> | string
    player_id?: UuidFilter<"NightAction"> | string
    action_type?: EnumActionTypeFilter<"NightAction"> | $Enums.ActionType
    target_id?: UuidNullableFilter<"NightAction"> | string | null
    second_target_id?: UuidNullableFilter<"NightAction"> | string | null
    phase?: EnumNightPhaseFilter<"NightAction"> | $Enums.NightPhase
    day_number?: IntFilter<"NightAction"> | number
    resolved?: BoolFilter<"NightAction"> | boolean
    success?: BoolNullableFilter<"NightAction"> | boolean | null
    result_message?: StringNullableFilter<"NightAction"> | string | null
    revealed_info?: JsonNullableFilter<"NightAction">
    effects?: JsonNullableFilter<"NightAction">
    created_at?: DateTimeFilter<"NightAction"> | Date | string
    resolved_at?: DateTimeNullableFilter<"NightAction"> | Date | string | null
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    performer?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }

  export type NightActionOrderByWithRelationInput = {
    id?: SortOrder
    game_id?: SortOrder
    player_id?: SortOrder
    action_type?: SortOrder
    target_id?: SortOrderInput | SortOrder
    second_target_id?: SortOrderInput | SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    resolved?: SortOrder
    success?: SortOrderInput | SortOrder
    result_message?: SortOrderInput | SortOrder
    revealed_info?: SortOrderInput | SortOrder
    effects?: SortOrderInput | SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    game?: GameOrderByWithRelationInput
    performer?: PlayerOrderByWithRelationInput
  }

  export type NightActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NightActionWhereInput | NightActionWhereInput[]
    OR?: NightActionWhereInput[]
    NOT?: NightActionWhereInput | NightActionWhereInput[]
    game_id?: UuidFilter<"NightAction"> | string
    player_id?: UuidFilter<"NightAction"> | string
    action_type?: EnumActionTypeFilter<"NightAction"> | $Enums.ActionType
    target_id?: UuidNullableFilter<"NightAction"> | string | null
    second_target_id?: UuidNullableFilter<"NightAction"> | string | null
    phase?: EnumNightPhaseFilter<"NightAction"> | $Enums.NightPhase
    day_number?: IntFilter<"NightAction"> | number
    resolved?: BoolFilter<"NightAction"> | boolean
    success?: BoolNullableFilter<"NightAction"> | boolean | null
    result_message?: StringNullableFilter<"NightAction"> | string | null
    revealed_info?: JsonNullableFilter<"NightAction">
    effects?: JsonNullableFilter<"NightAction">
    created_at?: DateTimeFilter<"NightAction"> | Date | string
    resolved_at?: DateTimeNullableFilter<"NightAction"> | Date | string | null
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
    performer?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }, "id">

  export type NightActionOrderByWithAggregationInput = {
    id?: SortOrder
    game_id?: SortOrder
    player_id?: SortOrder
    action_type?: SortOrder
    target_id?: SortOrderInput | SortOrder
    second_target_id?: SortOrderInput | SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    resolved?: SortOrder
    success?: SortOrderInput | SortOrder
    result_message?: SortOrderInput | SortOrder
    revealed_info?: SortOrderInput | SortOrder
    effects?: SortOrderInput | SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrderInput | SortOrder
    _count?: NightActionCountOrderByAggregateInput
    _avg?: NightActionAvgOrderByAggregateInput
    _max?: NightActionMaxOrderByAggregateInput
    _min?: NightActionMinOrderByAggregateInput
    _sum?: NightActionSumOrderByAggregateInput
  }

  export type NightActionScalarWhereWithAggregatesInput = {
    AND?: NightActionScalarWhereWithAggregatesInput | NightActionScalarWhereWithAggregatesInput[]
    OR?: NightActionScalarWhereWithAggregatesInput[]
    NOT?: NightActionScalarWhereWithAggregatesInput | NightActionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NightAction"> | string
    game_id?: UuidWithAggregatesFilter<"NightAction"> | string
    player_id?: UuidWithAggregatesFilter<"NightAction"> | string
    action_type?: EnumActionTypeWithAggregatesFilter<"NightAction"> | $Enums.ActionType
    target_id?: UuidNullableWithAggregatesFilter<"NightAction"> | string | null
    second_target_id?: UuidNullableWithAggregatesFilter<"NightAction"> | string | null
    phase?: EnumNightPhaseWithAggregatesFilter<"NightAction"> | $Enums.NightPhase
    day_number?: IntWithAggregatesFilter<"NightAction"> | number
    resolved?: BoolWithAggregatesFilter<"NightAction"> | boolean
    success?: BoolNullableWithAggregatesFilter<"NightAction"> | boolean | null
    result_message?: StringNullableWithAggregatesFilter<"NightAction"> | string | null
    revealed_info?: JsonNullableWithAggregatesFilter<"NightAction">
    effects?: JsonNullableWithAggregatesFilter<"NightAction">
    created_at?: DateTimeWithAggregatesFilter<"NightAction"> | Date | string
    resolved_at?: DateTimeNullableWithAggregatesFilter<"NightAction"> | Date | string | null
  }

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: UuidFilter<"Profile"> | string
    username?: StringNullableFilter<"Profile"> | string | null
    full_name?: StringNullableFilter<"Profile"> | string | null
    avatar_url?: StringNullableFilter<"Profile"> | string | null
    updated_at?: DateTimeNullableFilter<"Profile"> | Date | string | null
    created_at?: DateTimeFilter<"Profile"> | Date | string
    games_played?: IntFilter<"Profile"> | number
    games_won?: IntFilter<"Profile"> | number
    created_games?: GameListRelationFilter
    players?: PlayerListRelationFilter
    game_logs?: GameLogListRelationFilter
    chat_messages?: ChatMessageListRelationFilter
    role_configs?: GameRoleConfigListRelationFilter
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    games_played?: SortOrder
    games_won?: SortOrder
    created_games?: GameOrderByRelationAggregateInput
    players?: PlayerOrderByRelationAggregateInput
    game_logs?: GameLogOrderByRelationAggregateInput
    chat_messages?: ChatMessageOrderByRelationAggregateInput
    role_configs?: GameRoleConfigOrderByRelationAggregateInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    full_name?: StringNullableFilter<"Profile"> | string | null
    avatar_url?: StringNullableFilter<"Profile"> | string | null
    updated_at?: DateTimeNullableFilter<"Profile"> | Date | string | null
    created_at?: DateTimeFilter<"Profile"> | Date | string
    games_played?: IntFilter<"Profile"> | number
    games_won?: IntFilter<"Profile"> | number
    created_games?: GameListRelationFilter
    players?: PlayerListRelationFilter
    game_logs?: GameLogListRelationFilter
    chat_messages?: ChatMessageListRelationFilter
    role_configs?: GameRoleConfigListRelationFilter
  }, "id" | "username">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    games_played?: SortOrder
    games_won?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _avg?: ProfileAvgOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
    _sum?: ProfileSumOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Profile"> | string
    username?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    full_name?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    avatar_url?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"Profile"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    games_played?: IntWithAggregatesFilter<"Profile"> | number
    games_won?: IntWithAggregatesFilter<"Profile"> | number
  }

  export type GameCreateInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    creator: ProfileCreateNestedOneWithoutCreated_gamesInput
    players?: PlayerCreateNestedManyWithoutGameInput
    game_logs?: GameLogCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigCreateNestedOneWithoutGameInput
    night_actions?: NightActionCreateNestedManyWithoutGameInput
  }

  export type GameUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    creator_id: string
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigUncheckedCreateNestedOneWithoutGameInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutCreated_gamesNestedInput
    players?: PlayerUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUncheckedUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameCreateManyInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    creator_id: string
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
  }

  export type GameUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerCreateInput = {
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    user: ProfileCreateNestedOneWithoutPlayersInput
    game: GameCreateNestedOneWithoutPlayersInput
    game_logs?: GameLogCreateNestedManyWithoutPlayerInput
    night_actions?: NightActionCreateNestedManyWithoutPerformerInput
  }

  export type PlayerUncheckedCreateInput = {
    user_id: string
    game_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    game_logs?: GameLogUncheckedCreateNestedManyWithoutPlayerInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutPerformerInput
  }

  export type PlayerUpdateInput = {
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    user?: ProfileUpdateOneRequiredWithoutPlayersNestedInput
    game?: GameUpdateOneRequiredWithoutPlayersNestedInput
    game_logs?: GameLogUpdateManyWithoutPlayerNestedInput
    night_actions?: NightActionUpdateManyWithoutPerformerNestedInput
  }

  export type PlayerUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    game_logs?: GameLogUncheckedUpdateManyWithoutPlayerNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutPerformerNestedInput
  }

  export type PlayerCreateManyInput = {
    user_id: string
    game_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
  }

  export type PlayerUpdateManyMutationInput = {
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlayerUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameLogCreateInput = {
    id?: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
    game: GameCreateNestedOneWithoutGame_logsInput
    user?: ProfileCreateNestedOneWithoutGame_logsInput
    player?: PlayerCreateNestedOneWithoutGame_logsInput
  }

  export type GameLogUncheckedCreateInput = {
    id?: string
    game_id: string
    user_id?: string | null
    player_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type GameLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneRequiredWithoutGame_logsNestedInput
    user?: ProfileUpdateOneWithoutGame_logsNestedInput
    player?: PlayerUpdateOneWithoutGame_logsNestedInput
  }

  export type GameLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    player_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameLogCreateManyInput = {
    id?: string
    game_id: string
    user_id?: string | null
    player_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type GameLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    player_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
    game?: GameCreateNestedOneWithoutChat_messagesInput
    user: ProfileCreateNestedOneWithoutChat_messagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    game_id?: string | null
    user_id: string
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneWithoutChat_messagesNestedInput
    user?: ProfileUpdateOneRequiredWithoutChat_messagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    game_id?: string | null
    user_id: string
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameRoleConfigCreateInput = {
    id?: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_at?: Date | string
    game: GameCreateNestedOneWithoutRole_configInput
    creator: ProfileCreateNestedOneWithoutRole_configsInput
  }

  export type GameRoleConfigUncheckedCreateInput = {
    id?: string
    game_id: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_by: string
    created_at?: Date | string
  }

  export type GameRoleConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneRequiredWithoutRole_configNestedInput
    creator?: ProfileUpdateOneRequiredWithoutRole_configsNestedInput
  }

  export type GameRoleConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameRoleConfigCreateManyInput = {
    id?: string
    game_id: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_by: string
    created_at?: Date | string
  }

  export type GameRoleConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameRoleConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NightActionCreateInput = {
    id?: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
    game: GameCreateNestedOneWithoutNight_actionsInput
    performer: PlayerCreateNestedOneWithoutNight_actionsInput
  }

  export type NightActionUncheckedCreateInput = {
    id?: string
    game_id: string
    player_id: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type NightActionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    game?: GameUpdateOneRequiredWithoutNight_actionsNestedInput
    performer?: PlayerUpdateOneRequiredWithoutNight_actionsNestedInput
  }

  export type NightActionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NightActionCreateManyInput = {
    id?: string
    game_id: string
    player_id: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type NightActionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NightActionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProfileCreateInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    game_logs?: GameLogCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigCreateNestedManyWithoutCreatorInput
  }

  export type ProfileUncheckedCreateInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUpdateManyWithoutCreatorNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type ProfileCreateManyInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumGameStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusFilter<$PrismaModel> | $Enums.GameStatus
  }

  export type EnumGamePhaseNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.GamePhase | EnumGamePhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGamePhaseNullableFilter<$PrismaModel> | $Enums.GamePhase | null
  }

  export type EnumNightPhaseNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumNightPhaseNullableFilter<$PrismaModel> | $Enums.NightPhase | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ProfileScalarRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type PlayerListRelationFilter = {
    every?: PlayerWhereInput
    some?: PlayerWhereInput
    none?: PlayerWhereInput
  }

  export type GameLogListRelationFilter = {
    every?: GameLogWhereInput
    some?: GameLogWhereInput
    none?: GameLogWhereInput
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type GameRoleConfigNullableScalarRelationFilter = {
    is?: GameRoleConfigWhereInput | null
    isNot?: GameRoleConfigWhereInput | null
  }

  export type NightActionListRelationFilter = {
    every?: NightActionWhereInput
    some?: NightActionWhereInput
    none?: NightActionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PlayerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NightActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    status?: SortOrder
    phase?: SortOrder
    night_phase?: SortOrder
    day_number?: SortOrder
    max_players?: SortOrder
    current_players?: SortOrder
    game_settings?: SortOrder
    winner?: SortOrder
    creator_id?: SortOrder
    created_at?: SortOrder
    started_at?: SortOrder
    finished_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GameAvgOrderByAggregateInput = {
    day_number?: SortOrder
    max_players?: SortOrder
    current_players?: SortOrder
  }

  export type GameMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    status?: SortOrder
    phase?: SortOrder
    night_phase?: SortOrder
    day_number?: SortOrder
    max_players?: SortOrder
    current_players?: SortOrder
    winner?: SortOrder
    creator_id?: SortOrder
    created_at?: SortOrder
    started_at?: SortOrder
    finished_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GameMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    status?: SortOrder
    phase?: SortOrder
    night_phase?: SortOrder
    day_number?: SortOrder
    max_players?: SortOrder
    current_players?: SortOrder
    winner?: SortOrder
    creator_id?: SortOrder
    created_at?: SortOrder
    started_at?: SortOrder
    finished_at?: SortOrder
    updated_at?: SortOrder
  }

  export type GameSumOrderByAggregateInput = {
    day_number?: SortOrder
    max_players?: SortOrder
    current_players?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumGameStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameStatusFilter<$PrismaModel>
    _max?: NestedEnumGameStatusFilter<$PrismaModel>
  }

  export type EnumGamePhaseNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GamePhase | EnumGamePhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGamePhaseNullableWithAggregatesFilter<$PrismaModel> | $Enums.GamePhase | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGamePhaseNullableFilter<$PrismaModel>
    _max?: NestedEnumGamePhaseNullableFilter<$PrismaModel>
  }

  export type EnumNightPhaseNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumNightPhaseNullableWithAggregatesFilter<$PrismaModel> | $Enums.NightPhase | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumNightPhaseNullableFilter<$PrismaModel>
    _max?: NestedEnumNightPhaseNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumWerewolfRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.WerewolfRole | EnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWerewolfRoleNullableFilter<$PrismaModel> | $Enums.WerewolfRole | null
  }

  export type EnumTeamNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Team | EnumTeamFieldRefInput<$PrismaModel> | null
    in?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTeamNullableFilter<$PrismaModel> | $Enums.Team | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type GameScalarRelationFilter = {
    is?: GameWhereInput
    isNot?: GameWhereInput
  }

  export type PlayerUser_idGame_idCompoundUniqueInput = {
    user_id: string
    game_id: string
  }

  export type PlayerCountOrderByAggregateInput = {
    user_id?: SortOrder
    game_id?: SortOrder
    role?: SortOrder
    team?: SortOrder
    is_alive?: SortOrder
    is_host?: SortOrder
    joined_at?: SortOrder
    eliminated_at?: SortOrder
    votes_cast?: SortOrder
    lover_id?: SortOrder
    has_heal_potion?: SortOrder
    has_poison_potion?: SortOrder
    can_shoot?: SortOrder
    has_spied?: SortOrder
    spy_risk?: SortOrder
    is_protected?: SortOrder
  }

  export type PlayerAvgOrderByAggregateInput = {
    votes_cast?: SortOrder
    spy_risk?: SortOrder
  }

  export type PlayerMaxOrderByAggregateInput = {
    user_id?: SortOrder
    game_id?: SortOrder
    role?: SortOrder
    team?: SortOrder
    is_alive?: SortOrder
    is_host?: SortOrder
    joined_at?: SortOrder
    eliminated_at?: SortOrder
    votes_cast?: SortOrder
    lover_id?: SortOrder
    has_heal_potion?: SortOrder
    has_poison_potion?: SortOrder
    can_shoot?: SortOrder
    has_spied?: SortOrder
    spy_risk?: SortOrder
    is_protected?: SortOrder
  }

  export type PlayerMinOrderByAggregateInput = {
    user_id?: SortOrder
    game_id?: SortOrder
    role?: SortOrder
    team?: SortOrder
    is_alive?: SortOrder
    is_host?: SortOrder
    joined_at?: SortOrder
    eliminated_at?: SortOrder
    votes_cast?: SortOrder
    lover_id?: SortOrder
    has_heal_potion?: SortOrder
    has_poison_potion?: SortOrder
    can_shoot?: SortOrder
    has_spied?: SortOrder
    spy_risk?: SortOrder
    is_protected?: SortOrder
  }

  export type PlayerSumOrderByAggregateInput = {
    votes_cast?: SortOrder
    spy_risk?: SortOrder
  }

  export type EnumWerewolfRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WerewolfRole | EnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWerewolfRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.WerewolfRole | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumWerewolfRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumWerewolfRoleNullableFilter<$PrismaModel>
  }

  export type EnumTeamNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Team | EnumTeamFieldRefInput<$PrismaModel> | null
    in?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTeamNullableWithAggregatesFilter<$PrismaModel> | $Enums.Team | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTeamNullableFilter<$PrismaModel>
    _max?: NestedEnumTeamNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null
    isNot?: ProfileWhereInput | null
  }

  export type PlayerNullableScalarRelationFilter = {
    is?: PlayerWhereInput | null
    isNot?: PlayerWhereInput | null
  }

  export type GameLogCountOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrder
    player_id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    created_at?: SortOrder
  }

  export type GameLogAvgOrderByAggregateInput = {
    day_number?: SortOrder
  }

  export type GameLogMaxOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrder
    player_id?: SortOrder
    action?: SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    created_at?: SortOrder
  }

  export type GameLogMinOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrder
    player_id?: SortOrder
    action?: SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    created_at?: SortOrder
  }

  export type GameLogSumOrderByAggregateInput = {
    day_number?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumChatChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatChannel | EnumChatChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumChatChannelFilter<$PrismaModel> | $Enums.ChatChannel
  }

  export type EnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type GameNullableScalarRelationFilter = {
    is?: GameWhereInput | null
    isNot?: GameWhereInput | null
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    type?: SortOrder
    content?: SortOrder
    mentions?: SortOrder
    edited?: SortOrder
    edited_at?: SortOrder
    created_at?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    type?: SortOrder
    content?: SortOrder
    edited?: SortOrder
    edited_at?: SortOrder
    created_at?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    type?: SortOrder
    content?: SortOrder
    edited?: SortOrder
    edited_at?: SortOrder
    created_at?: SortOrder
  }

  export type EnumChatChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatChannel | EnumChatChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumChatChannelWithAggregatesFilter<$PrismaModel> | $Enums.ChatChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatChannelFilter<$PrismaModel>
    _max?: NestedEnumChatChannelFilter<$PrismaModel>
  }

  export type EnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type GameRoleConfigCountOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    villagers?: SortOrder
    werewolves?: SortOrder
    seer?: SortOrder
    witch?: SortOrder
    hunter?: SortOrder
    cupid?: SortOrder
    little_girl?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type GameRoleConfigAvgOrderByAggregateInput = {
    villagers?: SortOrder
    werewolves?: SortOrder
  }

  export type GameRoleConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    villagers?: SortOrder
    werewolves?: SortOrder
    seer?: SortOrder
    witch?: SortOrder
    hunter?: SortOrder
    cupid?: SortOrder
    little_girl?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type GameRoleConfigMinOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    villagers?: SortOrder
    werewolves?: SortOrder
    seer?: SortOrder
    witch?: SortOrder
    hunter?: SortOrder
    cupid?: SortOrder
    little_girl?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type GameRoleConfigSumOrderByAggregateInput = {
    villagers?: SortOrder
    werewolves?: SortOrder
  }

  export type EnumActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeFilter<$PrismaModel> | $Enums.ActionType
  }

  export type EnumNightPhaseFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumNightPhaseFilter<$PrismaModel> | $Enums.NightPhase
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type PlayerScalarRelationFilter = {
    is?: PlayerWhereInput
    isNot?: PlayerWhereInput
  }

  export type NightActionCountOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    player_id?: SortOrder
    action_type?: SortOrder
    target_id?: SortOrder
    second_target_id?: SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    resolved?: SortOrder
    success?: SortOrder
    result_message?: SortOrder
    revealed_info?: SortOrder
    effects?: SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrder
  }

  export type NightActionAvgOrderByAggregateInput = {
    day_number?: SortOrder
  }

  export type NightActionMaxOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    player_id?: SortOrder
    action_type?: SortOrder
    target_id?: SortOrder
    second_target_id?: SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    resolved?: SortOrder
    success?: SortOrder
    result_message?: SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrder
  }

  export type NightActionMinOrderByAggregateInput = {
    id?: SortOrder
    game_id?: SortOrder
    player_id?: SortOrder
    action_type?: SortOrder
    target_id?: SortOrder
    second_target_id?: SortOrder
    phase?: SortOrder
    day_number?: SortOrder
    resolved?: SortOrder
    success?: SortOrder
    result_message?: SortOrder
    created_at?: SortOrder
    resolved_at?: SortOrder
  }

  export type NightActionSumOrderByAggregateInput = {
    day_number?: SortOrder
  }

  export type EnumActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionTypeFilter<$PrismaModel>
    _max?: NestedEnumActionTypeFilter<$PrismaModel>
  }

  export type EnumNightPhaseWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumNightPhaseWithAggregatesFilter<$PrismaModel> | $Enums.NightPhase
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNightPhaseFilter<$PrismaModel>
    _max?: NestedEnumNightPhaseFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type GameListRelationFilter = {
    every?: GameWhereInput
    some?: GameWhereInput
    none?: GameWhereInput
  }

  export type GameRoleConfigListRelationFilter = {
    every?: GameRoleConfigWhereInput
    some?: GameRoleConfigWhereInput
    none?: GameRoleConfigWhereInput
  }

  export type GameOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameRoleConfigOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    updated_at?: SortOrder
    created_at?: SortOrder
    games_played?: SortOrder
    games_won?: SortOrder
  }

  export type ProfileAvgOrderByAggregateInput = {
    games_played?: SortOrder
    games_won?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    updated_at?: SortOrder
    created_at?: SortOrder
    games_played?: SortOrder
    games_won?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    updated_at?: SortOrder
    created_at?: SortOrder
    games_played?: SortOrder
    games_won?: SortOrder
  }

  export type ProfileSumOrderByAggregateInput = {
    games_played?: SortOrder
    games_won?: SortOrder
  }

  export type ProfileCreateNestedOneWithoutCreated_gamesInput = {
    create?: XOR<ProfileCreateWithoutCreated_gamesInput, ProfileUncheckedCreateWithoutCreated_gamesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCreated_gamesInput
    connect?: ProfileWhereUniqueInput
  }

  export type PlayerCreateNestedManyWithoutGameInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type GameLogCreateNestedManyWithoutGameInput = {
    create?: XOR<GameLogCreateWithoutGameInput, GameLogUncheckedCreateWithoutGameInput> | GameLogCreateWithoutGameInput[] | GameLogUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutGameInput | GameLogCreateOrConnectWithoutGameInput[]
    createMany?: GameLogCreateManyGameInputEnvelope
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
  }

  export type ChatMessageCreateNestedManyWithoutGameInput = {
    create?: XOR<ChatMessageCreateWithoutGameInput, ChatMessageUncheckedCreateWithoutGameInput> | ChatMessageCreateWithoutGameInput[] | ChatMessageUncheckedCreateWithoutGameInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutGameInput | ChatMessageCreateOrConnectWithoutGameInput[]
    createMany?: ChatMessageCreateManyGameInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type GameRoleConfigCreateNestedOneWithoutGameInput = {
    create?: XOR<GameRoleConfigCreateWithoutGameInput, GameRoleConfigUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutGameInput
    connect?: GameRoleConfigWhereUniqueInput
  }

  export type NightActionCreateNestedManyWithoutGameInput = {
    create?: XOR<NightActionCreateWithoutGameInput, NightActionUncheckedCreateWithoutGameInput> | NightActionCreateWithoutGameInput[] | NightActionUncheckedCreateWithoutGameInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutGameInput | NightActionCreateOrConnectWithoutGameInput[]
    createMany?: NightActionCreateManyGameInputEnvelope
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type GameLogUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<GameLogCreateWithoutGameInput, GameLogUncheckedCreateWithoutGameInput> | GameLogCreateWithoutGameInput[] | GameLogUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutGameInput | GameLogCreateOrConnectWithoutGameInput[]
    createMany?: GameLogCreateManyGameInputEnvelope
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<ChatMessageCreateWithoutGameInput, ChatMessageUncheckedCreateWithoutGameInput> | ChatMessageCreateWithoutGameInput[] | ChatMessageUncheckedCreateWithoutGameInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutGameInput | ChatMessageCreateOrConnectWithoutGameInput[]
    createMany?: ChatMessageCreateManyGameInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type GameRoleConfigUncheckedCreateNestedOneWithoutGameInput = {
    create?: XOR<GameRoleConfigCreateWithoutGameInput, GameRoleConfigUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutGameInput
    connect?: GameRoleConfigWhereUniqueInput
  }

  export type NightActionUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<NightActionCreateWithoutGameInput, NightActionUncheckedCreateWithoutGameInput> | NightActionCreateWithoutGameInput[] | NightActionUncheckedCreateWithoutGameInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutGameInput | NightActionCreateOrConnectWithoutGameInput[]
    createMany?: NightActionCreateManyGameInputEnvelope
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumGameStatusFieldUpdateOperationsInput = {
    set?: $Enums.GameStatus
  }

  export type NullableEnumGamePhaseFieldUpdateOperationsInput = {
    set?: $Enums.GamePhase | null
  }

  export type NullableEnumNightPhaseFieldUpdateOperationsInput = {
    set?: $Enums.NightPhase | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProfileUpdateOneRequiredWithoutCreated_gamesNestedInput = {
    create?: XOR<ProfileCreateWithoutCreated_gamesInput, ProfileUncheckedCreateWithoutCreated_gamesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCreated_gamesInput
    upsert?: ProfileUpsertWithoutCreated_gamesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutCreated_gamesInput, ProfileUpdateWithoutCreated_gamesInput>, ProfileUncheckedUpdateWithoutCreated_gamesInput>
  }

  export type PlayerUpdateManyWithoutGameNestedInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutGameInput | PlayerUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutGameInput | PlayerUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutGameInput | PlayerUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type GameLogUpdateManyWithoutGameNestedInput = {
    create?: XOR<GameLogCreateWithoutGameInput, GameLogUncheckedCreateWithoutGameInput> | GameLogCreateWithoutGameInput[] | GameLogUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutGameInput | GameLogCreateOrConnectWithoutGameInput[]
    upsert?: GameLogUpsertWithWhereUniqueWithoutGameInput | GameLogUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: GameLogCreateManyGameInputEnvelope
    set?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    disconnect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    delete?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    update?: GameLogUpdateWithWhereUniqueWithoutGameInput | GameLogUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: GameLogUpdateManyWithWhereWithoutGameInput | GameLogUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
  }

  export type ChatMessageUpdateManyWithoutGameNestedInput = {
    create?: XOR<ChatMessageCreateWithoutGameInput, ChatMessageUncheckedCreateWithoutGameInput> | ChatMessageCreateWithoutGameInput[] | ChatMessageUncheckedCreateWithoutGameInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutGameInput | ChatMessageCreateOrConnectWithoutGameInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutGameInput | ChatMessageUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: ChatMessageCreateManyGameInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutGameInput | ChatMessageUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutGameInput | ChatMessageUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type GameRoleConfigUpdateOneWithoutGameNestedInput = {
    create?: XOR<GameRoleConfigCreateWithoutGameInput, GameRoleConfigUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutGameInput
    upsert?: GameRoleConfigUpsertWithoutGameInput
    disconnect?: GameRoleConfigWhereInput | boolean
    delete?: GameRoleConfigWhereInput | boolean
    connect?: GameRoleConfigWhereUniqueInput
    update?: XOR<XOR<GameRoleConfigUpdateToOneWithWhereWithoutGameInput, GameRoleConfigUpdateWithoutGameInput>, GameRoleConfigUncheckedUpdateWithoutGameInput>
  }

  export type NightActionUpdateManyWithoutGameNestedInput = {
    create?: XOR<NightActionCreateWithoutGameInput, NightActionUncheckedCreateWithoutGameInput> | NightActionCreateWithoutGameInput[] | NightActionUncheckedCreateWithoutGameInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutGameInput | NightActionCreateOrConnectWithoutGameInput[]
    upsert?: NightActionUpsertWithWhereUniqueWithoutGameInput | NightActionUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: NightActionCreateManyGameInputEnvelope
    set?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    disconnect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    delete?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    update?: NightActionUpdateWithWhereUniqueWithoutGameInput | NightActionUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: NightActionUpdateManyWithWhereWithoutGameInput | NightActionUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: NightActionScalarWhereInput | NightActionScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutGameInput | PlayerUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutGameInput | PlayerUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutGameInput | PlayerUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type GameLogUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<GameLogCreateWithoutGameInput, GameLogUncheckedCreateWithoutGameInput> | GameLogCreateWithoutGameInput[] | GameLogUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutGameInput | GameLogCreateOrConnectWithoutGameInput[]
    upsert?: GameLogUpsertWithWhereUniqueWithoutGameInput | GameLogUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: GameLogCreateManyGameInputEnvelope
    set?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    disconnect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    delete?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    update?: GameLogUpdateWithWhereUniqueWithoutGameInput | GameLogUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: GameLogUpdateManyWithWhereWithoutGameInput | GameLogUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<ChatMessageCreateWithoutGameInput, ChatMessageUncheckedCreateWithoutGameInput> | ChatMessageCreateWithoutGameInput[] | ChatMessageUncheckedCreateWithoutGameInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutGameInput | ChatMessageCreateOrConnectWithoutGameInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutGameInput | ChatMessageUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: ChatMessageCreateManyGameInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutGameInput | ChatMessageUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutGameInput | ChatMessageUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type GameRoleConfigUncheckedUpdateOneWithoutGameNestedInput = {
    create?: XOR<GameRoleConfigCreateWithoutGameInput, GameRoleConfigUncheckedCreateWithoutGameInput>
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutGameInput
    upsert?: GameRoleConfigUpsertWithoutGameInput
    disconnect?: GameRoleConfigWhereInput | boolean
    delete?: GameRoleConfigWhereInput | boolean
    connect?: GameRoleConfigWhereUniqueInput
    update?: XOR<XOR<GameRoleConfigUpdateToOneWithWhereWithoutGameInput, GameRoleConfigUpdateWithoutGameInput>, GameRoleConfigUncheckedUpdateWithoutGameInput>
  }

  export type NightActionUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<NightActionCreateWithoutGameInput, NightActionUncheckedCreateWithoutGameInput> | NightActionCreateWithoutGameInput[] | NightActionUncheckedCreateWithoutGameInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutGameInput | NightActionCreateOrConnectWithoutGameInput[]
    upsert?: NightActionUpsertWithWhereUniqueWithoutGameInput | NightActionUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: NightActionCreateManyGameInputEnvelope
    set?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    disconnect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    delete?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    update?: NightActionUpdateWithWhereUniqueWithoutGameInput | NightActionUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: NightActionUpdateManyWithWhereWithoutGameInput | NightActionUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: NightActionScalarWhereInput | NightActionScalarWhereInput[]
  }

  export type ProfileCreateNestedOneWithoutPlayersInput = {
    create?: XOR<ProfileCreateWithoutPlayersInput, ProfileUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutPlayersInput
    connect?: ProfileWhereUniqueInput
  }

  export type GameCreateNestedOneWithoutPlayersInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput
    connect?: GameWhereUniqueInput
  }

  export type GameLogCreateNestedManyWithoutPlayerInput = {
    create?: XOR<GameLogCreateWithoutPlayerInput, GameLogUncheckedCreateWithoutPlayerInput> | GameLogCreateWithoutPlayerInput[] | GameLogUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutPlayerInput | GameLogCreateOrConnectWithoutPlayerInput[]
    createMany?: GameLogCreateManyPlayerInputEnvelope
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
  }

  export type NightActionCreateNestedManyWithoutPerformerInput = {
    create?: XOR<NightActionCreateWithoutPerformerInput, NightActionUncheckedCreateWithoutPerformerInput> | NightActionCreateWithoutPerformerInput[] | NightActionUncheckedCreateWithoutPerformerInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutPerformerInput | NightActionCreateOrConnectWithoutPerformerInput[]
    createMany?: NightActionCreateManyPerformerInputEnvelope
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
  }

  export type GameLogUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<GameLogCreateWithoutPlayerInput, GameLogUncheckedCreateWithoutPlayerInput> | GameLogCreateWithoutPlayerInput[] | GameLogUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutPlayerInput | GameLogCreateOrConnectWithoutPlayerInput[]
    createMany?: GameLogCreateManyPlayerInputEnvelope
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
  }

  export type NightActionUncheckedCreateNestedManyWithoutPerformerInput = {
    create?: XOR<NightActionCreateWithoutPerformerInput, NightActionUncheckedCreateWithoutPerformerInput> | NightActionCreateWithoutPerformerInput[] | NightActionUncheckedCreateWithoutPerformerInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutPerformerInput | NightActionCreateOrConnectWithoutPerformerInput[]
    createMany?: NightActionCreateManyPerformerInputEnvelope
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
  }

  export type NullableEnumWerewolfRoleFieldUpdateOperationsInput = {
    set?: $Enums.WerewolfRole | null
  }

  export type NullableEnumTeamFieldUpdateOperationsInput = {
    set?: $Enums.Team | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProfileUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: XOR<ProfileCreateWithoutPlayersInput, ProfileUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutPlayersInput
    upsert?: ProfileUpsertWithoutPlayersInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutPlayersInput, ProfileUpdateWithoutPlayersInput>, ProfileUncheckedUpdateWithoutPlayersInput>
  }

  export type GameUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput
    upsert?: GameUpsertWithoutPlayersInput
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutPlayersInput, GameUpdateWithoutPlayersInput>, GameUncheckedUpdateWithoutPlayersInput>
  }

  export type GameLogUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<GameLogCreateWithoutPlayerInput, GameLogUncheckedCreateWithoutPlayerInput> | GameLogCreateWithoutPlayerInput[] | GameLogUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutPlayerInput | GameLogCreateOrConnectWithoutPlayerInput[]
    upsert?: GameLogUpsertWithWhereUniqueWithoutPlayerInput | GameLogUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: GameLogCreateManyPlayerInputEnvelope
    set?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    disconnect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    delete?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    update?: GameLogUpdateWithWhereUniqueWithoutPlayerInput | GameLogUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: GameLogUpdateManyWithWhereWithoutPlayerInput | GameLogUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
  }

  export type NightActionUpdateManyWithoutPerformerNestedInput = {
    create?: XOR<NightActionCreateWithoutPerformerInput, NightActionUncheckedCreateWithoutPerformerInput> | NightActionCreateWithoutPerformerInput[] | NightActionUncheckedCreateWithoutPerformerInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutPerformerInput | NightActionCreateOrConnectWithoutPerformerInput[]
    upsert?: NightActionUpsertWithWhereUniqueWithoutPerformerInput | NightActionUpsertWithWhereUniqueWithoutPerformerInput[]
    createMany?: NightActionCreateManyPerformerInputEnvelope
    set?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    disconnect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    delete?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    update?: NightActionUpdateWithWhereUniqueWithoutPerformerInput | NightActionUpdateWithWhereUniqueWithoutPerformerInput[]
    updateMany?: NightActionUpdateManyWithWhereWithoutPerformerInput | NightActionUpdateManyWithWhereWithoutPerformerInput[]
    deleteMany?: NightActionScalarWhereInput | NightActionScalarWhereInput[]
  }

  export type GameLogUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<GameLogCreateWithoutPlayerInput, GameLogUncheckedCreateWithoutPlayerInput> | GameLogCreateWithoutPlayerInput[] | GameLogUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutPlayerInput | GameLogCreateOrConnectWithoutPlayerInput[]
    upsert?: GameLogUpsertWithWhereUniqueWithoutPlayerInput | GameLogUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: GameLogCreateManyPlayerInputEnvelope
    set?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    disconnect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    delete?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    update?: GameLogUpdateWithWhereUniqueWithoutPlayerInput | GameLogUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: GameLogUpdateManyWithWhereWithoutPlayerInput | GameLogUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
  }

  export type NightActionUncheckedUpdateManyWithoutPerformerNestedInput = {
    create?: XOR<NightActionCreateWithoutPerformerInput, NightActionUncheckedCreateWithoutPerformerInput> | NightActionCreateWithoutPerformerInput[] | NightActionUncheckedCreateWithoutPerformerInput[]
    connectOrCreate?: NightActionCreateOrConnectWithoutPerformerInput | NightActionCreateOrConnectWithoutPerformerInput[]
    upsert?: NightActionUpsertWithWhereUniqueWithoutPerformerInput | NightActionUpsertWithWhereUniqueWithoutPerformerInput[]
    createMany?: NightActionCreateManyPerformerInputEnvelope
    set?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    disconnect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    delete?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    connect?: NightActionWhereUniqueInput | NightActionWhereUniqueInput[]
    update?: NightActionUpdateWithWhereUniqueWithoutPerformerInput | NightActionUpdateWithWhereUniqueWithoutPerformerInput[]
    updateMany?: NightActionUpdateManyWithWhereWithoutPerformerInput | NightActionUpdateManyWithWhereWithoutPerformerInput[]
    deleteMany?: NightActionScalarWhereInput | NightActionScalarWhereInput[]
  }

  export type GameCreateNestedOneWithoutGame_logsInput = {
    create?: XOR<GameCreateWithoutGame_logsInput, GameUncheckedCreateWithoutGame_logsInput>
    connectOrCreate?: GameCreateOrConnectWithoutGame_logsInput
    connect?: GameWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutGame_logsInput = {
    create?: XOR<ProfileCreateWithoutGame_logsInput, ProfileUncheckedCreateWithoutGame_logsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutGame_logsInput
    connect?: ProfileWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutGame_logsInput = {
    create?: XOR<PlayerCreateWithoutGame_logsInput, PlayerUncheckedCreateWithoutGame_logsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutGame_logsInput
    connect?: PlayerWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type GameUpdateOneRequiredWithoutGame_logsNestedInput = {
    create?: XOR<GameCreateWithoutGame_logsInput, GameUncheckedCreateWithoutGame_logsInput>
    connectOrCreate?: GameCreateOrConnectWithoutGame_logsInput
    upsert?: GameUpsertWithoutGame_logsInput
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutGame_logsInput, GameUpdateWithoutGame_logsInput>, GameUncheckedUpdateWithoutGame_logsInput>
  }

  export type ProfileUpdateOneWithoutGame_logsNestedInput = {
    create?: XOR<ProfileCreateWithoutGame_logsInput, ProfileUncheckedCreateWithoutGame_logsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutGame_logsInput
    upsert?: ProfileUpsertWithoutGame_logsInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutGame_logsInput, ProfileUpdateWithoutGame_logsInput>, ProfileUncheckedUpdateWithoutGame_logsInput>
  }

  export type PlayerUpdateOneWithoutGame_logsNestedInput = {
    create?: XOR<PlayerCreateWithoutGame_logsInput, PlayerUncheckedCreateWithoutGame_logsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutGame_logsInput
    upsert?: PlayerUpsertWithoutGame_logsInput
    disconnect?: PlayerWhereInput | boolean
    delete?: PlayerWhereInput | boolean
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutGame_logsInput, PlayerUpdateWithoutGame_logsInput>, PlayerUncheckedUpdateWithoutGame_logsInput>
  }

  export type ChatMessageCreatementionsInput = {
    set: string[]
  }

  export type GameCreateNestedOneWithoutChat_messagesInput = {
    create?: XOR<GameCreateWithoutChat_messagesInput, GameUncheckedCreateWithoutChat_messagesInput>
    connectOrCreate?: GameCreateOrConnectWithoutChat_messagesInput
    connect?: GameWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutChat_messagesInput = {
    create?: XOR<ProfileCreateWithoutChat_messagesInput, ProfileUncheckedCreateWithoutChat_messagesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutChat_messagesInput
    connect?: ProfileWhereUniqueInput
  }

  export type EnumChatChannelFieldUpdateOperationsInput = {
    set?: $Enums.ChatChannel
  }

  export type EnumMessageTypeFieldUpdateOperationsInput = {
    set?: $Enums.MessageType
  }

  export type ChatMessageUpdatementionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type GameUpdateOneWithoutChat_messagesNestedInput = {
    create?: XOR<GameCreateWithoutChat_messagesInput, GameUncheckedCreateWithoutChat_messagesInput>
    connectOrCreate?: GameCreateOrConnectWithoutChat_messagesInput
    upsert?: GameUpsertWithoutChat_messagesInput
    disconnect?: GameWhereInput | boolean
    delete?: GameWhereInput | boolean
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutChat_messagesInput, GameUpdateWithoutChat_messagesInput>, GameUncheckedUpdateWithoutChat_messagesInput>
  }

  export type ProfileUpdateOneRequiredWithoutChat_messagesNestedInput = {
    create?: XOR<ProfileCreateWithoutChat_messagesInput, ProfileUncheckedCreateWithoutChat_messagesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutChat_messagesInput
    upsert?: ProfileUpsertWithoutChat_messagesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutChat_messagesInput, ProfileUpdateWithoutChat_messagesInput>, ProfileUncheckedUpdateWithoutChat_messagesInput>
  }

  export type GameCreateNestedOneWithoutRole_configInput = {
    create?: XOR<GameCreateWithoutRole_configInput, GameUncheckedCreateWithoutRole_configInput>
    connectOrCreate?: GameCreateOrConnectWithoutRole_configInput
    connect?: GameWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutRole_configsInput = {
    create?: XOR<ProfileCreateWithoutRole_configsInput, ProfileUncheckedCreateWithoutRole_configsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutRole_configsInput
    connect?: ProfileWhereUniqueInput
  }

  export type GameUpdateOneRequiredWithoutRole_configNestedInput = {
    create?: XOR<GameCreateWithoutRole_configInput, GameUncheckedCreateWithoutRole_configInput>
    connectOrCreate?: GameCreateOrConnectWithoutRole_configInput
    upsert?: GameUpsertWithoutRole_configInput
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutRole_configInput, GameUpdateWithoutRole_configInput>, GameUncheckedUpdateWithoutRole_configInput>
  }

  export type ProfileUpdateOneRequiredWithoutRole_configsNestedInput = {
    create?: XOR<ProfileCreateWithoutRole_configsInput, ProfileUncheckedCreateWithoutRole_configsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutRole_configsInput
    upsert?: ProfileUpsertWithoutRole_configsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutRole_configsInput, ProfileUpdateWithoutRole_configsInput>, ProfileUncheckedUpdateWithoutRole_configsInput>
  }

  export type GameCreateNestedOneWithoutNight_actionsInput = {
    create?: XOR<GameCreateWithoutNight_actionsInput, GameUncheckedCreateWithoutNight_actionsInput>
    connectOrCreate?: GameCreateOrConnectWithoutNight_actionsInput
    connect?: GameWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutNight_actionsInput = {
    create?: XOR<PlayerCreateWithoutNight_actionsInput, PlayerUncheckedCreateWithoutNight_actionsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutNight_actionsInput
    connect?: PlayerWhereUniqueInput
  }

  export type EnumActionTypeFieldUpdateOperationsInput = {
    set?: $Enums.ActionType
  }

  export type EnumNightPhaseFieldUpdateOperationsInput = {
    set?: $Enums.NightPhase
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type GameUpdateOneRequiredWithoutNight_actionsNestedInput = {
    create?: XOR<GameCreateWithoutNight_actionsInput, GameUncheckedCreateWithoutNight_actionsInput>
    connectOrCreate?: GameCreateOrConnectWithoutNight_actionsInput
    upsert?: GameUpsertWithoutNight_actionsInput
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutNight_actionsInput, GameUpdateWithoutNight_actionsInput>, GameUncheckedUpdateWithoutNight_actionsInput>
  }

  export type PlayerUpdateOneRequiredWithoutNight_actionsNestedInput = {
    create?: XOR<PlayerCreateWithoutNight_actionsInput, PlayerUncheckedCreateWithoutNight_actionsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutNight_actionsInput
    upsert?: PlayerUpsertWithoutNight_actionsInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutNight_actionsInput, PlayerUpdateWithoutNight_actionsInput>, PlayerUncheckedUpdateWithoutNight_actionsInput>
  }

  export type GameCreateNestedManyWithoutCreatorInput = {
    create?: XOR<GameCreateWithoutCreatorInput, GameUncheckedCreateWithoutCreatorInput> | GameCreateWithoutCreatorInput[] | GameUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameCreateOrConnectWithoutCreatorInput | GameCreateOrConnectWithoutCreatorInput[]
    createMany?: GameCreateManyCreatorInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type PlayerCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type GameLogCreateNestedManyWithoutUserInput = {
    create?: XOR<GameLogCreateWithoutUserInput, GameLogUncheckedCreateWithoutUserInput> | GameLogCreateWithoutUserInput[] | GameLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutUserInput | GameLogCreateOrConnectWithoutUserInput[]
    createMany?: GameLogCreateManyUserInputEnvelope
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
  }

  export type ChatMessageCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatMessageCreateWithoutUserInput, ChatMessageUncheckedCreateWithoutUserInput> | ChatMessageCreateWithoutUserInput[] | ChatMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutUserInput | ChatMessageCreateOrConnectWithoutUserInput[]
    createMany?: ChatMessageCreateManyUserInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type GameRoleConfigCreateNestedManyWithoutCreatorInput = {
    create?: XOR<GameRoleConfigCreateWithoutCreatorInput, GameRoleConfigUncheckedCreateWithoutCreatorInput> | GameRoleConfigCreateWithoutCreatorInput[] | GameRoleConfigUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutCreatorInput | GameRoleConfigCreateOrConnectWithoutCreatorInput[]
    createMany?: GameRoleConfigCreateManyCreatorInputEnvelope
    connect?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
  }

  export type GameUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<GameCreateWithoutCreatorInput, GameUncheckedCreateWithoutCreatorInput> | GameCreateWithoutCreatorInput[] | GameUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameCreateOrConnectWithoutCreatorInput | GameCreateOrConnectWithoutCreatorInput[]
    createMany?: GameCreateManyCreatorInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type GameLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GameLogCreateWithoutUserInput, GameLogUncheckedCreateWithoutUserInput> | GameLogCreateWithoutUserInput[] | GameLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutUserInput | GameLogCreateOrConnectWithoutUserInput[]
    createMany?: GameLogCreateManyUserInputEnvelope
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatMessageCreateWithoutUserInput, ChatMessageUncheckedCreateWithoutUserInput> | ChatMessageCreateWithoutUserInput[] | ChatMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutUserInput | ChatMessageCreateOrConnectWithoutUserInput[]
    createMany?: ChatMessageCreateManyUserInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type GameRoleConfigUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<GameRoleConfigCreateWithoutCreatorInput, GameRoleConfigUncheckedCreateWithoutCreatorInput> | GameRoleConfigCreateWithoutCreatorInput[] | GameRoleConfigUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutCreatorInput | GameRoleConfigCreateOrConnectWithoutCreatorInput[]
    createMany?: GameRoleConfigCreateManyCreatorInputEnvelope
    connect?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
  }

  export type GameUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<GameCreateWithoutCreatorInput, GameUncheckedCreateWithoutCreatorInput> | GameCreateWithoutCreatorInput[] | GameUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameCreateOrConnectWithoutCreatorInput | GameCreateOrConnectWithoutCreatorInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutCreatorInput | GameUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: GameCreateManyCreatorInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutCreatorInput | GameUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: GameUpdateManyWithWhereWithoutCreatorInput | GameUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type PlayerUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutUserInput | PlayerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutUserInput | PlayerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutUserInput | PlayerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type GameLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameLogCreateWithoutUserInput, GameLogUncheckedCreateWithoutUserInput> | GameLogCreateWithoutUserInput[] | GameLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutUserInput | GameLogCreateOrConnectWithoutUserInput[]
    upsert?: GameLogUpsertWithWhereUniqueWithoutUserInput | GameLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameLogCreateManyUserInputEnvelope
    set?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    disconnect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    delete?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    update?: GameLogUpdateWithWhereUniqueWithoutUserInput | GameLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameLogUpdateManyWithWhereWithoutUserInput | GameLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
  }

  export type ChatMessageUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatMessageCreateWithoutUserInput, ChatMessageUncheckedCreateWithoutUserInput> | ChatMessageCreateWithoutUserInput[] | ChatMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutUserInput | ChatMessageCreateOrConnectWithoutUserInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutUserInput | ChatMessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatMessageCreateManyUserInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutUserInput | ChatMessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutUserInput | ChatMessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type GameRoleConfigUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<GameRoleConfigCreateWithoutCreatorInput, GameRoleConfigUncheckedCreateWithoutCreatorInput> | GameRoleConfigCreateWithoutCreatorInput[] | GameRoleConfigUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutCreatorInput | GameRoleConfigCreateOrConnectWithoutCreatorInput[]
    upsert?: GameRoleConfigUpsertWithWhereUniqueWithoutCreatorInput | GameRoleConfigUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: GameRoleConfigCreateManyCreatorInputEnvelope
    set?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    disconnect?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    delete?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    connect?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    update?: GameRoleConfigUpdateWithWhereUniqueWithoutCreatorInput | GameRoleConfigUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: GameRoleConfigUpdateManyWithWhereWithoutCreatorInput | GameRoleConfigUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: GameRoleConfigScalarWhereInput | GameRoleConfigScalarWhereInput[]
  }

  export type GameUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<GameCreateWithoutCreatorInput, GameUncheckedCreateWithoutCreatorInput> | GameCreateWithoutCreatorInput[] | GameUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameCreateOrConnectWithoutCreatorInput | GameCreateOrConnectWithoutCreatorInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutCreatorInput | GameUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: GameCreateManyCreatorInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutCreatorInput | GameUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: GameUpdateManyWithWhereWithoutCreatorInput | GameUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutUserInput | PlayerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutUserInput | PlayerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutUserInput | PlayerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type GameLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameLogCreateWithoutUserInput, GameLogUncheckedCreateWithoutUserInput> | GameLogCreateWithoutUserInput[] | GameLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameLogCreateOrConnectWithoutUserInput | GameLogCreateOrConnectWithoutUserInput[]
    upsert?: GameLogUpsertWithWhereUniqueWithoutUserInput | GameLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameLogCreateManyUserInputEnvelope
    set?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    disconnect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    delete?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    connect?: GameLogWhereUniqueInput | GameLogWhereUniqueInput[]
    update?: GameLogUpdateWithWhereUniqueWithoutUserInput | GameLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameLogUpdateManyWithWhereWithoutUserInput | GameLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatMessageCreateWithoutUserInput, ChatMessageUncheckedCreateWithoutUserInput> | ChatMessageCreateWithoutUserInput[] | ChatMessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutUserInput | ChatMessageCreateOrConnectWithoutUserInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutUserInput | ChatMessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatMessageCreateManyUserInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutUserInput | ChatMessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutUserInput | ChatMessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type GameRoleConfigUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<GameRoleConfigCreateWithoutCreatorInput, GameRoleConfigUncheckedCreateWithoutCreatorInput> | GameRoleConfigCreateWithoutCreatorInput[] | GameRoleConfigUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: GameRoleConfigCreateOrConnectWithoutCreatorInput | GameRoleConfigCreateOrConnectWithoutCreatorInput[]
    upsert?: GameRoleConfigUpsertWithWhereUniqueWithoutCreatorInput | GameRoleConfigUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: GameRoleConfigCreateManyCreatorInputEnvelope
    set?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    disconnect?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    delete?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    connect?: GameRoleConfigWhereUniqueInput | GameRoleConfigWhereUniqueInput[]
    update?: GameRoleConfigUpdateWithWhereUniqueWithoutCreatorInput | GameRoleConfigUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: GameRoleConfigUpdateManyWithWhereWithoutCreatorInput | GameRoleConfigUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: GameRoleConfigScalarWhereInput | GameRoleConfigScalarWhereInput[]
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumGameStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusFilter<$PrismaModel> | $Enums.GameStatus
  }

  export type NestedEnumGamePhaseNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.GamePhase | EnumGamePhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGamePhaseNullableFilter<$PrismaModel> | $Enums.GamePhase | null
  }

  export type NestedEnumNightPhaseNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumNightPhaseNullableFilter<$PrismaModel> | $Enums.NightPhase | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumGameStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameStatusFilter<$PrismaModel>
    _max?: NestedEnumGameStatusFilter<$PrismaModel>
  }

  export type NestedEnumGamePhaseNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GamePhase | EnumGamePhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.GamePhase[] | ListEnumGamePhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumGamePhaseNullableWithAggregatesFilter<$PrismaModel> | $Enums.GamePhase | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumGamePhaseNullableFilter<$PrismaModel>
    _max?: NestedEnumGamePhaseNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumNightPhaseNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel> | null
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel> | null
    not?: NestedEnumNightPhaseNullableWithAggregatesFilter<$PrismaModel> | $Enums.NightPhase | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumNightPhaseNullableFilter<$PrismaModel>
    _max?: NestedEnumNightPhaseNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumWerewolfRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.WerewolfRole | EnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWerewolfRoleNullableFilter<$PrismaModel> | $Enums.WerewolfRole | null
  }

  export type NestedEnumTeamNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Team | EnumTeamFieldRefInput<$PrismaModel> | null
    in?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTeamNullableFilter<$PrismaModel> | $Enums.Team | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumWerewolfRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WerewolfRole | EnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WerewolfRole[] | ListEnumWerewolfRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWerewolfRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.WerewolfRole | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumWerewolfRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumWerewolfRoleNullableFilter<$PrismaModel>
  }

  export type NestedEnumTeamNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Team | EnumTeamFieldRefInput<$PrismaModel> | null
    in?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Team[] | ListEnumTeamFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTeamNullableWithAggregatesFilter<$PrismaModel> | $Enums.Team | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTeamNullableFilter<$PrismaModel>
    _max?: NestedEnumTeamNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumChatChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatChannel | EnumChatChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumChatChannelFilter<$PrismaModel> | $Enums.ChatChannel
  }

  export type NestedEnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type NestedEnumChatChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatChannel | EnumChatChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatChannel[] | ListEnumChatChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumChatChannelWithAggregatesFilter<$PrismaModel> | $Enums.ChatChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatChannelFilter<$PrismaModel>
    _max?: NestedEnumChatChannelFilter<$PrismaModel>
  }

  export type NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type NestedEnumActionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeFilter<$PrismaModel> | $Enums.ActionType
  }

  export type NestedEnumNightPhaseFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumNightPhaseFilter<$PrismaModel> | $Enums.NightPhase
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumActionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionType | EnumActionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionType[] | ListEnumActionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumActionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ActionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionTypeFilter<$PrismaModel>
    _max?: NestedEnumActionTypeFilter<$PrismaModel>
  }

  export type NestedEnumNightPhaseWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NightPhase | EnumNightPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.NightPhase[] | ListEnumNightPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumNightPhaseWithAggregatesFilter<$PrismaModel> | $Enums.NightPhase
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNightPhaseFilter<$PrismaModel>
    _max?: NestedEnumNightPhaseFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type ProfileCreateWithoutCreated_gamesInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    players?: PlayerCreateNestedManyWithoutUserInput
    game_logs?: GameLogCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigCreateNestedManyWithoutCreatorInput
  }

  export type ProfileUncheckedCreateWithoutCreated_gamesInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type ProfileCreateOrConnectWithoutCreated_gamesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutCreated_gamesInput, ProfileUncheckedCreateWithoutCreated_gamesInput>
  }

  export type PlayerCreateWithoutGameInput = {
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    user: ProfileCreateNestedOneWithoutPlayersInput
    game_logs?: GameLogCreateNestedManyWithoutPlayerInput
    night_actions?: NightActionCreateNestedManyWithoutPerformerInput
  }

  export type PlayerUncheckedCreateWithoutGameInput = {
    user_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    game_logs?: GameLogUncheckedCreateNestedManyWithoutPlayerInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutPerformerInput
  }

  export type PlayerCreateOrConnectWithoutGameInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput>
  }

  export type PlayerCreateManyGameInputEnvelope = {
    data: PlayerCreateManyGameInput | PlayerCreateManyGameInput[]
    skipDuplicates?: boolean
  }

  export type GameLogCreateWithoutGameInput = {
    id?: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
    user?: ProfileCreateNestedOneWithoutGame_logsInput
    player?: PlayerCreateNestedOneWithoutGame_logsInput
  }

  export type GameLogUncheckedCreateWithoutGameInput = {
    id?: string
    user_id?: string | null
    player_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type GameLogCreateOrConnectWithoutGameInput = {
    where: GameLogWhereUniqueInput
    create: XOR<GameLogCreateWithoutGameInput, GameLogUncheckedCreateWithoutGameInput>
  }

  export type GameLogCreateManyGameInputEnvelope = {
    data: GameLogCreateManyGameInput | GameLogCreateManyGameInput[]
    skipDuplicates?: boolean
  }

  export type ChatMessageCreateWithoutGameInput = {
    id?: string
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
    user: ProfileCreateNestedOneWithoutChat_messagesInput
  }

  export type ChatMessageUncheckedCreateWithoutGameInput = {
    id?: string
    user_id: string
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutGameInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutGameInput, ChatMessageUncheckedCreateWithoutGameInput>
  }

  export type ChatMessageCreateManyGameInputEnvelope = {
    data: ChatMessageCreateManyGameInput | ChatMessageCreateManyGameInput[]
    skipDuplicates?: boolean
  }

  export type GameRoleConfigCreateWithoutGameInput = {
    id?: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_at?: Date | string
    creator: ProfileCreateNestedOneWithoutRole_configsInput
  }

  export type GameRoleConfigUncheckedCreateWithoutGameInput = {
    id?: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_by: string
    created_at?: Date | string
  }

  export type GameRoleConfigCreateOrConnectWithoutGameInput = {
    where: GameRoleConfigWhereUniqueInput
    create: XOR<GameRoleConfigCreateWithoutGameInput, GameRoleConfigUncheckedCreateWithoutGameInput>
  }

  export type NightActionCreateWithoutGameInput = {
    id?: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
    performer: PlayerCreateNestedOneWithoutNight_actionsInput
  }

  export type NightActionUncheckedCreateWithoutGameInput = {
    id?: string
    player_id: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type NightActionCreateOrConnectWithoutGameInput = {
    where: NightActionWhereUniqueInput
    create: XOR<NightActionCreateWithoutGameInput, NightActionUncheckedCreateWithoutGameInput>
  }

  export type NightActionCreateManyGameInputEnvelope = {
    data: NightActionCreateManyGameInput | NightActionCreateManyGameInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutCreated_gamesInput = {
    update: XOR<ProfileUpdateWithoutCreated_gamesInput, ProfileUncheckedUpdateWithoutCreated_gamesInput>
    create: XOR<ProfileCreateWithoutCreated_gamesInput, ProfileUncheckedCreateWithoutCreated_gamesInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutCreated_gamesInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutCreated_gamesInput, ProfileUncheckedUpdateWithoutCreated_gamesInput>
  }

  export type ProfileUpdateWithoutCreated_gamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    players?: PlayerUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUpdateManyWithoutCreatorNestedInput
  }

  export type ProfileUncheckedUpdateWithoutCreated_gamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type PlayerUpsertWithWhereUniqueWithoutGameInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutGameInput, PlayerUncheckedUpdateWithoutGameInput>
    create: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutGameInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutGameInput, PlayerUncheckedUpdateWithoutGameInput>
  }

  export type PlayerUpdateManyWithWhereWithoutGameInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutGameInput>
  }

  export type PlayerScalarWhereInput = {
    AND?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    OR?: PlayerScalarWhereInput[]
    NOT?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    user_id?: UuidFilter<"Player"> | string
    game_id?: UuidFilter<"Player"> | string
    role?: EnumWerewolfRoleNullableFilter<"Player"> | $Enums.WerewolfRole | null
    team?: EnumTeamNullableFilter<"Player"> | $Enums.Team | null
    is_alive?: BoolFilter<"Player"> | boolean
    is_host?: BoolFilter<"Player"> | boolean
    joined_at?: DateTimeFilter<"Player"> | Date | string
    eliminated_at?: DateTimeNullableFilter<"Player"> | Date | string | null
    votes_cast?: IntFilter<"Player"> | number
    lover_id?: UuidNullableFilter<"Player"> | string | null
    has_heal_potion?: BoolFilter<"Player"> | boolean
    has_poison_potion?: BoolFilter<"Player"> | boolean
    can_shoot?: BoolFilter<"Player"> | boolean
    has_spied?: BoolFilter<"Player"> | boolean
    spy_risk?: IntFilter<"Player"> | number
    is_protected?: BoolFilter<"Player"> | boolean
  }

  export type GameLogUpsertWithWhereUniqueWithoutGameInput = {
    where: GameLogWhereUniqueInput
    update: XOR<GameLogUpdateWithoutGameInput, GameLogUncheckedUpdateWithoutGameInput>
    create: XOR<GameLogCreateWithoutGameInput, GameLogUncheckedCreateWithoutGameInput>
  }

  export type GameLogUpdateWithWhereUniqueWithoutGameInput = {
    where: GameLogWhereUniqueInput
    data: XOR<GameLogUpdateWithoutGameInput, GameLogUncheckedUpdateWithoutGameInput>
  }

  export type GameLogUpdateManyWithWhereWithoutGameInput = {
    where: GameLogScalarWhereInput
    data: XOR<GameLogUpdateManyMutationInput, GameLogUncheckedUpdateManyWithoutGameInput>
  }

  export type GameLogScalarWhereInput = {
    AND?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
    OR?: GameLogScalarWhereInput[]
    NOT?: GameLogScalarWhereInput | GameLogScalarWhereInput[]
    id?: UuidFilter<"GameLog"> | string
    game_id?: UuidFilter<"GameLog"> | string
    user_id?: UuidNullableFilter<"GameLog"> | string | null
    player_id?: UuidNullableFilter<"GameLog"> | string | null
    action?: StringFilter<"GameLog"> | string
    details?: JsonNullableFilter<"GameLog">
    phase?: EnumGamePhaseNullableFilter<"GameLog"> | $Enums.GamePhase | null
    day_number?: IntNullableFilter<"GameLog"> | number | null
    created_at?: DateTimeFilter<"GameLog"> | Date | string
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutGameInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutGameInput, ChatMessageUncheckedUpdateWithoutGameInput>
    create: XOR<ChatMessageCreateWithoutGameInput, ChatMessageUncheckedCreateWithoutGameInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutGameInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutGameInput, ChatMessageUncheckedUpdateWithoutGameInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutGameInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutGameInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: UuidFilter<"ChatMessage"> | string
    game_id?: UuidNullableFilter<"ChatMessage"> | string | null
    user_id?: UuidFilter<"ChatMessage"> | string
    channel?: EnumChatChannelFilter<"ChatMessage"> | $Enums.ChatChannel
    type?: EnumMessageTypeFilter<"ChatMessage"> | $Enums.MessageType
    content?: StringFilter<"ChatMessage"> | string
    mentions?: StringNullableListFilter<"ChatMessage">
    edited?: BoolFilter<"ChatMessage"> | boolean
    edited_at?: DateTimeNullableFilter<"ChatMessage"> | Date | string | null
    created_at?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type GameRoleConfigUpsertWithoutGameInput = {
    update: XOR<GameRoleConfigUpdateWithoutGameInput, GameRoleConfigUncheckedUpdateWithoutGameInput>
    create: XOR<GameRoleConfigCreateWithoutGameInput, GameRoleConfigUncheckedCreateWithoutGameInput>
    where?: GameRoleConfigWhereInput
  }

  export type GameRoleConfigUpdateToOneWithWhereWithoutGameInput = {
    where?: GameRoleConfigWhereInput
    data: XOR<GameRoleConfigUpdateWithoutGameInput, GameRoleConfigUncheckedUpdateWithoutGameInput>
  }

  export type GameRoleConfigUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutRole_configsNestedInput
  }

  export type GameRoleConfigUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_by?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NightActionUpsertWithWhereUniqueWithoutGameInput = {
    where: NightActionWhereUniqueInput
    update: XOR<NightActionUpdateWithoutGameInput, NightActionUncheckedUpdateWithoutGameInput>
    create: XOR<NightActionCreateWithoutGameInput, NightActionUncheckedCreateWithoutGameInput>
  }

  export type NightActionUpdateWithWhereUniqueWithoutGameInput = {
    where: NightActionWhereUniqueInput
    data: XOR<NightActionUpdateWithoutGameInput, NightActionUncheckedUpdateWithoutGameInput>
  }

  export type NightActionUpdateManyWithWhereWithoutGameInput = {
    where: NightActionScalarWhereInput
    data: XOR<NightActionUpdateManyMutationInput, NightActionUncheckedUpdateManyWithoutGameInput>
  }

  export type NightActionScalarWhereInput = {
    AND?: NightActionScalarWhereInput | NightActionScalarWhereInput[]
    OR?: NightActionScalarWhereInput[]
    NOT?: NightActionScalarWhereInput | NightActionScalarWhereInput[]
    id?: UuidFilter<"NightAction"> | string
    game_id?: UuidFilter<"NightAction"> | string
    player_id?: UuidFilter<"NightAction"> | string
    action_type?: EnumActionTypeFilter<"NightAction"> | $Enums.ActionType
    target_id?: UuidNullableFilter<"NightAction"> | string | null
    second_target_id?: UuidNullableFilter<"NightAction"> | string | null
    phase?: EnumNightPhaseFilter<"NightAction"> | $Enums.NightPhase
    day_number?: IntFilter<"NightAction"> | number
    resolved?: BoolFilter<"NightAction"> | boolean
    success?: BoolNullableFilter<"NightAction"> | boolean | null
    result_message?: StringNullableFilter<"NightAction"> | string | null
    revealed_info?: JsonNullableFilter<"NightAction">
    effects?: JsonNullableFilter<"NightAction">
    created_at?: DateTimeFilter<"NightAction"> | Date | string
    resolved_at?: DateTimeNullableFilter<"NightAction"> | Date | string | null
  }

  export type ProfileCreateWithoutPlayersInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameCreateNestedManyWithoutCreatorInput
    game_logs?: GameLogCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigCreateNestedManyWithoutCreatorInput
  }

  export type ProfileUncheckedCreateWithoutPlayersInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameUncheckedCreateNestedManyWithoutCreatorInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type ProfileCreateOrConnectWithoutPlayersInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutPlayersInput, ProfileUncheckedCreateWithoutPlayersInput>
  }

  export type GameCreateWithoutPlayersInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    creator: ProfileCreateNestedOneWithoutCreated_gamesInput
    game_logs?: GameLogCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigCreateNestedOneWithoutGameInput
    night_actions?: NightActionCreateNestedManyWithoutGameInput
  }

  export type GameUncheckedCreateWithoutPlayersInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    creator_id: string
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    game_logs?: GameLogUncheckedCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigUncheckedCreateNestedOneWithoutGameInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutPlayersInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
  }

  export type GameLogCreateWithoutPlayerInput = {
    id?: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
    game: GameCreateNestedOneWithoutGame_logsInput
    user?: ProfileCreateNestedOneWithoutGame_logsInput
  }

  export type GameLogUncheckedCreateWithoutPlayerInput = {
    id?: string
    user_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type GameLogCreateOrConnectWithoutPlayerInput = {
    where: GameLogWhereUniqueInput
    create: XOR<GameLogCreateWithoutPlayerInput, GameLogUncheckedCreateWithoutPlayerInput>
  }

  export type GameLogCreateManyPlayerInputEnvelope = {
    data: GameLogCreateManyPlayerInput | GameLogCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type NightActionCreateWithoutPerformerInput = {
    id?: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
    game: GameCreateNestedOneWithoutNight_actionsInput
  }

  export type NightActionUncheckedCreateWithoutPerformerInput = {
    id?: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type NightActionCreateOrConnectWithoutPerformerInput = {
    where: NightActionWhereUniqueInput
    create: XOR<NightActionCreateWithoutPerformerInput, NightActionUncheckedCreateWithoutPerformerInput>
  }

  export type NightActionCreateManyPerformerInputEnvelope = {
    data: NightActionCreateManyPerformerInput | NightActionCreateManyPerformerInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutPlayersInput = {
    update: XOR<ProfileUpdateWithoutPlayersInput, ProfileUncheckedUpdateWithoutPlayersInput>
    create: XOR<ProfileCreateWithoutPlayersInput, ProfileUncheckedCreateWithoutPlayersInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutPlayersInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutPlayersInput, ProfileUncheckedUpdateWithoutPlayersInput>
  }

  export type ProfileUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUpdateManyWithoutCreatorNestedInput
    game_logs?: GameLogUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUpdateManyWithoutCreatorNestedInput
  }

  export type ProfileUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUncheckedUpdateManyWithoutCreatorNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type GameUpsertWithoutPlayersInput = {
    update: XOR<GameUpdateWithoutPlayersInput, GameUncheckedUpdateWithoutPlayersInput>
    create: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutPlayersInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutPlayersInput, GameUncheckedUpdateWithoutPlayersInput>
  }

  export type GameUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutCreated_gamesNestedInput
    game_logs?: GameLogUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game_logs?: GameLogUncheckedUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUncheckedUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameLogUpsertWithWhereUniqueWithoutPlayerInput = {
    where: GameLogWhereUniqueInput
    update: XOR<GameLogUpdateWithoutPlayerInput, GameLogUncheckedUpdateWithoutPlayerInput>
    create: XOR<GameLogCreateWithoutPlayerInput, GameLogUncheckedCreateWithoutPlayerInput>
  }

  export type GameLogUpdateWithWhereUniqueWithoutPlayerInput = {
    where: GameLogWhereUniqueInput
    data: XOR<GameLogUpdateWithoutPlayerInput, GameLogUncheckedUpdateWithoutPlayerInput>
  }

  export type GameLogUpdateManyWithWhereWithoutPlayerInput = {
    where: GameLogScalarWhereInput
    data: XOR<GameLogUpdateManyMutationInput, GameLogUncheckedUpdateManyWithoutPlayerInput>
  }

  export type NightActionUpsertWithWhereUniqueWithoutPerformerInput = {
    where: NightActionWhereUniqueInput
    update: XOR<NightActionUpdateWithoutPerformerInput, NightActionUncheckedUpdateWithoutPerformerInput>
    create: XOR<NightActionCreateWithoutPerformerInput, NightActionUncheckedCreateWithoutPerformerInput>
  }

  export type NightActionUpdateWithWhereUniqueWithoutPerformerInput = {
    where: NightActionWhereUniqueInput
    data: XOR<NightActionUpdateWithoutPerformerInput, NightActionUncheckedUpdateWithoutPerformerInput>
  }

  export type NightActionUpdateManyWithWhereWithoutPerformerInput = {
    where: NightActionScalarWhereInput
    data: XOR<NightActionUpdateManyMutationInput, NightActionUncheckedUpdateManyWithoutPerformerInput>
  }

  export type GameCreateWithoutGame_logsInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    creator: ProfileCreateNestedOneWithoutCreated_gamesInput
    players?: PlayerCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigCreateNestedOneWithoutGameInput
    night_actions?: NightActionCreateNestedManyWithoutGameInput
  }

  export type GameUncheckedCreateWithoutGame_logsInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    creator_id: string
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigUncheckedCreateNestedOneWithoutGameInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutGame_logsInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutGame_logsInput, GameUncheckedCreateWithoutGame_logsInput>
  }

  export type ProfileCreateWithoutGame_logsInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigCreateNestedManyWithoutCreatorInput
  }

  export type ProfileUncheckedCreateWithoutGame_logsInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type ProfileCreateOrConnectWithoutGame_logsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutGame_logsInput, ProfileUncheckedCreateWithoutGame_logsInput>
  }

  export type PlayerCreateWithoutGame_logsInput = {
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    user: ProfileCreateNestedOneWithoutPlayersInput
    game: GameCreateNestedOneWithoutPlayersInput
    night_actions?: NightActionCreateNestedManyWithoutPerformerInput
  }

  export type PlayerUncheckedCreateWithoutGame_logsInput = {
    user_id: string
    game_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    night_actions?: NightActionUncheckedCreateNestedManyWithoutPerformerInput
  }

  export type PlayerCreateOrConnectWithoutGame_logsInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutGame_logsInput, PlayerUncheckedCreateWithoutGame_logsInput>
  }

  export type GameUpsertWithoutGame_logsInput = {
    update: XOR<GameUpdateWithoutGame_logsInput, GameUncheckedUpdateWithoutGame_logsInput>
    create: XOR<GameCreateWithoutGame_logsInput, GameUncheckedCreateWithoutGame_logsInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutGame_logsInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutGame_logsInput, GameUncheckedUpdateWithoutGame_logsInput>
  }

  export type GameUpdateWithoutGame_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutCreated_gamesNestedInput
    players?: PlayerUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutGame_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUncheckedUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutGameNestedInput
  }

  export type ProfileUpsertWithoutGame_logsInput = {
    update: XOR<ProfileUpdateWithoutGame_logsInput, ProfileUncheckedUpdateWithoutGame_logsInput>
    create: XOR<ProfileCreateWithoutGame_logsInput, ProfileUncheckedCreateWithoutGame_logsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutGame_logsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutGame_logsInput, ProfileUncheckedUpdateWithoutGame_logsInput>
  }

  export type ProfileUpdateWithoutGame_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUpdateManyWithoutCreatorNestedInput
  }

  export type ProfileUncheckedUpdateWithoutGame_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type PlayerUpsertWithoutGame_logsInput = {
    update: XOR<PlayerUpdateWithoutGame_logsInput, PlayerUncheckedUpdateWithoutGame_logsInput>
    create: XOR<PlayerCreateWithoutGame_logsInput, PlayerUncheckedCreateWithoutGame_logsInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutGame_logsInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutGame_logsInput, PlayerUncheckedUpdateWithoutGame_logsInput>
  }

  export type PlayerUpdateWithoutGame_logsInput = {
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    user?: ProfileUpdateOneRequiredWithoutPlayersNestedInput
    game?: GameUpdateOneRequiredWithoutPlayersNestedInput
    night_actions?: NightActionUpdateManyWithoutPerformerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutGame_logsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    night_actions?: NightActionUncheckedUpdateManyWithoutPerformerNestedInput
  }

  export type GameCreateWithoutChat_messagesInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    creator: ProfileCreateNestedOneWithoutCreated_gamesInput
    players?: PlayerCreateNestedManyWithoutGameInput
    game_logs?: GameLogCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigCreateNestedOneWithoutGameInput
    night_actions?: NightActionCreateNestedManyWithoutGameInput
  }

  export type GameUncheckedCreateWithoutChat_messagesInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    creator_id: string
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigUncheckedCreateNestedOneWithoutGameInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutChat_messagesInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutChat_messagesInput, GameUncheckedCreateWithoutChat_messagesInput>
  }

  export type ProfileCreateWithoutChat_messagesInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    game_logs?: GameLogCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigCreateNestedManyWithoutCreatorInput
  }

  export type ProfileUncheckedCreateWithoutChat_messagesInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutUserInput
    role_configs?: GameRoleConfigUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type ProfileCreateOrConnectWithoutChat_messagesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutChat_messagesInput, ProfileUncheckedCreateWithoutChat_messagesInput>
  }

  export type GameUpsertWithoutChat_messagesInput = {
    update: XOR<GameUpdateWithoutChat_messagesInput, GameUncheckedUpdateWithoutChat_messagesInput>
    create: XOR<GameCreateWithoutChat_messagesInput, GameUncheckedCreateWithoutChat_messagesInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutChat_messagesInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutChat_messagesInput, GameUncheckedUpdateWithoutChat_messagesInput>
  }

  export type GameUpdateWithoutChat_messagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutCreated_gamesNestedInput
    players?: PlayerUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutChat_messagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUncheckedUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutGameNestedInput
  }

  export type ProfileUpsertWithoutChat_messagesInput = {
    update: XOR<ProfileUpdateWithoutChat_messagesInput, ProfileUncheckedUpdateWithoutChat_messagesInput>
    create: XOR<ProfileCreateWithoutChat_messagesInput, ProfileUncheckedCreateWithoutChat_messagesInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutChat_messagesInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutChat_messagesInput, ProfileUncheckedUpdateWithoutChat_messagesInput>
  }

  export type ProfileUpdateWithoutChat_messagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUpdateManyWithoutCreatorNestedInput
  }

  export type ProfileUncheckedUpdateWithoutChat_messagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutUserNestedInput
    role_configs?: GameRoleConfigUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type GameCreateWithoutRole_configInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    creator: ProfileCreateNestedOneWithoutCreated_gamesInput
    players?: PlayerCreateNestedManyWithoutGameInput
    game_logs?: GameLogCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageCreateNestedManyWithoutGameInput
    night_actions?: NightActionCreateNestedManyWithoutGameInput
  }

  export type GameUncheckedCreateWithoutRole_configInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    creator_id: string
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutGameInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutRole_configInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutRole_configInput, GameUncheckedCreateWithoutRole_configInput>
  }

  export type ProfileCreateWithoutRole_configsInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    game_logs?: GameLogCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageCreateNestedManyWithoutUserInput
  }

  export type ProfileUncheckedCreateWithoutRole_configsInput = {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    updated_at?: Date | string | null
    created_at?: Date | string
    games_played?: number
    games_won?: number
    created_games?: GameUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutUserInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type ProfileCreateOrConnectWithoutRole_configsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutRole_configsInput, ProfileUncheckedCreateWithoutRole_configsInput>
  }

  export type GameUpsertWithoutRole_configInput = {
    update: XOR<GameUpdateWithoutRole_configInput, GameUncheckedUpdateWithoutRole_configInput>
    create: XOR<GameCreateWithoutRole_configInput, GameUncheckedCreateWithoutRole_configInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutRole_configInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutRole_configInput, GameUncheckedUpdateWithoutRole_configInput>
  }

  export type GameUpdateWithoutRole_configInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutCreated_gamesNestedInput
    players?: PlayerUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutGameNestedInput
    night_actions?: NightActionUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutRole_configInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutGameNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutGameNestedInput
  }

  export type ProfileUpsertWithoutRole_configsInput = {
    update: XOR<ProfileUpdateWithoutRole_configsInput, ProfileUncheckedUpdateWithoutRole_configsInput>
    create: XOR<ProfileCreateWithoutRole_configsInput, ProfileUncheckedCreateWithoutRole_configsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutRole_configsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutRole_configsInput, ProfileUncheckedUpdateWithoutRole_configsInput>
  }

  export type ProfileUpdateWithoutRole_configsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutUserNestedInput
  }

  export type ProfileUncheckedUpdateWithoutRole_configsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    games_played?: IntFieldUpdateOperationsInput | number
    games_won?: IntFieldUpdateOperationsInput | number
    created_games?: GameUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutUserNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GameCreateWithoutNight_actionsInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    creator: ProfileCreateNestedOneWithoutCreated_gamesInput
    players?: PlayerCreateNestedManyWithoutGameInput
    game_logs?: GameLogCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigCreateNestedOneWithoutGameInput
  }

  export type GameUncheckedCreateWithoutNight_actionsInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    creator_id: string
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigUncheckedCreateNestedOneWithoutGameInput
  }

  export type GameCreateOrConnectWithoutNight_actionsInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutNight_actionsInput, GameUncheckedCreateWithoutNight_actionsInput>
  }

  export type PlayerCreateWithoutNight_actionsInput = {
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    user: ProfileCreateNestedOneWithoutPlayersInput
    game: GameCreateNestedOneWithoutPlayersInput
    game_logs?: GameLogCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutNight_actionsInput = {
    user_id: string
    game_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    game_logs?: GameLogUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutNight_actionsInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutNight_actionsInput, PlayerUncheckedCreateWithoutNight_actionsInput>
  }

  export type GameUpsertWithoutNight_actionsInput = {
    update: XOR<GameUpdateWithoutNight_actionsInput, GameUncheckedUpdateWithoutNight_actionsInput>
    create: XOR<GameCreateWithoutNight_actionsInput, GameUncheckedCreateWithoutNight_actionsInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutNight_actionsInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutNight_actionsInput, GameUncheckedUpdateWithoutNight_actionsInput>
  }

  export type GameUpdateWithoutNight_actionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: ProfileUpdateOneRequiredWithoutCreated_gamesNestedInput
    players?: PlayerUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutNight_actionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUncheckedUpdateOneWithoutGameNestedInput
  }

  export type PlayerUpsertWithoutNight_actionsInput = {
    update: XOR<PlayerUpdateWithoutNight_actionsInput, PlayerUncheckedUpdateWithoutNight_actionsInput>
    create: XOR<PlayerCreateWithoutNight_actionsInput, PlayerUncheckedCreateWithoutNight_actionsInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutNight_actionsInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutNight_actionsInput, PlayerUncheckedUpdateWithoutNight_actionsInput>
  }

  export type PlayerUpdateWithoutNight_actionsInput = {
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    user?: ProfileUpdateOneRequiredWithoutPlayersNestedInput
    game?: GameUpdateOneRequiredWithoutPlayersNestedInput
    game_logs?: GameLogUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutNight_actionsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    game_logs?: GameLogUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type GameCreateWithoutCreatorInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    players?: PlayerCreateNestedManyWithoutGameInput
    game_logs?: GameLogCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigCreateNestedOneWithoutGameInput
    night_actions?: NightActionCreateNestedManyWithoutGameInput
  }

  export type GameUncheckedCreateWithoutCreatorInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
    game_logs?: GameLogUncheckedCreateNestedManyWithoutGameInput
    chat_messages?: ChatMessageUncheckedCreateNestedManyWithoutGameInput
    role_config?: GameRoleConfigUncheckedCreateNestedOneWithoutGameInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutCreatorInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutCreatorInput, GameUncheckedCreateWithoutCreatorInput>
  }

  export type GameCreateManyCreatorInputEnvelope = {
    data: GameCreateManyCreatorInput | GameCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type PlayerCreateWithoutUserInput = {
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    game: GameCreateNestedOneWithoutPlayersInput
    game_logs?: GameLogCreateNestedManyWithoutPlayerInput
    night_actions?: NightActionCreateNestedManyWithoutPerformerInput
  }

  export type PlayerUncheckedCreateWithoutUserInput = {
    game_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
    game_logs?: GameLogUncheckedCreateNestedManyWithoutPlayerInput
    night_actions?: NightActionUncheckedCreateNestedManyWithoutPerformerInput
  }

  export type PlayerCreateOrConnectWithoutUserInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput>
  }

  export type PlayerCreateManyUserInputEnvelope = {
    data: PlayerCreateManyUserInput | PlayerCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GameLogCreateWithoutUserInput = {
    id?: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
    game: GameCreateNestedOneWithoutGame_logsInput
    player?: PlayerCreateNestedOneWithoutGame_logsInput
  }

  export type GameLogUncheckedCreateWithoutUserInput = {
    id?: string
    game_id: string
    player_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type GameLogCreateOrConnectWithoutUserInput = {
    where: GameLogWhereUniqueInput
    create: XOR<GameLogCreateWithoutUserInput, GameLogUncheckedCreateWithoutUserInput>
  }

  export type GameLogCreateManyUserInputEnvelope = {
    data: GameLogCreateManyUserInput | GameLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatMessageCreateWithoutUserInput = {
    id?: string
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
    game?: GameCreateNestedOneWithoutChat_messagesInput
  }

  export type ChatMessageUncheckedCreateWithoutUserInput = {
    id?: string
    game_id?: string | null
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutUserInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutUserInput, ChatMessageUncheckedCreateWithoutUserInput>
  }

  export type ChatMessageCreateManyUserInputEnvelope = {
    data: ChatMessageCreateManyUserInput | ChatMessageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GameRoleConfigCreateWithoutCreatorInput = {
    id?: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_at?: Date | string
    game: GameCreateNestedOneWithoutRole_configInput
  }

  export type GameRoleConfigUncheckedCreateWithoutCreatorInput = {
    id?: string
    game_id: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_at?: Date | string
  }

  export type GameRoleConfigCreateOrConnectWithoutCreatorInput = {
    where: GameRoleConfigWhereUniqueInput
    create: XOR<GameRoleConfigCreateWithoutCreatorInput, GameRoleConfigUncheckedCreateWithoutCreatorInput>
  }

  export type GameRoleConfigCreateManyCreatorInputEnvelope = {
    data: GameRoleConfigCreateManyCreatorInput | GameRoleConfigCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type GameUpsertWithWhereUniqueWithoutCreatorInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutCreatorInput, GameUncheckedUpdateWithoutCreatorInput>
    create: XOR<GameCreateWithoutCreatorInput, GameUncheckedCreateWithoutCreatorInput>
  }

  export type GameUpdateWithWhereUniqueWithoutCreatorInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutCreatorInput, GameUncheckedUpdateWithoutCreatorInput>
  }

  export type GameUpdateManyWithWhereWithoutCreatorInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutCreatorInput>
  }

  export type GameScalarWhereInput = {
    AND?: GameScalarWhereInput | GameScalarWhereInput[]
    OR?: GameScalarWhereInput[]
    NOT?: GameScalarWhereInput | GameScalarWhereInput[]
    id?: UuidFilter<"Game"> | string
    name?: StringFilter<"Game"> | string
    code?: StringFilter<"Game"> | string
    status?: EnumGameStatusFilter<"Game"> | $Enums.GameStatus
    phase?: EnumGamePhaseNullableFilter<"Game"> | $Enums.GamePhase | null
    night_phase?: EnumNightPhaseNullableFilter<"Game"> | $Enums.NightPhase | null
    day_number?: IntFilter<"Game"> | number
    max_players?: IntFilter<"Game"> | number
    current_players?: IntFilter<"Game"> | number
    game_settings?: JsonFilter<"Game">
    winner?: StringNullableFilter<"Game"> | string | null
    creator_id?: UuidFilter<"Game"> | string
    created_at?: DateTimeFilter<"Game"> | Date | string
    started_at?: DateTimeNullableFilter<"Game"> | Date | string | null
    finished_at?: DateTimeNullableFilter<"Game"> | Date | string | null
    updated_at?: DateTimeFilter<"Game"> | Date | string
  }

  export type PlayerUpsertWithWhereUniqueWithoutUserInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutUserInput, PlayerUncheckedUpdateWithoutUserInput>
    create: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutUserInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutUserInput, PlayerUncheckedUpdateWithoutUserInput>
  }

  export type PlayerUpdateManyWithWhereWithoutUserInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutUserInput>
  }

  export type GameLogUpsertWithWhereUniqueWithoutUserInput = {
    where: GameLogWhereUniqueInput
    update: XOR<GameLogUpdateWithoutUserInput, GameLogUncheckedUpdateWithoutUserInput>
    create: XOR<GameLogCreateWithoutUserInput, GameLogUncheckedCreateWithoutUserInput>
  }

  export type GameLogUpdateWithWhereUniqueWithoutUserInput = {
    where: GameLogWhereUniqueInput
    data: XOR<GameLogUpdateWithoutUserInput, GameLogUncheckedUpdateWithoutUserInput>
  }

  export type GameLogUpdateManyWithWhereWithoutUserInput = {
    where: GameLogScalarWhereInput
    data: XOR<GameLogUpdateManyMutationInput, GameLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutUserInput, ChatMessageUncheckedUpdateWithoutUserInput>
    create: XOR<ChatMessageCreateWithoutUserInput, ChatMessageUncheckedCreateWithoutUserInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutUserInput, ChatMessageUncheckedUpdateWithoutUserInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutUserInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutUserInput>
  }

  export type GameRoleConfigUpsertWithWhereUniqueWithoutCreatorInput = {
    where: GameRoleConfigWhereUniqueInput
    update: XOR<GameRoleConfigUpdateWithoutCreatorInput, GameRoleConfigUncheckedUpdateWithoutCreatorInput>
    create: XOR<GameRoleConfigCreateWithoutCreatorInput, GameRoleConfigUncheckedCreateWithoutCreatorInput>
  }

  export type GameRoleConfigUpdateWithWhereUniqueWithoutCreatorInput = {
    where: GameRoleConfigWhereUniqueInput
    data: XOR<GameRoleConfigUpdateWithoutCreatorInput, GameRoleConfigUncheckedUpdateWithoutCreatorInput>
  }

  export type GameRoleConfigUpdateManyWithWhereWithoutCreatorInput = {
    where: GameRoleConfigScalarWhereInput
    data: XOR<GameRoleConfigUpdateManyMutationInput, GameRoleConfigUncheckedUpdateManyWithoutCreatorInput>
  }

  export type GameRoleConfigScalarWhereInput = {
    AND?: GameRoleConfigScalarWhereInput | GameRoleConfigScalarWhereInput[]
    OR?: GameRoleConfigScalarWhereInput[]
    NOT?: GameRoleConfigScalarWhereInput | GameRoleConfigScalarWhereInput[]
    id?: UuidFilter<"GameRoleConfig"> | string
    game_id?: UuidFilter<"GameRoleConfig"> | string
    villagers?: IntFilter<"GameRoleConfig"> | number
    werewolves?: IntFilter<"GameRoleConfig"> | number
    seer?: BoolFilter<"GameRoleConfig"> | boolean
    witch?: BoolFilter<"GameRoleConfig"> | boolean
    hunter?: BoolFilter<"GameRoleConfig"> | boolean
    cupid?: BoolFilter<"GameRoleConfig"> | boolean
    little_girl?: BoolFilter<"GameRoleConfig"> | boolean
    created_by?: UuidFilter<"GameRoleConfig"> | string
    created_at?: DateTimeFilter<"GameRoleConfig"> | Date | string
  }

  export type PlayerCreateManyGameInput = {
    user_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
  }

  export type GameLogCreateManyGameInput = {
    id?: string
    user_id?: string | null
    player_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type ChatMessageCreateManyGameInput = {
    id?: string
    user_id: string
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
  }

  export type NightActionCreateManyGameInput = {
    id?: string
    player_id: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type PlayerUpdateWithoutGameInput = {
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    user?: ProfileUpdateOneRequiredWithoutPlayersNestedInput
    game_logs?: GameLogUpdateManyWithoutPlayerNestedInput
    night_actions?: NightActionUpdateManyWithoutPerformerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutGameInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    game_logs?: GameLogUncheckedUpdateManyWithoutPlayerNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutPerformerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutGameInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameLogUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneWithoutGame_logsNestedInput
    player?: PlayerUpdateOneWithoutGame_logsNestedInput
  }

  export type GameLogUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    player_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameLogUncheckedUpdateManyWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    player_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ProfileUpdateOneRequiredWithoutChat_messagesNestedInput
  }

  export type ChatMessageUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NightActionUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performer?: PlayerUpdateOneRequiredWithoutNight_actionsNestedInput
  }

  export type NightActionUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NightActionUncheckedUpdateManyWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameLogCreateManyPlayerInput = {
    id?: string
    user_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type NightActionCreateManyPerformerInput = {
    id?: string
    action_type: $Enums.ActionType
    target_id?: string | null
    second_target_id?: string | null
    phase: $Enums.NightPhase
    day_number: number
    resolved?: boolean
    success?: boolean | null
    result_message?: string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    resolved_at?: Date | string | null
  }

  export type GameLogUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneRequiredWithoutGame_logsNestedInput
    user?: ProfileUpdateOneWithoutGame_logsNestedInput
  }

  export type GameLogUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameLogUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NightActionUpdateWithoutPerformerInput = {
    id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    game?: GameUpdateOneRequiredWithoutNight_actionsNestedInput
  }

  export type NightActionUncheckedUpdateWithoutPerformerInput = {
    id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NightActionUncheckedUpdateManyWithoutPerformerInput = {
    id?: StringFieldUpdateOperationsInput | string
    action_type?: EnumActionTypeFieldUpdateOperationsInput | $Enums.ActionType
    target_id?: NullableStringFieldUpdateOperationsInput | string | null
    second_target_id?: NullableStringFieldUpdateOperationsInput | string | null
    phase?: EnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase
    day_number?: IntFieldUpdateOperationsInput | number
    resolved?: BoolFieldUpdateOperationsInput | boolean
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
    result_message?: NullableStringFieldUpdateOperationsInput | string | null
    revealed_info?: NullableJsonNullValueInput | InputJsonValue
    effects?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resolved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameCreateManyCreatorInput = {
    id?: string
    name: string
    code: string
    status?: $Enums.GameStatus
    phase?: $Enums.GamePhase | null
    night_phase?: $Enums.NightPhase | null
    day_number?: number
    max_players?: number
    current_players?: number
    game_settings: JsonNullValueInput | InputJsonValue
    winner?: string | null
    created_at?: Date | string
    started_at?: Date | string | null
    finished_at?: Date | string | null
    updated_at?: Date | string
  }

  export type PlayerCreateManyUserInput = {
    game_id: string
    role?: $Enums.WerewolfRole | null
    team?: $Enums.Team | null
    is_alive?: boolean
    is_host?: boolean
    joined_at?: Date | string
    eliminated_at?: Date | string | null
    votes_cast?: number
    lover_id?: string | null
    has_heal_potion?: boolean
    has_poison_potion?: boolean
    can_shoot?: boolean
    has_spied?: boolean
    spy_risk?: number
    is_protected?: boolean
  }

  export type GameLogCreateManyUserInput = {
    id?: string
    game_id: string
    player_id?: string | null
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: $Enums.GamePhase | null
    day_number?: number | null
    created_at?: Date | string
  }

  export type ChatMessageCreateManyUserInput = {
    id?: string
    game_id?: string | null
    channel: $Enums.ChatChannel
    type?: $Enums.MessageType
    content: string
    mentions?: ChatMessageCreatementionsInput | string[]
    edited?: boolean
    edited_at?: Date | string | null
    created_at?: Date | string
  }

  export type GameRoleConfigCreateManyCreatorInput = {
    id?: string
    game_id: string
    villagers?: number
    werewolves?: number
    seer?: boolean
    witch?: boolean
    hunter?: boolean
    cupid?: boolean
    little_girl?: boolean
    created_at?: Date | string
  }

  export type GameUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    players?: PlayerUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
    game_logs?: GameLogUncheckedUpdateManyWithoutGameNestedInput
    chat_messages?: ChatMessageUncheckedUpdateManyWithoutGameNestedInput
    role_config?: GameRoleConfigUncheckedUpdateOneWithoutGameNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    night_phase?: NullableEnumNightPhaseFieldUpdateOperationsInput | $Enums.NightPhase | null
    day_number?: IntFieldUpdateOperationsInput | number
    max_players?: IntFieldUpdateOperationsInput | number
    current_players?: IntFieldUpdateOperationsInput | number
    game_settings?: JsonNullValueInput | InputJsonValue
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    started_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerUpdateWithoutUserInput = {
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    game?: GameUpdateOneRequiredWithoutPlayersNestedInput
    game_logs?: GameLogUpdateManyWithoutPlayerNestedInput
    night_actions?: NightActionUpdateManyWithoutPerformerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutUserInput = {
    game_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
    game_logs?: GameLogUncheckedUpdateManyWithoutPlayerNestedInput
    night_actions?: NightActionUncheckedUpdateManyWithoutPerformerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutUserInput = {
    game_id?: StringFieldUpdateOperationsInput | string
    role?: NullableEnumWerewolfRoleFieldUpdateOperationsInput | $Enums.WerewolfRole | null
    team?: NullableEnumTeamFieldUpdateOperationsInput | $Enums.Team | null
    is_alive?: BoolFieldUpdateOperationsInput | boolean
    is_host?: BoolFieldUpdateOperationsInput | boolean
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    eliminated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    votes_cast?: IntFieldUpdateOperationsInput | number
    lover_id?: NullableStringFieldUpdateOperationsInput | string | null
    has_heal_potion?: BoolFieldUpdateOperationsInput | boolean
    has_poison_potion?: BoolFieldUpdateOperationsInput | boolean
    can_shoot?: BoolFieldUpdateOperationsInput | boolean
    has_spied?: BoolFieldUpdateOperationsInput | boolean
    spy_risk?: IntFieldUpdateOperationsInput | number
    is_protected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneRequiredWithoutGame_logsNestedInput
    player?: PlayerUpdateOneWithoutGame_logsNestedInput
  }

  export type GameLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    player_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    player_id?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    phase?: NullableEnumGamePhaseFieldUpdateOperationsInput | $Enums.GamePhase | null
    day_number?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneWithoutChat_messagesNestedInput
  }

  export type ChatMessageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: EnumChatChannelFieldUpdateOperationsInput | $Enums.ChatChannel
    type?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    content?: StringFieldUpdateOperationsInput | string
    mentions?: ChatMessageUpdatementionsInput | string[]
    edited?: BoolFieldUpdateOperationsInput | boolean
    edited_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameRoleConfigUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: GameUpdateOneRequiredWithoutRole_configNestedInput
  }

  export type GameRoleConfigUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameRoleConfigUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    game_id?: StringFieldUpdateOperationsInput | string
    villagers?: IntFieldUpdateOperationsInput | number
    werewolves?: IntFieldUpdateOperationsInput | number
    seer?: BoolFieldUpdateOperationsInput | boolean
    witch?: BoolFieldUpdateOperationsInput | boolean
    hunter?: BoolFieldUpdateOperationsInput | boolean
    cupid?: BoolFieldUpdateOperationsInput | boolean
    little_girl?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}