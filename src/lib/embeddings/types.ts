/** Expected vector size from the selected embedding model. */
export const EMBEDDING_DIMENSION = 1536;

/** Property text used to create an embedding. */
export interface PropertyEmbeddingInput {
  title: string;
  summary: string;
}

/** A successfully generated embedding vector. */
export interface EmbeddingSuccess {
  ok: true;
  embedding: number[];
  model?: string;
}

/** Known reasons an embedding could not be generated. */
export type EmbeddingErrorCode =
  | "EMPTY_TEXT"
  | "WRONG_DIMENSION"
  | "MISSING_API_KEY"
  | "PROVIDER_ERROR";

/** Details about a failed embedding attempt. */
export interface EmbeddingFailure {
  ok: false;
  code: EmbeddingErrorCode;
  message: string;
}

/** Either a generated vector or a typed failure. */
export type EmbeddingResult = EmbeddingSuccess | EmbeddingFailure;
