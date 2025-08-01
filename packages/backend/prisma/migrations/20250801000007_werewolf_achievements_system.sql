-- Achievement/Badge System Implementation
-- This migration completes the achievement system with automatic triggers and werewolf-specific achievements

-- Create achievement triggers and categories
CREATE TYPE achievement_trigger_type AS ENUM (
    'TRANSFORMATION_COUNT',
    'TERRITORY_CLAIMED',
    'PACK_LEADERSHIP',
    'REPUTATION_MILESTONE',
    'COMBAT_VICTORY',
    'SURVIVAL_STREAK',
    'PACK_SIZE',
    'LUNAR_AFFINITY',
    'BLOODLINE_POWER',
    'SOCIAL_INTERACTION',
    'EXPLORATION',
    'SPECIAL_EVENT'
);

-- Enhanced achievements table with more detailed structure
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS trigger_type achievement_trigger_type;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS trigger_threshold INTEGER;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS prerequisite_achievements UUID[];
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS is_repeatable BOOLEAN DEFAULT FALSE;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS max_progress INTEGER;

-- Create achievement progress tracking table
CREATE TABLE achievement_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    
    -- Progress tracking
    current_progress INTEGER DEFAULT 0,
    max_progress INTEGER NOT NULL,
    progress_data JSONB DEFAULT '{}', -- Detailed progress information
    
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    milestone_data JSONB DEFAULT '{}',
    
    CONSTRAINT achievement_progress_user_achievement_unique UNIQUE (user_id, achievement_id),
    CONSTRAINT achievement_progress_valid_progress 
        CHECK (current_progress >= 0 AND current_progress <= max_progress)
);

-- Achievement categories table for better organization
CREATE TABLE achievement_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link achievements to categories
ALTER TABLE achievements ADD COLUMN category_id UUID;
ALTER TABLE achievements ADD CONSTRAINT fk_achievements_category_id 
    FOREIGN KEY (category_id) REFERENCES achievement_categories(id) ON DELETE SET NULL;

-- Add foreign key constraints for new tables
ALTER TABLE achievement_progress ADD CONSTRAINT fk_achievement_progress_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE achievement_progress ADD CONSTRAINT fk_achievement_progress_achievement_id 
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE;

-- Create indexes for achievement system
CREATE INDEX idx_achievement_progress_user_id ON achievement_progress(user_id);
CREATE INDEX idx_achievement_progress_achievement_id ON achievement_progress(achievement_id);
CREATE INDEX idx_achievement_progress_is_completed ON achievement_progress(is_completed);
CREATE INDEX idx_achievement_progress_last_updated_desc ON achievement_progress(last_updated DESC);

CREATE INDEX idx_achievements_trigger_type ON achievements(trigger_type);
CREATE INDEX idx_achievements_category_id ON achievements(category_id);
CREATE INDEX idx_achievements_is_hidden ON achievements(is_hidden);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);

-- Insert achievement categories
INSERT INTO achievement_categories (name, description, sort_order) VALUES
('Transformation', 'Achievements related to werewolf transformations and lunar cycles', 1),
('Territory', 'Achievements for claiming and defending territories', 2),
('Pack Leadership', 'Achievements for pack management and leadership', 3),
('Combat', 'Achievements for disputes and combat prowess', 4),
('Social', 'Achievements for pack interactions and relationships', 5),
('Exploration', 'Achievements for discovering new territories and features', 6),
('Reputation', 'Achievements for building reputation and influence', 7),
('Special Events', 'Rare achievements for unique circumstances', 8);

-- Insert comprehensive werewolf achievements
WITH category_ids AS (
    SELECT name, id FROM achievement_categories
)
INSERT INTO achievements (
    name, 
    description, 
    category_id, 
    criteria, 
    rarity, 
    points, 
    trigger_type, 
    trigger_threshold,
    max_progress,
    icon_url,
    badge_color
) VALUES
-- Transformation Achievements
('First Blood', 'Complete your first transformation', 
 (SELECT id FROM category_ids WHERE name = 'Transformation'),
 '{"type": "transformation_count", "threshold": 1}', 'common', 10, 'TRANSFORMATION_COUNT', 1, 1, '/badges/first-blood.png', '#DC2626'),

('Lunar Devotee', 'Transform 10 times during full moon phases', 
 (SELECT id FROM category_ids WHERE name = 'Transformation'),
 '{"type": "full_moon_transformations", "threshold": 10}', 'rare', 50, 'TRANSFORMATION_COUNT', 10, 10, '/badges/lunar-devotee.png', '#1E40AF'),

