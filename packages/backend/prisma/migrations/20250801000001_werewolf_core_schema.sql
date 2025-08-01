-- Werewolf Game Core Schema Migration
-- This migration creates the foundational database structure for the werewolf pack system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('ALPHA', 'BETA', 'OMEGA', 'HUNTER', 'HEALER', 'SCOUT', 'GUARDIAN', 'CIVILIAN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'DORMANT', 'TRANSFORMED', 'BANISHED', 'DECEASED');
CREATE TYPE pack_status AS ENUM ('ACTIVE', 'DORMANT', 'DISBANDED', 'RECRUITING', 'WARRING');
CREATE TYPE moon_phase AS ENUM ('NEW', 'WAXING_CRESCENT', 'FIRST_QUARTER', 'WAXING_GIBBOUS', 'FULL', 'WANING_GIBBOUS', 'LAST_QUARTER', 'WANING_CRESCENT');
CREATE TYPE territory_status AS ENUM ('CONTROLLED', 'CONTESTED', 'NEUTRAL', 'ABANDONED');
CREATE TYPE terrain_type AS ENUM ('FOREST', 'MOUNTAIN', 'PLAINS', 'SWAMP', 'URBAN', 'COASTAL', 'DESERT');
CREATE TYPE transformation_trigger AS ENUM ('MOON_PHASE', 'EMOTIONAL', 'VOLUNTARY', 'FORCED', 'TERRITORIAL');
CREATE TYPE dispute_status AS ENUM ('PENDING', 'ACTIVE', 'RESOLVED', 'ESCALATED');
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'TRANSFORM', 'CLAIM_TERRITORY', 'JOIN_PACK', 'LEAVE_PACK');

-- Core Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role DEFAULT 'CIVILIAN',
    status user_status DEFAULT 'ACTIVE',
    pack_id UUID,
    pack_role user_role,
    
    -- Werewolf-specific attributes
    transformation_count INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    lunar_affinity DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0, affects transformation strength
    bloodline_power INTEGER DEFAULT 1, -- 1-10, affects abilities
    territory_claims INTEGER DEFAULT 0,
    
    -- Tracking fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    last_transformation TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
    
    -- Metadata
    preferences JSONB DEFAULT '{}',
    statistics JSONB DEFAULT '{}',
    
    CONSTRAINT users_reputation_range CHECK (reputation >= -1000 AND reputation <= 10000),
    CONSTRAINT users_lunar_affinity_range CHECK (lunar_affinity >= 0.0 AND lunar_affinity <= 1.0),
    CONSTRAINT users_bloodline_power_range CHECK (bloodline_power >= 1 AND bloodline_power <= 10)
);

-- Packs Table
CREATE TABLE packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    alpha_id UUID NOT NULL,
    status pack_status DEFAULT 'RECRUITING',
    
    -- Pack attributes
    member_limit INTEGER DEFAULT 12,
    reputation INTEGER DEFAULT 0,
    territory_count INTEGER DEFAULT 0,
    total_territory_size DECIMAL(10,2) DEFAULT 0, -- in km²
    
    -- Werewolf-specific
    moon_allegiance moon_phase DEFAULT 'FULL', -- Primary moon phase for pack power
    pack_strength INTEGER DEFAULT 1, -- 1-10, collective power rating
    hunting_success_rate DECIMAL(4,2) DEFAULT 0.5, -- 0.0 to 1.0
    
    -- Timestamps
    founded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    statistics JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    
    CONSTRAINT packs_member_limit_positive CHECK (member_limit > 0),
    CONSTRAINT packs_reputation_range CHECK (reputation >= -5000 AND reputation <= 50000),
    CONSTRAINT packs_pack_strength_range CHECK (pack_strength >= 1 AND pack_strength <= 10),
    CONSTRAINT packs_hunting_success_range CHECK (hunting_success_rate >= 0.0 AND hunting_success_rate <= 1.0)
);

