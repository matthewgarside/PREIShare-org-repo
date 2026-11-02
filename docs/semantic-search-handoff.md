# PREIShare Semantic Search Handoff

## Project Overview

PREIShare helps real estate investors explore property listings and identify
possible opportunities. Investors may know what they want to find without
knowing the exact wording a sponsor used in a listing. Semantic search is
intended to match the meaning of a natural-language query—for example, finding
a lakeside home for “cabin near water”—instead of requiring the same keywords.

This sprint worked toward a small search experience backed by property
embeddings and pgvector. An embedding is a list of numbers representing text
meaning. Comparing query and listing embeddings can find related wording that
a basic exact-keyword search could miss. Search results still describe
listings; they do not promise an investment outcome.

## Stakeholder Goals

The requirements describe investors entering ordinary-language property
descriptions, finding listings expressed in different words, and seeing
better matches before weaker ones. The team should be able to compare sample
results with an agreed list of relevant properties.

The repository contains an embedding generator, vector-search function,
search helper, API route, and search page intended to support that flow. The
verification report did not establish that the main investor goal was met:
embedding requests failed, no sample properties were inserted, and no
semantic results were ranked. These goals therefore remain acceptance
criteria, not demonstrated outcomes.

## Work Completed

The following components are present in the repository. Their presence does
not mean every component was successfully exercised against live data.

| Component | Contribution and current evidence |
| --- | --- |
| Embedding types and generation helper: `src/lib/embeddings/types.ts`, `src/lib/embeddings/generate.ts` | Defines the property text input, typed success/failure results, and 1536-value validation. The server-only helper sends text to OpenAI's embedding endpoint. The verification report says all eight seed requests returned `PROVIDER_ERROR`; successful generation was not verified. |
| pgvector setup | `supabase/migrations/20250315000000_enable_pgvector_properties.sql` and `scripts/dev-setup/semantic-search-bootstrap.sql` define a `public.properties` demonstration table with a vector column. `supabase/migrations/20261029214300_add_property_listing_embeddings.sql` instead adds a vector column to `public.property_listings`. These are different schema paths, not one confirmed production setup. The verification report says no migrations or schema changes were performed during that run. |
| Sample data and seed script: `data/sample-properties.json`, `scripts/seed-property-embeddings.ts` | Provides eight fictional listings and a server-side seed path with a configuration-only `--check` mode. The report says the check passed, but all eight embedding requests failed and no rows were inserted. |
| Similarity-search SQL | `supabase/migrations/20250315000001_match_properties_function.sql` and the development bootstrap define `match_properties` for `public.properties`; `supabase/migrations/20261029214400_create_match_properties_function.sql` defines it for `public.property_listings`. The function sorts by ascending cosine distance and limits the result count. A ranked live query was not verified. |
| TypeScript property search helper: `src/lib/property-search.ts` | Requires a signed-in user, embeds the query, calls Supabase RPC `match_properties`, and preserves the SQL result order. It defaults to five matches and accepts a count from 1 to 20. End-to-end search was not verified. |
| Search API route: `src/routes/api/properties/search.ts` | Accepts a query and optional limit, rejects invalid requests, and returns results or an error response. The report records HTTP 400 for an empty query and invalid limit, and HTTP 401 for a valid query while signed out. |
| Search page: `src/routes/search.tsx` | Provides a natural-language search form and UI states for loading, errors, empty results, and ranked listings. The report records that the route loaded and blank input showed validation; successful and empty-result states were not exercised with a successful API response. |
| Verification report: `docs/semantic-search-verification.md` | Records local route and input-validation checks, a failed seed attempt, zero database rows, blocked query/ranking tests, and remaining verification needs. |

## Architecture and Technical Decisions

- **Embedding model and size:** The generator uses OpenAI
  `text-embedding-3-small`; the helper validates 1536 finite numbers and the
  relevant vector columns are declared `vector(1536)`. Both the listing and
  query embeddings must use compatible model and dimension settings.
- **Text embedded:** The data-model document specifies a listing's `title`
  and `summary`. The generator joins those fields; the demo seed maps its
  `description` into `summary`. For a search query, the helper passes the
  query as the title and an empty summary.
