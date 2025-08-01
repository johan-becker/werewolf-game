-- Materialized Views for Performance Optimization
-- These views pre-calculate expensive aggregations for fast querying

-- Pack Statistics Materialized View
CREATE MATERIALIZED VIEW pack_statistics AS
SELECT 
    p.id as pack_id,
    p.name as pack_name,
    p.alpha_id,
    u_alpha.username as alpha_username,
    p.status,
    p.reputation,
    p.founded_at,
    
    -- Member statistics
    COALESCE(member_counts.total_members, 0) as total_members,
    COALESCE(member_counts.active_members, 0) as active_members,
    COALESCE(member_counts.online_members, 0) as online_members,
    COALESCE(member_counts.avg_reputation, 0) as avg_member_reputation,
    
    -- Territory statistics
    COALESCE(territory_stats.territory_count, 0) as territory_count,
    COALESCE(territory_stats.total_territory_size, 0) as total_territory_size,
    COALESCE(territory_stats.avg_strategic_value, 0) as avg_strategic_value,
    COALESCE(territory_stats.disputed_territories, 0) as disputed_territories,
    
    -- Transformation statistics
    COALESCE(transform_stats.total_transformations, 0) as total_transformations,
    COALESCE(transform_stats.avg_transformation_intensity, 0) as avg_transformation_intensity,
    COALESCE(transform_stats.transformations_last_30_days, 0) as transformations_last_30_days,
    
    -- Combat statistics
    COALESCE(dispute_stats.disputes_won, 0) as disputes_won,
    COALESCE(dispute_stats.disputes_lost, 0) as disputes_lost,
    COALESCE(dispute_stats.disputes_active, 0) as disputes_active,
    
    -- Relations
    COALESCE(relation_stats.allies, 0) as ally_count,
    COALESCE(relation_stats.enemies, 0) as enemy_count,
    
    -- Calculated rankings
    RANK() OVER (ORDER BY p.reputation DESC) as reputation_rank,
    RANK() OVER (ORDER BY COALESCE(member_counts.total_members, 0) DESC) as size_rank,
    RANK() OVER (ORDER BY COALESCE(territory_stats.total_territory_size, 0) DESC) as territory_rank
    
FROM packs p
LEFT JOIN users u_alpha ON p.alpha_id = u_alpha.id

-- Member counts subquery
LEFT JOIN (
    SELECT 
        pm.pack_id,
        COUNT(*) as total_members,
        COUNT(CASE WHEN u.status = 'ACTIVE' THEN 1 END) as active_members,
        COUNT(CASE WHEN u.last_login > NOW() - INTERVAL '1 hour' THEN 1 END) as online_members,
        AVG(u.reputation) as avg_reputation
    FROM pack_memberships pm
    JOIN users u ON pm.user_id = u.id
    WHERE pm.is_active = TRUE AND u.deleted_at IS NULL
    GROUP BY pm.pack_id
) member_counts ON p.id = member_counts.pack_id

-- Territory statistics subquery
LEFT JOIN (
    SELECT 
        t.claimed_by_pack_id as pack_id,
        COUNT(*) as territory_count,
        SUM(t.size_km2) as total_territory_size,
        AVG(t.strategic_value) as avg_strategic_value,
        COUNT(CASE WHEN t.disputed = TRUE THEN 1 END) as disputed_territories
    FROM territories t
    WHERE t.deleted_at IS NULL 
        AND t.status = 'CONTROLLED' 
        AND t.claimed_by_pack_id IS NOT NULL
    GROUP BY t.claimed_by_pack_id
) territory_stats ON p.id = territory_stats.pack_id

-- Transformation statistics subquery
LEFT JOIN (
    SELECT 
        u.pack_id,
        COUNT(t.*) as total_transformations,
        AVG(t.intensity) as avg_transformation_intensity,
        COUNT(CASE WHEN t.triggered_at > NOW() - INTERVAL '30 days' THEN 1 END) as transformations_last_30_days
    FROM transformations t
    JOIN users u ON t.user_id = u.id
    WHERE u.pack_id IS NOT NULL
    GROUP BY u.pack_id
) transform_stats ON p.id = transform_stats.pack_id

