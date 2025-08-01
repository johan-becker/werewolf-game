-- Audit Logging and Soft Delete Functionality
-- This migration creates triggers for automatic audit logging and soft delete implementation

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create audit trigger function
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    audit_action audit_action;
    old_values JSONB := '{}';
    new_values JSONB := '{}';
    changed_fields TEXT[] := ARRAY[]::TEXT[];
    field_name TEXT;
    current_user_id_val UUID;
    current_user_ip_val INET;
    current_user_agent_val TEXT;
BEGIN
    -- Get current user context
    current_user_id_val := current_user_id();
    current_user_ip_val := COALESCE(current_setting('werewolf.current_user_ip', true)::INET, NULL);
    current_user_agent_val := COALESCE(current_setting('werewolf.current_user_agent', true), NULL);
    
    -- Determine audit action
    IF TG_OP = 'INSERT' THEN
        audit_action := 'INSERT';
        new_values := to_jsonb(NEW);
        
    ELSIF TG_OP = 'UPDATE' THEN
        audit_action := 'UPDATE';
        old_values := to_jsonb(OLD);
        new_values := to_jsonb(NEW);
        
        -- Find changed fields
        FOR field_name IN SELECT jsonb_object_keys(old_values) LOOP
            IF old_values->field_name IS DISTINCT FROM new_values->field_name THEN
                changed_fields := array_append(changed_fields, field_name);
            END IF;
        END LOOP;
        
        -- Don't log if only updated_at changed (automatic updates)
        IF array_length(changed_fields, 1) = 1 AND changed_fields[1] = 'updated_at' THEN
            RETURN COALESCE(NEW, OLD);
        END IF;
        
    ELSIF TG_OP = 'DELETE' THEN
        audit_action := 'DELETE';
        old_values := to_jsonb(OLD);
    END IF;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        user_id,
        user_ip,
        user_agent,
        old_values,
        new_values,
        changed_fields,
        context
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        audit_action,
        current_user_id_val,
        current_user_ip_val,
        current_user_agent_val,
        old_values,
        new_values,
        changed_fields,
        COALESCE(current_setting('werewolf.audit_context', true)::JSONB, '{}')
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create soft delete function
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Instead of deleting, set deleted_at timestamp
    UPDATE users SET deleted_at = NOW() WHERE id = OLD.id AND TG_TABLE_NAME = 'users';
    UPDATE packs SET deleted_at = NOW() WHERE id = OLD.id AND TG_TABLE_NAME = 'packs';
    UPDATE territories SET deleted_at = NOW() WHERE id = OLD.id AND TG_TABLE_NAME = 'territories';
    
    -- Still create audit log for delete attempt
    PERFORM create_audit_log();
    
    -- Prevent actual deletion
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to track specific werewolf actions
CREATE OR REPLACE FUNCTION track_werewolf_action()
RETURNS TRIGGER AS $$
DECLARE
    action_type audit_action;
    context_data JSONB := '{}';
