-- Territory Dispute Resolution System
-- This migration creates the complete dispute resolution framework

-- Create dispute resolution types and phases
CREATE TYPE dispute_resolution_method AS ENUM ('COMBAT', 'NEGOTIATION', 'ARBITRATION', 'ABANDON', 'TIMEOUT');
CREATE TYPE dispute_phase AS ENUM ('INITIATED', 'PREPARATION', 'NEGOTIATION', 'COMBAT', 'RESOLUTION', 'COMPLETED');
CREATE TYPE combat_outcome AS ENUM ('ATTACKER_WIN', 'DEFENDER_WIN', 'DRAW', 'INTERRUPTED');

-- Dispute Resolution Details Table
CREATE TABLE dispute_resolution_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL,
    
    -- Resolution process
    phase dispute_phase DEFAULT 'INITIATED',
    method dispute_resolution_method,
    
    -- Timeline
    phase_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    phase_deadline TIMESTAMP WITH TIME ZONE,
    preparation_time_hours INTEGER DEFAULT 24, -- Time for packs to prepare
    
    -- Negotiation details
    negotiation_rounds INTEGER DEFAULT 0,
    max_negotiation_rounds INTEGER DEFAULT 3,
    negotiation_offers JSONB DEFAULT '[]',
    
    -- Combat details
    combat_participants JSONB DEFAULT '{}', -- List of participants from each pack
    combat_modifiers JSONB DEFAULT '{}', -- Terrain, moon phase, etc.
    combat_events JSONB DEFAULT '[]', -- Log of combat events
    combat_outcome combat_outcome,
    
    -- Resolution details
    resolution_terms JSONB DEFAULT '{}',
    compensation JSONB DEFAULT '{}',
    
    -- Administrative
    mediator_notes TEXT,
    resolution_summary TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT dispute_resolution_details_unique_dispute UNIQUE (dispute_id),
    CONSTRAINT dispute_resolution_details_valid_phase_deadline 
        CHECK (phase_deadline IS NULL OR phase_deadline > NOW())
);

-- Dispute Participants Table (for combat and negotiation)
CREATE TABLE dispute_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL,
    user_id UUID NOT NULL,
    pack_id UUID NOT NULL,
    
    -- Participation details
    role VARCHAR(20) NOT NULL, -- 'champion', 'negotiator', 'support', 'observer'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'withdrawn', 'eliminated'
    
    -- Combat stats (if applicable)
    combat_strength INTEGER,
    combat_modifiers JSONB DEFAULT '{}',
    
    -- Participation tracking
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_action_at TIMESTAMP WITH TIME ZONE,
    
    -- Results
    performance_score INTEGER DEFAULT 0,
    contribution_notes TEXT,
    
    CONSTRAINT dispute_participants_user_pack_unique UNIQUE (dispute_id, user_id),
    CONSTRAINT dispute_participants_valid_strength 
        CHECK (combat_strength IS NULL OR (combat_strength >= 1 AND combat_strength <= 100))
);

-- Dispute Events Table (chronological log of all dispute events)
CREATE TABLE dispute_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL,
    
    -- Event details
    event_type VARCHAR(30) NOT NULL, -- 'initiated', 'participant_joined', 'offer_made', 'combat_round', 'resolved'
    event_phase dispute_phase NOT NULL,
    
    -- Event context
    actor_user_id UUID, -- Who performed this action
    actor_pack_id UUID,
    target_user_id UUID, -- Target of action (if applicable)
    target_pack_id UUID,
    
    -- Event data
    event_data JSONB DEFAULT '{}',
    description TEXT,
    
    -- Metadata
    automatic BOOLEAN DEFAULT FALSE, -- System-generated vs user action
    
    -- Timestamp
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Combat Rounds Table (detailed combat tracking)
CREATE TABLE combat_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL,
    round_number INTEGER NOT NULL,
    
    -- Round participants
    attacker_participants UUID[], -- Array of participant IDs
    defender_participants UUID[], -- Array of participant IDs
    
    -- Round modifiers
    terrain_modifier DECIMAL(3,2) DEFAULT 1.0,
    moon_phase_modifier DECIMAL(3,2) DEFAULT 1.0,
    pack_bonus_attacker DECIMAL(3,2) DEFAULT 1.0,
    pack_bonus_defender DECIMAL(3,2) DEFAULT 1.0,
    
    -- Round results
    attacker_total_strength INTEGER,
    defender_total_strength INTEGER,
    random_factor DECIMAL(3,2), -- Randomness element (0.8 to 1.2)
    
    -- Round outcome
    round_winner VARCHAR(10), -- 'attacker', 'defender', 'draw'
    casualties JSONB DEFAULT '{}', -- Injured participants
    round_description TEXT,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT combat_rounds_dispute_round_unique UNIQUE (dispute_id, round_number),
    CONSTRAINT combat_rounds_valid_strength 
        CHECK (attacker_total_strength >= 0 AND defender_total_strength >= 0),
    CONSTRAINT combat_rounds_valid_random_factor 
        CHECK (random_factor >= 0.5 AND random_factor <= 1.5)
);

