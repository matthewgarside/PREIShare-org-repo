# Sprint 4 Topic 2 Handoff — PREIShare Sponsor Authentication and Property Listings

## 1. Sprint Overview and Client Outcomes

PREIShare's client story is to help sponsors make better real-estate decisions
using property and market information. For this topic, the sponsor-facing
requirement is to sign in, reach a protected dashboard, and work with property
listings that are associated with their authenticated account. Listing
ownership here means account-level access control; it does not represent legal
ownership of the real estate.

The requirements identify a sponsor with a valid Supabase Auth account as the
intended user. The app includes email-and-password login and signup pages, but
the product decision about unrestricted self-registration versus
invitation-only accounts is still open. No administrator or reviewer role is
defined for this work. See the [sponsor authentication requirements](./sponsor-auth-requirements.md).

| Client outcome | What is implemented | What verification supports |
| --- | --- | --- |
| Sponsor authentication | Login routes submit email and password to Supabase Auth. Successful flows are written to establish a server session and navigate to `/dashboard`. | Invalid login was tested and displayed an error (L3 PASS). A successful login with a current sponsor account was NOT RUN (L2). |
| Protected dashboard and sign-out | The dashboard layout checks the session before rendering its nested routes. A sign-out implementation clears the session and navigates to login. | An unauthenticated visit to `/dashboard` redirected to `/login` (L5 PASS). Sign-out and a post-sign-out route retry are source-inspected but not browser-tested (L7 PASS; L8 NOT RUN). |
| Sponsor property listings | The properties page reads `property_listings` through a server function using the request's authenticated session and displays the returned listing fields. | The checklist records current-route two-sponsor UI observations (X4–X7 PASS). It does not establish live database RLS enforcement. |
| Create property records | The new-property form validates listing input; its server mutation verifies the sponsor and assigns `sponsor_id` from the verified user's ID, rather than accepting an owner ID from the form. | The checklist reports Sponsor A created a property and saw it on the properties page (C11/C15 PASS). Invalid-price and owner-tampering tests were NOT RUN. |
| Ownership restrictions | The applied listing migration defines RLS policies that compare `sponsor_id` to `auth.uid()` for listing operations. | The policy text was inspected (P4 PASS), but the live database policy and direct unauthorized requests were NOT RUN (P5/X11). Current-route UI observations are not a substitute for those checks. |
| Public/private Supabase configuration | Browser code uses the public `VITE_` URL and anon-key settings; server code has optional server-side URL/anon overrides and a separate server-only service-role helper. | The local production build's browser bundle scan passed (E8/R4 PASS). Deployment configuration was not inspected (R2/R6 NOT RUN). |

The current properties UI evidence is specifically recorded in X4–X7. The
checklist also marks P7 (a current-route browser load) NOT RUN, so those entries
are not fully consistent; this handoff preserves the specific reported
cross-sponsor observations without treating them as proof of database
authorization.

## 2. Architecture Decisions

- **Supabase Auth for identity:** Supabase Auth verifies a sponsor's
  email-and-password credentials and provides the authenticated user ID. The
  application does not create its own password table. Successful current
  login and account-registration policy still need verification/approval.
- **PostgreSQL for property records:** The actual listing table is
  `public.property_listings`, defined in
  [`20250321000000_property_listings.sql`](../supabase/migrations/20250321000000_property_listings.sql).
  It includes title, summary, property type, address, asking price, currency,
  status, sponsor ID, and timestamps. The migration source exists; the live
  database schema was not checked during this verification.
- **RLS for row ownership:** RLS moves access enforcement into PostgreSQL,
  rather than trusting only the page to hide data. The documented and
  migration-defined owner conditions are:
  - `SELECT`: `USING (sponsor_id = auth.uid())` restricts visible existing rows.
  - `INSERT`: `WITH CHECK (sponsor_id = auth.uid())` accepts a new row only
    when its sponsor ID matches the signed-in user.
  - `UPDATE`: `USING` limits the existing row and `WITH CHECK` ensures the
    saved row remains owned by that user.
  - `DELETE`: `USING (sponsor_id = auth.uid())` limits deletion to owned rows.

  Update and delete policies are present in the migration, but user-facing
  editing and deletion are outside this sprint's approved scope. The checklist
  verifies the policy text, not that these policies are enabled and effective
  in the live Supabase project.
