# Sprint 4 Authentication and Listings Verification Checklist

**Project:** PREIshare  
**Date prepared:** 2026-10-24  
**Verifier:** To be completed  
**Environment:** Local app and Supabase project; do not record credentials here

## Status key

- **PASS** — the test or check was performed and succeeded.
- **FAIL** — the test or check was performed and failed.
- **NOT VERIFIED** — there is not enough evidence that it was performed successfully.

Code inspection can confirm what the application and migration are written to do,
but it does not prove live Supabase behavior. The evidence below separates
source-review findings from behavior that still needs a manual test.

## Authentication testing

Routes reviewed: `/auth/signup`, `/auth/login`, and `/dashboard`.

| # | Test | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| A1 | Register a new sponsor through `/auth/signup`. | A new sponsor account is registered successfully. | No registration test result was provided or recorded. | NOT VERIFIED |
| A2 | Confirm Supabase Auth creates the sponsor account. | The new account is present in Supabase Auth. | No account-creation result was provided or recorded. | NOT VERIFIED |
| A3 | Sign in as a sponsor using email and password. | Supabase accepts the credentials and establishes a session. | Previously confirmed: a sponsor could log in. | PASS |
| A4 | Check the destination after successful login. | The sponsor is taken to `/dashboard`. | Previously confirmed: the sponsor reached the dashboard after login. | PASS |
| A5 | Sign out of the sponsor account. | The session ends and protected content is no longer accessible. | No sign-out test result was provided or recorded. | NOT VERIFIED |
| A6 | Visit `/dashboard` while signed out. | The visitor is redirected to `/auth/login`. | No signed-out access test result was provided or recorded. | NOT VERIFIED |
| A7 | While signed out, try a protected dashboard child route, including a listings route. | The visitor cannot access protected content or listing data. | No protected-child-route test result was provided or recorded. | NOT VERIFIED |
| A8 | Refresh the page with a valid sponsor session. | The sponsor remains signed in and can continue using the dashboard. | No refresh/session-persistence test result was provided or recorded. | NOT VERIFIED |

**Email confirmation:** Email confirmation was temporarily disabled for local
testing. Enable it again before production use and test the registration and
confirmation flow with the production setting.

## PostgreSQL property listing tests

The expected table is `public.property_listings`. The reviewed migration defines
`id`, `sponsor_id`, `title`, `summary`, `property_type`, `address_line1`,
`address_line2`, `city`, `region`, `postal_code`, `country`, `asking_price`,
`currency`, `status`, `created_at`, and `updated_at`.

| # | Test | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| P1 | Check that `property_listings` exists in Supabase. | The table exists in the project's PostgreSQL database. | Previously observed: the table exists. | PASS |
| P2 | Check the live table columns against the migration. | The live table has the column names and types defined in `20250321000000_property_listings.sql`. | The migration defines the columns listed above, but no live column query or result was recorded. | NOT VERIFIED |
| P3 | Check whether RLS is enabled on the live table. | RLS is enabled for `public.property_listings`. | The migration enables RLS, but no live database result was recorded. | NOT VERIFIED |
| P4 | Check the live SELECT, INSERT, UPDATE, and DELETE policies. | Each expected policy exists for `authenticated` and limits access to the sponsor's own rows. | The migration defines `property_listings_select_own`, `property_listings_insert_own`, `property_listings_update_own`, and `property_listings_delete_own`; live policy results were not recorded. | NOT VERIFIED |
| P5 | Open `/dashboard/listings` as an authenticated sponsor. | The listings page loads without an access or database error. | Previously observed: the page displayed the empty-listing message. | PASS |
| P6 | View the listings page for a sponsor with no listings. | The page displays **“No properties yet”**. | Previously observed: the page displayed **“No properties yet”**. | PASS |
| P7 | Open `/dashboard/listings/new` as an authenticated sponsor. | The new-listing form loads. | No test result was provided or recorded. | NOT VERIFIED |
| P8 | Submit valid property information through the form. | The listing is accepted and the user receives a successful result. | No successful listing-creation test was provided or recorded. | NOT VERIFIED |
| P9 | Confirm the application saves the new listing in PostgreSQL. | A row containing the submitted listing is saved in `property_listings`. | No saved-row result was provided or recorded. | NOT VERIFIED |
| P10 | Check the listings index after creating a listing. | The newly created listing appears on `/dashboard/listings`. | No created listing was recorded, so its appearance was not verified. | NOT VERIFIED |
| P11 | Refresh the listings page after creating a listing. | The listing remains visible after refresh because it was persisted. | No successful creation-and-refresh test was provided or recorded. | NOT VERIFIED |
| P12 | Confirm displayed listing data is real database data, not hardcoded mock listings. | A listing returned from the database is displayed by the application. | The reviewed listings route loads through `listMyListings`; no populated listing was observed to verify a database result against mock data. | NOT VERIFIED |