-- Dispute statistics subquery
LEFT JOIN (
    SELECT 
        pack_id,
        SUM(disputes_won) as disputes_won,
        SUM(disputes_lost) as disputes_lost,
        SUM(disputes_active) as disputes_active
    FROM (
        SELECT 
            challenger_pack_id as pack_id,
            COUNT(CASE WHEN winner_pack_id = challenger_pack_id THEN 1 END) as disputes_won,
            COUNT(CASE WHEN winner_pack_id != challenger_pack_id AND winner_pack_id IS NOT NULL THEN 1 END) as disputes_lost,
            COUNT(CASE WHEN status IN ('PENDING', 'ACTIVE') THEN 1 END) as disputes_active
        FROM territory_disputes
        GROUP BY challenger_pack_id
        
        UNION ALL
        
        SELECT 
            defender_pack_id as pack_id,
            COUNT(CASE WHEN winner_pack_id = defender_pack_id THEN 1 END) as disputes_won,
            COUNT(CASE WHEN winner_pack_id != defender_pack_id AND winner_pack_id IS NOT NULL THEN 1 END) as disputes_lost,
            COUNT(CASE WHEN status IN ('PENDING', 'ACTIVE') THEN 1 END) as disputes_active
        FROM territory_disputes
        WHERE defender_pack_id IS NOT NULL
        GROUP BY defender_pack_id
    ) combined_disputes
    GROUP BY pack_id
) dispute_stats ON p.id = dispute_stats.pack_id

-- Relations statistics subquery
LEFT JOIN (
    SELECT 
        pack_id,
        COUNT(CASE WHEN relation_type = 'alliance' THEN 1 END) as allies,
        COUNT(CASE WHEN relation_type IN ('rivalry', 'war') THEN 1 END) as enemies
    FROM (
        SELECT pack_a_id as pack_id, relation_type FROM pack_relations
        UNION ALL
        SELECT pack_b_id as pack_id, relation_type FROM pack_relations
    ) all_relations
    GROUP BY pack_id
) relation_stats ON p.id = relation_stats.pack_id

WHERE p.deleted_at IS NULL;

-- User Statistics Materialized View
CREATE MATERIALIZED VIEW user_statistics AS
SELECT 
    u.id as user_id,
    u.username,
    u.role,
    u.status,
    u.pack_id,
    u.pack_role,
    u.reputation,
    u.transformation_count,
    u.lunar_affinity,
    u.bloodline_power,
    u.created_at,
    u.last_login,
    
    -- Pack information
    p.name as pack_name,
    p.reputation as pack_reputation,
    
    -- Transformation statistics
    COALESCE(transform_stats.avg_intensity, 0) as avg_transformation_intensity,
    COALESCE(transform_stats.avg_control, 0) as avg_transformation_control,
    COALESCE(transform_stats.transformations_last_30_days, 0) as transformations_last_30_days,
    COALESCE(transform_stats.voluntary_transformations, 0) as voluntary_transformations,
    COALESCE(transform_stats.forced_transformations, 0) as forced_transformations,
    
    -- Territory statistics
    COALESCE(territory_stats.territories_claimed, 0) as territories_claimed,
    COALESCE(territory_stats.total_territory_size, 0) as total_territory_size,
    
    -- Achievement statistics
    COALESCE(achievement_stats.total_achievements, 0) as total_achievements,
    COALESCE(achievement_stats.total_achievement_points, 0) as total_achievement_points,
    COALESCE(achievement_stats.legendary_achievements, 0) as legendary_achievements,
    
    -- Rankings
    RANK() OVER (ORDER BY u.reputation DESC) as reputation_rank,
    RANK() OVER (ORDER BY u.transformation_count DESC) as transformation_rank,
    RANK() OVER (ORDER BY COALESCE(achievement_stats.total_achievement_points, 0) DESC) as achievement_rank
    
FROM users u
LEFT JOIN packs p ON u.pack_id = p.id

-- Transformation statistics subquery
LEFT JOIN (
    SELECT 
        user_id,
        AVG(intensity) as avg_intensity,
        AVG(control_level) as avg_control,
        COUNT(CASE WHEN triggered_at > NOW() - INTERVAL '30 days' THEN 1 END) as transformations_last_30_days,
        COUNT(CASE WHEN trigger_type = 'VOLUNTARY' THEN 1 END) as voluntary_transformations,
        COUNT(CASE WHEN trigger_type = 'FORCED' THEN 1 END) as forced_transformations
    FROM transformations
    GROUP BY user_id
) transform_stats ON u.id = transform_stats.user_id

