import { createServerFn } from "@tanstack/react-start";
import {
  assertEmbeddingDimension,
  generatePropertyEmbedding,
} from "./embeddings/generate";
import { EMBEDDING_DIMENSION } from "./embeddings/types";
import { createSupabaseServerClient } from "./supabase.server";

const DEFAULT_MATCH_COUNT = 5;
const MAX_MATCH_COUNT = 20;

export type PropertyMatch = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  price_usd: number | null;
  distance: number;
};

type SearchInput = {
  query: string;
  matchCount: number;
};

type MatchPropertiesRpc = (
  functionName: "match_properties",
  args: {
    query_embedding: number[];
    match_count: number;
  }
) => PromiseLike<{
  data: PropertyMatch[] | null;
  error: { message: string } | null;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateSearchInput(input: unknown): SearchInput {
  if (!isRecord(input) || typeof input.query !== "string") {
    throw new Error("Enter a property search query.");
  }

  const query = input.query.trim();
  if (!query) {
    throw new Error("Enter a property search query.");
  }

  const matchCount = input.matchCount ?? DEFAULT_MATCH_COUNT;
  if (
    typeof matchCount !== "number" ||
    !Number.isInteger(matchCount) ||
    matchCount < 1 ||
    matchCount > MAX_MATCH_COUNT
  ) {
    throw new Error(`Result count must be between 1 and ${MAX_MATCH_COUNT}.`);
  }

  return { query, matchCount };
}

export const searchProperties = createServerFn({ method: "POST" })
  .validator(validateSearchInput)
  .handler(async ({ data }): Promise<PropertyMatch[]> => {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Sign in before searching properties.");
    }

    // The existing helper accepts property text, so use the query as its title.
    const embeddingResult = await generatePropertyEmbedding({
      title: data.query,
      summary: "",
    });

    if (!embeddingResult.ok) {
      if (embeddingResult.code === "MISSING_API_KEY") {
        throw new Error("Property search is not configured on the server.");
      }
      if (embeddingResult.code === "WRONG_DIMENSION") {
        throw new Error(
          `The search embedding must contain ${EMBEDDING_DIMENSION} values.`
        );
      }
      if (embeddingResult.code === "EMPTY_TEXT") {
        throw new Error("Enter a property search query.");
      }
      throw new Error("Could not create an embedding for this search.");
    }

    if (!assertEmbeddingDimension(embeddingResult.embedding)) {
      throw new Error(
        `The search embedding must contain ${EMBEDDING_DIMENSION} valid numbers.`
      );
    }

    // The generated Supabase Database type does not yet include this RPC.
    const rpc = supabase.rpc.bind(supabase) as MatchPropertiesRpc;
    const { data: matches, error } = await rpc("match_properties", {
      query_embedding: embeddingResult.embedding,
      match_count: data.matchCount,
    });

    if (error) {
      throw new Error("Property search could not be completed.");
    }

    // SQL returns results ordered by ascending cosine distance; preserve that order.
    return matches ?? [];
  });