## Two-sponsor RLS isolation testing

Use two separate browser sessions. Identify the accounts only as **User A** and
**User B** in test notes. Do not record passwords, session tokens, or private
authentication information. This test verifies sponsor data isolation: each
sponsor should only be able to read their own listings.

| # | Test | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| R1 | User A signs in and creates a property listing. | The listing is created and associated with User A. | No two-user test result was provided or recorded. | NOT VERIFIED |
| R2 | User A views the listing they created. | User A can see their own listing. | No two-user test result was provided or recorded. | NOT VERIFIED |
| R3 | User B signs in using a separate browser session. | User B has a separate authenticated session from User A. | No two-user test result was provided or recorded. | NOT VERIFIED |
| R4 | User B checks the listings index for User A's listing. | User B cannot see User A's listing. | No two-user isolation result was provided or recorded. | NOT VERIFIED |
| R5 | User B creates a separate property listing. | The listing is created and associated with User B. | No two-user test result was provided or recorded. | NOT VERIFIED |
| R6 | User A checks the listings index for User B's listing. | User A cannot see User B's listing. | No two-user isolation result was provided or recorded. | NOT VERIFIED |
| R7 | Verify the database ownership rule. | RLS policies use `auth.uid()` and `sponsor_id` to limit rows to their owner. | The migration defines owner policies comparing `sponsor_id` with `auth.uid()`. The live policies and their behavior have not been verified. | NOT VERIFIED |

## Environment and secret hygiene

No real `.env` files were opened, and no credential values are recorded here.
The project's documented public variable names are
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The documented
server-only variable name is `SUPABASE_SECRET_KEY`.

| # | Check | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| S1 | Check public Supabase variable names. | Browser-facing configuration uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. | `.env.example`, the browser client, and the server client use those public variable names. | PASS |
| S2 | Check that secret/service-role keys are only used server-side. | Any privileged key is restricted to trusted server-side code and is not exposed to the browser. | The reviewed Supabase client code uses the public variables; no privileged key use was found in the reviewed files. A complete repository and deployment-configuration audit was not performed. | NOT VERIFIED |
| S3 | Check browser components for imports of privileged server clients. | Browser-facing components do not import privileged server-only Supabase clients. | Reviewed auth routes use the browser client; reviewed listing routes call server functions. No direct privileged server-client import was found in the reviewed routes/components. | PASS |
| S4 | Check source files for hardcoded service-role keys or database passwords. | No actual privileged keys or database passwords are hardcoded in source. | A read-only search for common secret identifiers and PostgreSQL URL patterns found no matches in `src/`. This limited search is not a complete credential audit. | NOT VERIFIED |
| S5 | Check whether real environment files are excluded from Git. | Real `.env` files are ignored and are not tracked. | `git check-ignore` matched `.env`, `.env.local`, and `.env.production`. The only environment-related tracked/unignored path reported was `.env.example`. | PASS |
| S6 | Check that `.env.example` contains placeholders only. | The example file contains no live credentials. | The reviewed file uses example project URL and placeholder key text, not live values. | PASS |
| S7 | Check whether sensitive credentials have been committed to Git. | No sensitive credentials appear in the repository's Git history. | A read-only filename check found no real environment file currently tracked; it does not inspect all historical content for credentials. | NOT VERIFIED |
| S8 | Check the normal sponsor listing access path. | Sponsor operations use the authenticated user's permissions and the database enforces RLS; ordinary requests do not bypass RLS with a service-role key. | Reviewed server functions verify the user and use the Supabase client with the public key and sponsor identity. The migration defines RLS policies, but live policy enforcement has not been tested. | NOT VERIFIED |

## Risks and Remaining Verification

- Email confirmation was temporarily disabled for local testing. Restore it
  before production and verify the confirmation flow.
- The live table columns, RLS setting, and SELECT, INSERT, UPDATE, and DELETE
  policies still need confirmation from Supabase query results.
- Registration, account creation, sign-out, signed-out redirects, protected
  child routes, and session persistence after refresh have no recorded test
  results.
- Listing creation, database persistence, index display, and persistence after
  refresh have no recorded successful test results.
- The two-sponsor data-isolation test has not been recorded. Do not treat RLS
  isolation as verified until User A and User B have been tested in separate
  sessions.
- The source search and current Git filename check do not confirm that the full
  Git history or deployment configuration is free of credentials. Complete
  secret-hygiene verification without printing or copying secret values.

## Overall result

**NOT VERIFIED.** Some login, dashboard, table-existence, and empty-state checks
have prior reported passing evidence, and several configuration checks passed
by static inspection. The remaining tests above are incomplete; Sprint 4 should
not be described as fully verified yet.
