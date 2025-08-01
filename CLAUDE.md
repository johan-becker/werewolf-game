# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a TypeScript-based real-time multiplayer werewolf game backend with dual database architecture (Prisma + Supabase). The system uses Supabase for authentication and Row Level Security (RLS), while supporting both REST APIs and Socket.IO for real-time gameplay.

### Key Architectural Patterns

**Dual Database Setup**: The project uses both Prisma ORM and Supabase client libraries. Supabase provides authentication, RLS policies, and database functions, while Prisma handles schema management and migrations.

**Security-First Design**: Database operations use Row Level Security (RLS) with separate admin and user clients. The `supabaseAdmin` client bypasses RLS for setup operations, while regular `supabase` client respects user permissions.

**Real-time Game Architecture**: Socket.IO handles real-time events with typed interfaces, room-based game isolation (`game:${gameId}`), and automatic cleanup on disconnect. Features mandatory authentication state machine with 5-second timeout enforcement.

**Game Code System**: Uses 6-character alphanumeric codes excluding ambiguous characters (0, 1, I, O) for easy game joining.

**Role Strategy Pattern**: Modular role system using strategy pattern with `BaseRoleStrategy` interface. Each werewolf role (Villager, Seer, Witch, Hunter, etc.) implements specific behaviors through dedicated strategy classes in `src/services/role-strategies/`.

**Night Phase Management**: Structured night phases with `WerewolfNightManager` coordinating sequential role actions (Seer → Werewolves → Witch → Hunter) and automatic phase transitions.

**Socket Authentication State Machine**: Mandatory authentication enforcement with three states (PENDING, AUTHENTICATED, REJECTED). Implements 5-second timeout, message queuing during authentication, typed event interfaces requiring user context, and automatic cleanup.

## Terminal Commands

**Development**:
- `npm run dev`: Hot-reload development server with ts-node-dev
- `npm run docker:up`: Full Docker environment (PostgreSQL + Redis + app)
- `npm run build && npm start`: Production build and server

**Database Management**:
- `npm run db:migrate`: Run Prisma migrations
- `npm run db:studio`: Open Prisma Studio for database inspection
- `npx ts-node src/test-supabase.ts`: Comprehensive integration test for auth, RLS, and database functions

**Testing & Quality**:
- `npm test`: Run Jest test suite
- `npm run lint`: ESLint code checking
- `npm run format`: Prettier code formatting

**System Testing**:
- `node test-chat-system.js`: Comprehensive chat system test suite
- `node test-socket-events.js`: Socket.IO event testing
- `node test-role-system.js`: Werewolf role system and strategy pattern testing
- `npx ts-node test-socket-auth-state.ts`: Socket authentication state machine testing
- Tests cover: lobby chat, mentions, spam protection, typing indicators, message editing, role mechanics, authentication flows

## Database Architecture

**Supabase Integration**:
- Authentication with automatic profile creation via `handle_new_user()` trigger
- RLS policies on all tables (profiles, games, players)
- Database functions for complex operations: `join_game_by_code()`, `join_game()`, `is_user_in_game()`
- Security Definer functions with explicit `search_path = 'public'` for SQL injection prevention

**Key Tables**:
- `profiles`: User data linked to Supabase auth.users
- `games`: Game instances with creator_id, status, and unique codes
- `players`: Game participants with roles and state
- `chat_messages`: Real-time chat with channel-based permissions and moderation
- `game_logs`: Audit trail for game events

**Client Separation**:
```typescript
// Admin client - bypasses RLS for setup operations
supabaseAdmin.from('profiles').insert(...)

// User client - respects RLS policies  
supabase.from('games').select(...)
```

## Authentication Flow

1. User signup via `AuthService.signup()` creates auth user
2. Database trigger `handle_new_user()` automatically creates profile
3. JWT tokens managed by Supabase with refresh token support
4. Middleware `authenticateToken()` validates requests
5. Socket.IO uses mandatory authentication state machine with 5-second timeout
6. Socket connections start in PENDING state, transition to AUTHENTICATED or REJECTED
7. Messages are queued during pending authentication and processed after success

## Chat System Architecture

**Real-time Communication**: Socket.IO-based chat with 5 channel types (LOBBY, DAY, NIGHT, DEAD, SYSTEM) and channel-specific permissions based on player status and game phase.

**Message Persistence**: All messages stored in Supabase with full audit trail, edit history, and @mention support.

**Moderation Features**: Built-in spam protection (5 messages/minute), word filtering, and role-based access control ensuring players only see appropriate channels.