- **Storage and metric:** pgvector stores the embedding beside its property
  record. The SQL uses cosine distance (`<=>`); lower distance means a closer
  match. Results are ordered by ascending distance before the top-K limit.
  The helper keeps that database order, and the page displays the returned
  distance.
- **Application/database communication:** The TypeScript search helper uses
  the Supabase server client and calls the PostgreSQL function through Supabase
  RPC. It does not create a direct PostgreSQL connection. The helper requires
  a signed-in user before generating the query embedding and making the RPC
  call.
- **Sensitive configuration:** `OPENAI_API_KEY` is read by server-only
  embedding code and must not be exposed to browser code. Supabase URL and
  anon-key variables are used by application clients; the seed script also
  requires `SUPABASE_SERVICE_ROLE_KEY` for server-side administrative inserts.
  That privileged key must remain server-only. The verification report says
  the seed check confirmed required variables were present without recording
  their values; it does not establish that a provider request succeeds.

### Two Different Property Schemas

The sponsor-owned model is `public.property_listings`, with fields including
`summary`, `sponsor_id`, and existing sponsor ownership/RLS rules. The
data-model and pgvector planning documents describe adding an embedding to
that table; they explicitly do not propose creating a second table.

The development demonstration instead uses `public.properties`, with
`description`, `location`, and `price_usd`. Its sample JSON, seed script,
older search migration, and development bootstrap follow that shape. The
verification report says PREIShare-Dev was configured for this demonstration
and that the sponsor-owned table was not changed. The later
`20261029214300`/`20261029214400` migrations describe a separate
`property_listings` implementation. Do not present the `properties` demo
schema as PREIShare's final production architecture.

## Verification and Results

The verification report is the source for these outcomes:

- `npm run typecheck` passed. This is evidence of a successful TypeScript
  check, not of working live search.
- The local `/search` and `/auth/login` pages returned HTTP 200. No login
  credentials were entered, so a signed-in session was not verified.
- The seed script's no-network `--check` mode passed: the PREIShare-Dev URL
  matched its safeguard and required server-side variables were present.
- The attempted seed run failed for all eight embeddings with the helper's
  generic `PROVIDER_ERROR`. No sample rows were inserted. A read-only count
  against the development `public.properties` table reported 0 total rows,
  0 rows with embeddings, and 0 rows without embeddings. The count succeeded,
  but the expected sample data was absent.
- Four requirement queries, including “cabin near water,” returned no ranked
  results or distances. The earlier browser query stopped at authentication
  with HTTP 401. The report records the query checks as failed; it does not
  provide evidence about actual semantic ranking quality.
- The keyword-trap check found zero exact all-token keyword matches in the
  eight-record sample under the report's stated baseline rule. Semantic search
  also returned no result because the seed failed, so it did not demonstrate
  that semantic search beat the trap.
- Live ranking refinement and re-test were blocked because there was no
  baseline result to refine. The report says authenticated RPC permission was
  separately confirmed in the development setup, but no authenticated RPC
  call was made.
- The API rejected an empty query and a zero result limit with HTTP 400; the
  blank UI query displayed validation. Successful-result ordering, the
  successful empty-results state, and the loading state were not verified.
- The report identifies the farmland contrast check as failed: no semantic
  query was ranked, and the sample set includes a Rural Farmhouse explicitly
  described as surrounded by working farmland. Thus the sample does not meet
  the stated “no farmland” condition for that contrast.

Overall, the documented outcomes do **not** meet the original semantic-search
success criteria. Route loading, type checking, configuration validation, and
invalid-input handling have evidence; relevant result retrieval and ordering
do not. The report's statement that the deployed database dimension was
previously confirmed was not re-queried in its recorded count check, so that
check is documented but not independently confirmed there.

## Limitations and Remaining Issues

- **Development versus production:** The successful count request and failed
  seed attempt concern the isolated `public.properties` demonstration. The
  report says the sponsor-owned `property_listings` table was not changed.
  No production data integration is established.
- **Authentication and Row Level Security:** The search helper requires a
  signed-in user, but no authenticated search succeeded. The bootstrap's
  permissive read policy is explicitly for fictional development data and is
  not a substitute for sponsor ownership rules. The two schema paths also
  differ in function grants: the older `properties` migration revokes
  authenticated execution, while the development bootstrap grants it; the
  later `property_listings` function grants authenticated execution. Resolve
  which setup is intended and verify access end to end before relying on it.
