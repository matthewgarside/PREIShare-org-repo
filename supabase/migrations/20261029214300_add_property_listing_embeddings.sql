-- Store one 1536-dimensional semantic embedding with each property listing.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Keep the existing listing columns, sponsor ownership, and RLS policies.
ALTER TABLE public.property_listings
  ADD COLUMN embedding extensions.vector(1536);
