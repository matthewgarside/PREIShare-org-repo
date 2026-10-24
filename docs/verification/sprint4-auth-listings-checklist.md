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
| A1 | Register a new sponsor through `/auth/signup`. | Registration succeeds and either establishes a session or displays the email-confirmation message. | No browser registration result was provided. The route calls Supabase Auth `signUp`, but source code alone does not verify registration. | NOT VERIFIED |
| A2 | Confirm Supabase Auth creates the sponsor account. | The account appears in Supabase Auth for the project. | No Supabase Auth user-list result was provided or recorded. | NOT VERIFIED |
| A3 | Sign in as a sponsor using email and password. | Supabase accepts the credentials and establishes a session. | Previously confirmed: a sponsor could log in. | PASS |
| A4 | Check the destination after successful login. | The sponsor is taken to `/dashboard`. | Previously confirmed: the sponsor reached the dashboard after login. | PASS |
| A5 | Sign out of the sponsor account. | The Supabase session ends and protected content is no longer accessible. | No browser sign-out result was provided. The session module defines a server sign-out function, but its behavior was not tested. | NOT VERIFIED |
| A6 | Visit `/dashboard` while signed out. | The visitor is redirected to `/auth/login`. | No signed-out browser result was provided. The dashboard route checks `getUser()` and redirects when no user is returned. | NOT VERIFIED |
| A7 | While signed out, visit `/dashboard/listings`. | The visitor is redirected to `/auth/login` and listing data is not shown. | No signed-out child-route browser result was provided. The dashboard parent route applies the session check, but the redirect was not tested. | NOT VERIFIED |
| A8 | Refresh the page with a valid sponsor session. | The sponsor remains signed in and can continue using the dashboard. | No refresh/session-persistence test result was provided or recorded. | NOT VERIFIED |
| A9 | Try to sign in with invalid credentials. | The login page shows an appropriate error and does not establish an authenticated session. | No invalid-credentials browser test was provided. The login route displays Supabase's returned error, but this was not tested. | NOT VERIFIED |

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
| P7 | Open `/dashboard/listings/new` as an authenticated sponsor. | The new-listing form loads and accepts input. | No browser result was provided. The route renders `ListingForm`; opening it in an authenticated session was not tested. | NOT VERIFIED |
| P8 | Submit valid property information through the form. | The form accepts values allowed by `createListingSchema` and reports success. Required values include title, summary, property type, address, city, region, postal code, country, non-negative asking price, currency, and status. | No valid form submission was performed or recorded. The schema defines these validation rules, but that is not a submission test. | NOT VERIFIED |
| P9 | Confirm the application saves the new listing in PostgreSQL. | A matching row is present in `public.property_listings`, with `sponsor_id` equal to the authenticated sponsor's user ID. | No saved-row result or sponsor-ID comparison was provided. The server function inserts the listing with the verified user's ID; database persistence was not tested. | NOT VERIFIED |
| P10 | Check the listings index after creating a listing. | The newly created listing and its submitted values appear on `/dashboard/listings`. | No listing was successfully created and observed on the index during this verification. | NOT VERIFIED |
| P11 | Refresh the listings page after creating a listing. | The saved listing remains visible after a full page refresh. | No create-and-refresh result was provided or recorded. | NOT VERIFIED |
| P12 | Confirm displayed listing data is real database data, not hardcoded mock listings. | The index shows listing rows returned by Supabase, not substituted mock records. | The reviewed index loader calls `listMyListings`, which reads `property_listings`; no populated database row was displayed during testing, so actual displayed data remains unverified. | NOT VERIFIED |

## Two-sponsor RLS isolation testing

Use two separate browser sessions. Identify the accounts only as **User A** and
**User B** in test notes. Do not record passwords, session tokens, or private
authentication information. This test verifies sponsor data isolation: each
sponsor should only be able to read their own listings.

| # | Test | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| R1 | User A signs in and creates “Test Property A”. | The row is saved with User A's authenticated ID as `sponsor_id`. | No User A test or database row observation was provided. | NOT VERIFIED |
| R2 | User A views “Test Property A”. | User A sees their own listing in the listings index. | No User A listings-page observation was provided. | NOT VERIFIED |
| R3 | User B signs in using a separate browser session. | User B is a different authenticated account and does not share User A's session. | No separate-session test result was provided. | NOT VERIFIED |
| R4 | User B opens the listings index. | User B cannot see “Test Property A” or any User A listing. | No User B isolation observation was provided. | NOT VERIFIED |
| R5 | User B creates and views “Test Property B”. | The row is saved with User B's authenticated ID; User B can see it. | No User B creation or listing observation was provided. | NOT VERIFIED |
| R6 | User A refreshes the listings index. | User A still sees “Test Property A” and cannot see “Test Property B”. | No return-to-User-A isolation observation was provided. | NOT VERIFIED |
| R7 | Verify the database ownership rule. | RLS policies use `auth.uid()` and `sponsor_id` to limit rows to their owner. | The migration defines owner policies comparing `sponsor_id` with `auth.uid()`. The live policies and their behavior have not been verified. | NOT VERIFIED |

