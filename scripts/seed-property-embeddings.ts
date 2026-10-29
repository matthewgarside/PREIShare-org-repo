import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { generatePropertyEmbedding } from "../src/lib/embeddings/generate";
import { EMBEDDING_DIMENSION } from "../src/lib/embeddings/types";

type SampleProperty = {
  title: string;
  description: string;
  location: string;
  price_usd: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSampleProperty(value: unknown): value is SampleProperty {
  if (!isRecord(value)) {
    return false;
  }

  const allowedFields = new Set(["title", "description", "location", "price_usd"]);
  return (
    Object.keys(value).every((field) => allowedFields.has(field)) &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.description === "string" &&
    value.description.trim().length > 0 &&
    typeof value.location === "string" &&
    value.location.trim().length > 0 &&
    typeof value.price_usd === "number" &&
    Number.isFinite(value.price_usd) &&
    value.price_usd >= 0
  );
}

async function main() {
  if (typeof window !== "undefined") {
    throw new Error("This seed script can only run in a server-side Node.js environment.");
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
  const missingConfiguration = [
    !supabaseUrl && "SUPABASE_URL",
    !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
    !openAiApiKey && "OPENAI_API_KEY",
  ].filter((name): name is string => Boolean(name));

  if (!supabaseUrl || !serviceRoleKey || !openAiApiKey) {
    throw new Error(`Missing required server environment variable(s): ${missingConfiguration.join(", ")}.`);
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const filePath = path.join(process.cwd(), "data", "sample-properties.json");
  const rawData: unknown = JSON.parse(await readFile(filePath, "utf8"));
  if (!isRecord(rawData) || !Array.isArray(rawData.properties)) {
    throw new Error("Sample data must contain a properties array.");
  }

  const properties: unknown[] = rawData.properties;
  if (properties.length === 0 || !properties.every(isSampleProperty)) {
    throw new Error(
      "Each sample property must have a title, description, location, and non-negative price_usd, with no other fields."
    );
  }

  let insertedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  // The schema has no unique sample key, so exact matching protects sequential reruns, not concurrent ones.
  for (const property of properties) {
    if (!isSampleProperty(property)) {
      failedCount += 1;
      console.error("Sample property validation failed.");
      continue;
    }

    const { data: existingProperties, error: lookupError } = await client
      .from("properties")
      .select("id")
      .eq("title", property.title)
      .eq("description", property.description)
      .eq("location", property.location)
      .eq("price_usd", property.price_usd)
      .limit(1);

    if (lookupError) {
      failedCount += 1;
      console.error(
        `Could not check whether "${property.title}" already exists (database code: ${lookupError.code ?? "unknown"}).`
      );
      continue;
    }

    if (existingProperties.length > 0) {
      skippedCount += 1;
      console.log(`Skipped existing property: ${property.title}`);
      continue;
    }

    const embeddingResult = await generatePropertyEmbedding({
      title: property.title,
      summary: property.description,
    });

    if (!embeddingResult.ok) {
      failedCount += 1;
      console.error(
        `Embedding failed for "${property.title}" (${embeddingResult.code}): ${embeddingResult.message}`
      );
      continue;
    }

    const embedding = embeddingResult.embedding;
    if (
      embedding.length !== EMBEDDING_DIMENSION ||
      !embedding.every((value) => Number.isFinite(value))
    ) {
      failedCount += 1;
      console.error(
        `Embedding for "${property.title}" must contain ${EMBEDDING_DIMENSION} finite numbers.`
      );
      continue;
    }

    const { error: insertError } = await client.from("properties").insert({
      title: property.title,
      description: property.description,
      location: property.location,
      price_usd: property.price_usd,
      embedding,
    });

    if (insertError) {
      failedCount += 1;
      console.error(
        `Could not insert "${property.title}" (database code: ${insertError.code ?? "unknown"}).`
      );
      continue;
    }

    insertedCount += 1;
    console.log(`Inserted property: ${property.title}`);
  }

  const processedCount = insertedCount + skippedCount;
  console.log(
    `Processed ${processedCount} of ${properties.length} properties (${insertedCount} inserted, ${skippedCount} already present, ${failedCount} failed).`
  );

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error.";
  console.error(`Property seed script stopped: ${message}`);
  process.exitCode = 1;
});
