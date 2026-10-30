# PREIShare Semantic Search Verification

## Overview

PREIShare semantic search is meant to let an investor describe a property in
everyday language and find listings with a similar meaning, even when they use
different words. This report records checks that were actually run and
separates them from tests blocked by the current local and database setup.

## Environment Notes

- The project uses React, TypeScript, TanStack Start, TanStack Router, Vite,
  and npm.
- The embedding code selects OpenAI's `text-embedding-3-small` model and
  validates a vector length of 1536. The migration defines
  `public.properties.embedding` as `vector(1536)`.
- The SQL function uses pgvector cosine distance (`<=>`) and sorts in
  ascending order. Smaller distance means a closer match. The search helper
  returns the SQL results without reordering them, and the page displays the
  returned distance.
- `npm run typecheck` passed.
- I started the local development server. Port 3000 was already occupied, so
  Vite started this instance at `http://localhost:3001`.
- The browser opened `/search` and displayed the search form. The page request
  returned HTTP 200.
- Configuration presence was checked without printing values:
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` were configured. The
  server-side `OPENAI_API_KEY` was missing. The application can use the Vite
  Supabase settings as fallbacks for its server Supabase client, but that does
  not provide the missing OpenAI key.
- The expected Supabase project could not be independently confirmed because
  no expected project identifier is documented in the checked files. No
  credential values were printed or recorded.
- No migration, seed script, database write, or OpenAI embedding request was
  performed.

## Database Data Checks

I made read-only count requests against the configured Supabase endpoint for
`public.properties`: total rows, rows with `embedding IS NULL`, and rows with
`embedding IS NOT NULL`. All three requests returned HTTP 404 with PostgREST
error code `PGRST205` (the requested table was not found in the schema cache).
Therefore, the actual counts could not be retrieved.

| Check | Result | Notes |
|---|---|---|
| Total properties | NOT AVAILABLE | HTTP 404, `PGRST205`; no count returned. |
| Non-null embeddings | NOT AVAILABLE | HTTP 404, `PGRST205`; no count returned. |
| Missing embeddings | NOT AVAILABLE | HTTP 404, `PGRST205`; no count returned. |
| Database sample data check | BLOCKED | The expected table is unavailable through the configured project's PostgREST schema cache. This does not prove whether the table is absent, its migration was not applied, or the configured project is not the intended project. |
| Sample JSON count | 8; database presence NOT VERIFIED | The requirements do not prescribe a row count. The checked-in JSON has eight varied entries, but this does not show what is stored in the database. |
| Embedding dimension in deployed database | NOT VERIFIED | Source SQL expects 1536 dimensions, but the live table could not be queried. |

The relevant source files do not describe the same data model: the embedding
data model document describes `public.property_listings` with `summary` and a
proposed embedding field, while the search migration and seed script use
`public.properties` with `description`. The project team should confirm which
table is intended and verify that the expected migrations are installed in
the intended Supabase project.

## Natural-Language Query Results

The requirements give five example queries. Four representative queries are
listed here. The first was submitted through the real local UI and API. The
remaining searches were not sent because the first request established that
the local browser session was unauthenticated, while the embedding key and
database table were also unavailable. No property ranking or distance score
was returned for any query.

| Query | Actual top three property titles and distances | Sensible neighbors? | Pass/Fail/Blocked | Explanation |
|---|---|---|---|---|
| “cabin near water” | No results; API returned HTTP 401 with `{"error":"Sign in before searching properties."}` | Not evaluated | BLOCKED | The request reached the local API but stopped at authentication before embedding or database matching. |
| “downtown condo walkable to restaurants” | Not returned | Not evaluated | BLOCKED | Search was not run after the authentication and setup blockers were established. |
| “small apartment building with rental income” | Not returned | Not evaluated | BLOCKED | Search was not run after the authentication and setup blockers were established. |
| “quiet rural place for weekend getaways” | Not returned | Not evaluated | BLOCKED | Search was not run after the authentication and setup blockers were established. |

The source sample file suggests possible expected matches—such as
`Lakeside Wooden Retreat`, `Downtown City Loft`, `Rental Income Duplex`, and
`Rural Farmhouse`—but these are expectations from the JSON, not observed
search results. The actual result order and distances remain unknown.

## Keyword-Trap Test

**Query:** “Peaceful timber getaway beside a lake”

**Expected relevant sample:** `Lakeside Wooden Retreat`. Its description
mentions a quiet wooden vacation home beside a clear lake, while not using the
query's exact words “timber” and “getaway.” `Waterfront Vacation Cottage` may
also be relevant.

**Exact-keyword baseline rule:** Lowercase the combined property title and
description, split the query into whole-word tokens, ignore the stopword “a,”
and count a listing as a baseline match only if every remaining query token
appears as an exact whole word. I checked this rule against the checked-in
sample JSON: it contains eight properties and produces zero exact all-token
matches. The expected lakeside listing uses “wooden” and “vacation home,” not
“timber” and “getaway.”

**Actual semantic result:** NOT AVAILABLE. The real search request could not
reach embedding generation or the database. The semantic rank and distance
for `Lakeside Wooden Retreat` are unknown.

**Did semantic search beat the keyword trap? NOT EVALUABLE.** The baseline
comparison indicates why a paraphrase can be useful, but without an actual
semantic result it would be incorrect to claim that semantic search found a
listing that keyword matching missed.

## Refinement Cycle

**Live ranking refinement:** BLOCKED. No live result or distance was returned,
so there is no evidence-based weak ranking to investigate and no honest
before-and-after ranking comparison to record.

**Confirmed issue considered:** The helper calls `match_properties` after
checking for an authenticated user. The checked-in migration explicitly
revokes function execution from `authenticated` (and other API roles), and
states that the `properties` table has no authenticated grants or row-level
security policies in its creation migration. If that migration reflects the
deployed database, the app's authenticated RPC request is expected to be
denied.

**Decision:** No code or SQL correction was made. Changing database access
without an approved visibility and authorization design would not be safe, and
the task does not permit migration changes. The live request was unauthenticated
and the table was not found in the endpoint schema cache, so the RPC permission
issue could not be confirmed by an authenticated runtime call.

**Re-test:** NOT RUN. First confirm the intended Supabase project, the
`public.properties` schema and sample data, the approved access policy for
`match_properties`, an authenticated local test session, and server-side
embedding configuration. Then record original ranking results before deciding
on a ranking refinement.

## API and UI Verification

| Check | Actual observation | Result |
|---|---|---|
| `/search` route | Browser opened `http://localhost:3001/search`; page showed “Search Properties” and the search form. | PASS for local route loading |
| Empty query in UI | Clicking Search with a blank input displayed “Enter a description of the property you want to find.” | PASS for client-side validation |
| Empty API query | `GET /api/properties/search?q=` returned HTTP 400. | PASS |
| Invalid API limit | `GET /api/properties/search?q=test&limit=0` returned HTTP 400. | PASS |
| Valid requirement query while signed out | Submitting “cabin near water” in the browser returned HTTP 401 and displayed “Please sign in before searching properties.” Direct API response was `{"error":"Sign in before searching properties."}`. | PASS for authentication error handling; semantic search BLOCKED |
| API ranked JSON and SQL distance | No ranked response was returned. | BLOCKED |
| UI loading state | Not separately verified in the browser. | NOT VERIFIED |
| UI empty-results state | No successful API response with an empty result list was available. | NOT VERIFIED |
| UI successful-results state and ordering | No successful API response was available. | BLOCKED |