-- Territory statistics subquery  
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as territories_claimed,
        SUM(size_km2) as total_territory_size
    FROM (
        SELECT DISTINCT 
            au.user_id,
            t.id,
            t.size_km2
        FROM audit_logs au
        JOIN territories t ON au.record_id = t.id
        WHERE au.table_name = 'territories' 
            AND au.action = 'CLAIM_TERRITORY'
            AND au.user_id IS NOT NULL
    ) user_territories
    GROUP BY user_id
) territory_stats ON u.id = territory_stats.user_id

-- Achievement statistics subquery
LEFT JOIN (
    SELECT 
        ua.user_id,
        COUNT(*) as total_achievements,
        SUM(a.points) as total_achievement_points,
        COUNT(CASE WHEN a.rarity = 'legendary' THEN 1 END) as legendary_achievements
    FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.id
    GROUP BY ua.user_id
) achievement_stats ON u.id = achievement_stats.user_id

WHERE u.deleted_at IS NULL;

-- Territory Analytics Materialized View
CREATE MATERIALIZED VIEW territory_analytics AS
SELECT 
    t.id as territory_id,
    t.name,
    t.terrain,
    t.size_km2,
    t.strategic_value,
    t.defense_bonus,
    t.hunting_bonus,
    t.resource_richness,
    t.status,
    t.claimed_by_pack_id,
    t.disputed,
    t.dispute_count,
    
    -- Pack information
    p.name as controlling_pack_name,
    p.reputation as controlling_pack_reputation,
    
    -- Geographic statistics
    ST_Area(t.coordinates::geography) / 1000000 as actual_area_km2, -- PostGIS calculation
    ST_X(t.center_point) as longitude,
    ST_Y(t.center_point) as latitude,
    
    -- Transformation statistics
    COALESCE(transform_stats.transformation_count, 0) as transformation_count,
    COALESCE(transform_stats.avg_transformation_intensity, 0) as avg_transformation_intensity,
    COALESCE(transform_stats.transformations_last_30_days, 0) as transformations_last_30_days,
    
    -- Dispute history
    COALESCE(dispute_stats.total_disputes, 0) as total_disputes,
    COALESCE(dispute_stats.successful_defenses, 0) as successful_defenses,
    COALESCE(dispute_stats.lost_defenses, 0) as lost_defenses,
    COALESCE(dispute_stats.times_conquered, 0) as times_conquered,
    
    -- Calculated metrics
    (t.strategic_value::decimal / t.size_km2) as value_density,
    (t.defense_bonus + t.hunting_bonus + t.resource_richness) as total_bonus_score
    
FROM territories t
LEFT JOIN packs p ON t.claimed_by_pack_id = p.id

-- Transformation statistics subquery
LEFT JOIN (
    SELECT 
        territory_id,
        COUNT(*) as transformation_count,
        AVG(intensity) as avg_transformation_intensity,
        COUNT(CASE WHEN triggered_at > NOW() - INTERVAL '30 days' THEN 1 END) as transformations_last_30_days
    FROM transformations
    WHERE territory_id IS NOT NULL
    GROUP BY territory_id
) transform_stats ON t.id = transform_stats.territory_id

-- Dispute statistics subquery
LEFT JOIN (
    SELECT 
        territory_id,
        COUNT(*) as total_disputes,
        COUNT(CASE WHEN winner_pack_id = defender_pack_id THEN 1 END) as successful_defenses,
        COUNT(CASE WHEN winner_pack_id = challenger_pack_id THEN 1 END) as lost_defenses,
        COUNT(CASE WHEN winner_pack_id != defender_pack_id AND winner_pack_id IS NOT NULL THEN 1 END) as times_conquered
    FROM territory_disputes
    GROUP BY territory_id
) dispute_stats ON t.id = dispute_stats.territory_id

WHERE t.deleted_at IS NULL;

