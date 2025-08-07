# Environment Setup Guide

This guide explains how to properly configure the environment for the Werewolf Game project.

## Critical Environment Configuration Fixes

This document addresses the critical issues identified in the code review:

### 1. Supabase Environment Variables (RESOLVED ✅)

**Issue**: Inconsistent environment variable naming between code and configuration files.
**Solution**: Standardized all references to use `SUPABASE_SERVICE_KEY`.

**Files Updated:**
- `/packages/backend/src/lib/supabase.ts` - Uses consistent variable name
- `/packages/backend/src/config/app.config.ts` - Updated schema and getters
- `/.env.example` - Fixed variable name
- `/docker-compose.yml` - Updated environment mapping
- `/.github/workflows/ci.yml` - Updated CI configuration
- `/.github/workflows/docker.yml` - Updated Docker workflow
- `/packages/backend/README.md` - Updated documentation

### 2. Deprecated NPM Configuration (RESOLVED ✅)

**Issue**: Deprecated `use-node-version` in `.npmrc` will break in next npm major version.
**Solution**: Replaced with informative comment about alternatives.

**File Updated:**
- `/.npmrc` - Removed deprecated option

### 3. Environment Files Created (NEW ✅)

Created proper environment configuration files:
- `/.env` - Root environment file with development defaults
- `/packages/backend/.env` - Backend-specific environment
- `/packages/backend/.env.test` - Test environment configuration
- `/packages/backend/.env.example` - Backend environment template

## Environment Variable Reference

### Supabase Configuration
```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_KEY="your-supabase-service-role-key"  # ✅ Consistent naming
```

### Database Configuration
```bash
DATABASE_URL="postgresql://werewolf_user:werewolf_password@localhost:5432/werewolf_game"
REDIS_URL="redis://localhost:6379"
```

### Security Configuration
```bash
JWT_SECRET="your-super-secret-jwt-key-here-at-least-32-characters"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-at-least-32-characters"
SESSION_SECRET="your-super-secret-session-key-here-at-least-32-characters"
```

## Setup Instructions

### 1. Copy Environment Files
```bash
# Root level
cp .env.example .env

# Backend
cp packages/backend/.env.example packages/backend/.env
```

### 2. Configure Supabase
1. Create a Supabase project at https://supabase.com
2. Get your project URL and keys from the Supabase dashboard
3. Update the environment files with your actual Supabase values:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_ANON_KEY`: Anonymous/public key
   - `SUPABASE_SERVICE_KEY`: Service role key (keep secret!)

### 3. Generate Secrets
```bash
# Generate random secrets (Linux/macOS)
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
openssl rand -base64 32  # For SESSION_SECRET
```

### 4. Database Setup
```bash
# Start PostgreSQL and Redis with Docker
docker-compose up postgres redis -d

# Run database migrations
cd packages/backend
npm run db:migrate
```

### 5. Verification
```bash
# Test environment loading
node -e "require('dotenv').config(); console.log('✅ Environment loaded successfully');"

# Test builds
npm run build

# Test backend
cd packages/backend && npm test

# Test frontend
cd packages/frontend && npm test
```

## CI/CD Configuration

### GitHub Secrets Required
Add these secrets to your GitHub repository:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` ✅ (Updated from old name)
- `JWT_SECRET`
- `DATABASE_URL`

### Docker Environment
The docker-compose files now use the correct environment variable names and will work seamlessly with the new configuration.

## Troubleshooting

### Common Issues

**"Cannot find module" or build failures**
- Ensure all environment files are created and populated
- Check that `SUPABASE_SERVICE_KEY` is set (not the old `SUPABASE_SERVICE_ROLE_KEY`)

**Database connection errors**
- Verify PostgreSQL is running and accessible
- Check DATABASE_URL format and credentials

**Supabase connection errors**
- Verify SUPABASE_URL is correct (includes https://)
- Check that SUPABASE_SERVICE_KEY has correct permissions
- Ensure RLS policies are properly configured

### Debug Commands
```bash
# Check environment variables
printenv | grep SUPABASE

# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Test Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
console.log('✅ Supabase client created successfully');
"
```

## Security Notes

- Never commit `.env` files to version control
- Use different secrets for each environment (dev/staging/production)
- Rotate secrets regularly, especially in production
- Use the least privileged Supabase keys possible
- Keep service role keys secure and never expose them to client-side code

## Testing Environment

For E2E tests, a separate test environment is configured:
- Uses in-memory or test databases
- Faster, less secure configurations for speed
- Isolated from development data
- Automatically cleaned up between test runs

The test environment is properly configured and all tests should now pass without environment-related errors.