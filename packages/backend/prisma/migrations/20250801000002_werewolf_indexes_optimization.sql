-- Performance Optimization: Indexes and Query Optimization
-- This migration creates composite indexes for common query patterns and performance optimization

-- Users table indexes
CREATE INDEX CONCURRENTLY idx_users_pack_id ON users(pack_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_status_role ON users(status, role) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_reputation_desc ON users(reputation DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_transformation_count_desc ON users(transformation_count DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_last_login ON users(last_login DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_last_transformation ON users(last_transformation DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_lunar_affinity ON users(lunar_affinity DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_username_trgm ON users USING gin(username gin_trgm_ops) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_email_trgm ON users USING gin(email gin_trgm_ops) WHERE deleted_at IS NULL;

-- Packs table indexes
CREATE INDEX CONCURRENTLY idx_packs_alpha_id ON packs(alpha_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_packs_status ON packs(status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_packs_reputation_desc ON packs(reputation DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_packs_territory_count_desc ON packs(territory_count DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_packs_moon_allegiance ON packs(moon_allegiance) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_packs_pack_strength_desc ON packs(pack_strength DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_packs_founded_at_desc ON packs(founded_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_packs_name_trgm ON packs USING gin(name gin_trgm_ops) WHERE deleted_at IS NULL;

-- Territories table indexes (including spatial indexes)
CREATE INDEX CONCURRENTLY idx_territories_claimed_by_pack_id ON territories(claimed_by_pack_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_territories_status ON territories(status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_territories_terrain ON territories(terrain) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_territories_strategic_value_desc ON territories(strategic_value DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_territories_size_desc ON territories(size_km2 DESC) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_territories_disputed ON territories(disputed) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_territories_coordinates_gist ON territories USING gist(coordinates);
CREATE INDEX CONCURRENTLY idx_territories_center_point_gist ON territories USING gist(center_point);
CREATE INDEX CONCURRENTLY idx_territories_name_trgm ON territories USING gin(name gin_trgm_ops) WHERE deleted_at IS NULL;

-- Composite indexes for common territory queries
CREATE INDEX CONCURRENTLY idx_territories_pack_status ON territories(claimed_by_pack_id, status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_territories_terrain_strategic_value ON territories(terrain, strategic_value DESC) WHERE deleted_at IS NULL;

-- Moon phases table indexes
CREATE INDEX CONCURRENTLY idx_moon_phases_date_desc ON moon_phases(date DESC);
CREATE INDEX CONCURRENTLY idx_moon_phases_phase_name ON moon_phases(phase_name);
CREATE INDEX CONCURRENTLY idx_moon_phases_date_phase ON moon_phases(date, phase_name);
CREATE INDEX CONCURRENTLY idx_moon_phases_luminosity_desc ON moon_phases(luminosity DESC);
CREATE INDEX CONCURRENTLY idx_moon_phases_transformation_modifier_desc ON moon_phases(transformation_modifier DESC);

-- Transformations table indexes (applied to all partitions)
CREATE INDEX CONCURRENTLY idx_transformations_user_id ON transformations(user_id);
CREATE INDEX CONCURRENTLY idx_transformations_moon_phase_id ON transformations(moon_phase_id);
CREATE INDEX CONCURRENTLY idx_transformations_territory_id ON transformations(territory_id);
CREATE INDEX CONCURRENTLY idx_transformations_trigger_type ON transformations(trigger_type);
CREATE INDEX CONCURRENTLY idx_transformations_triggered_at_desc ON transformations(triggered_at DESC);
CREATE INDEX CONCURRENTLY idx_transformations_duration_desc ON transformations(duration_minutes DESC);
CREATE INDEX CONCURRENTLY idx_transformations_intensity_desc ON transformations(intensity DESC);
CREATE INDEX CONCURRENTLY idx_transformations_location_gist ON transformations USING gist(location);

-- Composite indexes for transformation analytics
CREATE INDEX CONCURRENTLY idx_transformations_user_triggered_at ON transformations(user_id, triggered_at DESC);
CREATE INDEX CONCURRENTLY idx_transformations_territory_triggered_at ON transformations(territory_id, triggered_at DESC) WHERE territory_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_transformations_trigger_intensity ON transformations(trigger_type, intensity DESC);

-- Pack memberships table indexes
CREATE INDEX CONCURRENTLY idx_pack_memberships_user_id ON pack_memberships(user_id);
CREATE INDEX CONCURRENTLY idx_pack_memberships_pack_id ON pack_memberships(pack_id);
CREATE INDEX CONCURRENTLY idx_pack_memberships_is_active ON pack_memberships(is_active);
CREATE INDEX CONCURRENTLY idx_pack_memberships_joined_at_desc ON pack_memberships(joined_at DESC);
CREATE INDEX CONCURRENTLY idx_pack_memberships_role ON pack_memberships(role);

-- Composite indexes for membership queries
CREATE INDEX CONCURRENTLY idx_pack_memberships_pack_active ON pack_memberships(pack_id, is_active);
CREATE INDEX CONCURRENTLY idx_pack_memberships_user_active ON pack_memberships(user_id, is_active);
CREATE INDEX CONCURRENTLY idx_pack_memberships_pack_role_active ON pack_memberships(pack_id, role, is_active);

-- Territory disputes table indexes
CREATE INDEX CONCURRENTLY idx_territory_disputes_territory_id ON territory_disputes(territory_id);
CREATE INDEX CONCURRENTLY idx_territory_disputes_challenger_pack_id ON territory_disputes(challenger_pack_id);
CREATE INDEX CONCURRENTLY idx_territory_disputes_defender_pack_id ON territory_disputes(defender_pack_id);
CREATE INDEX CONCURRENTLY idx_territory_disputes_status ON territory_disputes(status);
CREATE INDEX CONCURRENTLY idx_territory_disputes_initiated_at_desc ON territory_disputes(initiated_at DESC);
CREATE INDEX CONCURRENTLY idx_territory_disputes_winner_pack_id ON territory_disputes(winner_pack_id);

-- Composite indexes for dispute queries
CREATE INDEX CONCURRENTLY idx_territory_disputes_territory_status ON territory_disputes(territory_id, status);
CREATE INDEX CONCURRENTLY idx_territory_disputes_challenger_status ON territory_disputes(challenger_pack_id, status);

-- Pack relations table indexes
CREATE INDEX CONCURRENTLY idx_pack_relations_pack_a_id ON pack_relations(pack_a_id);
CREATE INDEX CONCURRENTLY idx_pack_relations_pack_b_id ON pack_relations(pack_b_id);
CREATE INDEX CONCURRENTLY idx_pack_relations_relation_type ON pack_relations(relation_type);
CREATE INDEX CONCURRENTLY idx_pack_relations_strength_desc ON pack_relations(strength DESC);
CREATE INDEX CONCURRENTLY idx_pack_relations_established_at_desc ON pack_relations(established_at DESC);

-- Achievements table indexes
CREATE INDEX CONCURRENTLY idx_achievements_category ON achievements(category);
CREATE INDEX CONCURRENTLY idx_achievements_rarity ON achievements(rarity);
CREATE INDEX CONCURRENTLY idx_achievements_points_desc ON achievements(points DESC);
CREATE INDEX CONCURRENTLY idx_achievements_name_trgm ON achievements USING gin(name gin_trgm_ops);

-- User achievements table indexes
CREATE INDEX CONCURRENTLY idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX CONCURRENTLY idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX CONCURRENTLY idx_user_achievements_earned_at_desc ON user_achievements(earned_at DESC);

-- Composite index for user achievement queries
CREATE INDEX CONCURRENTLY idx_user_achievements_user_earned ON user_achievements(user_id, earned_at DESC);

-- Audit logs table indexes
CREATE INDEX CONCURRENTLY idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX CONCURRENTLY idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX CONCURRENTLY idx_audit_logs_action ON audit_logs(action);
CREATE INDEX CONCURRENTLY idx_audit_logs_created_at_desc ON audit_logs(created_at DESC);

-- Composite indexes for audit queries
CREATE INDEX CONCURRENTLY idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_audit_logs_table_action_created ON audit_logs(table_name, action, created_at DESC);

-- Partial indexes for frequently filtered data
CREATE INDEX CONCURRENTLY idx_users_active_with_pack ON users(pack_id, role) 
    WHERE deleted_at IS NULL AND status = 'ACTIVE' AND pack_id IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_packs_active_recruiting ON packs(reputation DESC, founded_at DESC) 
    WHERE deleted_at IS NULL AND status IN ('ACTIVE', 'RECRUITING');

CREATE INDEX CONCURRENTLY idx_territories_available ON territories(strategic_value DESC, size_km2 DESC) 
    WHERE deleted_at IS NULL AND status IN ('NEUTRAL', 'ABANDONED');

CREATE INDEX CONCURRENTLY idx_territory_disputes_active ON territory_disputes(initiated_at DESC) 
    WHERE status IN ('PENDING', 'ACTIVE');

-- Functional indexes for JSON queries
CREATE INDEX CONCURRENTLY idx_users_preferences_theme ON users((preferences->>'theme')) 
    WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_territories_features_water ON territories(id) 
    WHERE deleted_at IS NULL AND features ? 'water_access';

-- Expression indexes for calculated fields
CREATE INDEX CONCURRENTLY idx_packs_power_rating ON packs((pack_strength * member_limit)) 
    WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_territories_value_density ON territories((strategic_value::decimal / size_km2)) 
    WHERE deleted_at IS NULL AND size_km2 > 0;