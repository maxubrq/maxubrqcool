-- Fix functions to work with string IDs instead of UUIDs

-- Create function to safely increment like count (updated for string IDs)
CREATE OR REPLACE FUNCTION public.increment_post_like(p_post_id text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count bigint;
BEGIN
    INSERT INTO public.eng_post_like_counters (post_id, like_count, updated_at)
    VALUES (p_post_id, 1, now())
    ON CONFLICT (post_id) 
    DO UPDATE SET 
        like_count = eng_post_like_counters.like_count + 1,
        updated_at = now()
    RETURNING like_count INTO new_count;
    
    RETURN new_count;
END;
$$;

-- Create function to safely decrement like count (floor at 0) (updated for string IDs)
CREATE OR REPLACE FUNCTION public.decrement_post_like(p_post_id text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count bigint;
BEGIN
    -- First ensure the row exists
    INSERT INTO public.eng_post_like_counters (post_id, like_count, updated_at)
    VALUES (p_post_id, 0, now())
    ON CONFLICT (post_id) DO NOTHING;
    
    -- Then decrement with floor at 0
    UPDATE public.eng_post_like_counters 
    SET 
        like_count = GREATEST(like_count - 1, 0),
        updated_at = now()
    WHERE post_id = p_post_id
    RETURNING like_count INTO new_count;
    
    RETURN new_count;
END;
$$;

-- Create function to get like count (updated for string IDs)
CREATE OR REPLACE FUNCTION public.get_post_like_count(p_post_id text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_count bigint;
BEGIN
    SELECT COALESCE(like_count, 0) INTO result_count
    FROM public.eng_post_like_counters 
    WHERE post_id = p_post_id;
    
    RETURN COALESCE(result_count, 0);
END;
$$;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION public.increment_post_like(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.decrement_post_like(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_post_like_count(text) TO service_role;

-- Grant read permissions to anon and authenticated users
GRANT SELECT ON public.eng_post_like_counters TO anon, authenticated;
GRANT SELECT ON public.eng_post_like_events_daily TO anon, authenticated;