-- Add foreign key constraints
ALTER TABLE dispute_resolution_details ADD CONSTRAINT fk_dispute_resolution_details_dispute_id 
    FOREIGN KEY (dispute_id) REFERENCES territory_disputes(id) ON DELETE CASCADE;

ALTER TABLE dispute_participants ADD CONSTRAINT fk_dispute_participants_dispute_id 
    FOREIGN KEY (dispute_id) REFERENCES territory_disputes(id) ON DELETE CASCADE;

ALTER TABLE dispute_participants ADD CONSTRAINT fk_dispute_participants_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE dispute_participants ADD CONSTRAINT fk_dispute_participants_pack_id 
    FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE;

ALTER TABLE dispute_events ADD CONSTRAINT fk_dispute_events_dispute_id 
    FOREIGN KEY (dispute_id) REFERENCES territory_disputes(id) ON DELETE CASCADE;

ALTER TABLE dispute_events ADD CONSTRAINT fk_dispute_events_actor_user_id 
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE dispute_events ADD CONSTRAINT fk_dispute_events_actor_pack_id 
    FOREIGN KEY (actor_pack_id) REFERENCES packs(id) ON DELETE SET NULL;

ALTER TABLE combat_rounds ADD CONSTRAINT fk_combat_rounds_dispute_id 
    FOREIGN KEY (dispute_id) REFERENCES territory_disputes(id) ON DELETE CASCADE;

-- Create indexes for dispute resolution tables
CREATE INDEX idx_dispute_resolution_details_dispute_id ON dispute_resolution_details(dispute_id);
CREATE INDEX idx_dispute_resolution_details_phase ON dispute_resolution_details(phase);
CREATE INDEX idx_dispute_resolution_details_method ON dispute_resolution_details(method);
CREATE INDEX idx_dispute_resolution_details_phase_deadline ON dispute_resolution_details(phase_deadline) 
    WHERE phase_deadline IS NOT NULL;

CREATE INDEX idx_dispute_participants_dispute_id ON dispute_participants(dispute_id);
CREATE INDEX idx_dispute_participants_user_id ON dispute_participants(user_id);
CREATE INDEX idx_dispute_participants_pack_id ON dispute_participants(pack_id);
CREATE INDEX idx_dispute_participants_role ON dispute_participants(role);
CREATE INDEX idx_dispute_participants_status ON dispute_participants(status);

CREATE INDEX idx_dispute_events_dispute_id ON dispute_events(dispute_id);
CREATE INDEX idx_dispute_events_event_type ON dispute_events(event_type);
CREATE INDEX idx_dispute_events_event_phase ON dispute_events(event_phase);
CREATE INDEX idx_dispute_events_occurred_at_desc ON dispute_events(occurred_at DESC);
CREATE INDEX idx_dispute_events_actor_user_id ON dispute_events(actor_user_id);

CREATE INDEX idx_combat_rounds_dispute_id ON combat_rounds(dispute_id);
CREATE INDEX idx_combat_rounds_round_number ON combat_rounds(dispute_id, round_number);
CREATE INDEX idx_combat_rounds_started_at_desc ON combat_rounds(started_at DESC);

-- Create dispute resolution functions

