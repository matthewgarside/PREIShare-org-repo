-- DEVELOPMENT ONLY: manually review and run this in the isolated PREIShare-Dev
-- project. Do not run against production, and do not move this file into
-- supabase/migrations. This is a one-off demonstration setup, not a replacement
-- for the application's canonical migration history.
--
-- The properties schema and result shape follow the accepted March 15
-- properties migration. pgvector is placed in the extensions schema, consistent
-- with the later Supabase extension setup. Stop and review if pgvector is
-- already installed in a different schema; this script will not move it. The
-- function is created, not replaced, so this script fails rather than
-- overwriting a match_properties function from the separate property_listings
-- system.

BEGIN;

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

DO $check_vector_schema$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_extension AS extension
    JOIN pg_catalog.pg_namespace AS extension_schema
      ON extension_schema.oid = extension.extnamespace
    WHERE extension.extname = 'vector'
      AND extension_schema.nspname = 'extensions'
  ) THEN
    RAISE EXCEPTION
      'pgvector must be installed in the extensions schema for this development setup; review its current schema before proceeding';
  END IF;
END;
$check_vector_schema$;

-- This table contains fictional sample properties only. Keep its fields aligned
-- with data/sample-properties.json and scripts/seed-property-embeddings.ts.
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text,
  price_usd numeric,
  embedding extensions.vector(1536),
  created_at timestamptz NOT NULL DEFAULT pg_catalog.now()
);

COMMENT ON TABLE public.properties IS
  'Fictional PREIshare development properties for semantic-search demonstration.';
COMMENT ON COLUMN public.properties.embedding IS
  'text-embedding-3-small vector; 1536 dimensions.';

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Authenticated development users may read the fictional sample set. This
-- permissive policy is for this isolated demonstration only; it is not a
-- replacement for sponsor-ownership policies on property_listings.
DO $create_read_policy$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'properties'
      AND policyname = 'dev_semantic_search_authenticated_read'
  ) THEN
    CREATE POLICY dev_semantic_search_authenticated_read
      ON public.properties
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END;
$create_read_policy$;

REVOKE ALL ON TABLE public.properties FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON TABLE public.properties TO authenticated;

-- The seed script runs server-side with the service-role key. Never expose that
-- key to browser code; only the server-side seeding process needs these rights.
GRANT SELECT, INSERT ON TABLE public.properties TO service_role;

-- The RPC runs as the caller, so its SELECT is constrained by the table's RLS
-- policy. Explicitly qualify the pgvector type and cosine operator.
CREATE FUNCTION public.match_properties(
  query_embedding extensions.vector(1536),
  match_count integer DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  location text,
  price_usd numeric,
  distance double precision
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog, public, extensions
AS $function$
BEGIN
  IF query_embedding IS NULL THEN
    RAISE EXCEPTION USING
      ERRCODE = '22004',
      MESSAGE = 'query_embedding must not be null';
  END IF;

  IF match_count NOT BETWEEN 1 AND 20 THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'match_count must be between 1 and 20';
  END IF;

  RETURN QUERY
  SELECT
    property.id,
    property.title,
    property.description,
    property.location,
    property.price_usd,
    property.embedding OPERATOR(extensions.<=>) query_embedding AS distance
  FROM public.properties AS property
  WHERE property.embedding IS NOT NULL
  ORDER BY property.embedding OPERATOR(extensions.<=>) query_embedding ASC
  LIMIT match_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.match_properties(extensions.vector, integer)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public, extensions TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_properties(extensions.vector, integer)
  TO authenticated;

COMMIT;

-- Read-only verification queries. Run these separately after applying the
-- setup statements above; all four should report the expected schema/access.

-- pgvector is installed under extensions and properties.embedding is vector(1536).
SELECT
  extension_schema.nspname AS vector_schema,
  pg_catalog.format_type(column_definition.atttypid, column_definition.atttypmod)
    AS embedding_type
FROM pg_catalog.pg_extension AS extension
JOIN pg_catalog.pg_namespace AS extension_schema
  ON extension_schema.oid = extension.extnamespace
JOIN pg_catalog.pg_class AS table_definition
  ON table_definition.oid = 'public.properties'::pg_catalog.regclass
JOIN pg_catalog.pg_namespace AS table_schema
  ON table_schema.oid = table_definition.relnamespace
JOIN pg_catalog.pg_attribute AS column_definition
  ON column_definition.attrelid = table_definition.oid
WHERE extension.extname = 'vector'
  AND table_schema.nspname = 'public'
  AND column_definition.attname = 'embedding'
  AND NOT column_definition.attisdropped;

-- Confirm function signature, return contract, invoker security, and search_path.
SELECT
  procedure.oid::pg_catalog.regprocedure AS function_signature,
  pg_catalog.pg_get_function_result(procedure.oid) AS return_type,
  procedure.prosecdef AS is_security_definer,
  procedure.proconfig AS function_settings
FROM pg_catalog.pg_proc AS procedure
WHERE procedure.oid =
  'public.match_properties(extensions.vector,integer)'::pg_catalog.regprocedure;

-- Confirm only authenticated callers have RPC execution permission.
SELECT
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.match_properties(extensions.vector,integer)',
    'EXECUTE'
  ) AS authenticated_can_execute,
  pg_catalog.has_function_privilege(
    'anon',
    'public.match_properties(extensions.vector,integer)',
    'EXECUTE'
  ) AS anon_can_execute,
  EXISTS (
    SELECT 1
    FROM pg_catalog.pg_proc AS procedure
    CROSS JOIN LATERAL pg_catalog.aclexplode(
      COALESCE(
        procedure.proacl,
        pg_catalog.acldefault('f', procedure.proowner)
      )
    ) AS permission
    WHERE procedure.oid =
      'public.match_properties(extensions.vector,integer)'::pg_catalog.regprocedure
      AND permission.grantee = 0
      AND permission.privilege_type = 'EXECUTE'
  ) AS public_can_execute;

-- Confirm RLS, the authenticated read policy, and table-level access.
SELECT
  table_definition.relrowsecurity AS row_level_security_enabled,
  pg_catalog.has_table_privilege('authenticated', 'public.properties', 'SELECT')
    AS authenticated_can_select,
  pg_catalog.has_table_privilege('anon', 'public.properties', 'SELECT')
    AS anon_can_select,
  policy.policyname,
  policy.roles,
  policy.qual AS read_condition
FROM pg_catalog.pg_class AS table_definition
JOIN pg_catalog.pg_namespace AS table_schema
  ON table_schema.oid = table_definition.relnamespace
LEFT JOIN pg_catalog.pg_policies AS policy
  ON policy.schemaname = table_schema.nspname
  AND policy.tablename = table_definition.relname
  AND policy.policyname = 'dev_semantic_search_authenticated_read'
WHERE table_schema.nspname = 'public'
  AND table_definition.relname = 'properties';