-- Moon Phase Impact Analysis View
CREATE MATERIALIZED VIEW moon_phase_analytics AS
SELECT 
    mp.id as moon_phase_id,
    mp.phase_name,
    mp.date,
    mp.luminosity,
    mp.transformation_modifier,
    
    -- Transformation statistics for this moon phase
    COALESCE(transform_stats.transformation_count, 0) as transformation_count,
    COALESCE(transform_stats.avg_intensity, 0) as avg_transformation_intensity,
    COALESCE(transform_stats.avg_control_level, 0) as avg_control_level,
    COALESCE(transform_stats.unique_users, 0) as unique_users_transformed,
    
    -- Territory activity during this moon phase
    COALESCE(territory_activity.disputes_initiated, 0) as disputes_initiated,
    COALESCE(territory_activity.territories_claimed, 0) as territories_claimed,
    
    -- Pack activity
    COALESCE(pack_activity.packs_formed, 0) as packs_formed,
    COALESCE(pack_activity.members_joined, 0) as members_joined,
    
    -- Calculated impact scores
    (mp.luminosity * mp.transformation_modifier * COALESCE(transform_stats.transformation_count, 0)) as impact_score
    
FROM moon_phases mp

-- Transformation statistics subquery
LEFT JOIN (
    SELECT 
        moon_phase_id,
        COUNT(*) as transformation_count,
        AVG(intensity) as avg_intensity,
        AVG(control_level) as avg_control_level,
        COUNT(DISTINCT user_id) as unique_users
    FROM transformations
    WHERE moon_phase_id IS NOT NULL
    GROUP BY moon_phase_id
) transform_stats ON mp.id = transform_stats.moon_phase_id

-- Territory activity subquery
LEFT JOIN (
    SELECT 
        DATE(td.initiated_at) as dispute_date,
        COUNT(CASE WHEN td.status = 'PENDING' THEN 1 END) as disputes_initiated,
        COUNT(CASE WHEN td.winner_pack_id = td.challenger_pack_id THEN 1 END) as territories_claimed
    FROM territory_disputes td
    GROUP BY DATE(td.initiated_at)
) territory_activity ON mp.date = territory_activity.dispute_date

-- Pack activity subquery
LEFT JOIN (
    SELECT 
        DATE(founded_at) as formation_date,
        COUNT(*) as packs_formed,
        0 as members_joined -- Placeholder, would need more complex query
    FROM packs
    WHERE deleted_at IS NULL
    GROUP BY DATE(founded_at)
) pack_activity ON mp.date = pack_activity.formation_date;

-- Create indexes on materialized views for better query performance
CREATE INDEX idx_pack_statistics_pack_id ON pack_statistics(pack_id);
CREATE INDEX idx_pack_statistics_reputation_rank ON pack_statistics(reputation_rank);
CREATE INDEX idx_pack_statistics_total_members_desc ON pack_statistics(total_members DESC);

CREATE INDEX idx_user_statistics_user_id ON user_statistics(user_id);
CREATE INDEX idx_user_statistics_pack_id ON user_statistics(pack_id);
CREATE INDEX idx_user_statistics_reputation_rank ON user_statistics(reputation_rank);

CREATE INDEX idx_territory_analytics_territory_id ON territory_analytics(territory_id);
CREATE INDEX idx_territory_analytics_controlling_pack_id ON territory_analytics(claimed_by_pack_id);
CREATE INDEX idx_territory_analytics_value_density_desc ON territory_analytics(value_density DESC);

CREATE INDEX idx_moon_phase_analytics_phase_name ON moon_phase_analytics(phase_name);
CREATE INDEX idx_moon_phase_analytics_date_desc ON moon_phase_analytics(date DESC);
CREATE INDEX idx_moon_phase_analytics_impact_score_desc ON moon_phase_analytics(impact_score DESC);

-- Create refresh functions for materialized views
CREATE OR REPLACE FUNCTION refresh_pack_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW pack_statistics;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_user_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_statistics;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_territory_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW territory_analytics;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_moon_phase_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW moon_phase_analytics;
END;
$$ LANGUAGE plpgsql;

-- Create a function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    PERFORM refresh_pack_statistics();
    PERFORM refresh_user_statistics();
    PERFORM refresh_territory_analytics();
    PERFORM refresh_moon_phase_analytics();
END;
$$ LANGUAGE plpgsql;