-- Territories Table with PostGIS support
CREATE TABLE territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Geographic data
    coordinates GEOMETRY(POLYGON, 4326) NOT NULL, -- PostGIS polygon for territory boundaries
    center_point GEOMETRY(POINT, 4326), -- Center point for quick distance calculations
    size_km2 DECIMAL(10,2) NOT NULL, -- Territory size in km²
    terrain terrain_type DEFAULT 'FOREST',
    
    -- Ownership and status
    claimed_by_pack_id UUID,
    status territory_status DEFAULT 'NEUTRAL',
    claimed_at TIMESTAMP WITH TIME ZONE,
    
    -- Territory attributes
    strategic_value INTEGER DEFAULT 1, -- 1-10, affects pack reputation
    defense_bonus INTEGER DEFAULT 0, -- Percentage bonus for defending pack
    hunting_bonus INTEGER DEFAULT 0, -- Percentage bonus for hunting activities
    resource_richness INTEGER DEFAULT 5, -- 1-10, affects territory value
    population INTEGER DEFAULT 0, -- Human population in territory
    
    -- Dispute tracking
    disputed BOOLEAN DEFAULT FALSE,
    dispute_count INTEGER DEFAULT 0,
    last_disputed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    features JSONB DEFAULT '{}', -- Natural features, landmarks, etc.
    
    CONSTRAINT territories_size_positive CHECK (size_km2 > 0),
    CONSTRAINT territories_strategic_value_range CHECK (strategic_value >= 1 AND strategic_value <= 10),
    CONSTRAINT territories_defense_bonus_range CHECK (defense_bonus >= 0 AND defense_bonus <= 100),
    CONSTRAINT territories_hunting_bonus_range CHECK (hunting_bonus >= 0 AND hunting_bonus <= 100),
    CONSTRAINT territories_resource_richness_range CHECK (resource_richness >= 1 AND resource_richness <= 10),
    CONSTRAINT territories_population_positive CHECK (population >= 0)
);

-- Moon Phases Table
CREATE TABLE moon_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_name moon_phase NOT NULL,
    date DATE NOT NULL,
    
    -- Phase attributes
    luminosity DECIMAL(4,2) NOT NULL, -- 0.0 to 1.0, moon brightness
    transformation_modifier DECIMAL(3,2) DEFAULT 1.0, -- Multiplier for transformation effects
    duration_hours INTEGER DEFAULT 8, -- How long the phase lasts
    
    -- Astronomical data
    moonrise TIME,
    moonset TIME,
    angular_size DECIMAL(6,4), -- Apparent size of moon
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT moon_phases_date_phase_unique UNIQUE (date, phase_name),
    CONSTRAINT moon_phases_luminosity_range CHECK (luminosity >= 0.0 AND luminosity <= 1.0),
    CONSTRAINT moon_phases_transformation_modifier_range CHECK (transformation_modifier >= 0.1 AND transformation_modifier <= 3.0),
    CONSTRAINT moon_phases_duration_positive CHECK (duration_hours > 0)
);

-- Transformations Table (Partitioned by month for performance)
CREATE TABLE transformations (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    moon_phase_id UUID,
    
    -- Transformation details
    trigger_type transformation_trigger NOT NULL,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Transformation attributes
    intensity INTEGER DEFAULT 5, -- 1-10, how intense the transformation was
    control_level INTEGER DEFAULT 5, -- 1-10, how much control user had
    location GEOMETRY(POINT, 4326), -- Where transformation occurred
    territory_id UUID, -- Territory where transformation occurred
    
    -- Effects and consequences
    reputation_change INTEGER DEFAULT 0,
    injuries JSONB DEFAULT '[]',
    witnesses JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT transformations_intensity_range CHECK (intensity >= 1 AND intensity <= 10),
    CONSTRAINT transformations_control_level_range CHECK (control_level >= 1 AND control_level <= 10),
    CONSTRAINT transformations_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0)
) PARTITION BY RANGE (triggered_at);

-- Create partitions for transformations table (last 6 months + next 6 months)
CREATE TABLE transformations_2024_08 PARTITION OF transformations 
    FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
CREATE TABLE transformations_2024_09 PARTITION OF transformations 
    FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
CREATE TABLE transformations_2024_10 PARTITION OF transformations 
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE transformations_2024_11 PARTITION OF transformations 
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE transformations_2024_12 PARTITION OF transformations 
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
CREATE TABLE transformations_2025_01 PARTITION OF transformations 
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE transformations_2025_02 PARTITION OF transformations 
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Primary key constraints for partitioned table
ALTER TABLE transformations_2024_08 ADD PRIMARY KEY (id, triggered_at);
ALTER TABLE transformations_2024_09 ADD PRIMARY KEY (id, triggered_at);
ALTER TABLE transformations_2024_10 ADD PRIMARY KEY (id, triggered_at);
ALTER TABLE transformations_2024_11 ADD PRIMARY KEY (id, triggered_at);
ALTER TABLE transformations_2024_12 ADD PRIMARY KEY (id, triggered_at);
ALTER TABLE transformations_2025_01 ADD PRIMARY KEY (id, triggered_at);
ALTER TABLE transformations_2025_02 ADD PRIMARY KEY (id, triggered_at);

-- Pack Memberships Table (for tracking membership history)
CREATE TABLE pack_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    pack_id UUID NOT NULL,
    role user_role DEFAULT 'OMEGA',
    
    -- Membership details
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Performance tracking
    contributions JSONB DEFAULT '{}',
    achievements JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT pack_memberships_user_pack_active_unique UNIQUE (user_id, pack_id, is_active) 
        WHERE is_active = TRUE
);

