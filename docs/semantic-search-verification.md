# PREIShare Semantic Search Verification

## Overview

Semantic search is intended to let an investor describe a property in everyday
language and find listings that mean something similar, even when they use
different words. For example, “cabin near water” should be able to find a
lakeside vacation home. This report separates what was confirmed by reading
the project files from what still needs to be tested with a working database
and app.

## Environment and Setup

The project is a React and TypeScript application using TanStack Start and
file-based TanStack Router routes. The search page is
`src/routes/search.tsx`; it calls the `/api/properties/search` route, which
uses the server-side property search helper.

The embedding code uses OpenAI's `text-embedding-3-small` model. The project
expects 1536-dimensional vectors: the TypeScript dimension constant, vector
validation, and `vector(1536)` database column agree. The database function
uses pgvector's cosine-distance operator (`<=>`) and sorts in ascending order,
so a smaller distance means a closer match. The page displays the returned
distance to three decimal places and states this ordering.

The code review and `npm run typecheck` were performed locally. The typecheck
passed. The app was not started for this review, and no browser or database
results were available. No embedding API call, database write, migration, or
seed run was performed.

There is an important difference between the planned data model and the
implemented search schema. `docs/embedding-data-model.md` describes
`public.property_listings` with a `summary` field and a proposed embedding.
The search migrations and seed script instead use `public.properties` with a
`description` field and an embedding. The seed JSON currently provides eight
varied sample properties, but that file alone does not prove that any records
or embeddings are in the database.

## Database Verification

**NOT VERIFIED.** No database was queried during this review, so the number of
sample records and the number with non-null embeddings are unknown.

The migration defines `public.properties.embedding` as `vector(1536)`, and
the seed script is written to insert each property with an embedding. Those
files describe intended behavior; they are not evidence that the migrations
were applied or that the seed script has successfully run.

Before testing search, use a read-only query in the authorized Supabase SQL
editor to check the data:

```sql
select
  count(*) as property_count,
  count(*) filter (where embedding is not null) as embedded_count
from public.properties;
```

Do not run the seed script just to obtain this result. If the table is missing,
empty, or has no embedded rows, record that result and resolve the setup issue
before evaluating rankings.

## Search Query Test Results

These are the five example queries from
`docs/semantic-search-requirements.md`. Expected results are based on the
meaning described there and the current sample JSON. The actual result column
is intentionally left unfilled: no live query was run, so no titles or
distance scores can be reported.

| Query | Expected result | Actual top three results | Pass/Fail/Not Tested | Notes |
|---|---|---|---|---|
| “cabin near water” | A lakeside vacation home or waterfront cottage. The sample set includes Lakeside Wooden Retreat and Waterfront Vacation Cottage; their descriptions use related wording rather than “cabin.” | Not observed | NOT TESTED | Directly tests whether meaning can match wording that differs from the query. |
| “family-friendly home close to good schools” | A residential house suited to a family and near schools. Suburban Family Home is the closest sample description. | Not observed | NOT TESTED | The description mentions room for a growing family and local schools, not “family-friendly” or “good schools.” |
| “downtown condo walkable to restaurants” | A central apartment or condo near restaurants and shops. Downtown City Loft is a likely fit. | Not observed | NOT TESTED | Downtown Nightlife Apartment is a useful less suitable comparison because its description emphasizes late-night activity. |
| “small apartment building with rental income” | A multi-unit residential property with rental activity. Rental Income Duplex is a likely fit. | Not observed | NOT TESTED | Its description explains the two units and rental options without using every query phrase. |
| “quiet rural place for weekend getaways” | A peaceful country home or vacation property suitable for short stays. Rural Farmhouse is a possible rural/quiet match, but its description does not mention weekend stays. | Not observed | NOT TESTED | Treat the weekend-getaway part as unconfirmed rather than a stated property feature. |

## Keyword-Trap Test

**Suggested test query:** “Peaceful timber getaway beside a lake”

**Expected behavior:** A quiet wooden vacation property near a lake should rank
highly. Lakeside Wooden Retreat is a relevant sample because its description
says it is a quiet wooden vacation home beside a clear lake, although it does
not repeat the full query. Waterfront Vacation Cottage may also be relevant.

**Actual observed behavior:** NOT TESTED. There are no live results or
distances available for this query.

This is useful because the query paraphrases the listing. It tests whether
search can connect related ideas such as “timber” and “wooden,” “getaway” and
“vacation home,” and “beside a lake” and “lakeside,” rather than merely finding
identical words.

