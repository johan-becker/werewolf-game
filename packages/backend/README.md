# Werewolf Game Backend

Enterprise-grade Node.js backend with TypeScript, featuring comprehensive werewolf game mechanics, pack management, and territory control.

## 🏗️ Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM + Supabase
- **Authentication**: JWT with refresh token rotation + Redis session management
- **Real-time**: Socket.IO with authentication state machine
- **Security**: Argon2 password hashing, rate limiting, input validation
- **DI Container**: InversifyJS for dependency injection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis server
- Supabase project (optional)

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migration:run

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

## 🗄️ Database Management

### Migration Commands

```bash
# Check migration status
npm run migration:status

# Run pending migrations
npm run migration:run

# Create new migration
npm run migration:create add_new_feature

# Rollback last migration
npm run migration:rollback

# Validate database schema
npm run migration:validate

# Check database health
npm run migration:health

# Reset database (DANGEROUS!)
npm run migration reset --confirm-reset
```

### Migration Files

Migrations are stored in `src/migrations/` with corresponding rollback files in `src/migrations/rollbacks/`.

Each migration follows the naming pattern: `YYYYMMDDHHMMSS_migration_name.sql`

## 🎮 Game Features

### Werewolf Role System
- **Alpha**: Pack leader with full authority
- **Beta**: Second in command, trusted lieutenant
- **Omega**: Pack peace keeper and conflict resolver
- **Hunter**: Skilled tracker and warrior
- **Healer**: Pack medic and herbalist
- **Scout**: Territory explorer and messenger
- **Guardian**: Pack protector and defender
- **Pack Member**: Regular werewolf
- **Lone Wolf**: Independent werewolf
- **Cub**: Young werewolf in training
- **Elder**: Retired pack member with wisdom

### Pack Management
- Pack creation and hierarchy
- Territory claiming and disputes
- Member recruitment and challenges
- Leadership succession

### Moon Phase System
- Lunar calendar tracking
- Transformation events
- Ritual scheduling
- Eclipse events

## 🔐 Security Features

### Authentication
- Argon2id password hashing
- JWT access tokens (15 minutes)
- Refresh token rotation (7 days)
- Token family tracking for theft detection
- Redis-based token blacklisting

### Authorization
- Role-based access control (RBAC)
- Pack-based permissions
- Territory ownership validation
- Action-based permissions

### Input Validation
- Zod schema validation
- Request sanitization
- Rate limiting
- CORS configuration

## 📡 API Endpoints

### Authentication (`/api/auth/*`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Token refresh
- `POST /logout` - User logout
- `GET /me` - Current user profile
- `PUT /me` - Update profile

### Pack Management (`/api/packs/*`)
- `GET /` - List packs
- `POST /` - Create pack
- `GET /:id` - Get pack details
- `POST /:id/join` - Join pack
- `POST /:id/leave` - Leave pack
- `GET /:id/members` - Pack members

### Territory Management (`/api/territories/*`)
- `GET /` - List territories
- `POST /claim` - Claim territory
- `GET /nearby` - Nearby territories
- `POST /:id/patrol` - Log patrol
- `POST /:id/dispute` - File dispute

### Moon Phases (`/api/moon-phases/*`)
- `GET /current` - Current moon phase
- `GET /calendar` - Lunar calendar
- `POST /transformation-log` - Log transformation
- `GET /events` - Moon phase events

## 🔧 Development

### Project Structure
```
src/
├── cli/                 # Command-line tools
├── config/             # Configuration management
├── container/          # Dependency injection
├── controllers/        # Route handlers
├── interfaces/         # TypeScript interfaces
├── middleware/         # Express middleware
├── migrations/         # Database migrations
├── routes/            # API routes
├── services/          # Business logic
├── types/             # Type definitions
├── utils/             # Utility functions
└── validation/        # Request validation
```

### Available Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/werewolf"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret-32-chars-minimum"
JWT_REFRESH_SECRET="your-refresh-secret-32-chars"

# Supabase (optional)
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Server
NODE_ENV="development"
PORT=3000
WS_PORT=3001
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Test specific functionality
npm run test -- --grep "authentication"
```

## 📦 Production Deployment

### Docker

```bash
# Build production image
docker build -f Dockerfile -t werewolf-backend .

# Run with Docker Compose
docker-compose up -d
```

### Manual Deployment

```bash
# Build application
npm run build

# Run migrations
npm run migration:run

# Start production server
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Migration Errors**
   ```bash
   # Check migration status
   npm run migration:status
   
   # Validate schema
   npm run migration:validate
   ```

2. **Authentication Issues**
   - Verify JWT secrets are set
   - Check Redis connection
   - Validate token expiration times

3. **Database Connection**
   - Verify DATABASE_URL format
   - Check PostgreSQL server status
   - Validate database permissions

### Logging

Logs are written to:
- Console (development)
- `logs/app.log` (production)
- `logs/error.log` (errors only)

## 📄 License

MIT License - see LICENSE file for details.