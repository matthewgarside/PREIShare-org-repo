-- Search only listings the authenticated caller can read through existing RLS.
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
SET search_path = ''
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
    listing.id,
    listing.title,
    listing.summary AS description,
    pg_catalog.concat_ws(
      ', ',
      NULLIF(listing.address_line1, ''),
      NULLIF(listing.address_line2, ''),
      NULLIF(listing.city, ''),
      NULLIF(listing.region, ''),
      NULLIF(listing.postal_code, ''),
      NULLIF(listing.country, '')
    ) AS location,
    CASE
      WHEN listing.currency = 'USD' THEN listing.asking_price
      ELSE NULL
    END AS price_usd,
    listing.embedding OPERATOR(extensions.<=>) query_embedding AS distance
  FROM public.property_listings AS listing
  WHERE listing.embedding IS NOT NULL
  ORDER BY listing.embedding OPERATOR(extensions.<=>) query_embedding ASC
  LIMIT match_count;
END;
$function$;

-- Match the existing TypeScript response shape without mislabeling other currencies.
COMMENT ON FUNCTION public.match_properties(extensions.vector, integer) IS
  'Returns visible listings ranked by cosine distance; summary is description, and price_usd is null unless currency is USD.';

-- Supabase functions default to PUBLIC execution; allow only authenticated callers.
REVOKE ALL ON FUNCTION public.match_properties(extensions.vector, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.match_properties(extensions.vector, integer)
  TO authenticated;
