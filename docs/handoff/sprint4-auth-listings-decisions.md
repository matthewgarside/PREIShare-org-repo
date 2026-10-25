# Sprint 4 Handoff: Sponsor Authentication and Property Listings

**Project:** PREIshare  
**Status date:** 2026-10-24  
**Verification status:** Partially verified; see the checklist conflicts and remaining tests below.

## 1. Delivered vs. Client Story

The original client wanted sponsors to sign in securely, manage real property
listings saved in PostgreSQL, and see only listings they are authorized to
access. The client also required protected sponsor pages and credentials kept
out of browser code. The requirements brief describes these as product goals;
the verification checklist provides the evidence for what was tested.

| Client need | Sprint 4 evidence and current status |
| --- | --- |
| Sponsor authentication | A sponsor successfully signed in and reached `/dashboard` (A3–A4 PASS). The signup, account creation, sign-out, session-refresh, invalid-login, and signed-out redirect tests remain NOT VERIFIED. |
| Protected dashboard routes | Source review says the dashboard route checks the current user and redirects when signed out. Browser tests of `/dashboard` and `/dashboard/listings` while signed out remain NOT VERIFIED. |
| Real PostgreSQL listings | The checklist reports that `public.property_listings` exists (P1 PASS). The migration and source review describe database-backed listing operations, but live columns, row persistence, and listing persistence after refresh have not been confirmed. |
| Creating and viewing a sponsor's listing | The two-sponsor test records that User A and User B each created and saw their own listing (R1–R2 and R5 PASS). The checklist separately marks form submission and database persistence tests P7–P12 NOT VERIFIED, so those test statuses and evidence need reconciliation. |
| Preventing access to another sponsor's listings | The checklist records that B could not see A's listing and A could not see B's (R4 and R6 PASS). These are UI observations in separate browser sessions, not a direct test of live database RLS enforcement. |
| Keeping credentials out of browser code | Static source and configuration checks S1–S7 are marked PASS, with limits described in Section 5. Deployment settings were not inspected, and normal-request RLS enforcement remains NOT VERIFIED (S8). |

The two-sponsor UI observations support the client requirement that sponsors
should see their own listings, not another sponsor's. They do not prove every
database policy or authorization scenario works. The overall Sprint 4 status
must remain **partially verified**, not production-ready.

## 2. Architecture Decisions

### Supabase Auth and protected routes

The project uses Supabase Auth for sponsor identity. The checklist reports a
successful sign-in and redirect to `/dashboard`. A protected dashboard route
checks for a current user in the reviewed source. This replaces reliance on
mock identity for the login path that was tested, but signup, sign-out, session
persistence, and signed-out route behavior still need browser verification.

### PostgreSQL listings and ownership

The proposed database table is `public.property_listings`. A listing has a
generated `uuid` primary key, `id`, which uniquely identifies that row.
`sponsor_id` is a required `uuid` foreign key to `auth.users(id)`, linking each
listing to the sponsor account that owns it for access control. Other fields
include the title and summary, property type, address, asking price and
currency, status, and creation and update timestamps.

PostgreSQL is the intended persistent store for listings, rather than React
state or hardcoded sample arrays. The checklist says the migration defines the
table and ownership policies, and the reviewed listings index reads through a
Supabase listing function. The table's existence is reported as PASS; the live
column definitions, row ownership, and database persistence have not been
confirmed by recorded database results.

The migration provides a repeatable definition of the table and its policies.
The checklist names `20250321000000_property_listings.sql`, but does not
document a migration-application command. Follow the repository/team's approved
Supabase migration workflow; do not assume the live database matches the
migration until it is checked.

### Row Level Security

The proposed policies enable RLS and compare `sponsor_id` to `auth.uid()`,
Supabase's ID for the authenticated user making the database request:

- **SELECT:** `USING (sponsor_id = auth.uid())` limits returned rows to the
  signed-in sponsor's listings.
- **INSERT:** `WITH CHECK (sponsor_id = auth.uid())` allows insertion only
  when the new row belongs to that sponsor.
- **UPDATE:** `USING` restricts which existing row can be changed, and
  `WITH CHECK` ensures the saved row still belongs to the same sponsor.
- **DELETE:** `USING (sponsor_id = auth.uid())` restricts deletion to the
  sponsor's own row.