('Apex Predator', 'Achieve 100 total transformations', 
 (SELECT id FROM category_ids WHERE name = 'Transformation'),
 '{"type": "transformation_count", "threshold": 100}', 'epic', 100, 'TRANSFORMATION_COUNT', 100, 100, '/badges/apex-predator.png', '#7C2D12'),

('Master of Change', 'Complete 500 transformations', 
 (SELECT id FROM category_ids WHERE name = 'Transformation'),
 '{"type": "transformation_count", "threshold": 500}', 'legendary', 250, 'TRANSFORMATION_COUNT', 500, 500, '/badges/master-change.png', '#059669'),

('Controlled Beast', 'Maintain control level above 8 for 20 consecutive transformations', 
 (SELECT id FROM category_ids WHERE name = 'Transformation'),
 '{"type": "controlled_transformations", "threshold": 20, "min_control": 8}', 'epic', 150, 'TRANSFORMATION_COUNT', 20, 20, '/badges/controlled-beast.png', '#7C3AED'),

-- Territory Achievements
('Land Owner', 'Claim your first territory', 
 (SELECT id FROM category_ids WHERE name = 'Territory'),
 '{"type": "territories_claimed", "threshold": 1}', 'common', 20, 'TERRITORY_CLAIMED', 1, 1, '/badges/land-owner.png', '#16A34A'),

('Territory Baron', 'Control 5 territories simultaneously', 
 (SELECT id FROM category_ids WHERE name = 'Territory'),
 '{"type": "territories_controlled", "threshold": 5, "simultaneous": true}', 'rare', 75, 'TERRITORY_CLAIMED', 5, 5, '/badges/territory-baron.png', '#CA8A04'),

('Domain Lord', 'Control territories totaling over 100 km²', 
 (SELECT id FROM category_ids WHERE name = 'Territory'),
 '{"type": "territory_size", "threshold": 100, "unit": "km2"}', 'epic', 120, 'TERRITORY_CLAIMED', 100, 100, '/badges/domain-lord.png', '#DC2626'),

('Strategic Genius', 'Claim 3 territories with strategic value of 8 or higher', 
 (SELECT id FROM category_ids WHERE name = 'Territory'),
 '{"type": "high_value_territories", "threshold": 3, "min_strategic_value": 8}', 'epic', 100, 'TERRITORY_CLAIMED', 3, 3, '/badges/strategic-genius.png', '#7C2D12'),

-- Pack Leadership Achievements  
('Pack Founder', 'Create your first pack', 
 (SELECT id FROM category_ids WHERE name = 'Pack Leadership'),
 '{"type": "packs_created", "threshold": 1}', 'common', 30, 'PACK_LEADERSHIP', 1, 1, '/badges/pack-founder.png', '#1E40AF'),

('Alpha Leader', 'Lead a pack to 12 members', 
 (SELECT id FROM category_ids WHERE name = 'Pack Leadership'),
 '{"type": "pack_size", "threshold": 12, "role": "alpha"}', 'rare', 80, 'PACK_SIZE', 12, 12, '/badges/alpha-leader.png', '#DC2626'),

('Pack Dynasty', 'Lead the same pack for 365 days', 
 (SELECT id FROM category_ids WHERE name = 'Pack Leadership'),
 '{"type": "leadership_duration", "threshold": 365, "unit": "days"}', 'epic', 150, 'PACK_LEADERSHIP', 365, 365, '/badges/pack-dynasty.png', '#059669'),

('Respected Alpha', 'Achieve pack reputation of 1000 while leading', 
 (SELECT id FROM category_ids WHERE name = 'Pack Leadership'),
 '{"type": "pack_reputation", "threshold": 1000, "role": "alpha"}', 'epic', 120, 'REPUTATION_MILESTONE', 1000, 1000, '/badges/respected-alpha.png', '#7C3AED'),

-- Combat Achievements
('First Victory', 'Win your first territory dispute', 
 (SELECT id FROM category_ids WHERE name = 'Combat'),
 '{"type": "disputes_won", "threshold": 1}', 'common', 25, 'COMBAT_VICTORY', 1, 1, '/badges/first-victory.png', '#DC2626'),

('Warrior', 'Win 10 territory disputes', 
 (SELECT id FROM category_ids WHERE name = 'Combat'),
 '{"type": "disputes_won", "threshold": 10}', 'rare', 100, 'COMBAT_VICTORY', 10, 10, '/badges/warrior.png', '#7C2D12'),

