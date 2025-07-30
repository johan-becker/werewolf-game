-- Fix Security Definer View Issue - FINAL FIX
-- The game_overview view should NOT use SECURITY DEFINER

-- Drop the existing view completely
DROP VIEW IF EXISTS public.game_overview CASCADE;

-- Recreate the view WITHOUT SECURITY DEFINER (this is the key fix)
CREATE VIEW public.game_overview 
WITH (security_invoker = true)
AS
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

-- Grant appropriate permissions to the view
GRANT SELECT ON public.game_overview TO authenticated;
GRANT SELECT ON public.game_overview TO anon;

-- Add comment to document the security model
COMMENT ON VIEW public.game_overview IS 
'Game overview with player counts. Uses security_invoker=true to respect RLS policies of the calling user.';