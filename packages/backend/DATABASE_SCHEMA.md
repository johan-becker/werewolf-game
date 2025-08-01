# Werewolf Game Database Schema Documentation

## Overview

This database schema supports a comprehensive werewolf pack dynamics and territorial system with the following core features:

- **Multi-tenant isolation** through Row Level Security (RLS)
- **Complete audit logging** for all data modifications
- **Soft delete** implementation for data recovery
- **Performance optimization** through strategic indexing and materialized views
- **Territory dispute resolution** system with combat mechanics
- **Achievement/badge system** with automatic progression tracking
- **PostGIS integration** for spatial territory management

## Core Architecture

### Database Engine
- **PostgreSQL 15+** with PostGIS extension
- **UUID primary keys** for all entities
- **JSONB fields** for flexible metadata storage
- **Partitioned tables** for high-volume time-series data
- **Materialized views** for performance-critical queries

### Security Model
- **Row Level Security (RLS)** on all tables
- **Multi-tenant isolation** by pack membership
- **Function-based security** with SECURITY DEFINER
- **Audit trail** for all data modifications
- **User context** preservation across sessions

## Core Tables

### Users (`users`)
Central user management with werewolf-specific attributes.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'CIVILIAN',
    status user_status DEFAULT 'ACTIVE',
    pack_id UUID,
    pack_role user_role,
    
    -- Werewolf attributes
    transformation_count INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    lunar_affinity DECIMAL(3,2) DEFAULT 0.5,
    bloodline_power INTEGER DEFAULT 1,
    territory_claims INTEGER DEFAULT 0,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);
```

**Key Features:**
- Soft delete with `deleted_at` timestamp
- Werewolf-specific attributes (lunar affinity, bloodline power)
- Pack membership and role tracking
- Reputation system integration
- Comprehensive constraint validation

### Packs (`packs`)
Pack management with territory and member statistics.

```sql
CREATE TABLE packs (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    alpha_id UUID NOT NULL,
    status pack_status DEFAULT 'RECRUITING',
    member_limit INTEGER DEFAULT 12,
    reputation INTEGER DEFAULT 0,
    
    -- Werewolf attributes
    moon_allegiance moon_phase DEFAULT 'FULL',
    pack_strength INTEGER DEFAULT 1,
    hunting_success_rate DECIMAL(4,2) DEFAULT 0.5,
    
    -- Territory statistics (auto-updated by triggers)
    territory_count INTEGER DEFAULT 0,
    total_territory_size DECIMAL(10,2) DEFAULT 0
);
```

**Key Features:**
- Alpha leadership model with foreign key constraint
- Moon phase allegiance affecting pack abilities
- Auto-calculated territory statistics via triggers
- Pack strength and hunting success metrics

### Territories (`territories`)
Spatial territory management with PostGIS integration.

```sql
CREATE TABLE territories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coordinates GEOMETRY(POLYGON, 4326) NOT NULL, -- PostGIS
    center_point GEOMETRY(POINT, 4326),
    size_km2 DECIMAL(10,2) NOT NULL,
    terrain terrain_type DEFAULT 'FOREST',
    
    -- Ownership
    claimed_by_pack_id UUID,
    status territory_status DEFAULT 'NEUTRAL',
    
    -- Attributes
    strategic_value INTEGER DEFAULT 1,
    defense_bonus INTEGER DEFAULT 0,
    hunting_bonus INTEGER DEFAULT 0,
    resource_richness INTEGER DEFAULT 5,
    
    -- Dispute tracking
    disputed BOOLEAN DEFAULT FALSE,
    dispute_count INTEGER DEFAULT 0
);
```

**Key Features:**
- PostGIS geometry support for complex territory shapes
- Strategic value and bonus system
- Dispute tracking with automatic flagging
- Terrain-based modifiers for combat and hunting

### Transformations (`transformations`)
Partitioned table for transformation tracking.

```sql
CREATE TABLE transformations (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    moon_phase_id UUID,
    trigger_type transformation_trigger NOT NULL,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Transformation details
    intensity INTEGER DEFAULT 5,
    control_level INTEGER DEFAULT 5,
    location GEOMETRY(POINT, 4326),
    territory_id UUID,
    
    -- Effects
    reputation_change INTEGER DEFAULT 0,
    injuries JSONB DEFAULT '[]',
    witnesses JSONB DEFAULT '[]'
) PARTITION BY RANGE (triggered_at);
```

**Key Features:**
- Monthly partitioning for performance
- Spatial location tracking
- Intensity and control level metrics
- Automatic reputation updates via triggers
- Comprehensive audit trail

## Advanced Features

### Territory Dispute Resolution

Complete dispute resolution system with multiple resolution methods:

- **Dispute Phases**: Initiated → Preparation → Negotiation/Combat → Resolution → Completed
- **Resolution Methods**: Combat, Negotiation, Arbitration, Abandon, Timeout
- **Combat System**: Participant-based with strength calculations and modifiers
- **Event Logging**: Complete chronological log of all dispute events

### Achievement System

Comprehensive badge/achievement system with automatic progression:

- **28+ Pre-defined Achievements** across 8 categories
- **Automatic Triggering** based on user actions
- **Progress Tracking** for multi-step achievements
- **Rarity System**: Common, Rare, Epic, Legendary
- **Points System** integrated with reputation

### Audit System

Complete audit logging with trigger-based automation:

```sql
-- Every table modification is logged
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    user_id UUID,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Features:**
- Automatic trigger-based logging
- User context preservation
- Changed field tracking
- IP and user agent logging
- Soft delete prevention