- **Embedding provider:** Search depends on OpenAI availability and
  configuration. The recorded `PROVIDER_ERROR` does not expose a status or
  provider response body, so its cause is unknown.
- **Small sample and ranking coverage:** Eight fictional records were
  validated, but none were seeded. There are no observed result titles,
  distances, ranking comparisons, or successful query cases.
- **Migration consistency:** Two files share the `20250321000000` migration
  version; one is labeled an assignment-only draft and must not be applied as
  is. The planning document recommends exact search without a specialized
  index, while the older `properties` migration creates an IVFFlat index.
  There are also different vector schema qualifications and function access
  rules across the demo and listing migrations. The report says no migrations
  were applied; reconcile these differences before treating migration history
  as repeatable.
- **Embedding lifecycle:** The data-model document leaves update and
  backfill behavior for later work. Listings with missing or stale embeddings
  should not be assumed searchable or current.

## Recommendations for the Next Sprint

1. **Choose and document the intended search data model.** Decide whether the
   search will integrate with sponsor-owned `public.property_listings` or
   remain an isolated `public.properties` demonstration. Reconcile
   `docs/embedding-data-model.md`, the development bootstrap, and the relevant
   migrations without treating the demo table as production. **Complete when**
   the team has one approved schema, matching field names, and a reviewed
   migration path that does not create a duplicate property model.
2. **Resolve migration and access-rule inconsistencies.** Review the duplicate
   `20250321000000` versions, the assignment-only draft, vector schema,
   index choice, and conflicting function grants. Confirm how authenticated
   search should obey the selected table's RLS rules. **Related files:**
   `supabase/migrations/`, `scripts/dev-setup/semantic-search-bootstrap.sql`,
   `docs/pgvector-setup-plan.md`. **Complete when** migration history is
   unambiguous and a reviewed development setup grants only the intended
   access; test with an authorized account before any production use.
3. **Diagnose the embedding-provider failure and seed the demo safely.**
   Investigate why `src/lib/embeddings/generate.ts` returned
   `PROVIDER_ERROR` without printing secrets, then rerun the guarded seed
   process against the intended development target. **Related files:**
   `scripts/seed-property-embeddings.ts`, `data/sample-properties.json`, and
   the embedding helper. **Complete when** the seed report confirms the
   expected eight sample records and each searchable record has a finite
   1536-value embedding, with no API key exposed.
4. **Run an authenticated end-to-end search evaluation.** After seeding,
   execute the documented requirement queries and the keyword-trap query
   through the signed-in search flow. Record actual top results and distances,
   compare them to an agreed relevance list, and resolve the farmland
   contrast sample mismatch. **Related files:** `docs/semantic-search-requirements.md`,
   `docs/semantic-search-verification.md`, `src/lib/property-search.ts`, and
   the search route/page. **Complete when** the report includes reproducible
   actual results and pass/fail decisions for each applicable criterion,
   including whether relevant listings rank ahead of weaker matches.
5. **Verify the full UI response states.** The report did not exercise the
   loading, successful-results, or successful empty-results UI states.
   **Related file:** `src/routes/search.tsx`. **Complete when** a successful
   search demonstrates each relevant state and the page preserves the
   server's distance order; update the verification report with observations.
6. **Define embedding refresh behavior for changed listings.** Decide how
   title or summary changes and missing vectors will be handled in the chosen
   schema. **Related files:** `docs/embedding-data-model.md`,
   `src/lib/embeddings/generate.ts`, and the selected seed/backfill path.
   **Complete when** there is a repeatable, reviewed process to generate or
   refresh vectors and verify they correspond to the current listing text.

## Final Handoff Summary

The repository contains the main pieces of a semantic-search demonstration:
embedding generation, pgvector SQL, sample data and a seed script, an
authenticated TypeScript search path, an API route, and a search page. The
next developer can reuse these pieces and the verification report, but should
first settle the demo-versus-sponsor schema and migration differences. The
reported run did not seed data or produce ranked results, so provider setup,
authorized end-to-end testing, and evidence against the original success
criteria remain the main work.