**Typing Indicators**: Real-time typing notifications with automatic cleanup and channel-aware broadcasting.

## Game Service Patterns

**Game Creation**: Uses `generateGameCode()` utility with collision detection
**Player Management**: Host transfer logic when original host leaves
**State Management**: Game phases (waiting, in_progress, finished) with validation
**Real-time Updates**: Socket events for joining, leaving, role assignments

## File Structure Significance

**Critical Service Files**:
- `src/services/authService.ts`: Supabase auth integration with error mapping
- `src/services/game.service.ts`: Core game operations using database functions
- `src/services/chat.service.ts`: Chat system with spam protection, permissions, and moderation
- `src/services/werewolf-game-manager.service.ts`: Main game manager coordinating roles, phases, and win conditions
- `src/services/werewolf-night-manager.service.ts`: Night phase orchestration and action processing
- `src/services/role-factory.ts`: Role instantiation using factory pattern with strategy implementations
- `src/lib/supabase.ts`: Database client configuration and RLS patterns

**Role Strategy Architecture**:
- `src/services/role-strategies/base-role-strategy.ts`: Abstract base class defining role behavior interface
- `src/services/role-strategies/`: Individual role implementations (villager, seer, witch, werewolf, hunter, cupid, little-girl)
- Each strategy handles role-specific actions, night abilities, and win condition checks

**Socket Architecture**:
- `src/socket/index.ts`: Main Socket.IO server setup with authentication
- `src/socket/index.enhanced.ts`: Enhanced server with authentication state machine
- `src/socket/authenticated-events.ts`: Event handlers requiring authenticated user context
- `src/socket/events/`: Event handlers for lobby, game phases, and chat
- `src/socket/events/chat.events.ts`: Real-time chat with typing indicators and message broadcasting
- `src/middleware/socket-auth-state.middleware.ts`: Authentication state machine implementation

**Type System**:
- `src/types/`: Comprehensive TypeScript definitions for game state, auth, socket events, and chat
- `src/types/socket.types.ts`: Complete Socket.IO event typing for both client and server
- `src/types/socket-auth.types.ts`: Authentication state machine types and interfaces
- `src/types/chat.types.ts`: Chat message interfaces and channel definitions
- `src/types/werewolf-roles.types.ts`: Werewolf-specific types including roles, teams, win conditions, and night phases
- `src/types/roles.types.ts`: General role interfaces and action types
- Strict typing for game phases, player roles, night actions, API responses, and authentication states

## Development Workflow

**Adding Game Features**:
1. Update types in `src/types/game.types.ts` and relevant role types
2. Add database functions/policies if needed
3. Implement service layer methods
4. Create socket event handlers
5. Add REST endpoints in controllers
6. Test with `npx ts-node src/test-supabase.ts`

**Adding New Werewolf Roles**:
1. Add role enum to `src/types/werewolf-roles.types.ts`
2. Create strategy class in `src/services/role-strategies/[role]-strategy.ts` extending `BaseRoleStrategy`
3. Implement required methods: `canUseNightAbility()`, `executeNightAction()`, `getWinCondition()`
4. Register role in `src/services/role-factory.ts`
5. Update night phase ordering in `WerewolfNightManager` if needed
6. Test with `node test-role-system.js`

**Database Changes**:
1. Update Prisma schema
2. Run `npm run db:migrate`
3. Apply Supabase policies/functions manually (SQL files in root directory)
4. Test RLS policies with integration tests

**Chat System Setup**:
The chat system requires manual database setup via Supabase SQL editor. Use `simple_chat_setup.sql` in the project root to create the `chat_messages` table with proper RLS policies and helper functions.

## Security Considerations

**Row Level Security**: All database access goes through RLS policies. Never bypass with admin client unless absolutely necessary for setup operations.

**Function Security**: Database functions use `SECURITY DEFINER` with explicit `SET search_path = 'public'` to prevent SQL injection.

**Token Management**: JWT tokens stored in HTTP-only cookies, validated on every request and socket connection.

**Socket Authentication**: Mandatory authentication state machine prevents undefined userId/username states. All game events require authenticated user context with 5-second timeout enforcement, message queuing, and automatic disconnection for failed authentication.

## Common Issues

**User Creation Failures**: Usually indicates RLS policy conflicts or missing database triggers. Check trigger exists and profile table permissions allow INSERT for authenticated users.

**Socket Disconnection**: Game cleanup logic in disconnect handlers prevents orphaned games. Host reassignment automatically occurs when host leaves.

**Database Function Errors**: Ensure functions have proper `search_path` settings and correct permissions granted to `authenticated` role.