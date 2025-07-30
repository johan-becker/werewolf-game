# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a TypeScript-based real-time multiplayer werewolf game backend with dual database architecture (Prisma + Supabase). The system uses Supabase for authentication and Row Level Security (RLS), while supporting both REST APIs and Socket.IO for real-time gameplay.

### Key Architectural Patterns

**Dual Database Setup**: The project uses both Prisma ORM and Supabase client libraries. Supabase provides authentication, RLS policies, and database functions, while Prisma handles schema management and migrations.

**Security-First Design**: Database operations use Row Level Security (RLS) with separate admin and user clients. The `supabaseAdmin` client bypasses RLS for setup operations, while regular `supabase` client respects user permissions.

**Real-time Game Architecture**: Socket.IO handles real-time events with typed interfaces, room-based game isolation (`game:${gameId}`), and automatic cleanup on disconnect.

**Game Code System**: Uses 6-character alphanumeric codes excluding ambiguous characters (0, 1, I, O) for easy game joining.

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
5. Socket.IO uses same JWT for real-time connection auth

## Game Service Patterns

**Game Creation**: Uses `generateGameCode()` utility with collision detection
**Player Management**: Host transfer logic when original host leaves
**State Management**: Game phases (waiting, in_progress, finished) with validation
**Real-time Updates**: Socket events for joining, leaving, role assignments

## File Structure Significance

**Critical Service Files**:
- `src/services/authService.ts`: Supabase auth integration with error mapping
- `src/services/game.service.ts`: Core game operations using database functions
- `src/lib/supabase.ts`: Database client configuration and RLS patterns

**Socket Architecture**:
- `src/socket/index.ts`: Main Socket.IO server setup with authentication
- `src/socket/events/`: Event handlers for lobby and game phases
- `src/socket/middleware.ts`: JWT validation for socket connections

**Type System**:
- `src/types/`: Comprehensive TypeScript definitions for game state, auth, and socket events
- Strict typing for game phases, player roles, and API responses

## Development Workflow

**Adding Game Features**:
1. Update types in `src/types/game.types.ts`
2. Add database functions/policies if needed
3. Implement service layer methods
4. Create socket event handlers
5. Add REST endpoints in controllers
6. Test with `npx ts-node src/test-supabase.ts`

**Database Changes**:
1. Update Prisma schema
2. Run `npm run db:migrate`
3. Apply Supabase policies/functions manually
4. Test RLS policies with integration tests

## Security Considerations

**Row Level Security**: All database access goes through RLS policies. Never bypass with admin client unless absolutely necessary for setup operations.

**Function Security**: Database functions use `SECURITY DEFINER` with explicit `SET search_path = 'public'` to prevent SQL injection.

**Token Management**: JWT tokens stored in HTTP-only cookies, validated on every request and socket connection.

## Common Issues

**User Creation Failures**: Usually indicates RLS policy conflicts or missing database triggers. Check trigger exists and profile table permissions allow INSERT for authenticated users.

**Socket Disconnection**: Game cleanup logic in disconnect handlers prevents orphaned games. Host reassignment automatically occurs when host leaves.

**Database Function Errors**: Ensure functions have proper `search_path` settings and correct permissions granted to `authenticated` role.