- **TanStack Start for server operations:** Server functions can verify the
  request's sponsor session and perform listing queries or inserts without
  treating browser-supplied ownership as trusted. The property-creation
  handler uses the verified user's `user.id` as `sponsor_id`.
- **Separate browser and server Supabase clients:** The browser client is
  initialized with public configuration. The normal property server client
  uses the anon key with request cookies, so the sponsor's authenticated
  permissions accompany the request and RLS can apply. This separation also
  keeps server-only code out of browser modules.
- **No service-role access for routine sponsor work:** Normal sponsor reads
  and writes must use the authenticated sponsor's permissions, not an
  elevated key. `SUPABASE_SERVICE_ROLE_KEY` is privileged, can bypass RLS,
  and must remain server-only. The code has a separate server-only helper for
  explicitly authorized administrative operations; it must not be used for
  ordinary sponsor listing requests.

The public environment variables are `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`. The server can optionally use `SUPABASE_URL` and
`SUPABASE_ANON_KEY` overrides, falling back to the public Vite variables.
Those URL/anon settings are not substitutes for authentication or RLS. Keep
the service-role key unprefixed and out of browser bundles, responses, and
logs. See the [environment-variable checklist](./env-var-checklist.md).

## 3. Important Project Files

| File Path | Purpose | Important Notes |
| --- | --- | --- |
| [`sponsor-auth-requirements.md`](./sponsor-auth-requirements.md) | Sponsor client story, access requirements, and open decisions. | Source of truth for intended sponsor actions; it explicitly distinguishes requirements from verified behavior. |
| [`data-model-and-rls-matrix.md`](./data-model-and-rls-matrix.md) | Documents the listing data model and owner-policy design. | `public.sponsors` is proposed only, not implemented; the listing table references `auth.users` directly. |
| [`env-var-checklist.md`](./env-var-checklist.md) | Classifies public and server-only Supabase variables. | Treats `SUPABASE_SERVICE_ROLE_KEY` as privileged and server-only. |
| [`security-verification-checklist.md`](./security-verification-checklist.md) | Records test evidence, failures, and remaining checks. | Source/code inspection, UI observations, and live database tests are distinguished. |
| [`src/lib/supabase.client.ts`](../src/lib/supabase.client.ts) | Browser-safe Supabase client used by the `/login` page. | Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; contains no service-role read. |
| [`src/lib/supabase.server.ts`](../src/lib/supabase.server.ts) | Server-only authenticated sponsor client and privileged helper. | Normal sponsor requests use anon-key session cookies; service-role helper is separate and server-only. |
| [`src/routes/login.tsx`](../src/routes/login.tsx) | Email-and-password login page at `/login`. | Calls `signInWithPassword`, establishes the session, then navigates to `/dashboard`. |
| [`src/routes/auth/login.tsx`](../src/routes/auth/login.tsx) | Email-and-password login page at `/auth/login`. | This second login route exists; route naming/redirect consistency is an open cleanup item. |
| [`src/routes/auth/signup.tsx`](../src/routes/auth/signup.tsx) | Signup page at `/auth/signup`. | A signup form exists, but unrestricted public registration is not a settled product decision and its runtime flow was not verified. |
| [`src/routes/dashboard.tsx`](../src/routes/dashboard.tsx) | Protected dashboard layout. | Calls `getUser()` in `beforeLoad`, redirects unauthenticated requests to `/login`, and renders child routes through an outlet. |
| [`src/routes/dashboard/properties.tsx`](../src/routes/dashboard/properties.tsx) | Loads and displays the sponsor's properties. | Checks the user, then queries `property_listings` using the authenticated server client. |
| [`src/routes/dashboard/properties.new.tsx`](../src/routes/dashboard/properties.new.tsx) | Property creation form and server mutation. | Validates the input, derives `sponsor_id` from the verified session, and inserts through the ordinary authenticated client. |
| [`src/lib/auth/session.ts`](../src/lib/auth/session.ts) | Establishes, verifies, and ends server-side Supabase sessions. | Sign-out implementation exists; actual sign-out behavior remains NOT RUN. |
| [`20250321000000_property_listings.sql`](../supabase/migrations/20250321000000_property_listings.sql) | Actual listing schema, grants, RLS enablement, and listing policies. | Source defines `property_listings` and owner checks; live database application/enforcement is not verified. |
| [`20250321000000_sponsors_properties_rls.sql`](../supabase/migrations/20250321000000_sponsors_properties_rls.sql) | Assignment-only SQL draft that repeats listing objects and proposes a sponsor profile table. | The file says **do not apply**. It shares a version with the actual migration and would conflict; it is not the applied schema. |