The requirements also suggest a contrast query, “farmland for growing crops,”
under the condition that the sample set has no farmland. The current sample
set includes a Rural Farmhouse described as being surrounded by “working
farmland,” so that condition does not hold for this data. Do not treat this
query as a clean no-farmland contrast unless the test data is changed or the
team agrees on how to interpret it.

## Refinement Cycle

**Issue considered:** The search helper requires an authenticated user and
then calls `match_properties` using the authenticated Supabase server client.
However, the match-function migration explicitly revokes execution from the
`authenticated` role. It also notes that the `properties` table has no
authenticated grants or row-level security policies in its creation
migration. This means the app's authenticated RPC request is expected to be
denied by the database as currently described by these migrations.

**File involved:** `supabase/migrations/20250315000001_match_properties_function.sql`
defines and revokes access to the function. The call site is
`src/lib/property-search.ts`.

**Decision and change status:** This is a confirmed configuration conflict by
code inspection. No application or SQL change was made. The smallest safe
correction is to agree on the intended visibility and authorization rules for
`public.properties`, then configure table access and RPC execution consistently
with those rules. Simply granting function execution without deciding who may
read which properties would not be a safe correction.

**Verification needed:** After an authorized database access configuration is
approved and applied by the project team, test an authenticated search through
the API and confirm it returns results. Check the function/table permissions
and access behavior as part of that setup. No database changes were made as
part of this review.

## Requirements Assessment

| Success criterion or implementation requirement | Status | Evidence |
|---|---|---|
| “cabin near water” returns a relevant lakeside listing without the word “cabin” | NOT VERIFIED | A relevant sample is present in the JSON, but no database search was run. |
| A meaning-appropriate sample appears for every documented example query | NOT VERIFIED | The sample descriptions provide plausible candidates; result rankings were not observed. |
| A relevant sample ranks ahead of less relevant samples | NOT VERIFIED | SQL orders by ascending cosine distance and the helper preserves the returned order, but there are no observed results. |
| A directly worded matching sample appears | NOT VERIFIED | No live query was run. |
| The farmland contrast avoids presenting cabins or condos as strong matches when the sample has no farmland | NOT VERIFIED | The current seed set includes a farmhouse that mentions working farmland, so the stated test condition is not met. |
| The team reviews and marks each example against an agreed relevance list | NOT VERIFIED | No review results or agreed list were available. |
| Search accepts natural-language input and rejects a blank query | PASS — by code inspection | The page checks trimmed input; the API rejects blank `q` with HTTP 400; the helper also validates the query. Runtime behavior remains untested. |
| Results use consistent cosine distance and retain server ordering | PASS — by code inspection | SQL uses `<=>` and ascending order; helper returns matches without resorting; UI describes lower distance as closer. Runtime scores are untested. |
| Search page and API routes are registered | PASS — by source inspection | The source routes and generated route tree both contain `/search` and `/api/properties/search`. Browser loading remains untested. |

## Remaining Limitations

- **Database and embeddings:** Record count and embedding nullability have not
  been checked against a live database.
- **Database permissions:** The migration revokes the authenticated role's
  execution of `match_properties`, while the app calls it as an authenticated
  user. The related `properties` table access model is also not established
  in the listed migration. This is a likely blocker for live search.
- **Schema alignment:** The embedding data model describes
  `property_listings`/`summary`; the search migration and seed workflow use
  `properties`/`description`. Confirm which schema is intended before treating
  search setup as complete.
- **Routing:** The route source files and generated route tree currently agree
  on both paths, and typecheck passed. No obvious route registration or import
  problem was found. The earlier “Not Found” error was not reproduced in a
  browser, so it is not confirmed resolved. “Crawling result not available”
  also cannot be diagnosed from source inspection alone.
- **API and ranking:** Request validation, error responses, and server-side
  ranking preservation look consistent by inspection. The endpoint was not
  called, and ranking quality has not been measured.
- **Authentication and setup:** Search requires a signed-in user and valid
  server configuration. The presence and correctness of local environment
  settings were not checked; no secret values were read.
- **Test evidence:** No browser search, API response, empty-query request,
  keyword-trap result, or refinement comparison was performed.

## Conclusion

The source code has a coherent embedding and cosine-distance search flow, and
the TypeScript check passed. Both search routes are present in the generated
route tree. However, the current migration's RPC permissions conflict with
the authenticated search call, and no live database, API, or ranking tests
were performed. The semantic search success criteria therefore remain
unverified. Before presenting this as working search, confirm the database
schema and authorized RPC access, check that sample rows have embeddings, and
record actual results for the example and keyword-trap queries.
