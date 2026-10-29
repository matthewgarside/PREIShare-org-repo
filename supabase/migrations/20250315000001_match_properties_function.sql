-- Search the properties created by 20250315000000_enable_pgvector_properties.sql.
-- That earlier migration defines public.properties with a UUID id, title,
-- description, location, price_usd, and embedding vector(1536).
-- The planning documents instead describe public.property_listings; the earlier
-- migration is the schema reference for this function.
--
-- The earlier migration does not explicitly choose the extension schema.
-- This function expects vector and its cosine operator in public; verify the
-- target database's extension schema before applying this migration.
--
-- Migration history still has a version collision: the two 20250321000000
-- files share a version. Resolve that collision before applying the migration
-- history as a whole. This function only depends on the earlier 20250315000000
-- pgvector/properties migration.

create or replace function public.match_properties(
  query_embedding public.vector(1536),
  match_count integer default 5
)
returns table (
  id uuid,
  title text,
  description text,
  location text,
  price_usd numeric,
  distance double precision
)
language plpgsql
stable
security invoker
set search_path = public
as $function$
begin
  -- The query embedding represents the investor's search text and must have
  -- the same 1536 dimensions as the stored property embeddings.
  if query_embedding is null then
    raise exception using
      errcode = '22004',
      message = 'query_embedding must not be null';
  end if;

  -- Top-K is the number of closest properties to return; keep it between 1 and 20.
  if match_count not between 1 and 20 then
    raise exception using
      errcode = '22023',
      message = 'match_count must be between 1 and 20';
  end if;

  return query
  select
    p.id,
    p.title,
    p.description,
    p.location,
    p.price_usd,
    p.embedding OPERATOR(public.<=>) query_embedding as distance
  from public.properties as p
  -- Properties without embeddings cannot be compared and are left out.
  where p.embedding is not null
  -- Cosine distance compares vector direction, which is useful for embedding
  -- meaning; smaller distance means a closer match.
  order by p.embedding OPERATOR(public.<=>) query_embedding asc
  limit match_count;
end;
$function$;

-- PostgreSQL grants function execution to PUBLIC by default. Keep the function
-- unavailable to browser and service roles until property visibility and the
-- intended authorized calling method are designed. The function owner retains
-- the ability to execute it.
revoke all on function public.match_properties(public.vector, integer)
  from public, anon, authenticated, service_role;

-- The application uses the authenticated role, but public.properties has no
-- RLS policies or authenticated table grants in its creating migration.
-- Do not grant RPC execution until listing visibility and table access are
-- designed; SECURITY INVOKER must not be used to bypass those restrictions.
--
-- Once access is approved, TypeScript can call this through Supabase RPC with
-- the matching parameter names: query_embedding and match_count.