('Undefeated', 'Win 5 consecutive disputes without losing', 
 (SELECT id FROM category_ids WHERE name = 'Combat'),
 '{"type": "win_streak", "threshold": 5}', 'epic', 150, 'COMBAT_VICTORY', 5, 5, '/badges/undefeated.png', '#059669'),

('Defender', 'Successfully defend your territory 10 times', 
 (SELECT id FROM category_ids WHERE name = 'Combat'),
 '{"type": "successful_defenses", "threshold": 10}', 'rare', 80, 'COMBAT_VICTORY', 10, 10, '/badges/defender.png', '#1E40AF'),

-- Social Achievements
('Pack Mate', 'Join your first pack', 
 (SELECT id FROM category_ids WHERE name = 'Social'),
 '{"type": "packs_joined", "threshold": 1}', 'common', 15, 'SOCIAL_INTERACTION', 1, 1, '/badges/pack-mate.png', '#16A34A'),

('Diplomat', 'Establish alliance with 3 different packs', 
 (SELECT id FROM category_ids WHERE name = 'Social'),
 '{"type": "alliances_formed", "threshold": 3}', 'rare', 60, 'SOCIAL_INTERACTION', 3, 3, '/badges/diplomat.png', '#7C3AED'),

('Mentor', 'Help 5 new pack members reach 10 transformations', 
 (SELECT id FROM category_ids WHERE name = 'Social'),
 '{"type": "members_mentored", "threshold": 5, "transformation_threshold": 10}', 'epic', 100, 'SOCIAL_INTERACTION', 5, 5, '/badges/mentor.png', '#CA8A04'),

-- Reputation Achievements
('Notable', 'Reach 100 reputation', 
 (SELECT id FROM category_ids WHERE name = 'Reputation'),
 '{"type": "reputation", "threshold": 100}', 'common', 20, 'REPUTATION_MILESTONE', 100, 100, '/badges/notable.png', '#16A34A'),

('Renowned', 'Reach 1000 reputation', 
 (SELECT id FROM category_ids WHERE name = 'Reputation'),
 '{"type": "reputation", "threshold": 1000}', 'rare', 75, 'REPUTATION_MILESTONE', 1000, 1000, '/badges/renowned.png', '#1E40AF'),

('Legendary', 'Reach 5000 reputation', 
 (SELECT id FROM category_ids WHERE name = 'Reputation'),
 '{"type": "reputation", "threshold": 5000}', 'epic', 200, 'REPUTATION_MILESTONE', 5000, 5000, '/badges/legendary.png', '#7C2D12'),

('Mythical', 'Reach 10000 reputation', 
 (SELECT id FROM category_ids WHERE name = 'Reputation'),
 '{"type": "reputation", "threshold": 10000}', 'legendary', 500, 'REPUTATION_MILESTONE', 10000, 10000, '/badges/mythical.png', '#059669'),

-- Exploration Achievements
('Scout', 'Discover 10 different territories', 
 (SELECT id FROM category_ids WHERE name = 'Exploration'),
 '{"type": "territories_discovered", "threshold": 10}', 'common', 30, 'EXPLORATION', 10, 10, '/badges/scout.png', '#CA8A04'),

('Pathfinder', 'Transform in 5 different terrain types', 
 (SELECT id FROM category_ids WHERE name = 'Exploration'),
 '{"type": "terrain_types_explored", "threshold": 5}', 'rare', 50, 'EXPLORATION', 5, 5, '/badges/pathfinder.png', '#16A34A'),

-- Special Event Achievements
('Eclipse Walker', 'Transform during a lunar eclipse', 
 (SELECT id FROM category_ids WHERE name = 'Special Events'),
 '{"type": "special_transformation", "event": "lunar_eclipse"}', 'legendary', 300, 'SPECIAL_EVENT', 1, 1, '/badges/eclipse-walker.png', '#1F2937'),

('Blood Moon', 'Lead pack during blood moon event', 
 (SELECT id FROM category_ids WHERE name = 'Special Events'),
 '{"type": "special_leadership", "event": "blood_moon"}', 'legendary', 250, 'SPECIAL_EVENT', 1, 1, '/badges/blood-moon.png', '#7F1D1D'),

