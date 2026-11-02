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
- The active local development server responded on port 3000 during this
  verification. `/search` loaded in the browser with HTTP 200.
- `/auth/login` also returned HTTP 200 and displayed the sponsor login form.
  The login route uses Supabase password sign-in and passes the returned
  session to the server session helper. No credentials were entered, so a
  signed-in session has not been verified.
- The seed script's no-network `--check` mode passed. It confirmed the
  configured URL matched the fixed PREIShare-Dev host and that the required
  server-side credential variables were present. No credential values were
  printed or recorded.
- The PREIShare-Dev project reference `ayiesrtimviebuwbqgqi` was supplied for
  the seed-script safeguard.
- The guarded seed script was run against PREIShare-Dev. All eight embedding
  requests returned the generator's generic `PROVIDER_ERROR`; no sample rows
  were inserted. The existing embedding helper does not expose the HTTP
  status or provider error body, so the exact cause is unknown.
- A separate read-only count check against the guarded development endpoint
  succeeded. It did not expose credential values.
- No migration or database schema change was performed. No semantic ranking
  query reached `match_properties`, and no live ranking refinement was possible.

## Database Data Checks

I made read-only count requests against the verified PREIShare-Dev endpoint for
`public.properties`: total rows, rows with `embedding IS NULL`, and rows with
`embedding IS NOT NULL`. The requests succeeded and returned the following
counts after the failed seed attempt.

| Check | Result | Notes |
|---|---|---|
| Total properties | FAIL: 0 | Read-only count from PREIShare-Dev after the seed attempt. Expected demonstration set: 8. |
| Non-null embeddings | FAIL: 0 | No rows have an embedding. |
| Missing embeddings | FAIL: 0 rows | Zero is the observed null-embedding count, but the expected eight embedded sample rows are absent. |
| Database sample data check | FAIL | No sample rows were inserted because embedding generation failed for all eight samples. |
| Sample JSON count | PASS: 8 | Eight fictional entries were validated by the seed script before processing. |
| Embedding dimension in deployed database | NOT RE-QUERIED | Setup verification previously confirmed the `vector(1536)` schema; this count check only measured row counts. |

The relevant source files also describe `public.property_listings` with
`summary`, while this assignment intentionally targets `public.properties`
with `description`. PREIShare-Dev is the confirmed target for this
demonstration; the sponsor-owned `property_listings` model is not being changed.

## Natural-Language Query Results

The following four requirement queries were selected. None produced a ranking:
the seed attempt failed to generate embeddings, leaving no properties to rank.
The earlier UI attempt for “cabin near water” also stopped at authentication.
No result titles or distance values are fabricated.

| Query | Actual top three property titles and distances | Sensible neighbors? | Pass/Fail/Blocked | Explanation |
|---|---|---|---|---|
| “cabin near water” | No top-three results or distances returned | NO — no sensible neighbor was returned | FAIL | The live seed attempt failed; no property rows exist to rank. A prior local UI attempt also returned HTTP 401 before search. |
| “family-friendly home close to good schools” | No top-three results or distances returned | NO — no sensible neighbor was returned | FAIL | No matching request reached ranking because there are no seeded rows and embedding generation failed. |
| “small apartment building with rental income” | No top-three results or distances returned | NO — no sensible neighbor was returned | FAIL | No matching request reached ranking because there are no seeded rows and embedding generation failed. |
| “quiet rural place for weekend getaways” | No top-three results or distances returned | NO — no sensible neighbor was returned | FAIL | No matching request reached ranking because there are no seeded rows and embedding generation failed. |

The source sample file suggests possible expected matches—such as
`Lakeside Wooden Retreat`, `Suburban Family Home`, `Rental Income Duplex`, and
`Rural Farmhouse`—but these are expectations from the JSON, not observed
search results. There are no live top-three titles or distances to report.

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

**Actual semantic result:** No result. The seed attempt could not generate
sample embeddings, and the query itself was not ranked. No semantic rank or
distance for `Lakeside Wooden Retreat` exists in this run.

**Did semantic search beat the keyword trap? NO.** The sample JSON has zero
exact all-token keyword matches under the stated baseline, but semantic search
also returned no result because embedding generation failed and the database
contains no rows. This is a failed demonstration, not evidence that semantic
matching is worse than keyword matching.

## Refinement Cycle

**Live ranking refinement:** BLOCKED. No live result or distance was returned,
so there is no evidence-based weak top result to investigate and no honest
before-and-after ranking comparison to record.

**Access check:** The development setup was separately verified to grant
`authenticated` EXECUTE on `match_properties`. An actual authenticated RPC call
has not been made, so end-to-end function access remains unverified. Older
canonical migration text revokes that grant; do not replay or assume those
migrations describe the manually configured development database.

**Decision:** Keep the existing cosine-distance ranking unchanged until a
successful baseline ranking exists. Changing the ranking without observed
results would be speculative. The current blockers are provider embedding
failures, zero stored rows, and no authenticated search result.

**Re-test:** FAIL / BLOCKED. The project and table are confirmed, and the
read-only count succeeded, but all eight seed embeddings failed with
`PROVIDER_ERROR`; no baseline ranking was available to refine or re-test.
Resolve the OpenAI provider failure, seed the fictional samples, then record
baseline rankings before changing a ranking input and comparing the same
query again.