## Performance Optimizations

### Indexing Strategy

```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_users_pack_status_role ON users(pack_id, status, role);
CREATE INDEX idx_territories_pack_status ON territories(claimed_by_pack_id, status);
CREATE INDEX idx_transformations_user_triggered_at ON transformations(user_id, triggered_at DESC);

-- Spatial indexes for PostGIS
CREATE INDEX idx_territories_coordinates_gist ON territories USING gist(coordinates);
CREATE INDEX idx_territories_center_point_gist ON territories USING gist(center_point);

-- Full-text search indexes
CREATE INDEX idx_users_username_trgm ON users USING gin(username gin_trgm_ops);
CREATE INDEX idx_packs_name_trgm ON packs USING gin(name gin_trgm_ops);
```

### Materialized Views

Four materialized views for expensive aggregations:

1. **`pack_statistics`** - Pre-calculated pack metrics, rankings, and member counts
2. **`user_statistics`** - User performance metrics and rankings
3. **`territory_analytics`** - Territory value analysis and transformation statistics
4. **`moon_phase_analytics`** - Moon phase impact analysis on transformations and disputes

### Partitioning

- **Transformations table** partitioned by month for optimal time-series performance
- **Automatic partition creation** via scheduled jobs
- **Partition pruning** for improved query performance

## Security Implementation

### Row Level Security (RLS)

Comprehensive RLS policies ensure data isolation:

```sql
-- Users can only see pack members and their own data
CREATE POLICY users_select_policy ON users
    FOR SELECT
    USING (
        id = current_user_id() 
        OR same_pack_as_user(id)
        OR pack_id IS NULL
    );

-- Territory visibility based on pack ownership
CREATE POLICY territories_select_policy ON territories
    FOR SELECT
    USING (
        status IN ('NEUTRAL', 'ABANDONED')
        OR claimed_by_pack_id = current_user_pack_id()
        OR disputed = TRUE
    );
```

### Context Functions

Security context preserved through session variables:

```sql
-- Set user context for RLS
SELECT set_user_context('user-uuid-here');

-- Context functions used in policies
current_user_id() -> UUID
current_user_pack_id() -> UUID
current_user_role() -> user_role
same_pack_as_user(target_user_id) -> BOOLEAN
```

## Data Recovery

### Soft Delete Implementation