## 4. Verification Results

The [security verification checklist](./security-verification-checklist.md)
reports **46 PASS, 1 FAIL, and 18 NOT RUN** across its test rows. A PASS can
mean source/configuration inspection, a local runtime check, a generated
bundle scan, or a reported manual UI observation; it does not always mean a
live database or production test passed.

### PASS

- **Environment and bundle checks:** E1–E11 and R4 PASS. The checklist records
  placeholder-only `.env.example`, ignored real environment files,
  public-only browser settings, no shared-route service-role references,
  a successful local build, and a generated browser-bundle scan with no
  privileged-key or server-only helper matches. E11 records that the earlier
  environment-variable naming mismatch was standardized and retested locally.
- **Authentication and routing evidence:** L1, L3–L7 PASS. Login/session code
  and sign-out code were inspected; invalid login was exercised and showed an
  error; an unauthenticated `/dashboard` request redirected to `/login`.
  The sign-out PASS is implementation inspection only.
- **Property list implementation:** P1–P4, P6, P8, P10, and P12 PASS. These
  rows verify the authenticated server query, use of `property_listings`,
  migration policy text, rendering/empty-state/error handling, and the
  unauthenticated current-route redirect. They do not prove live RLS.
- **Property creation:** C1–C11, C15, and C16 PASS. Source inspection covers
  form fields, validation, server-side mutation, user verification, and
  owner assignment. Manual evidence reports Sponsor A created a property and
  saw it in the list. The unauthenticated create-form route redirected, but
  a direct unauthorized mutation was not attempted.
- **Sponsor separation:** X1–X3 PASS are historical observations for the
  older `/dashboard/listings` page. X4–X7 PASS are separately reported
  current-route UI observations: each of two sponsors saw their own
  properties and not the other's on `/dashboard/properties`. These are UI
  observations only, not direct database/API authorization tests.

### FAIL

- **R1 — Migration version uniqueness:** the actual
  `20250321000000_property_listings.sql` and the
  assignment-only `20250321000000_sponsors_properties_rls.sql` share timestamp
  `20250321000000`. The duplicate must be resolved or the draft excluded from
  migration history before migration deployment. The draft itself warns not
  to apply it.

### NOT RUN

- **Authentication/session:** L2 (successful current sponsor login), L8
  (sign-out and protected-route retry), and L9 (session refresh/expiry).
- **Listing route and database policy:** P5 (live RLS setting/policy
  inspection), P7 (current-route page-load test as separately recorded),
  P9 (current-route empty state), and P11 (controlled database-error display).
  Note the checklist's separate X4–X7 rows report current-route
  cross-sponsor UI observations despite P7 being NOT RUN.
- **Property creation:** C12–C14 (invalid asking-price submission, direct
  owner assignment/tampering, and unauthenticated creation).
- **Cross-sponsor authorization:** X8–X10 (cross-owner creation attempts and
  unauthenticated mutation) and X11 (direct unauthorized database/API
  access).
- **Deployment/residual checks:** R2–R3 and R5–R6 (deployment environment,
  live schema/grants/RLS, production email-confirmation settings, and
  production security configuration).

The checklist also notes that the reported create-and-list UI observation is
not an independent database-row check: it did not inspect the saved
`sponsor_id`. Therefore the manual creation result is evidence of the UI
flow, not confirmation of PostgreSQL persistence or RLS behavior.

## 5. Known Limitations and Residual Risks