**Migration history caution:** Two files use the `20250321000000` migration
version: `20250321000000_property_listings.sql` and
`20250321000000_sponsors_properties_rls.sql`. The latter labels itself an
assignment-only draft and says not to apply it as-is. The version collision
must be resolved before treating the full migration history as safe to apply.
No migrations were applied.

## API and UI Verification

| Check | Actual observation | Result |
|---|---|---|
| `/search` route | Browser opened `http://localhost:3000/search`; page showed “Search Properties” and the search form. | PASS for local route loading |
| `/auth/login` route | Browser opened `http://localhost:3000/auth/login`; the sponsor login form rendered. | PASS for login page loading; authentication itself NOT VERIFIED |
| Empty query in UI | Clicking Search with a blank input displayed “Enter a description of the property you want to find.” | PASS for client-side validation |
| Empty API query | `GET /api/properties/search?q=` returned HTTP 400. | PASS |
| Invalid API limit | `GET /api/properties/search?q=test&limit=0` returned HTTP 400. | PASS |
| Valid requirement query while signed out | Submitting “cabin near water” in the browser returned HTTP 401 and displayed “Please sign in before searching properties.” Direct API response was `{"error":"Sign in before searching properties."}`. | PASS for authentication error handling; semantic search BLOCKED |
| API ranked JSON and SQL distance | No ranked response was returned. | BLOCKED |
| UI loading state | Not separately verified in the browser. | NOT VERIFIED |
| UI empty-results state | No successful API response with an empty result list was available. | NOT VERIFIED |
| UI successful-results state and ordering | No successful API response was available. | BLOCKED |

The source route files and generated route tree both include `/search`,
`/auth/login`, and `/api/properties/search`. No obvious route import or
registration error was found. The earlier “Not Found” did not reproduce on
the current local server at port 3000. The “Crawling result not available”
message was not reproduced and cannot be diagnosed from this evidence.

## Requirements Assessment

| Requirement or success criterion | Status | Evidence |
|---|---|---|
| “cabin near water” returns a relevant lakeside listing without the word “cabin” | FAIL | No rows or embeddings exist after all eight seed embedding requests failed; the earlier UI/API request also returned 401 before matching. |
| A meaning-appropriate sample appears for every documented query | FAIL | No semantic result set was returned. |
| Relevant listings rank ahead of less relevant listings | FAIL | No actual ranking or distance values were returned. |
| Directly worded matches appear | FAIL | No actual search result was returned. |
| The farmland contrast avoids cabins or condos as strong matches when no farmland exists | FAIL | No semantic query was ranked; the sample JSON includes a Rural Farmhouse described as surrounded by working farmland, so the stated no-farmland condition does not hold for this sample set. |
| The team reviews examples against an agreed relevance list and records pass/fail | BLOCKED | No result set or agreed review list was available. |
| Search page and API routes are registered | PASS | Both paths appear in the generated route tree; `/search` loaded in the browser. |
| Empty and invalid requests are rejected safely | PASS | Empty query and invalid limit returned HTTP 400; blank UI input showed a validation alert. |
| Search uses cosine distance consistently and preserves server order | PASS by source inspection only | SQL sorts `<=>` ascending, the helper preserves the order, and the UI displays the returned score. Runtime ranking was not verified. |

## Remaining Limitations

- The PREIShare-Dev endpoint is confirmed and `public.properties` is readable
  for the server-side count check. Current counts are 0 properties, 0
  non-null embeddings, and 0 null embeddings.
- All eight seed embedding requests returned `PROVIDER_ERROR`. The key's
  presence was confirmed without printing it, but the helper masks the
  provider's status/reason; the provider failure needs diagnosis before
  seeding can succeed.
- The browser had no authenticated session. The API's 401 response is the
  observed reason the real query stopped before embedding generation.
- Although setup previously confirmed authenticated RPC execute permission,
  a successful authenticated `match_properties` call has not been verified.
- The two `20250321000000` migration files have a version collision, and one
  identifies itself as an assignment-only draft. Do not apply the full
  migration history until this conflict is resolved.
- This demonstration intentionally uses `properties`/`description`, not the
  sponsor-owned `property_listings`/`summary` model.
- No semantic top-three results, numeric distances, or valid live
  refinement/re-test can be reported because no embeddings or property rows
  were created. The keyword-trap semantic result is NO for this run.
- The UI error state and blank-query state were observed. Loading,
  successful-results, and empty-results behavior were not exercised in a
  successful search session.

## Conclusion

The local `/search` page loads, the generated route tree contains both search
routes, TypeScript checking passes, and empty/invalid API requests are
rejected. The development database is confirmed and returned actual zero row
counts. The guarded seed attempt failed on all eight embedding requests with
`PROVIDER_ERROR`, so no properties were inserted and no live ranking could be
measured. This verification therefore FAILS the end-to-end semantic-search
demonstration; no ranking refinement is claimed.

Next, diagnose the OpenAI provider error without exposing the key, then rerun
the guarded seed. Confirm all eight rows have non-null 1536-dimensional
embeddings. Sign in with an authorized development test account, run at least
three requirement queries plus the keyword trap, and record each actual top
three titles/IDs and cosine distances. Only after capturing a real baseline
should a weak top result be refined and the same query re-tested. Do not
resolve the migration timestamp conflict by replaying the full history; the
development database setup has already been performed separately.
