import { createServerOnlyFn } from "@tanstack/react-start";
import {
  EMBEDDING_DIMENSION,
  type EmbeddingResult,
  type PropertyEmbeddingInput,
} from "./types";

/** Check that a vector contains finite numbers and has the expected size. */
export function assertEmbeddingDimension(embedding: number[]): boolean {
  return (
    embedding.length === EMBEDDING_DIMENSION &&
    embedding.every((value) => Number.isFinite(value))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item: unknown) => typeof item === "number" && Number.isFinite(item)
    )
  );
}

/** Generate a property embedding using the server-side OpenAI API. */
export const generatePropertyEmbedding = createServerOnlyFn(
  async (input: PropertyEmbeddingInput): Promise<EmbeddingResult> => {
    const text = [input.title, input.summary]
      .map((part) => (typeof part === "string" ? part.trim() : ""))
      .filter(Boolean)
      .join("\n\n");

    if (!text) {
      return {
        ok: false,
        code: "EMPTY_TEXT",
        message: "Property title and summary must contain text.",
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey?.trim()) {
      return {
        ok: false,
        code: "MISSING_API_KEY",
        message: "The server embedding API key is not configured.",
      };
    }

    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text,
        }),
      });

      if (!response.ok) {
        return {
          ok: false,
          code: "PROVIDER_ERROR",
          message: "The embedding provider could not process the request.",
        };
      }

      const result: unknown = await response.json();
      if (!isRecord(result) || !Array.isArray(result.data)) {
        return {
          ok: false,
          code: "PROVIDER_ERROR",
          message: "The embedding provider returned an invalid response.",
        };
      }

      const firstResult: unknown = result.data[0];
      if (!isRecord(firstResult) || !isFiniteNumberArray(firstResult.embedding)) {
        return {
          ok: false,
          code: "PROVIDER_ERROR",
          message: "The embedding provider returned an invalid vector.",
        };
      }

      const embedding = firstResult.embedding;
      if (!assertEmbeddingDimension(embedding)) {
        return {
          ok: false,
          code: "WRONG_DIMENSION",
          message: `The embedding must contain ${EMBEDDING_DIMENSION} values.`,
        };
      }

      return {
        ok: true,
        embedding,
        model: "text-embedding-3-small",
      };
    } catch {
      return {
        ok: false,
        code: "PROVIDER_ERROR",
        message: "The embedding provider request failed.",
      };
    }
  }
);
