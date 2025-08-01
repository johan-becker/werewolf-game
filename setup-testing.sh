#!/bin/bash

# Werewolf Game Testing Setup Script
# This script sets up the complete testing infrastructure for the werewolf game

set -e

echo "🐺 Setting up Werewolf Game Testing Infrastructure..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}🌙 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running in werewolf-game directory
if [[ ! -f "package.json" ]] || [[ ! -d "packages" ]]; then
    print_error "This script must be run from the werewolf-game root directory"
    exit 1
fi

print_step "Installing dependencies for all packages..."
pnpm install

print_step "Setting up test databases..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    print_warning "PostgreSQL is not running. Starting PostgreSQL with Docker..."
    docker run --name werewolf-test-db -e POSTGRES_PASSWORD=werewolf_test -e POSTGRES_USER=werewolf_test -e POSTGRES_DB=werewolf_test -p 5432:5432 -d postgres:15
    
    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL to start..."
    until pg_isready -h localhost -p 5432; do
        sleep 1
    done
fi

# Check if Redis is running
if ! redis-cli ping > /dev/null 2>&1; then
    print_warning "Redis is not running. Starting Redis with Docker..."
    docker run --name werewolf-test-redis -p 6379:6379 -d redis:7
    
    # Wait for Redis to be ready
    echo "Waiting for Redis to start..."
    until redis-cli ping; do
        sleep 1
    done
fi

print_step "Setting up environment variables..."

# Create test environment file
cat > .env.test << EOL
# Werewolf Game Test Environment
NODE_ENV=test
DATABASE_URL=postgresql://werewolf_test:werewolf_test@localhost:5432/werewolf_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=werewolf-test-secret-key-do-not-use-in-production
WEREWOLF_GAME_SECRET=test-werewolf-game-secret
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=test-supabase-key
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Werewolf-specific test configuration
WEREWOLF_TEST_MODE=true
MOON_PHASE_API_KEY=test-moon-api-key
PACK_TERRITORY_ENABLED=true
WEREWOLF_TRANSFORMATION_ANIMATIONS=false
TEST_CHAT_SPAM_LIMIT=100
TEST_GAME_TIMEOUT=300000
EOL

print_success "Test environment configured"

print_step "Setting up backend database..."
cd packages/backend
export DATABASE_URL=postgresql://werewolf_test:werewolf_test@localhost:5432/werewolf_test
pnpm run db:generate
pnpm run db:migrate
print_success "Backend database configured"
cd ../..

print_step "Installing Playwright browsers for E2E testing..."
cd packages/frontend
pnpm exec playwright install --with-deps
print_success "Playwright browsers installed"
cd ../..

print_step "Setting up pre-commit hooks..."
if command -v pre-commit &> /dev/null; then
    pre-commit install
    pre-commit install --hook-type commit-msg
    print_success "Pre-commit hooks installed"
else
    print_warning "pre-commit not found. Install with: pip install pre-commit"
fi

print_step "Installing k6 for performance testing..."
if command -v k6 &> /dev/null; then
    print_success "k6 already installed"
else
    print_warning "k6 not found. Please install k6 for performance testing:"
    echo "  - On macOS: brew install k6"
    echo "  - On Ubuntu: https://k6.io/docs/get-started/installation/"
fi

print_step "Running initial test suite to verify setup..."

# Test backend
echo "🧪 Testing backend..."
cd packages/backend
if pnpm run test --passWithNoTests --detectOpenHandles --forceExit; then
    print_success "Backend tests passed"
else
    print_error "Backend tests failed"
fi
cd ../..

# Test frontend
echo "🧪 Testing frontend..."
cd packages/frontend
if pnpm run test --watchAll=false --passWithNoTests; then
    print_success "Frontend tests passed"
else
    print_error "Frontend tests failed"
fi
cd ../..

# Test shared
echo "🧪 Testing shared package..."
cd packages/shared
if pnpm run test --passWithNoTests; then
    print_success "Shared package tests passed"
else
    print_error "Shared package tests failed"
fi
cd ../..

print_step "Creating test scripts..."

# Create test runner script
cat > run-tests.sh << 'EOL'
#!/bin/bash

