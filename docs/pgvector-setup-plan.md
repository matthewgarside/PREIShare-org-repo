# PREIshare pgvector setup plan

## Purpose
This plan describes how a later lesson could prepare PostgreSQL to store
property embeddings and compare them for semantic search. It is for planning
only; no migration or database change is being made here.

## Source of truth
- Data model: [docs/embedding-data-model.md](./embedding-data-model.md)
- Existing property table: `public.property_listings`
- Proposed embedding column: `embedding`
- Planned vector type: `vector(DIMENSION_TODO)`
- The embedding size and distance metric are still undecided.

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

The data model gives the planned column type as
`vector(DIMENSION_TODO)`. The real dimension has not been selected. It must be
decided from the embedding model and replace `DIMENSION_TODO` before a
migration using the type can be executed. Do not guess a number.

During the initial backfill, existing property rows may temporarily have a
`NULL` embedding while their vectors are generated and saved. Once the
required backfill is complete, the intended design is for listings eligible
for semantic search to have a non-`NULL` embedding. This plan does not change
the current required fields or constraints such as `title` and `summary`.

**Why this comes after Step 1:** Adding the vector column depends on pgvector
being available. The table and column must exist before an index or checks for
that column can be considered.

### Step 3: Consider a Vector Index
A vector index is an extra database structure that can help find nearby
vectors faster when there are many listings. It is not required to store
vectors or run a basic similarity search.

For the small demo, start without a specialized vector index. First make sure
that the stored vectors and result ordering are correct. An index can be
considered later if the dataset grows or performance testing shows a need.

If an index is added later, it must be created after the embedding column, and
its settings must match the distance operator used by the search.

**Why this follows Step 2:** There is no vector column to index until the
existing table has been updated. It is also easier to check a simple search
before adding an optimization.

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

**Check the configured vector dimension after the model is chosen:**

```sql
select pg_catalog.format_type(attribute.atttypid, attribute.atttypmod)
  as embedding_type
from pg_attribute as attribute
where attribute.attrelid = 'public.property_listings'::regclass
  and attribute.attname = 'embedding'
  and not attribute.attisdropped;
```

Compare the reported type with the dimension required by the chosen model.
Until that choice is made, the data model uses `DIMENSION_TODO`; that
placeholder is not a real dimension that can be used to execute a migration.

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

**Check similarity ordering and top-K:**
Once a metric and compatible query embedding are selected, a later search
check should order by that operator's distance in ascending order and then
apply the requested limit. For example, if cosine distance is selected:

```sql
select id, title, summary, embedding <=> :query_embedding as distance
from public.property_listings
where embedding is not null
order by embedding <=> :query_embedding asc
limit :top_k;
```

The `:query_embedding` and `:top_k` names are placeholders for values supplied
by the later test or search code, not literal SQL values. Check that returned
distances go from lower (closer) to higher (farther), and that the number of
rows is no greater than the requested top-K. The cosine example is only
applicable if that operator is chosen. Tests and future search must also run
under the intended access rules so results do not reveal listings a user
cannot view.

**Why verification comes last:** These checks need the extension and the
updated table to exist. Ranking and top-K checks also need a chosen dimension,
sample embeddings, and a selected operator.

## Similarity approach (beginner demo)
pgvector provides different ways to compare vectors. These operators return
distances or related values that can be sorted to put closer matches first.

| Operator | Simple explanation | How lower values are used |
| --- | --- | --- |
| Cosine distance (`<=>`) | Compares the direction of the vectors, which can be useful for comparing the meaning of text. | Smaller distance means a closer match. |
| Euclidean distance (`<->`) | Measures straight-line distance between the vectors. | Smaller distance means a closer match. |
| Negative inner product (`<#>`) | Compares how strongly vectors point in similar directions, with the result negated for database ordering. | Smaller (more negative) values mean a stronger match by this comparison. |

Cosine distance may be a reasonable starting option for comparing property
description meanings, but the metric is not decided yet. Whichever operator is
selected must be used consistently for ranking search results and setting up a
future vector index. For a distance operator, results should be sorted from
smaller distance to larger distance so the closest matches appear first.

## Index recommendation
- The tutorial uses a relatively small sample of property listings.
- A normal similarity search without a specialized vector index should be
  enough to start.
- An approximate vector index can make larger searches faster, but adds setup
  and tuning complexity.
- HNSW or IVFFlat can be considered later if the listing data grows or
  performance checks show a need.
- First verify that PREIShare returns relevant listings in the right order;
  optimization can wait.

## Environment values (high level—no secrets in this file)
The application may need configuration to connect to the right Supabase
project and database:

- **Database connection configuration:** A database connection string or
  other approved connection settings may be needed for trusted server-side
  database or migration work.
- **Public Supabase configuration:** The Supabase project URL and public
  client key may be used by browser-facing code where appropriate. These do
  not replace authentication or Row Level Security.
- **Server-only credentials:** A database password, privileged connection
  string, or Supabase service-role credential must stay on the server and
  must not be used to bypass normal user access checks.
- **Safe storage:** Sensitive values belong in approved secret storage or
  protected local/server environment configuration. They must never appear in
  browser code, public files, or Git commits.

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
- Which embedding model will PREIShare use?
- What vector dimension does the selected model require?
- Which distance operator should be selected?
- When will existing property listings receive embeddings?
- How will missing embeddings be handled during the initial setup?
- When would a vector index become necessary?
- How will we verify that searches return relevant properties?
- How will existing security policies apply to semantic search results?

## Handoff to next step
This document records the setup order and checks for a future implementation
lesson. Before any migration is executed, the team still needs to choose the
embedding model and dimension, confirm the distance operator, and decide how
to handle existing listings and their access rules.