('Ancient Bloodline', 'Achieve bloodline power of 10', 
 (SELECT id FROM category_ids WHERE name = 'Special Events'),
 '{"type": "bloodline_power", "threshold": 10}', 'legendary', 400, 'BLOODLINE_POWER', 10, 10, '/badges/ancient-bloodline.png', '#4C1D95');

-- Create achievement checking functions
CREATE OR REPLACE FUNCTION check_user_achievements(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    achievement_record RECORD;
    user_stats RECORD;
    pack_stats RECORD;
    achievements_granted INTEGER := 0;
BEGIN
    -- Get user statistics
    SELECT 
        u.transformation_count,
        u.reputation,
        u.bloodline_power,
        u.pack_id,
        u.pack_role,
        COALESCE(COUNT(DISTINCT t.territory_id), 0) as territories_discovered,
        COALESCE(COUNT(DISTINCT ter.terrain), 0) as terrain_types_explored
    INTO user_stats
    FROM users u
    LEFT JOIN transformations t ON u.id = t.user_id
    LEFT JOIN territories ter ON t.territory_id = ter.id
    WHERE u.id = p_user_id
    GROUP BY u.id, u.transformation_count, u.reputation, u.bloodline_power, u.pack_id, u.pack_role;
    
    -- Get pack statistics if user is in a pack
    IF user_stats.pack_id IS NOT NULL THEN
        SELECT 
            p.reputation as pack_reputation,
            COUNT(pm.user_id) as pack_size,
            COUNT(t.id) as territories_controlled
        INTO pack_stats
        FROM packs p
        LEFT JOIN pack_memberships pm ON p.id = pm.pack_id AND pm.is_active = TRUE
        LEFT JOIN territories t ON p.id = t.claimed_by_pack_id AND t.deleted_at IS NULL
        WHERE p.id = user_stats.pack_id
        GROUP BY p.id, p.reputation;
    END IF;
    
    -- Check each achievement
    FOR achievement_record IN 
        SELECT a.* FROM achievements a
        WHERE NOT EXISTS (
            SELECT 1 FROM user_achievements ua 
            WHERE ua.user_id = p_user_id AND ua.achievement_id = a.id
        )
    LOOP
        -- Check transformation count achievements
        IF achievement_record.trigger_type = 'TRANSFORMATION_COUNT' AND 
           user_stats.transformation_count >= achievement_record.trigger_threshold THEN
            
            INSERT INTO user_achievements (user_id, achievement_id, context)
            VALUES (p_user_id, achievement_record.id, 
                    jsonb_build_object('transformation_count', user_stats.transformation_count));
            achievements_granted := achievements_granted + 1;
            
            -- Update user achievement points
            UPDATE users SET 
                reputation = reputation + achievement_record.points
            WHERE id = p_user_id;
        
        -- Check reputation achievements
        ELSIF achievement_record.trigger_type = 'REPUTATION_MILESTONE' AND 
              user_stats.reputation >= achievement_record.trigger_threshold THEN
            
            INSERT INTO user_achievements (user_id, achievement_id, context)
            VALUES (p_user_id, achievement_record.id, 
                    jsonb_build_object('reputation', user_stats.reputation));
            achievements_granted := achievements_granted + 1;
        
        -- Check bloodline power achievements
        ELSIF achievement_record.trigger_type = 'BLOODLINE_POWER' AND 
              user_stats.bloodline_power >= achievement_record.trigger_threshold THEN
            
            INSERT INTO user_achievements (user_id, achievement_id, context)
            VALUES (p_user_id, achievement_record.id, 
                    jsonb_build_object('bloodline_power', user_stats.bloodline_power));
            achievements_granted := achievements_granted + 1;
        
        -- Check pack size achievements (only for alphas)
        ELSIF achievement_record.trigger_type = 'PACK_SIZE' AND 
              user_stats.pack_role = 'ALPHA' AND 
              pack_stats.pack_size >= achievement_record.trigger_threshold THEN
            
            INSERT INTO user_achievements (user_id, achievement_id, context)
            VALUES (p_user_id, achievement_record.id, 
                    jsonb_build_object('pack_size', pack_stats.pack_size));
            achievements_granted := achievements_granted + 1;
        
        -- Check exploration achievements
        ELSIF achievement_record.trigger_type = 'EXPLORATION' THEN
            IF achievement_record.criteria->>'type' = 'territories_discovered' AND
               user_stats.territories_discovered >= achievement_record.trigger_threshold THEN
                
                INSERT INTO user_achievements (user_id, achievement_id, context)
                VALUES (p_user_id, achievement_record.id, 
                        jsonb_build_object('territories_discovered', user_stats.territories_discovered));
                achievements_granted := achievements_granted + 1;
                
            ELSIF achievement_record.criteria->>'type' = 'terrain_types_explored' AND
                  user_stats.terrain_types_explored >= achievement_record.trigger_threshold THEN
                
                INSERT INTO user_achievements (user_id, achievement_id, context)
                VALUES (p_user_id, achievement_record.id, 
                        jsonb_build_object('terrain_types_explored', user_stats.terrain_types_explored));
                achievements_granted := achievements_granted + 1;
            END IF;
        END IF;
    END LOOP;
    
    RETURN achievements_granted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically check achievements
CREATE OR REPLACE FUNCTION trigger_achievement_check()
RETURNS TRIGGER AS $$
BEGIN
    -- Check achievements for relevant table changes
    IF TG_TABLE_NAME = 'transformations' AND TG_OP = 'INSERT' THEN
        PERFORM check_user_achievements(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'users' AND TG_OP = 'UPDATE' AND 
          (OLD.reputation IS DISTINCT FROM NEW.reputation OR 
           OLD.bloodline_power IS DISTINCT FROM NEW.bloodline_power) THEN
        PERFORM check_user_achievements(NEW.id);
    ELSIF TG_TABLE_NAME = 'pack_memberships' AND TG_OP IN ('INSERT', 'UPDATE') THEN
        -- Check achievements for all pack members when pack composition changes
        PERFORM check_user_achievements(user_id) 
        FROM pack_memberships 
        WHERE pack_id = COALESCE(NEW.pack_id, OLD.pack_id) AND is_active = TRUE;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add achievement checking triggers
CREATE TRIGGER trigger_transformations_achievements 
    AFTER INSERT ON transformations 
    FOR EACH ROW EXECUTE FUNCTION trigger_achievement_check();

CREATE TRIGGER trigger_users_achievements 
    AFTER UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION trigger_achievement_check();

CREATE TRIGGER trigger_pack_memberships_achievements 
    AFTER INSERT OR UPDATE ON pack_memberships 
    FOR EACH ROW EXECUTE FUNCTION trigger_achievement_check();

-- Create function to get user achievement summary
CREATE OR REPLACE FUNCTION get_user_achievement_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    summary JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_achievements', COUNT(*),
        'total_points', COALESCE(SUM(a.points), 0),
        'by_rarity', jsonb_object_agg(a.rarity, rarity_counts.count),
        'by_category', jsonb_object_agg(ac.name, category_counts.count),
        'recent_achievements', recent_achievements.achievements
    ) INTO summary
    FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.id
    JOIN achievement_categories ac ON a.category_id = ac.id
    LEFT JOIN (
        SELECT a.rarity, COUNT(*) as count
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = p_user_id
        GROUP BY a.rarity
    ) rarity_counts ON a.rarity = rarity_counts.rarity
    LEFT JOIN (
        SELECT ac.name, COUNT(*) as count
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        JOIN achievement_categories ac ON a.category_id = ac.id
        WHERE ua.user_id = p_user_id
        GROUP BY ac.name
    ) category_counts ON ac.name = category_counts.name
    LEFT JOIN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'name', a.name,
                'rarity', a.rarity,
                'points', a.points,
                'earned_at', ua.earned_at
            ) ORDER BY ua.earned_at DESC
        ) as achievements
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = p_user_id
        ORDER BY ua.earned_at DESC
        LIMIT 5
    ) recent_achievements ON true
    WHERE ua.user_id = p_user_id;
    
    RETURN COALESCE(summary, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for achievement system tables
ALTER TABLE achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_categories ENABLE ROW LEVEL SECURITY;

-- Achievement progress policies
CREATE POLICY achievement_progress_select_policy ON achievement_progress
    FOR SELECT
    USING (user_id = current_user_id());

CREATE POLICY achievement_progress_insert_policy ON achievement_progress
    FOR INSERT
    WITH CHECK (user_id = current_user_id());

CREATE POLICY achievement_progress_update_policy ON achievement_progress
    FOR UPDATE
    USING (user_id = current_user_id())
    WITH CHECK (user_id = current_user_id());

-- Achievement categories are public
CREATE POLICY achievement_categories_select_policy ON achievement_categories
    FOR SELECT
    USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON achievement_progress TO authenticated;
GRANT SELECT ON achievement_categories TO authenticated;