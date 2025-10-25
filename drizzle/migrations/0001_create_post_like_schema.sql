-- Migration: Create post like schema
-- This migration creates the tables and functions for the anonymous post like system

-- Create post like counters table
CREATE TABLE IF NOT EXISTS "public"."eng_post_like_counters" (
	"post_id" uuid PRIMARY KEY,
	"like_count" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL
);

-- Create daily events table for operational visibility
CREATE TABLE IF NOT EXISTS "public"."eng_post_like_events_daily" (
	"post_id" uuid NOT NULL,
	"day" date NOT NULL,
	"count" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "eng_post_like_events_daily_pk" PRIMARY KEY("post_id","day")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_eng_post_like_counters_updated_at" ON "public"."eng_post_like_counters" ("updated_at");
CREATE INDEX IF NOT EXISTS "idx_eng_post_like_events_daily_day" ON "public"."eng_post_like_events_daily" ("day");

-- Enable RLS
ALTER TABLE "public"."eng_post_like_counters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."eng_post_like_events_daily" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access to post like counters" ON "public"."eng_post_like_counters"
AS PERMISSIVE FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public read access to daily like events" ON "public"."eng_post_like_events_daily"
AS PERMISSIVE FOR SELECT
TO anon, authenticated
USING (true);

-- Create functions
CREATE OR REPLACE FUNCTION "public"."increment_post_like"("p_post_id" uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count bigint;
BEGIN
    INSERT INTO "public"."eng_post_like_counters" ("post_id", "like_count", "updated_at")
    VALUES ("p_post_id", 1, now())
    ON CONFLICT ("post_id") 
    DO UPDATE SET 
        "like_count" = "eng_post_like_counters"."like_count" + 1,
        "updated_at" = now()
    RETURNING "like_count" INTO new_count;
    
    RETURN new_count;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."decrement_post_like"("p_post_id" uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count bigint;
BEGIN
    -- First ensure the row exists
    INSERT INTO "public"."eng_post_like_counters" ("post_id", "like_count", "updated_at")
    VALUES ("p_post_id", 0, now())
    ON CONFLICT ("post_id") DO NOTHING;
    
    -- Then decrement with floor at 0
    UPDATE "public"."eng_post_like_counters" 
    SET 
        "like_count" = GREATEST("like_count" - 1, 0),
        "updated_at" = now()
    WHERE "post_id" = "p_post_id"
    RETURNING "like_count" INTO new_count;
    
    RETURN new_count;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."get_post_like_count"("p_post_id" uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_count bigint;
BEGIN
    SELECT COALESCE("like_count", 0) INTO result_count
    FROM "public"."eng_post_like_counters" 
    WHERE "post_id" = "p_post_id";
    
    RETURN COALESCE(result_count, 0);
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION "public"."increment_post_like"(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION "public"."decrement_post_like"(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION "public"."get_post_like_count"(uuid) TO service_role;
GRANT SELECT ON "public"."eng_post_like_counters" TO anon, authenticated;
GRANT SELECT ON "public"."eng_post_like_events_daily" TO anon, authenticated;