```sql
-- Soft delete prevents data loss
CREATE TRIGGER trigger_users_soft_delete 
    BEFORE DELETE ON users 
    FOR EACH ROW EXECUTE FUNCTION soft_delete();

-- Recovery function
SELECT restore_deleted_record('users', 'user-uuid-here');
```

### Audit Trail Recovery

Complete change history available through audit logs:

```sql
-- View all changes to a record
SELECT * FROM audit_logs 
WHERE table_name = 'users' AND record_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

## Territory Dispute System

### Dispute Lifecycle

1. **Initiation**: `initiate_territory_dispute(territory_id, challenger_pack_id)`
2. **Participation**: `join_dispute_as_participant(dispute_id, user_id, role)`
3. **Phase Advancement**: `advance_dispute_phase(dispute_id, new_phase, method)`
4. **Resolution**: `resolve_territory_dispute(dispute_id, winner_pack_id)`

### Combat Mechanics

```sql
-- Combat strength calculation
combat_strength = (bloodline_power * 5) + (reputation / 100) + (transformation_count / 10)

-- Combat modifiers
- Terrain bonus/penalty
- Moon phase effects
- Pack allegiance bonuses
- Territory defense bonuses
```

## Usage Examples

### Creating a New Pack

```sql
-- Set user context
SELECT set_user_context('user-uuid');

-- Create pack (RLS ensures user is alpha)
INSERT INTO packs (name, alpha_id, description) 
VALUES ('Shadow Runners', current_user_id(), 'A pack of the night');
```

### Claiming Territory

```sql
-- Claim neutral territory
UPDATE territories 
SET claimed_by_pack_id = current_user_pack_id(),
    status = 'CONTROLLED',
    claimed_at = NOW()
WHERE id = 'territory-uuid' AND status = 'NEUTRAL';
```

### Tracking Transformations

```sql
-- Record transformation (triggers automatic achievement checking)
INSERT INTO transformations (
    user_id, 
    trigger_type, 
    intensity, 
    control_level, 
    location, 
    territory_id
) VALUES (
    current_user_id(),
    'MOON_PHASE',
    8,
    7,
    ST_GeomFromText('POINT(-122.4194 37.7749)', 4326),
    'territory-uuid'
);
```

## Maintenance

### Materialized View Refresh

```sql
-- Refresh all views (run hourly)
SELECT refresh_all_materialized_views();

-- Refresh specific view
REFRESH MATERIALIZED VIEW pack_statistics;
```

### Cleanup Operations

```sql
-- Clean old audit logs (run monthly)
SELECT cleanup_old_audit_logs(365); -- Keep 1 year

-- Archive old transformation data
-- (Handled automatically by partition management)
```

## Migration Strategy

All migrations are versioned and can be applied sequentially:

1. `20250801000001_werewolf_core_schema.sql` - Core tables and types
2. `20250801000002_werewolf_indexes_optimization.sql` - Performance indexes
3. `20250801000003_werewolf_materialized_views.sql` - Analytical views
4. `20250801000004_werewolf_rls_policies.sql` - Security policies
5. `20250801000005_werewolf_audit_triggers.sql` - Audit and triggers
6. `20250801000006_werewolf_dispute_resolution.sql` - Dispute system
7. `20250801000007_werewolf_achievements_system.sql` - Achievement system

## Monitoring and Observability

### Key Metrics to Monitor

- **Active Transformations**: Current transformation rate
- **Territory Disputes**: Active dispute count and resolution rate
- **Pack Activity**: New pack creation and membership changes
- **Achievement Progression**: Achievement unlock rate
- **Database Performance**: Query performance on materialized views

### Health Checks

```sql
-- Check system health
SELECT 
    COUNT(*) as active_users,
    COUNT(DISTINCT pack_id) as active_packs,
    SUM(CASE WHEN disputed THEN 1 ELSE 0 END) as disputed_territories
FROM users 
WHERE deleted_at IS NULL AND status = 'ACTIVE';
```

This schema provides a robust foundation for a werewolf-themed application with enterprise-grade features including security, performance optimization, audit trails, and comprehensive game mechanics.