The source route files and generated route tree both include `/search` and
`/api/properties/search`. No obvious route import or registration error was
found. The earlier “Not Found” did not reproduce on the local server at port
3001. Since port 3000 was already occupied, the earlier error may have come
from a different or stale server, but that cause was not confirmed. The
“Crawling result not available” message was not reproduced and cannot be
diagnosed from this evidence.

## Requirements Assessment

| Requirement or success criterion | Status | Evidence |
|---|---|---|
| “cabin near water” returns a relevant lakeside listing without the word “cabin” | BLOCKED | The real UI/API request returned 401 before embedding generation and matching. |
| A meaning-appropriate sample appears for every documented query | BLOCKED | No semantic result set was returned. |
| Relevant listings rank ahead of less relevant listings | BLOCKED | No actual ranking or distance values were returned. |
| Directly worded matches appear | BLOCKED | No actual search result was returned. |
| The farmland contrast avoids cabins or condos as strong matches when no farmland exists | BLOCKED | No semantic query was run; additionally, the sample JSON includes a Rural Farmhouse described as surrounded by working farmland, so the stated no-farmland condition does not hold for this sample set. |
| The team reviews examples against an agreed relevance list and records pass/fail | BLOCKED | No result set or agreed review list was available. |
| Search page and API routes are registered | PASS | Both paths appear in the generated route tree; `/search` loaded in the browser. |
| Empty and invalid requests are rejected safely | PASS | Empty query and invalid limit returned HTTP 400; blank UI input showed a validation alert. |
| Search uses cosine distance consistently and preserves server order | PASS by source inspection only | SQL sorts `<=>` ascending, the helper preserves the order, and the UI displays the returned score. Runtime ranking was not verified. |

## Remaining Limitations

- The configured Supabase endpoint did not expose `public.properties` in its
  schema cache (`PGRST205`). The expected project identity is not documented,
  so the intended target could not be confirmed.
- Database row counts, sample presence, embedding nullability, and deployed
  vector dimensions remain unknown.
- `OPENAI_API_KEY` was not configured in the environment checked. No paid
  embedding request was made.
- The browser had no authenticated session. The API's 401 response is the
  observed reason the real query stopped before embedding generation.
- The migration revokes the app's authenticated role from calling
  `match_properties`. This is a source-level permission conflict; the deployed
  RPC permissions could not be tested because the request was unauthenticated
  and the table was not found in the schema cache.
- The data model document and search implementation use different table and
  description-field names (`property_listings`/`summary` versus
  `properties`/`description`). Confirm the intended schema.
- No semantic top-three results, numeric distances, keyword-trap outcome, or
  live refinement/re-test can be reported yet.
- The UI error state and blank-query state were observed. Loading,
  successful-results, and empty-results behavior were not exercised in a
  successful search session.

## Conclusion

The local `/search` page loads, the generated route tree contains both search
routes, TypeScript checking passes, and empty/invalid API requests are
rejected. The natural-language request was attempted through the actual UI but
stopped at the sign-in check. The configured database endpoint also returned
`PGRST205` for the expected properties table, and the embedding API key was
missing. Therefore, database readiness, semantic rankings, the keyword-trap
outcome, and a live refinement cycle are still blocked; semantic search has
not been shown to pass end-to-end.

To continue, confirm locally that the intended Supabase project is configured,
make the expected `public.properties` schema and sample embeddings available
there, agree on safe RPC/table permissions, sign in with a local test account,
and configure the server-side `OPENAI_API_KEY` without sharing its value.
Then rerun the documented queries and add their real top-three titles and
cosine distances before treating this verification as complete.