-- Territory Disputes Table
CREATE TABLE territory_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    territory_id UUID NOT NULL,
    challenger_pack_id UUID NOT NULL,
    defender_pack_id UUID,
    
    -- Dispute details
    status dispute_status DEFAULT 'PENDING',
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_method VARCHAR(50), -- 'combat', 'negotiation', 'abandon', etc.
    
    -- Stakes and conditions
    stakes JSONB DEFAULT '{}',
    conditions JSONB DEFAULT '{}',
    
    -- Results
    winner_pack_id UUID,
    outcome JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT territory_disputes_different_packs CHECK (challenger_pack_id != defender_pack_id)
);

-- Pack Relations Table (alliances, rivalries, etc.)
CREATE TABLE pack_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pack_a_id UUID NOT NULL,
    pack_b_id UUID NOT NULL,
    
    -- Relationship details
    relation_type VARCHAR(20) NOT NULL, -- 'alliance', 'rivalry', 'neutral', 'war'
    strength INTEGER DEFAULT 1, -- 1-10, strength of relationship
    
    -- History
    established_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    history JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT pack_relations_different_packs CHECK (pack_a_id != pack_b_id),
    CONSTRAINT pack_relations_unique_pair UNIQUE (pack_a_id, pack_b_id),
    CONSTRAINT pack_relations_strength_range CHECK (strength >= 1 AND strength <= 10)
);

-- Achievements/Badges System
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'transformation', 'territory', 'pack', 'combat', etc.
    
    -- Achievement criteria
    criteria JSONB NOT NULL, -- JSON structure defining unlock conditions
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    points INTEGER DEFAULT 10, -- Points awarded for achievement
    
    -- Visual
    icon_url VARCHAR(255),
    badge_color VARCHAR(7), -- Hex color code
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT achievements_points_positive CHECK (points > 0)
);

-- User Achievements Table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    
    -- Achievement details
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress JSONB DEFAULT '{}', -- For multi-step achievements
    
    -- Context
    context JSONB DEFAULT '{}', -- What triggered the achievement
    
    CONSTRAINT user_achievements_unique UNIQUE (user_id, achievement_id)
);

-- Audit Log Table (for all data modifications)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    
    -- User context
    user_id UUID,
    user_ip INET,
    user_agent TEXT,
    
    -- Change details
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Context
    context JSONB DEFAULT '{}',
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_pack_id 
    FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE SET NULL;

ALTER TABLE packs ADD CONSTRAINT fk_packs_alpha_id 
    FOREIGN KEY (alpha_id) REFERENCES users(id) ON DELETE RESTRICT;

ALTER TABLE territories ADD CONSTRAINT fk_territories_claimed_by_pack_id 
    FOREIGN KEY (claimed_by_pack_id) REFERENCES packs(id) ON DELETE SET NULL;

ALTER TABLE transformations ADD CONSTRAINT fk_transformations_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE transformations ADD CONSTRAINT fk_transformations_moon_phase_id 
    FOREIGN KEY (moon_phase_id) REFERENCES moon_phases(id) ON DELETE SET NULL;

ALTER TABLE transformations ADD CONSTRAINT fk_transformations_territory_id 
    FOREIGN KEY (territory_id) REFERENCES territories(id) ON DELETE SET NULL;

ALTER TABLE pack_memberships ADD CONSTRAINT fk_pack_memberships_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE pack_memberships ADD CONSTRAINT fk_pack_memberships_pack_id 
    FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE;

ALTER TABLE territory_disputes ADD CONSTRAINT fk_territory_disputes_territory_id 
    FOREIGN KEY (territory_id) REFERENCES territories(id) ON DELETE CASCADE;

ALTER TABLE territory_disputes ADD CONSTRAINT fk_territory_disputes_challenger_pack_id 
    FOREIGN KEY (challenger_pack_id) REFERENCES packs(id) ON DELETE CASCADE;

ALTER TABLE territory_disputes ADD CONSTRAINT fk_territory_disputes_defender_pack_id 
    FOREIGN KEY (defender_pack_id) REFERENCES packs(id) ON DELETE CASCADE;

ALTER TABLE territory_disputes ADD CONSTRAINT fk_territory_disputes_winner_pack_id 
    FOREIGN KEY (winner_pack_id) REFERENCES packs(id) ON DELETE SET NULL;

ALTER TABLE pack_relations ADD CONSTRAINT fk_pack_relations_pack_a_id 
    FOREIGN KEY (pack_a_id) REFERENCES packs(id) ON DELETE CASCADE;

ALTER TABLE pack_relations ADD CONSTRAINT fk_pack_relations_pack_b_id 
    FOREIGN KEY (pack_b_id) REFERENCES packs(id) ON DELETE CASCADE;

ALTER TABLE user_achievements ADD CONSTRAINT fk_user_achievements_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_achievements ADD CONSTRAINT fk_user_achievements_achievement_id 
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE;