-- Enable pgvector so PostgreSQL can store and compare embedding vectors.
-- Safe to re-run: IF NOT EXISTS avoids errors if the extension is already on.
CREATE EXTENSION IF NOT EXISTS vector;

-- Properties table for PREIshare sample listings + semantic search.
-- embedding dimension MUST match the embedding model used in app code (here: 1536).
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text,
  -- Optional business fields used later for display; keep simple for this sprint.
  price_usd numeric,
  -- Vector column: one embedding per property description (and related text).
  -- Do not change 1536 without also changing the TypeScript embedding module.
  embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Optional readability aid for humans browsing the schema in Supabase.
COMMENT ON TABLE properties IS 'PREIshare investment listings; embedding powers semantic search.';
COMMENT ON COLUMN properties.embedding IS 'pgvector embedding of property text; dimension 1536.';

-- Helpful index for later similarity search (cosine distance via vector_cosine_ops).
-- Creating it now is fine even before rows exist; seed step will fill embeddings.
CREATE INDEX IF NOT EXISTS properties_embedding_ivfflat_idx
  ON properties
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);