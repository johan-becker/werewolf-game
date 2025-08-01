-- Row-Level Security (RLS) Policies for Multi-Tenant Isolation
-- These policies ensure users can only access data they're authorized to see

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE moon_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security context functions
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        current_setting('werewolf.current_user_id', true)::UUID,
        NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_pack_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT pack_id 
        FROM users 
        WHERE id = current_user_id() 
            AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM users 
        WHERE id = current_user_id() 
            AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_pack_alpha(pack_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM packs 
        WHERE id = pack_uuid 
            AND alpha_id = current_user_id()
            AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN current_user_role() = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is in same pack as another user
CREATE OR REPLACE FUNCTION same_pack_as_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users u1
        JOIN users u2 ON u1.pack_id = u2.pack_id
        WHERE u1.id = current_user_id()
            AND u2.id = target_user_id
            AND u1.pack_id IS NOT NULL
            AND u1.deleted_at IS NULL
            AND u2.deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS TABLE POLICIES

-- Users can view their own profile and profiles in their pack
CREATE POLICY users_select_policy ON users
    FOR SELECT
    USING (
        id = current_user_id() 
        OR same_pack_as_user(id)
        OR pack_id IS NULL -- Allow viewing users without packs (for recruitment)
    );

-- Users can only update their own profile
CREATE POLICY users_update_policy ON users
    FOR UPDATE
    USING (id = current_user_id())
    WITH CHECK (id = current_user_id());

-- Users can insert their own profile (for registration)
CREATE POLICY users_insert_policy ON users
    FOR INSERT
    WITH CHECK (id = current_user_id());

-- Only pack alphas can delete members from their pack
CREATE POLICY users_delete_policy ON users
    FOR DELETE
    USING (
        id = current_user_id() 
        OR (pack_id IS NOT NULL AND is_pack_alpha(pack_id))
    );

-- PACKS TABLE POLICIES

-- Users can view all packs for discovery, but detailed info only for their pack
CREATE POLICY packs_select_policy ON packs
    FOR SELECT
    USING (
        deleted_at IS NULL
        AND (
            id = current_user_pack_id() -- Full access to own pack
            OR status IN ('ACTIVE', 'RECRUITING') -- Basic info for other packs
        )
    );

-- Only authenticated users can create packs
CREATE POLICY packs_insert_policy ON packs
    FOR INSERT
    WITH CHECK (alpha_id = current_user_id());

-- Only pack alphas can update their pack
CREATE POLICY packs_update_policy ON packs
    FOR UPDATE
    USING (alpha_id = current_user_id())
    WITH CHECK (alpha_id = current_user_id());

-- Only pack alphas can delete their pack
CREATE POLICY packs_delete_policy ON packs
    FOR DELETE
    USING (alpha_id = current_user_id());

-- TERRITORIES TABLE POLICIES

-- Users can view all territories, but see detailed info for their pack's territories
CREATE POLICY territories_select_policy ON territories
    FOR SELECT
    USING (
        deleted_at IS NULL
        AND (
            status IN ('NEUTRAL', 'ABANDONED') -- Public territories
            OR claimed_by_pack_id = current_user_pack_id() -- Own pack territories
            OR disputed = TRUE -- Disputed territories are public
        )
    );

-- Only pack members can claim territories for their pack
CREATE POLICY territories_insert_policy ON territories
    FOR INSERT
    WITH CHECK (
        claimed_by_pack_id IS NULL -- New territories start unclaimed
        OR claimed_by_pack_id = current_user_pack_id()
    );

-- Only pack members can update their pack's territories
CREATE POLICY territories_update_policy ON territories
    FOR UPDATE
    USING (
        claimed_by_pack_id = current_user_pack_id()
        OR status = 'NEUTRAL' -- Allow claiming neutral territories
    )
    WITH CHECK (
        claimed_by_pack_id = current_user_pack_id()
        OR claimed_by_pack_id IS NULL
    );

-- Only pack alphas can abandon territories
CREATE POLICY territories_delete_policy ON territories
    FOR DELETE
    USING (
        claimed_by_pack_id = current_user_pack_id()
        AND is_pack_alpha(current_user_pack_id())
    );

-- MOON PHASES TABLE POLICIES

-- Moon phases are public information
CREATE POLICY moon_phases_select_policy ON moon_phases
    FOR SELECT
    USING (true);

-- Only system can insert moon phases (handled by admin)
CREATE POLICY moon_phases_insert_policy ON moon_phases
    FOR INSERT
    WITH CHECK (false); -- Disable for regular users

-- TRANSFORMATIONS TABLE POLICIES

-- Users can view their own transformations and pack members' basic info
CREATE POLICY transformations_select_policy ON transformations
    FOR SELECT
    USING (
        user_id = current_user_id()
        OR same_pack_as_user(user_id)
    );

-- Users can only insert their own transformations
CREATE POLICY transformations_insert_policy ON transformations
    FOR INSERT
    WITH CHECK (user_id = current_user_id());

-- Users can only update their own transformations
CREATE POLICY transformations_update_policy ON transformations
    FOR UPDATE
    USING (user_id = current_user_id())
    WITH CHECK (user_id = current_user_id());

-- Users cannot delete transformations (audit trail)
CREATE POLICY transformations_delete_policy ON transformations
    FOR DELETE
    USING (false);

-- PACK MEMBERSHIPS TABLE POLICIES

-- Users can view memberships in their pack and their own membership history
CREATE POLICY pack_memberships_select_policy ON pack_memberships
    FOR SELECT
    USING (
        user_id = current_user_id()
        OR pack_id = current_user_pack_id()
    );

-- Users can join packs (create membership)
CREATE POLICY pack_memberships_insert_policy ON pack_memberships
    FOR INSERT
    WITH CHECK (
        user_id = current_user_id()
        OR is_pack_alpha(pack_id) -- Alphas can invite users
    );

-- Pack alphas can update member roles, users can leave
CREATE POLICY pack_memberships_update_policy ON pack_memberships
    FOR UPDATE
    USING (
        user_id = current_user_id() -- Users can update their own membership (leave)
        OR is_pack_alpha(pack_id) -- Alphas can update any membership in their pack
    )
    WITH CHECK (
        user_id = current_user_id()
        OR is_pack_alpha(pack_id)
    );

-- Pack alphas can remove members, users can remove themselves
CREATE POLICY pack_memberships_delete_policy ON pack_memberships
    FOR DELETE
    USING (
        user_id = current_user_id()
        OR is_pack_alpha(pack_id)
    );

-- TERRITORY DISPUTES TABLE POLICIES

-- Users can view disputes involving their pack or public disputes
CREATE POLICY territory_disputes_select_policy ON territory_disputes
    FOR SELECT
    USING (
        challenger_pack_id = current_user_pack_id()
        OR defender_pack_id = current_user_pack_id()
        OR status = 'RESOLVED' -- Resolved disputes are public
    );

-- Pack members can create disputes for territories
CREATE POLICY territory_disputes_insert_policy ON territory_disputes
    FOR INSERT
    WITH CHECK (
        challenger_pack_id = current_user_pack_id()
    );

-- Only pack alphas can update disputes involving their pack
CREATE POLICY territory_disputes_update_policy ON territory_disputes
    FOR UPDATE
    USING (
        (challenger_pack_id = current_user_pack_id() AND is_pack_alpha(current_user_pack_id()))
        OR (defender_pack_id = current_user_pack_id() AND is_pack_alpha(current_user_pack_id()))
    )
    WITH CHECK (
        (challenger_pack_id = current_user_pack_id() AND is_pack_alpha(current_user_pack_id()))
        OR (defender_pack_id = current_user_pack_id() AND is_pack_alpha(current_user_pack_id()))
    );

-- Disputes cannot be deleted (audit trail)
CREATE POLICY territory_disputes_delete_policy ON territory_disputes
    FOR DELETE
    USING (false);

-- PACK RELATIONS TABLE POLICIES

-- Users can view relations involving their pack
CREATE POLICY pack_relations_select_policy ON pack_relations
    FOR SELECT
    USING (
        pack_a_id = current_user_pack_id()
        OR pack_b_id = current_user_pack_id()
    );

-- Only pack alphas can create relations
CREATE POLICY pack_relations_insert_policy ON pack_relations
    FOR INSERT
    WITH CHECK (
        pack_a_id = current_user_pack_id() 
        AND is_pack_alpha(current_user_pack_id())
    );

-- Only pack alphas can update relations
CREATE POLICY pack_relations_update_policy ON pack_relations
    FOR UPDATE
    USING (
        (pack_a_id = current_user_pack_id() OR pack_b_id = current_user_pack_id())
        AND is_pack_alpha(current_user_pack_id())
    )
    WITH CHECK (
        (pack_a_id = current_user_pack_id() OR pack_b_id = current_user_pack_id())
        AND is_pack_alpha(current_user_pack_id())
    );

-- Only pack alphas can delete relations
CREATE POLICY pack_relations_delete_policy ON pack_relations
    FOR DELETE
    USING (
        (pack_a_id = current_user_pack_id() OR pack_b_id = current_user_pack_id())
        AND is_pack_alpha(current_user_pack_id())
    );

-- ACHIEVEMENTS TABLE POLICIES

-- Achievements are public information
CREATE POLICY achievements_select_policy ON achievements
    FOR SELECT
    USING (true);

-- Only system can manage achievements
CREATE POLICY achievements_insert_policy ON achievements
    FOR INSERT
    WITH CHECK (false);

CREATE POLICY achievements_update_policy ON achievements
    FOR UPDATE
    USING (false);

CREATE POLICY achievements_delete_policy ON achievements
    FOR DELETE
    USING (false);

-- USER ACHIEVEMENTS TABLE POLICIES

-- Users can view their own achievements and pack members' achievements
CREATE POLICY user_achievements_select_policy ON user_achievements
    FOR SELECT
    USING (
        user_id = current_user_id()
        OR same_pack_as_user(user_id)
    );

-- System grants achievements (handled by triggers/functions)
CREATE POLICY user_achievements_insert_policy ON user_achievements
    FOR INSERT
    WITH CHECK (user_id = current_user_id());

-- Achievements cannot be updated or deleted
CREATE POLICY user_achievements_update_policy ON user_achievements
    FOR UPDATE
    USING (false);

CREATE POLICY user_achievements_delete_policy ON user_achievements
    FOR DELETE
    USING (false);

-- AUDIT LOGS TABLE POLICIES

-- Users can view audit logs for records they can access
CREATE POLICY audit_logs_select_policy ON audit_logs
    FOR SELECT
    USING (
        user_id = current_user_id() -- Own actions
        OR (
            table_name = 'users' 
            AND (record_id = current_user_id() OR same_pack_as_user(record_id::UUID))
        )
        OR (
            table_name = 'packs' 
            AND record_id::UUID = current_user_pack_id()
        )
        OR (
            table_name = 'territories' 
            AND EXISTS (
                SELECT 1 FROM territories t 
                WHERE t.id = record_id::UUID 
                    AND t.claimed_by_pack_id = current_user_pack_id()
            )
        )
        OR (
            table_name = 'transformations'
            AND EXISTS (
                SELECT 1 FROM transformations tr
                WHERE tr.id = record_id::UUID
                    AND (tr.user_id = current_user_id() OR same_pack_as_user(tr.user_id))
            )
        )
    );

-- System inserts audit logs
CREATE POLICY audit_logs_insert_policy ON audit_logs
    FOR INSERT
    WITH CHECK (true); -- Handled by triggers

-- Audit logs cannot be updated or deleted
CREATE POLICY audit_logs_update_policy ON audit_logs
    FOR UPDATE
    USING (false);

CREATE POLICY audit_logs_delete_policy ON audit_logs
    FOR DELETE
    USING (false);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON packs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON territories TO authenticated;
GRANT SELECT ON moon_phases TO authenticated;
GRANT SELECT, INSERT, UPDATE ON transformations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON pack_memberships TO authenticated;
GRANT SELECT, INSERT, UPDATE ON territory_disputes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON pack_relations TO authenticated;
GRANT SELECT ON achievements TO authenticated;
GRANT SELECT, INSERT ON user_achievements TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;

-- Grant permissions on materialized views
GRANT SELECT ON pack_statistics TO authenticated;
GRANT SELECT ON user_statistics TO authenticated;
GRANT SELECT ON territory_analytics TO authenticated;
GRANT SELECT ON moon_phase_analytics TO authenticated;

-- Create a function to set user context for RLS
CREATE OR REPLACE FUNCTION set_user_context(user_uuid UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('werewolf.current_user_id', user_uuid::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to clear user context
CREATE OR REPLACE FUNCTION clear_user_context()
RETURNS void AS $$
BEGIN
    PERFORM set_config('werewolf.current_user_id', '', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;