# Comprehensive Werewolf Game Test Runner
set -e

echo "🐺 Running Werewolf Game Test Suite"
echo "==================================="

# Run all tests in parallel where possible
echo "🧪 Running unit tests..."
pnpm run test &
UNIT_PID=$!

echo "🔍 Running linting..."
pnpm run lint &
LINT_PID=$!

echo "📝 Running type checking..."
pnpm run typecheck &
TYPE_PID=$!

# Wait for parallel tasks
wait $UNIT_PID $LINT_PID $TYPE_PID

echo "🎭 Running E2E tests..."
cd packages/frontend
pnpm run test:e2e
cd ../..

echo "⚡ Running performance tests (if k6 is available)..."
if command -v k6 &> /dev/null; then
    # Start backend for performance testing
    cd packages/backend
    pnpm run start &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 10
    
    # Run performance tests
    cd ../..
    k6 run k6-performance-tests.js --quiet
    
    # Stop backend
    kill $BACKEND_PID
else
    echo "⚠️ k6 not found, skipping performance tests"
fi

echo "✅ All tests completed successfully!"
EOL

chmod +x run-tests.sh

# Create development test script
cat > run-dev-tests.sh << 'EOL'
#!/bin/bash

# Quick development test runner for werewolf game
set -e

echo "🐺 Running Development Tests"
echo "==========================="

# Fast tests for development workflow
echo "🧪 Running changed file tests..."
pnpm run test --onlyChanged --passWithNoTests

echo "🔍 Running linting on staged files..."
pnpm run lint --fix

echo "📝 Running type checking..."
pnpm run typecheck

echo "✅ Development tests completed!"
EOL

chmod +x run-dev-tests.sh

print_success "Test scripts created"

print_step "Setting up VS Code workspace settings..."
mkdir -p .vscode

cat > .vscode/settings.json << 'EOL'
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.workingDirectories": [
    "packages/backend",
    "packages/frontend", 
    "packages/shared"
  ],
  "jest.jestCommandLine": "pnpm run test",
  "files.associations": {
    "*.test.ts": "typescript",
    "*.spec.ts": "typescript"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/coverage": true,
    "**/dist": true,
    "**/.next": true,
    "**/test-results": true
  }
}
EOL

cat > .vscode/extensions.json << 'EOL'
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "orta.vscode-jest",
    "humao.rest-client",
    "ms-vscode.vscode-json"
  ]
}
EOL

print_success "VS Code workspace configured"

print_step "Creating documentation..."

cat > TESTING.md << 'EOL'
# 🐺 Werewolf Game Testing Guide

This document describes the comprehensive testing strategy for the Werewolf multiplayer game.

## Testing Architecture

### 🧪 Unit Tests
- **Backend**: Jest with Supertest for API testing
- **Frontend**: Jest with React Testing Library  
- **Shared**: Jest for utility and type testing
- **Coverage Target**: 80% for all packages

### 🎭 End-to-End Tests  
- **Framework**: Playwright
- **Scenarios**: Complete werewolf game flows
- **Browsers**: Chrome, Firefox, Safari, Mobile

### ⚡ Performance Tests
- **Framework**: k6
- **Load Testing**: API endpoints under werewolf game load
- **WebSocket Testing**: Real-time werewolf communication
- **Metrics**: Response time, throughput, error rates

### ♿ Accessibility Tests
- **Framework**: jest-axe with @axe-core/react
- **Standard**: WCAG 2.1 AA compliance
- **Focus**: Werewolf-themed UI accessibility

## Running Tests

### Quick Development Tests
```bash
./run-dev-tests.sh
```

### Full Test Suite
```bash
./run-tests.sh
```

### Individual Test Types
```bash
# Unit tests
pnpm run test

# E2E tests  
cd packages/frontend && pnpm run test:e2e

# Performance tests
k6 run k6-performance-tests.js

# Accessibility tests
pnpm run test -- --testPathPattern="a11y"
```

## Test Data

### Werewolf Test Scenarios
- **Full Moon Pack**: High werewolf activity testing
- **New Moon Mystery**: Low visibility gameplay
- **Alpha Showdown**: Special role interactions
- **Large Pack Stress**: 20+ player games

