-- Fix Security Definer View Issue
-- The game_overview view should NOT use SECURITY DEFINER to properly enforce RLS

-- Drop the existing view
DROP VIEW IF EXISTS public.game_overview;

-- Recreate the view WITHOUT SECURITY DEFINER
CREATE VIEW public.game_overview AS
SELECT 
    g.id,
    g.name,
    g.code,
    g.status,
    g.max_players,
    g.created_at,
    g.creator_id,
    p.username as creator_name,
    COALESCE(player_count.current_players, 0) as current_players
FROM games g
LEFT JOIN profiles p ON g.creator_id = p.id
LEFT JOIN (
    SELECT 
        game_id, 
        COUNT(*) as current_players
    FROM players 
    GROUP BY game_id
) player_count ON g.id = player_count.game_id;

-- Grant appropriate permissions
GRANT SELECT ON public.game_overview TO authenticated;
GRANT SELECT ON public.game_overview TO anon;