-- Function to initiate a territory dispute
CREATE OR REPLACE FUNCTION initiate_territory_dispute(
    p_territory_id UUID,
    p_challenger_pack_id UUID,
    p_stakes JSONB DEFAULT '{}',
    p_conditions JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    dispute_id UUID;
    defender_pack_id UUID;
    territory_name TEXT;
BEGIN
    -- Get territory details
    SELECT claimed_by_pack_id, name INTO defender_pack_id, territory_name
    FROM territories 
    WHERE id = p_territory_id AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Territory not found or has been deleted';
    END IF;
    
    -- Cannot dispute own territory
    IF defender_pack_id = p_challenger_pack_id THEN
        RAISE EXCEPTION 'Pack cannot dispute its own territory';
    END IF;
    
    -- Create the dispute
    INSERT INTO territory_disputes (
        territory_id,
        challenger_pack_id,
        defender_pack_id,
        status,
        stakes,
        conditions
    ) VALUES (
        p_territory_id,
        p_challenger_pack_id,
        defender_pack_id,
        'PENDING',
        p_stakes,
        p_conditions
    ) RETURNING id INTO dispute_id;
    
    -- Create dispute resolution details
    INSERT INTO dispute_resolution_details (
        dispute_id,
        phase,
        phase_deadline,
        preparation_time_hours
    ) VALUES (
        dispute_id,
        'INITIATED',
        NOW() + INTERVAL '24 hours', -- 24 hours to respond
        24
    );
    
    -- Log the initiation event
    INSERT INTO dispute_events (
        dispute_id,
        event_type,
        event_phase,
        actor_pack_id,
        target_pack_id,
        event_data,
        description
    ) VALUES (
        dispute_id,
        'initiated',
        'INITIATED',
        p_challenger_pack_id,
        defender_pack_id,
        jsonb_build_object(
            'territory_name', territory_name,
            'stakes', p_stakes,
            'conditions', p_conditions
        ),
        format('%s pack has challenged %s pack for control of %s territory', 
               (SELECT name FROM packs WHERE id = p_challenger_pack_id),
               COALESCE((SELECT name FROM packs WHERE id = defender_pack_id), 'Unknown'),
               territory_name)
    );
    
    -- Mark territory as disputed
    UPDATE territories 
    SET disputed = TRUE, dispute_count = dispute_count + 1, last_disputed_at = NOW()
    WHERE id = p_territory_id;
    
    RETURN dispute_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to join a dispute as participant
CREATE OR REPLACE FUNCTION join_dispute_as_participant(
    p_dispute_id UUID,
    p_user_id UUID,
    p_role VARCHAR(20) DEFAULT 'support'
)
RETURNS BOOLEAN AS $$
DECLARE
    user_pack_id UUID;
    challenger_pack_id UUID;
    defender_pack_id UUID;
    dispute_phase dispute_phase;
BEGIN
    -- Get user's pack
    SELECT pack_id INTO user_pack_id
    FROM users 
    WHERE id = p_user_id AND deleted_at IS NULL;
    
    IF user_pack_id IS NULL THEN
        RAISE EXCEPTION 'User must be in a pack to participate in disputes';
    END IF;
    
    -- Get dispute details
    SELECT td.challenger_pack_id, td.defender_pack_id, drd.phase
    INTO challenger_pack_id, defender_pack_id, dispute_phase
    FROM territory_disputes td
    JOIN dispute_resolution_details drd ON td.id = drd.dispute_id
    WHERE td.id = p_dispute_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dispute not found';
    END IF;
    
    -- Check if user's pack is involved in the dispute
    IF user_pack_id NOT IN (challenger_pack_id, defender_pack_id) THEN
        RAISE EXCEPTION 'User pack is not involved in this dispute';
    END IF;
    
    -- Check if phase allows participation
    IF dispute_phase NOT IN ('INITIATED', 'PREPARATION', 'NEGOTIATION') THEN
        RAISE EXCEPTION 'Cannot join dispute in current phase: %', dispute_phase;
    END IF;
    
    -- Add participant
    INSERT INTO dispute_participants (
        dispute_id,
        user_id,
        pack_id,
        role,
        combat_strength
    ) VALUES (
        p_dispute_id,
        p_user_id,
        user_pack_id,
        p_role,
        -- Calculate combat strength based on user attributes
        LEAST(100, GREATEST(1, 
            (SELECT (bloodline_power * 5) + (reputation / 100) + (transformation_count / 10)
             FROM users WHERE id = p_user_id)
        ))
    );
    
    -- Log participation event
    INSERT INTO dispute_events (
        dispute_id,
        event_type,
        event_phase,
        actor_user_id,
        actor_pack_id,
        event_data,
        description
    ) VALUES (
        p_dispute_id,
        'participant_joined',
        dispute_phase,
        p_user_id,
        user_pack_id,
        jsonb_build_object('role', p_role),
        format('%s joined the dispute as %s for %s pack',
               (SELECT username FROM users WHERE id = p_user_id),
               p_role,
               (SELECT name FROM packs WHERE id = user_pack_id))
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to advance dispute phase
CREATE OR REPLACE FUNCTION advance_dispute_phase(
    p_dispute_id UUID,
    p_new_phase dispute_phase,
    p_method dispute_resolution_method DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_phase dispute_phase;
    territory_name TEXT;
BEGIN
    -- Get current phase
    SELECT phase INTO current_phase
    FROM dispute_resolution_details
    WHERE dispute_id = p_dispute_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dispute resolution details not found';
    END IF;
    
    -- Validate phase transition
    IF NOT (
        (current_phase = 'INITIATED' AND p_new_phase = 'PREPARATION') OR
        (current_phase = 'PREPARATION' AND p_new_phase IN ('NEGOTIATION', 'COMBAT')) OR
        (current_phase = 'NEGOTIATION' AND p_new_phase IN ('COMBAT', 'RESOLUTION')) OR
        (current_phase = 'COMBAT' AND p_new_phase = 'RESOLUTION') OR
        (current_phase = 'RESOLUTION' AND p_new_phase = 'COMPLETED')
    ) THEN
        RAISE EXCEPTION 'Invalid phase transition from % to %', current_phase, p_new_phase;
    END IF;
    
    -- Update dispute phase
    UPDATE dispute_resolution_details
    SET 
        phase = p_new_phase,
        method = COALESCE(p_method, method),
        phase_started_at = NOW(),
        phase_deadline = CASE 
            WHEN p_new_phase = 'PREPARATION' THEN NOW() + INTERVAL '24 hours'
            WHEN p_new_phase = 'NEGOTIATION' THEN NOW() + INTERVAL '48 hours'
            WHEN p_new_phase = 'COMBAT' THEN NOW() + INTERVAL '2 hours'
            ELSE NULL
        END,
        updated_at = NOW()
    WHERE dispute_id = p_dispute_id;
    
    -- Log phase advancement
    SELECT t.name INTO territory_name
    FROM territory_disputes td
    JOIN territories t ON td.territory_id = t.id
    WHERE td.id = p_dispute_id;
    
    INSERT INTO dispute_events (
        dispute_id,
        event_type,
        event_phase,
        event_data,
        description,
        automatic
    ) VALUES (
        p_dispute_id,
        'phase_advanced',
        p_new_phase,
        jsonb_build_object(
            'previous_phase', current_phase,
            'new_phase', p_new_phase,
            'method', p_method
        ),
        format('Dispute for %s territory advanced from %s to %s phase',
               territory_name, current_phase, p_new_phase),
        TRUE
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resolve dispute
CREATE OR REPLACE FUNCTION resolve_territory_dispute(
    p_dispute_id UUID,
    p_winner_pack_id UUID,
    p_resolution_terms JSONB DEFAULT '{}',
    p_compensation JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
    territory_id UUID;
    challenger_pack_id UUID;
    defender_pack_id UUID;
    territory_name TEXT;
BEGIN
    -- Get dispute details
    SELECT td.territory_id, td.challenger_pack_id, td.defender_pack_id, t.name
    INTO territory_id, challenger_pack_id, defender_pack_id, territory_name
    FROM territory_disputes td
    JOIN territories t ON td.territory_id = t.id
    WHERE td.id = p_dispute_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dispute not found';
    END IF;
    
    -- Validate winner
    IF p_winner_pack_id IS NOT NULL AND 
       p_winner_pack_id NOT IN (challenger_pack_id, defender_pack_id) THEN
        RAISE EXCEPTION 'Winner must be one of the disputing packs';
    END IF;
    
    -- Update dispute status
    UPDATE territory_disputes
    SET 
        status = 'RESOLVED',
        resolved_at = NOW(),
        winner_pack_id = p_winner_pack_id,
        outcome = p_resolution_terms
    WHERE id = p_dispute_id;
    
    -- Update dispute resolution details
    UPDATE dispute_resolution_details
    SET 
        phase = 'COMPLETED',
        resolution_terms = p_resolution_terms,
        compensation = p_compensation,
        updated_at = NOW()
    WHERE dispute_id = p_dispute_id;
    
    -- Transfer territory if there's a winner
    IF p_winner_pack_id IS NOT NULL THEN
        UPDATE territories
        SET 
            claimed_by_pack_id = p_winner_pack_id,
            status = 'CONTROLLED',
            disputed = FALSE,
            claimed_at = NOW()
        WHERE id = territory_id;
    ELSE
        -- No winner, territory becomes neutral
        UPDATE territories
        SET 
            claimed_by_pack_id = NULL,
            status = 'NEUTRAL',
            disputed = FALSE
        WHERE id = territory_id;
    END IF;
    
    -- Log resolution
    INSERT INTO dispute_events (
        dispute_id,
        event_type,
        event_phase,
        target_pack_id,
        event_data,
        description,
        automatic
    ) VALUES (
        p_dispute_id,
        'resolved',
        'COMPLETED',
        p_winner_pack_id,
        jsonb_build_object(
            'winner_pack_id', p_winner_pack_id,
            'resolution_terms', p_resolution_terms,
            'compensation', p_compensation
        ),
        CASE 
            WHEN p_winner_pack_id IS NOT NULL THEN
                format('Dispute resolved: %s pack wins control of %s territory',
                       (SELECT name FROM packs WHERE id = p_winner_pack_id),
                       territory_name)
            ELSE
                format('Dispute resolved: %s territory becomes neutral', territory_name)
        END,
        TRUE
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for dispute resolution tables
ALTER TABLE dispute_resolution_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_rounds ENABLE ROW LEVEL SECURITY;

-- Dispute resolution details policies
CREATE POLICY dispute_resolution_details_select_policy ON dispute_resolution_details
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM territory_disputes td
            WHERE td.id = dispute_id
                AND (td.challenger_pack_id = current_user_pack_id() 
                     OR td.defender_pack_id = current_user_pack_id()
                     OR td.status = 'RESOLVED')
        )
    );

-- Dispute participants policies
CREATE POLICY dispute_participants_select_policy ON dispute_participants
    FOR SELECT
    USING (
        pack_id = current_user_pack_id()
        OR EXISTS (
            SELECT 1 FROM territory_disputes td
            WHERE td.id = dispute_id AND td.status = 'RESOLVED'
        )
    );

CREATE POLICY dispute_participants_insert_policy ON dispute_participants
    FOR INSERT
    WITH CHECK (user_id = current_user_id());

-- Dispute events policies
CREATE POLICY dispute_events_select_policy ON dispute_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM territory_disputes td
            WHERE td.id = dispute_id
                AND (td.challenger_pack_id = current_user_pack_id() 
                     OR td.defender_pack_id = current_user_pack_id()
                     OR td.status = 'RESOLVED')
        )
    );

-- Combat rounds policies
CREATE POLICY combat_rounds_select_policy ON combat_rounds
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM territory_disputes td
            WHERE td.id = dispute_id
                AND (td.challenger_pack_id = current_user_pack_id() 
                     OR td.defender_pack_id = current_user_pack_id()
                     OR td.status = 'RESOLVED')
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON dispute_resolution_details TO authenticated;
GRANT SELECT, INSERT, UPDATE ON dispute_participants TO authenticated;
GRANT SELECT ON dispute_events TO authenticated;
GRANT SELECT ON combat_rounds TO authenticated;