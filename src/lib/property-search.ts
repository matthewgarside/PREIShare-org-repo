-- src/lib/property-search.ts
// Scaffold shape — wire to YOUR Supabase client and generateEmbedding export.

import { generateEmbedding } from './embeddings/generate';
import type { EmbeddingVector } from './embeddings/types';
// import { supabase } from './supabase'; // use your existing client path

export type PropertyMatch = {
  id: string;
  title: string;
  description: string;
  location: string;
  similarity: number;
};

export async function searchPropertiesByText(
  query: string,
  matchCount = 5
): Promise<PropertyMatch[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const embedding: EmbeddingVector = await generateEmbedding(trimmed);

  const { data, error } = await supabase.rpc('match_properties', {
    query_embedding: embedding,
    match_count: matchCount,
  });

  if (error) {
    throw new Error(`match_properties failed: ${error.message}`);
  }

  return (data ?? []) as PropertyMatch[];
}