These database rules matter because a user can make requests without relying
on the React interface. Hiding another sponsor's listing in the UI alone would
not stop an unauthorized request. The schema design describes UPDATE and
DELETE policies for ownership protection, but editing, deleting, and archiving
are outside the current sprint scope. The live policies and their enforcement
remain unverified.

For a new listing, trusted server-side code should derive `sponsor_id` from the
verified session, not accept an owner ID chosen by the browser. Normal sponsor
operations should use the authenticated sponsor's permissions so RLS applies;
they should not use a service-role key that bypasses RLS.

### Browser, server, and mock data

The documented browser configuration is the public Supabase project URL and
anon key (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`). Server-side code verifies identity and handles trusted
operations. The checklist's source review says the listing server path uses
the public Supabase client with the authenticated user's identity; it does not
report a service-role key being used for these operations. The public key is
not authorization by itself.

The requirements brief identifies mock dashboard data and a `getUser()` stub
as prior scaffold limitations. A successful Supabase login is recorded, but
the checklist does not establish that every dashboard area or mock-data
surface has been replaced. Do not treat unrelated investor dashboard sample
data as real sponsor listing data.

## 3. How to Run PREIshare Locally

1. Clone or open the PREIshare repository.
2. From the repository root, install dependencies with `npm install`.
3. Review `.env.example` and the Supabase variable names below. Do not copy
   real credentials into source files or documentation.
4. Create a local `.env.local` or `.env` from `.env.example`, then fill in
   the values from the intended Supabase project.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as public
   variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only if it is required by the
   server configuration; the checklist reports no use of it in application
   code at the time of review.
6. Using the team's approved Supabase workflow, apply the property-listings
   migration if needed. Confirm the live table columns and that RLS and the
   expected policies are enabled. These live checks are not yet recorded as
   verified.
7. Start the development server with `npm run dev`. The project script serves
   the app on port 3000; use the localhost URL printed in the terminal.
8. Sign in with an authorized test sponsor account and open
   `/dashboard/listings`. Signup, sign-out, and related session behavior still
   need the tests listed in the verification checklist.

The documented variable names are:

| Variable | Visibility |
| --- | --- |
| `VITE_SUPABASE_URL` | Public; may be used by browser code. |
| `VITE_SUPABASE_ANON_KEY` | Public; may be used by browser code. |
| `SUPABASE_URL` | Optional server-side URL override. |
| `SUPABASE_ANON_KEY` | Optional server-side anon-key override. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose in browser code or responses. |

The public variables do not grant permission to another sponsor's records.
Database passwords, privileged connection URLs, secret/service-role keys, and
session secrets must never be exposed in browser code. The environment
checklist says `.env` and `.env.*` are ignored by Git while `.env.example` may
be committed. Keep real environment files local and uncommitted.

## 4. Known Limitations

The verification checklist records **no FAIL tests**, but many checks remain
NOT VERIFIED:

- Signup and Auth account creation (A1–A2), sign-out (A5), signed-out
  redirects for dashboard routes (A6–A7), session persistence after refresh
  (A8), and invalid-credential handling (A9).
- Live table columns and live RLS configuration/policies (P2–P4), opening and
  submitting the new-listing form (P7–P8), saved-row ownership and persistence
  (P9), and confirmation that displayed listing data is populated from the
  database and survives refresh (P10–P12).
- Live policy ownership verification (R7) and live RLS enforcement on the
  normal sponsor access path (S8).

**Checklist conflict to resolve:** R1–R6 are marked PASS and report that the
two sponsors created and viewed their own listings in separate browser
sessions, including A refreshing and not seeing B's listing. However, the
later risks section says the two-sponsor test was not recorded, and P9–P11
say listing creation, index display, and refresh were not verified. The
specific R1–R6 observations are included above as reported UI evidence, and
match the manual results supplied for this handoff. The checklist should be
updated to reconcile its contradictory summary and P-test rows. No direct
database ownership query or RLS bypass attempt is recorded, so those remain
unverified regardless of the UI results.

Email confirmation was temporarily disabled for local testing. Review and
restore the intended setting before real sponsors use the application, then
test registration and confirmation. Secret scans did not inspect real
environment files or deployment-provider settings, and pattern scans cannot
prove that every possible secret format is absent. The checklist reports that
real environment-file paths were ignored and no matching credential patterns
were found in the checked local files/history; these checks are not a complete
deployment or credential audit.

The schema design also records a decision to resolve: its status values
(`draft`, `active`, `under_contract`, `closed`) differ from the values in the
domain brief (`draft`, `published`, `under_offer`, `sold`, `archived`). Agree
on one set before implementing a database constraint or migration. Project
documentation does not establish production readiness.

## 5. Recommended Next-Sprint Work

1. **Finish verification and reconcile the checklist.** Record the missing
   authentication and form tests, check live schema and policies, confirm
   database persistence and ownership, and correct the conflicting P9–P11
   and overall-summary notes. This makes the Sprint 4 handoff dependable
   before expanding the feature.
2. **Harden the sponsor flow.** Test sign-out, signed-out route protection,
   session persistence, invalid credentials, and the email-confirmation flow.
   These checks complete the original secure-authentication goal.
3. **Add richer property listing fields (proposed).** If sponsors need more
   detail to evaluate properties, consider fields such as square footage,
   bedrooms, bathrooms, or additional financial details. Property photos could
   also be considered, with storage and access requirements decided first.
   These additions would extend the existing PostgreSQL `property_listings`
   table and help sponsors describe and compare properties more clearly. Update
   the database through a migration and update the TypeScript listing types and
   validation rules together. Keep each listing associated with its
   `sponsor_id` and protected by RLS. Supabase Auth identifies the sponsor, and
   any protected write should go through a TanStack Start server function that
   verifies the sponsor. Retain the separate public browser client and
   server-only handling for secrets.
4. **Explore a listing approval workflow (proposed future functionality).**
   PREIshare could let a sponsor create a draft, submit it for review, and let
   an authorized reviewer approve or reject it. The sponsor could then see the
   listing's approval status. This could help prevent unreviewed listings from
   becoming visible to the public or other authorized users. Supabase Auth
   would provide identity, while PostgreSQL could store the listing status and
   any review information the team approves. Reviewer permissions do not
   currently exist: stakeholders would need to define reviewer roles and
   visibility rules, then design RLS to distinguish sponsor actions from
   reviewer actions. TanStack Start server functions must verify reviewer
   permissions and enforce allowed status changes; never trust an approval
   decision sent by the browser. Keep privileged operations and secret keys on
   the server, and use authenticated permissions so RLS remains effective.
5. **Explore pgvector property search (proposed future enhancement).** If users
   need to find listings by meaning or similarity, a later sprint could
   evaluate PostgreSQL's `pgvector` extension and store or compare listing
   embeddings during search. For example, a user could search for properties
   similar to a description rather than matching only exact words. A migration
   and appropriate TypeScript types would be needed. This would build on the
   existing PostgreSQL listings, not replace them. Supabase Auth should
   identify the user, and RLS must still restrict which listings that user is
   allowed to search or receive. Use a protected TanStack Start server function
   with the user's authenticated permissions. If an external service is
   selected to generate embeddings, its API key and embedding operations must
   remain server-only; preserve the separate public browser and server-only
   clients. pgvector search and embeddings are not implemented in Sprint 4.
6. **Improve listing management within approved scope.** Once the client
   confirms requirements, consider editing or archiving listings; the current
   requirements exclude editing and deleting, and archiving is an update.
   Improve search and filtering only after confirming that sponsors need it.
7. **Connect remaining dashboard data to real records where required.**
   The requirements brief describes existing investor demo data as mock data,
   so stakeholders should decide whether and when those areas should use
   persisted data rather than implying they already do.
8. **Prepare deployment securely.** Verify provider-side environment
   configuration, restore and test email confirmation, and ensure normal
   sponsor operations continue to enforce RLS. Do not expose secret values
   while checking configuration.

## 6. Open Questions for Stakeholders

- Should sponsors eventually be able to edit, delete, or archive listings?
  The current planned sprint excludes editing and deleting; archiving also
  requires an update.
- Which listing status values should be standard across the TypeScript
  domain and database design?
- Should sponsor registration remain open to anyone, or become
  invitation-only? The current documents do not decide this.
- Are additional sponsor roles or organization membership needed? Complex
  staff roles and multi-member sponsor organizations are currently out of
  scope.
- Which dashboard data and listing improvements should be prioritized after
  the outstanding verification is complete?

## Source Documents

- [Requirements brief](../requirements/sponsor-auth-and-listings-brief.md)
- [Sprint 4 verification checklist](../verification/sprint4-auth-listings-checklist.md)
- [Property listings schema design](../data-model/property-listings-schema.md)
- [Supabase environment checklist](../setup/supabase-env-checklist.md)