- Live RLS configuration, live grants, and direct database/API ownership
  enforcement have not been verified. Current two-sponsor UI observations
  cannot prove that a direct request for another sponsor's row will be denied.
- The database row's saved `sponsor_id`, direct owner-tampering resistance,
  unauthenticated create rejection at the mutation boundary, invalid form
  submissions, and independent persisted-row/refresh behavior remain
  unverified.
- Successful current sponsor login, sign-out, session refresh/expiry,
  production email-confirmation behavior, and deployment environment
  settings remain unverified. A signup page exists, but self-registration
  policy is unresolved.
- The docs and routes disagree about the login URL: the requirements mention
  `/auth/login`, while the protected dashboard and current verification use
  `/login`. Both login route files exist. Confirm the intended canonical path
  and align redirects, links, and requirements documentation.
- The naming issue identified in the checklist was corrected according to
  E11; the documented contract now uses public `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY`, optional server overrides, and a server-only
  service-role key. However, hosted deployment values/scopes have not been
  inspected, so local checks do not establish production configuration.
- The two migration files share a timestamp, and the duplicate draft repeats
  objects from the actual migration while proposing a `public.sponsors` table
  that is not implemented. Do not apply the draft as-is; resolve its status
  before using the migration workflow.
- `public.sponsors` is not an implemented table. Listings instead reference
  `auth.users(id)` directly. Editing and deleting listings are also not
  current user-facing features, even though owner-restricted policies appear
  in the migration.
- The checklist has a reporting inconsistency: P7 says the current
  `/dashboard/properties` page was not browser-tested, while X4–X7 record
  manual current-route sponsor-isolation observations. Keep the narrower
  evidence visible and clarify the checklist during the next verification
  pass.

The project is **not verified as production-ready**. The checklist's verdict
is NOT READY for production because the migration collision is unresolved
and key live-database, authentication, and deployment checks remain open.

## 6. Recommended Next-Sprint Work

These are future recommendations, not completed features. They extend the
existing Supabase Auth, PostgreSQL, and RLS approach rather than replacing it.

1. **Complete authentication and RLS verification.** Use authorized test
   sponsor accounts to exercise successful login, sign-out, refresh/expiry,
   direct owner and cross-owner reads/writes, and unauthenticated mutation
   attempts. Inspect the live schema, grants, and policies using ordinary
   authenticated permissions. This closes the most important evidence gaps
   while retaining Auth identity and PostgreSQL ownership checks.
2. **Improve property listing management.** After product approval, design
   edit/archive/delete workflows with validated TanStack Start server
   operations and owner-scoped RLS. This builds on the existing create and
   list pages without exposing other sponsors' records. Editing/deleting
   should not be enabled until requirements and tests are agreed.
3. **Add richer property fields deliberately.** Gather sponsor and investor
   needs, agree on each field's meaning and validation, then update the
   PostgreSQL schema, TypeScript types, and form/list UI together. Keep
   ownership enforcement attached to each record and verify migrations
   before deployment.
4. **Explore a property approval workflow.** First define who may submit,
   review, approve, or publish a listing; no reviewer/admin role is currently
   defined. If approved, model status changes and permissions in PostgreSQL
   and enforce them in server operations and RLS, rather than relying on
   hidden interface controls.
5. **Evaluate pgvector for future property discovery.** pgvector is a
   possible future search capability, not part of the current implementation.
   Assess useful discovery questions and data/privacy requirements before
   storing embeddings, then prototype search alongside the existing
   PostgreSQL records and authenticated access rules.

## 7. Stakeholder Handoff Summary

The next developer can use the existing Supabase Auth flows, protected
dashboard, property list/create routes, PostgreSQL listing migration, and
documented RLS design immediately. The checklist verifies source/configuration
boundaries, invalid-login handling, unauthenticated dashboard redirects, and
reported two-sponsor UI isolation and property creation; it does not verify
live RLS enforcement, direct cross-sponsor denial, full session behavior, or
production configuration. Resolve the migration timestamp collision and
complete the outstanding security tests before production use. The project is
ready for further development, but it is not yet supported by enough
verification for production release.