BEGIN
    -- Track transformation events
    IF TG_TABLE_NAME = 'transformations' AND TG_OP = 'INSERT' THEN
        action_type := 'TRANSFORM';
        context_data := jsonb_build_object(
            'trigger_type', NEW.trigger_type,
            'intensity', NEW.intensity,
            'territory_id', NEW.territory_id,
            'moon_phase_id', NEW.moon_phase_id
        );
        
    -- Track territory claims
    ELSIF TG_TABLE_NAME = 'territories' AND TG_OP = 'UPDATE' AND 
          OLD.claimed_by_pack_id IS DISTINCT FROM NEW.claimed_by_pack_id AND
          NEW.claimed_by_pack_id IS NOT NULL THEN
        action_type := 'CLAIM_TERRITORY';
        context_data := jsonb_build_object(
            'territory_name', NEW.name,
            'previous_pack', OLD.claimed_by_pack_id,
            'new_pack', NEW.claimed_by_pack_id,
            'strategic_value', NEW.strategic_value
        );
    
    -- Track pack membership changes
    ELSIF TG_TABLE_NAME = 'pack_memberships' THEN
        IF TG_OP = 'INSERT' THEN
            action_type := 'JOIN_PACK';
            context_data := jsonb_build_object(
                'pack_id', NEW.pack_id,
                'role', NEW.role
            );
        ELSIF TG_OP = 'UPDATE' AND OLD.is_active = TRUE AND NEW.is_active = FALSE THEN
            action_type := 'LEAVE_PACK';
            context_data := jsonb_build_object(
                'pack_id', OLD.pack_id,
                'role', OLD.role,
                'duration_days', EXTRACT(days FROM (NOW() - OLD.joined_at))
            );
        END IF;
    
    -- Track login/logout (would be called from application)
    ELSIF TG_TABLE_NAME = 'users' AND TG_OP = 'UPDATE' AND 
          OLD.last_login IS DISTINCT FROM NEW.last_login THEN
        action_type := 'LOGIN';
        context_data := jsonb_build_object(
            'previous_login', OLD.last_login
        );
    END IF;
    
    -- Insert specific audit log if we identified a special action
    IF action_type IS NOT NULL THEN
        INSERT INTO audit_logs (
            table_name,
            record_id,
            action,
            user_id,
            user_ip,
            user_agent,
            old_values,
            new_values,
            context
        ) VALUES (
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            action_type,
            current_user_id(),
            COALESCE(current_setting('werewolf.current_user_ip', true)::INET, NULL),
            COALESCE(current_setting('werewolf.current_user_agent', true), NULL),
            CASE WHEN OLD IS NOT NULL THEN to_jsonb(OLD) ELSE '{}' END,
            CASE WHEN NEW IS NOT NULL THEN to_jsonb(NEW) ELSE '{}' END,
            context_data
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update transformation count
CREATE OR REPLACE FUNCTION update_transformation_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment transformation count when new transformation is inserted
    IF TG_OP = 'INSERT' THEN
        UPDATE users 
        SET transformation_count = transformation_count + 1,
            last_transformation = NEW.triggered_at
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update pack statistics
CREATE OR REPLACE FUNCTION update_pack_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update pack member count and territory statistics
    IF TG_TABLE_NAME = 'pack_memberships' THEN
        -- Recalculate member count for affected pack
        UPDATE packs SET 
            updated_at = NOW()
        WHERE id = COALESCE(NEW.pack_id, OLD.pack_id);
        
    ELSIF TG_TABLE_NAME = 'territories' THEN
        -- Update territory count and total size
        IF OLD.claimed_by_pack_id IS DISTINCT FROM NEW.claimed_by_pack_id THEN
            -- Update old pack statistics
            IF OLD.claimed_by_pack_id IS NOT NULL THEN
                UPDATE packs SET 
                    territory_count = territory_count - 1,
                    total_territory_size = total_territory_size - OLD.size_km2,
                    updated_at = NOW()
                WHERE id = OLD.claimed_by_pack_id;
            END IF;
            
            -- Update new pack statistics  
            IF NEW.claimed_by_pack_id IS NOT NULL THEN
                UPDATE packs SET 
                    territory_count = territory_count + 1,
                    total_territory_size = total_territory_size + NEW.size_km2,
                    updated_at = NOW()
                WHERE id = NEW.claimed_by_pack_id;
            END IF;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle reputation changes
CREATE OR REPLACE FUNCTION handle_reputation_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Apply reputation changes from transformations
    IF TG_TABLE_NAME = 'transformations' AND TG_OP = 'INSERT' AND NEW.reputation_change != 0 THEN
        UPDATE users 
        SET reputation = reputation + NEW.reputation_change
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_packs_updated_at 
    BEFORE UPDATE ON packs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_territories_updated_at 
    BEFORE UPDATE ON territories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_pack_memberships_updated_at 
    BEFORE UPDATE ON pack_memberships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_territory_disputes_updated_at 
    BEFORE UPDATE ON territory_disputes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_pack_relations_updated_at 
    BEFORE UPDATE ON pack_relations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add audit triggers to all tables
CREATE TRIGGER trigger_users_audit 
    AFTER INSERT OR UPDATE OR DELETE ON users 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER trigger_packs_audit 
    AFTER INSERT OR UPDATE OR DELETE ON packs 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER trigger_territories_audit 
    AFTER INSERT OR UPDATE OR DELETE ON territories 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER trigger_transformations_audit 
    AFTER INSERT OR UPDATE OR DELETE ON transformations 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER trigger_pack_memberships_audit 
    AFTER INSERT OR UPDATE OR DELETE ON pack_memberships 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER trigger_territory_disputes_audit 
    AFTER INSERT OR UPDATE OR DELETE ON territory_disputes 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER trigger_pack_relations_audit 
    AFTER INSERT OR UPDATE OR DELETE ON pack_relations 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER trigger_user_achievements_audit 
    AFTER INSERT OR UPDATE OR DELETE ON user_achievements 
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Add soft delete triggers
CREATE TRIGGER trigger_users_soft_delete 
    BEFORE DELETE ON users 
    FOR EACH ROW EXECUTE FUNCTION soft_delete();

CREATE TRIGGER trigger_packs_soft_delete 
    BEFORE DELETE ON packs 
    FOR EACH ROW EXECUTE FUNCTION soft_delete();

CREATE TRIGGER trigger_territories_soft_delete 
    BEFORE DELETE ON territories 
    FOR EACH ROW EXECUTE FUNCTION soft_delete();

-- Add werewolf-specific action triggers
CREATE TRIGGER trigger_transformations_werewolf_action 
    AFTER INSERT ON transformations 
    FOR EACH ROW EXECUTE FUNCTION track_werewolf_action();

CREATE TRIGGER trigger_territories_werewolf_action 
    AFTER UPDATE ON territories 
    FOR EACH ROW EXECUTE FUNCTION track_werewolf_action();

CREATE TRIGGER trigger_pack_memberships_werewolf_action 
    AFTER INSERT OR UPDATE ON pack_memberships 
    FOR EACH ROW EXECUTE FUNCTION track_werewolf_action();

CREATE TRIGGER trigger_users_werewolf_action 
    AFTER UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION track_werewolf_action();

-- Add business logic triggers
CREATE TRIGGER trigger_transformations_update_count 
    AFTER INSERT ON transformations 
    FOR EACH ROW EXECUTE FUNCTION update_transformation_count();

CREATE TRIGGER trigger_pack_statistics_update 
    AFTER INSERT OR UPDATE OR DELETE ON pack_memberships 
    FOR EACH ROW EXECUTE FUNCTION update_pack_statistics();

CREATE TRIGGER trigger_territory_statistics_update 
    AFTER UPDATE ON territories 
    FOR EACH ROW EXECUTE FUNCTION update_pack_statistics();

CREATE TRIGGER trigger_reputation_changes 
    AFTER INSERT ON transformations 
    FOR EACH ROW EXECUTE FUNCTION handle_reputation_changes();

-- Create functions to set audit context
CREATE OR REPLACE FUNCTION set_audit_context(context_data JSONB)
RETURNS void AS $$
BEGIN
    PERFORM set_config('werewolf.audit_context', context_data::text, true);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_user_request_info(user_ip INET, user_agent TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('werewolf.current_user_ip', user_ip::text, true);
    PERFORM set_config('werewolf.current_user_agent', user_agent, true);
END;
$$ LANGUAGE plpgsql;

-- Create function for data recovery (restore soft deleted records)
CREATE OR REPLACE FUNCTION restore_deleted_record(table_name TEXT, record_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    sql_query TEXT;
    result BOOLEAN := FALSE;
BEGIN
    -- Only allow restoration of soft-deletable tables
    IF table_name NOT IN ('users', 'packs', 'territories') THEN
        RAISE EXCEPTION 'Table % does not support soft delete restoration', table_name;
    END IF;
    
    -- Build and execute restoration query
    sql_query := format('UPDATE %I SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL', table_name);
    EXECUTE sql_query USING record_id;
    
    -- Check if any rows were affected
    GET DIAGNOSTICS result = ROW_COUNT;
    
    -- Log the restoration
    IF result THEN
        INSERT INTO audit_logs (
            table_name,
            record_id,
            action,
            user_id,
            context
        ) VALUES (
            table_name,
            record_id,
            'UPDATE',
            current_user_id(),
            '{"action": "restore_deleted_record"}'::JSONB
        );
    END IF;
    
    RETURN result > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to permanently delete soft-deleted records (admin only)
CREATE OR REPLACE FUNCTION permanently_delete_record(table_name TEXT, record_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    sql_query TEXT;
    result BOOLEAN := FALSE;
BEGIN
    -- Only allow permanent deletion of soft-deletable tables
    IF table_name NOT IN ('users', 'packs', 'territories') THEN
        RAISE EXCEPTION 'Table % does not support permanent deletion', table_name;
    END IF;
    
    -- Build and execute permanent deletion query (only if already soft deleted)
    sql_query := format('DELETE FROM %I WHERE id = $1 AND deleted_at IS NOT NULL', table_name);
    EXECUTE sql_query USING record_id;
    
    -- Check if any rows were affected
    GET DIAGNOSTICS result = ROW_COUNT;
    
    RETURN result > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create cleanup function for old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;