# PREIshare pgvector setup plan

## Purpose
This plan describes how a later lesson could prepare PostgreSQL to store
property embeddings and compare them for semantic search. It is for planning
only; no migration or database change is being made here.

## Source of truth
- Data model: [docs/embedding-data-model.md](./embedding-data-model.md)
- Existing property table: `public.property_listings`
- Proposed embedding column: `embedding`
- Embedding model: `text-embedding-3-small`
- Planned vector type: `vector(1536)`
- Similarity approach: cosine distance using pgvector's `<=>` operator

The existing property listing migration creates `public.property_listings`.
The data model proposes adding `embedding` to that table; it does not propose
a separate `properties` table.

## Migration goals (what “done” means)
1. Prepare PostgreSQL to store property embeddings.
2. Use pgvector to store vectors and support similarity comparisons.
3. Plan how the embedding field fits into the existing property data model.
4. Keep the setup manageable for a small PREIShare demo.
5. Check the extension, table, column, dimension, identifiers, null handling,
   sample vector storage and retrieval, ranking, and top-K behavior.

The embedding model generates the numbers from a property's title and summary.
PostgreSQL stores the generated vector; it does not create embeddings itself.
The same model and 1536-dimensional settings must be used for both property
text and investor queries.

## Safe migration order (must not be reordered)
The following is the planned order for a future migration and verification.
These are not instructions to execute anything during this lesson.

### Step 1: Enable pgvector
PostgreSQL needs the pgvector extension before it can use its vector data type
and distance operators. The extension is named `vector`.

**Why this comes first:** The property table cannot have a pgvector column
until PostgreSQL knows about the vector type.

### Step 2: Create or Update the Property Table
The existing table name is `public.property_listings`. Its current migration
already creates the table and listing fields, including `id`, `title`,
`summary`, `city`, and `asking_price`. A future migration should update that
existing table by adding the proposed `embedding` column, rather than create a
duplicate property table.

The data model selects OpenAI's `text-embedding-3-small`, which produces
1536-dimensional embeddings by default. The planned column type is
`vector(1536)`. Property text and investor queries must use the same model and
dimension settings so their vectors can be compared.

During the initial backfill, existing property rows may temporarily have a
`NULL` embedding while their vectors are generated and saved. Once the
required backfill is complete, the intended design is for listings eligible
for semantic search to have a non-`NULL` embedding. This plan does not change
the current required fields or constraints such as `title` and `summary`.

**Why this comes after Step 1:** Adding the vector column depends on pgvector
being available. The table and column must exist before an index or checks for
that column can be considered.

### Step 3: Use Exact Cosine-Distance Search Without a Specialized Vector Index
For this small demo, use exact similarity searches without a specialized
vector index. An exact search compares the query embedding against the stored
property embeddings to find the closest matches. Starting without an
approximate index keeps the first results easier to understand and verify.

If the dataset grows enough to need faster searches, PREIShare can consider an
HNSW index with the cosine-distance operator class that matches `<=>`.
Approximate indexes can improve speed on larger datasets, but they add
complexity and may involve tradeoffs in result accuracy.

**Why this follows Step 2:** Exact searches need the stored embedding column
to exist, but do not require a separate index. Once the column is ready, this
simple approach lets us verify matches before considering optimization.

### Step 4: Verification Queries
After a future migration, we can check the setup before relying on semantic
search. The checks below use the table and column names from the data model.
They are examples for a later lesson, not queries to run now.

**Check that the extension is enabled:**

```sql
select extname
from pg_extension
where extname = 'vector';
```

The result should include `vector`.

**Check that the expected table exists:**

```sql
select to_regclass('public.property_listings') as property_table;
```

The result should be `public.property_listings`, not null.

**Check that the embedding column exists and is a vector:**

```sql
select column_name, data_type, udt_name, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'property_listings'
  and column_name = 'embedding';
```

The column should be present and have a vector type. During backfill it may
allow nulls. The final nullability rule applies to listings eligible for
semantic search after backfill.

**Check the configured vector dimension:**

```sql
select pg_catalog.format_type(attribute.atttypid, attribute.atttypmod)
  as embedding_type
from pg_attribute as attribute
where attribute.attrelid = 'public.property_listings'::regclass
  and attribute.attname = 'embedding'
  and not attribute.attisdropped;
```

The expected type is `vector(1536)`, matching the default dimension for
`text-embedding-3-small`.

**Check that property identifiers remain unique:**

```sql
select id, count(*) as copies
from public.property_listings
group by id
having count(*) > 1;
```

This should return no rows. The existing `id` primary key is already meant to
enforce uniqueness; this is a check that it remains true.

**Check null embeddings during setup or after backfill:**

```sql
select
  count(*) as total_listings,
  count(*) filter (where embedding is null) as listings_without_embedding,
  count(*) filter (where embedding is not null) as listings_with_embedding
from public.property_listings;
```

During backfill, some nulls may be expected. After the required backfill,
listings eligible for semantic search should have embeddings.

**Check that a sample vector can be retrieved:**
As part of a later test, a controlled sample embedding can be stored against
an appropriate test listing and then read back by its `id`. For example:

```sql
select id, title, embedding
from public.property_listings
where id = :sample_property_id;
```

The test should confirm that the expected listing and its non-null vector are
returned. The sample write and cleanup belong to a future implementation or
test step, not this planning document.

**Check cosine-distance ordering and top-K:**
PREIShare will use cosine distance with `<=>`. Lower distance means a closer
match, so results should be sorted by ascending distance before the top-K
limit is applied:

```sql
select id, title, summary,
       embedding <=> cast(:query_embedding as vector(1536)) as distance
from public.property_listings
where embedding is not null
order by embedding <=> cast(:query_embedding as vector(1536)) asc
limit :top_k;
```

The `:query_embedding` and `:top_k` names are placeholders for values supplied
by the later test or search code, not literal SQL values. Check that returned
distances go from lower (closer) to higher (farther), and that the number of
rows is no greater than the requested top-K. The same cosine-distance
operator and ascending order should be used consistently in later SQL
functions and tests. Tests and future search must also run under the intended
access rules so results do not reveal listings a user cannot view.

**Why verification comes last:** These checks need the extension and the
updated table to exist. Ranking and top-K checks also need sample embeddings
created with `text-embedding-3-small` and a compatible 1536-dimensional query
embedding.

## Similarity approach (beginner demo)
pgvector provides different ways to compare vectors. These operators return
distances or related values that can be sorted to put closer matches first.

| Operator | Simple explanation | How lower values are used |
| --- | --- | --- |
| Cosine distance (`<=>`) | Compares the direction of the vectors, which can be useful for comparing the meaning of text. | Smaller distance means a closer match. |
| Euclidean distance (`<->`) | Measures straight-line distance between the vectors. | Smaller distance means a closer match. |
| Negative inner product (`<#>`) | Compares how strongly vectors point in similar directions, with the result negated for database ordering. | Smaller (more negative) values mean a stronger match by this comparison. |

Cosine distance is selected for comparing property
description meanings in this tutorial. Other operators are available, but
future search SQL and tests should consistently use `<=>`. Lower cosine
distance means a closer match, so sort from smaller distance to larger
distance to put the best matches first. If an HNSW index is considered later,
its operator class must match cosine distance.

## Index recommendation
- The tutorial uses a relatively small sample of property listings, so the
  initial decision is exact similarity search without a specialized vector
  index.
- Exact searches compare the query embedding with stored embeddings and make
  the initial results easier to understand and verify.
- If the dataset grows, PREIShare can consider an HNSW index with the
  appropriate cosine-distance operator class.
- An approximate index may improve performance with larger datasets, but it
  adds complexity and can involve tradeoffs in result accuracy.
- First verify that PREIShare returns relevant listings in the right order;
  optimization can wait.

## Environment values (high level—no secrets in this file)
Only variable names and their purposes are listed here:

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Public | Points browser-facing Supabase clients to the project. |
| `VITE_SUPABASE_ANON_KEY` | Public | Lets browser-facing clients connect using the public anon key; it does not replace authentication or Row Level Security. |
| `SUPABASE_URL` | Server-side override | Provides the Supabase project URL to trusted server code when an override is needed. |
| `SUPABASE_ANON_KEY` | Server-side override | Provides the public anon key to trusted server code when an override is needed. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Provides privileged Supabase access for explicitly authorized administrative work. |
| `OPENAI_API_KEY` | Proposed server-only | Lets trusted server code call the selected OpenAI embedding provider to create vectors. |

The `.env.example` already uses `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY`. `OPENAI_API_KEY` is a proposed name for the
selected embedding provider and is not currently in that example. The project
setup uses Supabase configuration; no `DATABASE_URL` direct-connection
convention was found, so this plan does not add a second database connection
method.

Never put `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` in browser code,
public files, or client-visible variables. A service-role client can bypass
RLS, so it does not automatically enforce user-specific listing access.
Semantic search for an investor must use an authenticated request and respect
the existing listing visibility and RLS rules.

Store sensitive values only in protected local or server-side secret
configuration. Never include secret values in documentation or Git commits.

Existing authentication and Row Level Security rules for
`property_listings` still apply. A future semantic search must respect the
signed-in user's allowed access to listings rather than making protected
property data public.

## Out of scope for this migration plan
- Executing database migrations or changing the database schema.
- Generating embeddings or writing embedding-generation scripts.
- Implementing similarity-search SQL functions.
- Creating TypeScript API endpoints.
- Building search page components.
- Changing authentication or Row Level Security policies.
- Payment processing.
- Production-scale embedding pipelines.
- Advanced ranking or recommendation systems.

These are out of scope for this planning lesson only. This does not mean they
are excluded from the full PREIShare semantic search tutorial.

## Open questions
- When will existing property listings receive embeddings?
- How will missing embeddings be handled during the initial setup?
- How will we verify that searches return relevant properties?
- How will existing security policies apply to semantic search results?

## Handoff to next step
This document records the setup order and checks for a future implementation
lesson. The model, dimension, cosine-distance operator, and initial no-index
approach are now set for the tutorial. A future lesson still needs to
implement and test the migration and decide how to backfill existing listings
while respecting their access rules.