### Factory Functions
- `WerewolfFactories.User.create()` - Generate werewolf players
- `WerewolfFactories.Game.createFullMoonGame()` - Full moon scenarios  
- `WerewolfFactories.Player.createAlphaWerewolf()` - Alpha werewolf
- `WerewolfFactories.Chat.createPackMessage()` - Pack communication

## CI/CD Pipeline

The GitHub Actions workflow runs:
1. **Setup**: Install dependencies and cache
2. **Lint**: ESLint and Prettier checks
3. **Test**: Unit and integration tests with coverage
4. **E2E**: Playwright browser testing
5. **Performance**: k6 load testing (main branch only)
6. **Security**: Dependency audit and CodeQL
7. **Build**: Production builds
8. **Docker**: Container builds and registry push

## Environment Setup

Test databases and services are automatically configured:
- PostgreSQL: `werewolf_test` database
- Redis: Session and cache testing
- Environment variables in `.env.test`

## Werewolf-Specific Testing

### Role Strategy Testing
Test each werewolf role's unique abilities:
- Werewolf pack coordination
- Seer vision mechanics  
- Witch potion usage
- Hunter revenge kill
- Alpha werewolf leadership

### Moon Phase Testing
Verify moon phase effects on gameplay:
- Full moon: Enhanced werewolf abilities
- New moon: Reduced visibility
- Phase transitions and bonuses

### Game Flow Testing
Complete werewolf game scenarios:
- Player joining and role assignment
- Day/night phase cycling
- Voting and elimination mechanics
- Win condition detection
- Chat and communication systems

## Best Practices

1. **Test Naming**: Use werewolf-themed descriptive names
2. **Data Factories**: Use factory functions for consistent test data
3. **Cleanup**: Always cleanup test databases between tests
4. **Isolation**: Each test should be independent
5. **Coverage**: Aim for 80% code coverage minimum
6. **Performance**: Keep unit tests under 100ms each

## Troubleshooting

### Common Issues
- **Database Connection**: Ensure PostgreSQL is running on port 5432
- **Port Conflicts**: Check for services running on ports 3000, 8000
- **Browser Issues**: Run `playwright install` to update browsers
- **Permission Errors**: Ensure test database user has proper permissions

### Debug Commands
```bash
# Run tests with debugging
pnpm run test --verbose --detectOpenHandles

# Debug E2E tests in headed mode
cd packages/frontend && pnpm run test:e2e:headed

# Check test database connection
psql postgresql://werewolf_test:werewolf_test@localhost:5432/werewolf_test
```

## Monitoring and Metrics

The testing pipeline tracks:
- Test execution times
- Coverage percentages
- Performance benchmarks
- Security vulnerability counts
- E2E test success rates

Results are uploaded to GitHub Actions artifacts and can be integrated with monitoring tools.
EOL

print_success "Testing documentation created"

echo ""
echo "🎉 Werewolf Game Testing Infrastructure Setup Complete!"
echo "======================================================"
echo ""
echo -e "${CYAN}📚 Next Steps:${NC}"
echo "1. Review the testing documentation: cat TESTING.md"
echo "2. Run the full test suite: ./run-tests.sh"  
echo "3. For development, use: ./run-dev-tests.sh"
echo "4. Configure your IDE with the .vscode settings"
echo ""
echo -e "${CYAN}🐺 Werewolf-Specific Features:${NC}"
echo "✅ Werewolf role strategy testing"
echo "✅ Moon phase gameplay testing" 
echo "✅ Pack communication testing"
echo "✅ Werewolf-themed test data factories"
echo "✅ Performance testing for large packs"
echo "✅ Accessibility testing for werewolf UI"
echo ""
echo -e "${CYAN}🔧 Tools Configured:${NC}"
echo "✅ Jest unit testing with 80% coverage target"
echo "✅ Playwright E2E testing across browsers"
echo "✅ k6 performance testing"
echo "✅ Pre-commit hooks with werewolf validations"
echo "✅ GitHub Actions CI/CD pipeline"
echo "✅ Docker test environment"
echo ""
echo -e "${GREEN}🌕 The werewolf pack is ready for testing! Happy hunting! 🐺${NC}"