## Environment and secret hygiene

No real `.env` files were opened, and no credential values are recorded here.
The project's documented public variable names are
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The documented
server-only variable name is `SUPABASE_SECRET_KEY`.

| # | Check | Expected result | Actual result / evidence | Status |
|---|---|---|---|---|
| S1 | Check public Supabase variable names. | Browser-facing configuration uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. | `.env.example`, the browser client, and the server client use those public variable names. | PASS |
| S2 | Check the entire project for privileged key use and browser exposure. | Privileged credentials are only used by trusted server-side code and never imported into browser-facing code. | Read-only whole-project searches found no service-role or `SUPABASE_SECRET_KEY` use in application code and no server-client import in `src/routes` or `src/components`. The reviewed server listing path uses the public Supabase client with the authenticated user. No deployment settings were available to inspect. | PASS |
| S3 | Check browser components for imports of privileged server clients. | Browser-facing components do not import privileged server-only Supabase clients. | A read-only search of `src/routes` and `src/components` found no server Supabase client imports; reviewed routes use the browser client or server functions. | PASS |
| S4 | Search the whole project for hardcoded service-role keys, private API keys, and database credentials. | No real privileged keys or database passwords are present in project files. | Filename-only scans of non-environment working-tree files found no matches for common Supabase secret, service-role, JWT, cloud-key, or credential-bearing PostgreSQL URL formats. Real `.env` files were deliberately excluded and not read. No matching value or credential was displayed. This is a pattern-based check, not proof against every possible secret format. | PASS |
| S5 | Check whether real environment files are excluded from Git. | Real `.env` files are ignored and are not tracked. | `git check-ignore` matched `.env`, `.env.local`, and `.env.production`. The only environment-related tracked/unignored path reported was `.env.example`. | PASS |
| S6 | Check that `.env.example` contains placeholders only. | The example file contains no live credentials. | The reviewed file uses example project URL and placeholder key text, not live values. | PASS |
| S7 | Search Git history for accidentally committed credentials. | No real sensitive credentials appear in repository history. | A read-only filename-only pattern scan of commits reachable from local branches and available remote-tracking refs found no matches for common Supabase secret, JWT, cloud-key, or credential-bearing PostgreSQL URL formats. The checked `.env`, `.env.local`, and `.env.production` paths did not appear in reachable history. This does not cover refs or history unavailable in this local clone or every possible credential format. | PASS |
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
- The source and Git-history scans found no known credential patterns. They did
  not inspect real `.env` files or deployment-provider settings, and pattern
  scanning cannot prove the absence of every possible secret format. Confirm
  deployment settings without displaying or copying secret values.
- The manual authentication, listing persistence, and two-sponsor isolation
  tests remain unverified. Follow the test steps below and report only
  observations; do not share passwords or session tokens.

## Overall result

**NOT VERIFIED.** Some login, dashboard, table-existence, and empty-state checks
have prior reported passing evidence, and several configuration checks passed
by static inspection. The whole-project, pattern-based source and local
reachable-history credential scans found no matching credential values. The
remaining browser and live-database tests above are incomplete; Sprint 4 should
not be described as fully verified yet.

## Manual test steps still needed

Do not record passwords, tokens, or recovery codes. For User A and User B, use
only those labels in the reported results; email addresses are optional.

1. **Signup and Auth account (A1–A2):** In a normal browser session, open
   `/auth/signup`, register a new sponsor account, note the page result, then
   confirm the account appears in Supabase Auth. Do not send the password.
2. **Sign in, redirect, refresh, and invalid credentials (A3–A4, A8–A9):**
   sign in with valid credentials and record the destination; separately try
   invalid credentials and record the displayed error without sharing either
   password. Confirm the signed-in dashboard loads and remains signed in after
   a full page refresh.
3. **Sign out and route protection (A5–A7):** Click **Sign out** in the
   dashboard header, then open `/dashboard` and `/dashboard/listings` directly.
   Record the resulting URL and whether protected content or listing data
   appeared.
4. **Listings (P5–P12):** While signed in, open `/dashboard/listings` and
   `/dashboard/listings/new`. For test data, use a clearly synthetic listing:
   title “Test Property A” or “Test Property B”, summary “Synthetic Chapter 4
   RLS test record”, property type `single_family`, address `1 Example Test
   Lane`, city `Testville`, region `Test Region`, postal code `00000`, country
   `US`, asking price `100000`, currency `USD`, and status `draft`. Leave the
   optional address line 2 blank. Confirm the saved row and its `sponsor_id` in
   Supabase, then confirm the matching values appear on the index and remain
   after a full refresh.
5. **Two-sponsor isolation (R1–R6):** In the normal browser, use User A to
   create and view “Test Property A”. In a separate Incognito session, sign in
   as User B, confirm User A's listing is absent, create and view “Test
   Property B”, then return to User A and refresh. Confirm User A sees A but
   not B. Record what each session displayed and confirm each row's owner in
   Supabase. Do not use a service-role key.

Report the observed outcome for each test ID. Tests remain **NOT VERIFIED**
until those observations are provided and recorded.
