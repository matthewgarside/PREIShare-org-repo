# PREIshare Security Verification Checklist

**Review date:** 2026-10-24  
**Verifier:** Source and documentation review  
**Runtime testing:** No browser, live-database, or generated-bundle tests were run for this review.

This checklist distinguishes source/configuration inspection from runtime behavior. A `PASS` on a source-inspection row confirms only the stated code or configuration was found; it does not prove deployed behavior. Previous manual observations are attributed to the older `/dashboard/listings` route and are not evidence for `/dashboard/properties`. No passwords, tokens, or real secret values are recorded here.

**Status values:** `PASS` | `FAIL` | `NOT RUN`

## 1. Environment and Secret Hygiene

| Test ID | What is being tested | Expected result | Observed result or evidence | Status |
|---|---|---|---|---|
| E1 | `.env.example` contains placeholders rather than real credentials. | Values are clearly generic examples, not project credentials. | Inspected `.env.example`: it uses `your-project-ref`, `your-supabase-publishable-key`, and `your-supabase-secret-key` placeholders. | PASS |
| E2 | `.gitignore` prevents real `.env` files from being tracked as new files. | `.env`, local/deployment variants, and `.env.*` are ignored. | Read `.gitignore` and ran `git check-ignore -v` for `.env`, `.env.local`, `.env.development`, `.env.production`, and `.env.production.local`; each matched an ignore rule. | PASS |
| E3 | `.env.example` is allowed to be committed. | The example file is not ignored. | `.gitignore` explicitly allows `!.env.example`; `git check-ignore -v .env.example` returned no ignored result. | PASS |
| E4 | The browser client reads public Supabase configuration only. | The client uses a public project URL and public anon/publishable key, not privileged credentials. | Inspected `src/lib/supabase.client.ts`: it reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Both are public-prefixed configuration values. | PASS |
| E5 | The browser client does not read `SUPABASE_SERVICE_ROLE_KEY` or another privileged key. | No privileged credential is imported or read by browser code. | The browser-client module contains no service-role or secret-key read. | PASS |
| E6 | Shared React components do not import privileged Supabase credentials. | Shared components and routes do not reference privileged key names or the service-role client. | Searched `src/components` and `src/routes` for `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, and `createSupabaseServiceRoleClient`; no matches were found. | PASS |
| E7 | Privileged server operations are separated from normal sponsor operations. | The privileged key stays in server-side code and is not used for ordinary sponsor listing reads or writes. | `src/lib/supabase.server.ts` defines a separate service-role client using `SUPABASE_SERVICE_ROLE_KEY`; the properties route and create mutation use the ordinary cookie-authenticated client instead. This is source inspection only. | PASS |
| E8 | The generated browser bundle excludes privileged credentials. | No service-role/secret credential is present in browser assets. | No production bundle was built or inspected during this review. | NOT RUN |
| E9 | Committed application source contains no real credentials. | No credential values are hardcoded in tracked `src/` files. | A filename-only scan of tracked application source checked common Supabase secret, JWT, database-URL, and credential-assignment patterns and returned no matching files. This pattern scan cannot detect every possible secret format; no matching values were printed. | PASS |
| E10 | Sensitive environment files are not already tracked by Git. | No real `.env` file is tracked; `.env.example` may be tracked. | Read-only `git ls-files` inspection returned `.env.example` as the only matching environment path; no real `.env` file was listed. | PASS |
| E11 | Application environment-variable names match the documented names and `.env.example`. | The active client/server code and setup template agree on public and server-only variable names. | They do not agree. The docs/example name `VITE_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`; active modules also expect `VITE_SUPABASE_ANON_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. The login/list route imports use differing Supabase modules. Deployment configuration was not inspected. | FAIL |

## 2. Login and Session Routing

| Test ID | What is being tested | Expected result | Observed result or evidence | Status |
|---|---|---|---|---|
| L1 | Login implementation uses Supabase password authentication and establishes a session before redirecting. | Valid credentials are submitted to Supabase Auth; a returned session is established before navigation to `/dashboard`. | Source inspection of `src/routes/login.tsx` found `signInWithPassword`, a required returned session, a call to `establishSession`, and navigation to `/dashboard`. This does not prove the live flow succeeds. | PASS |
| L2 | Successful login with valid sponsor credentials. | Authentication succeeds, the session is established, and the sponsor reaches `/dashboard`. | No current browser test was performed. The older verification record reports a successful login and dashboard destination, but it does not establish that the current `/login` flow was tested. | NOT RUN |
| L3 | Invalid login. | Authentication is denied, a useful error appears, and the visitor remains on `/login`. | No invalid-credential browser test was performed. | NOT RUN |
| L4 | Dashboard route guard implementation. | An unauthenticated request is checked and redirected to `/login` before the dashboard renders. | Source inspection of `src/routes/dashboard.tsx` found a `getUser()` check in `beforeLoad` and a redirect to `/login` when no user is returned. | PASS |
| L5 | Actual unauthenticated visit to `/dashboard`. | The browser is redirected to `/login` and no protected dashboard data is exposed. | No logged-out browser test or request-level check was performed. | NOT RUN |
| L6 | Child route protection implementation. | Dashboard child routes are nested under the protected dashboard layout. | Source inspection found the `/dashboard` layout applies the session check and renders child routes through `<Outlet />`. Runtime child-route behavior was not tested. | PASS |
| L7 | Sign-out implementation. | Sign-out clears the Supabase session on the client and server and navigates to `/login`. | Source inspection of the dashboard header and auth session helper found client sign-out, server `signOut`, and navigation to `/login`. | PASS |
| L8 | Actual sign-out and protected-route retry. | After signing out, the sponsor returns to `/login` and cannot reopen `/dashboard` without authentication. | No sign-out browser test or protected-route retry was performed. | NOT RUN |
| L9 | Session refresh and expiry. | A valid session remains usable after refresh; an invalid/expired session does not grant protected access. | No refresh, expiry, or invalid-session browser test was performed. | NOT RUN |

## 3. Property List Isolation

| Test ID | What is being tested | Expected result | Observed result or evidence | Status |
|---|---|---|---|---|
| P1 | Current properties loader uses an authenticated server-side query. | The server verifies the current user before returning property rows. | Source inspection of `src/routes/dashboard/properties.tsx` found a server function that calls `supabase.auth.getUser()` and redirects when no verified user is available before querying. | PASS |
| P2 | The properties query uses the current PostgreSQL table. | The query reads `public.property_listings`, not an assumed `properties` or older listings table. | The route queries `.from('property_listings')`; the reviewed migration defines `public.property_listings`. | PASS |
| P3 | Ordinary sponsor reads do not use the service-role key. | Listing reads use the authenticated sponsor's permissions so RLS can apply. | The route calls `createSupabaseServerClient()`, which uses the anon key and request cookies; it does not call the service-role client. | PASS |
| P4 | The reviewed migration defines owner-based property read protection. | RLS is enabled and SELECT is limited by `sponsor_id = auth.uid()`. | `20250321000000_property_listings.sql` enables RLS and defines `property_listings_select_own` with `USING (sponsor_id = auth.uid())`. This verifies the migration text only. | PASS |
| P5 | Live Supabase RLS setting and SELECT policy. | The deployed table has RLS enabled and the expected owner-only SELECT policy. | The prior checklist says live RLS and policy inspection was not recorded. No live database inspection was performed for this review. | NOT RUN |
| P6 | Property page displays fields from the authorized query result. | The UI renders property details returned by its loader. | Source inspection found the component maps the loader's returned `properties` to visible property cards. Actual authorized database content was not observed. | PASS |
| P7 | Signed-in sponsor views the current `/dashboard/properties` page. | The page loads successfully and displays only authorized information. | No browser test of the current route was performed. | NOT RUN |
| P8 | Empty-list state implementation. | An empty result displays a clear, non-sensitive empty state. | Source inspection found a “No properties yet” empty-state message when the returned array has no rows. | PASS |
| P9 | Actual current-route empty state. | A sponsor with no authorized rows sees the empty-state message. | No current-route browser test was performed. Earlier empty-state evidence concerns `/dashboard/listings`, not this route. | NOT RUN |
| P10 | Database-error handling implementation. | A listing-query error displays a useful generic message without exposing raw database details. | Source inspection found a generic “Could not load properties” message and an error component; raw database errors are not rendered. | PASS |
| P11 | Actual database-failure display. | A failed properties query produces a useful error in the browser. | No controlled database-failure browser test was performed. | NOT RUN |
| P12 | Unauthenticated access cannot retrieve private property data. | A visitor without a valid session receives no private property rows, including through a direct request. | No current-route browser or direct request test was performed. The source guard is not a substitute for live verification. | NOT RUN |

## 4. Property Creation Under RLS

| Test ID | What is being tested | Expected result | Observed result or evidence | Status |
|---|---|---|---|---|
| C1 | New-property form fields. | The form contains the required listing fields and identifies the optional address line 2. | Source inspection of `src/routes/dashboard/properties.new.tsx` found title, summary, property type, address, city, region, postal code, country, asking price, currency, and status fields; address line 2 is optional. | PASS |
| C2 | Required-field and asking-price validation. | Required values are validated; non-finite, negative, over-limit, and over-precision prices are rejected. | Source inspection found a strict Zod schema with required listing fields and asking-price checks for finite values, minimum zero, database maximum, and at most two decimal places. | PASS |
| C3 | Insert is performed through a server-side mutation. | The browser submits to a server mutation rather than directly inserting from the form. | The route defines `createProperty` using `createServerFn({ method: 'POST' })`; the form calls that function. | PASS |
| C4 | Server verifies the authenticated sponsor. | The mutation obtains the user from a verified Supabase session and rejects missing users. | The handler calls `supabase.auth.getUser()` and returns an error result when there is an auth error or no user. | PASS |
| C5 | Sponsor ownership is assigned from the verified identity. | The inserted `sponsor_id` comes from the server-verified user's ID. | The insert supplies `sponsor_id: user.id`; it does not take ownership from submitted form fields. | PASS |
| C6 | Browser cannot select another sponsor as owner. | The submitted schema rejects unknown ownership fields and the server sets the owner itself. | The server-side validator uses a strict schema, and the handler constructs the owner field from `user.id`. This is source inspection; no tampering attempt was run. | PASS |
| C7 | Database checks ownership on insert. | The migration's INSERT policy uses `WITH CHECK (sponsor_id = auth.uid())`. | The reviewed migration defines `property_listings_insert_own` with that `WITH CHECK` expression. Live enforcement remains unverified. | PASS |
| C8 | Create uses the ordinary authenticated client. | The mutation uses sponsor-session permissions rather than the service-role key. | Source inspection found `createSupabaseServerClient()` in the mutation and no service-role-client call. | PASS |
| C9 | Insert failures do not expose raw database details. | The user receives a useful generic error rather than credentials or raw DB internals. | The mutation returns a generic create error; the UI displays the returned message and catches request failures with a generic message. | PASS |
| C10 | Success navigation requires a confirmed insert. | Navigation happens only after the server returns success for a selected inserted row. | The handler returns success only after `.insert(...).select('id').single()` yields a property; the form navigates only when `result.ok` is true. | PASS |
| C11 | Actual form validation and successful create. | Valid data creates a property and the browser reports success. | No current-route form submission was performed. | NOT RUN |
| C12 | Actual invalid asking-price submissions. | Invalid prices are rejected in the browser and server mutation. | No browser submission with invalid prices was performed. | NOT RUN |
| C13 | Actual owner assignment and spoof resistance. | A saved row belongs to the authenticated sponsor; attempts to submit another sponsor ID fail or are ignored. | No insert, database-row ownership comparison, or owner-tampering attempt was performed. | NOT RUN |
| C14 | Unauthenticated property creation. | A visitor without a valid session cannot create a private property. | No unauthenticated form or direct mutation attempt was performed. | NOT RUN |
| C15 | Created property appears in the current list. | After confirmed insert, the property appears under the same sponsor in `/dashboard/properties`. | No current-route create-and-list browser test was performed. | NOT RUN |

## 5. Cross-Sponsor Access Attempts

The following PASS results are previously recorded manual observations for the older `/dashboard/listings` route in `docs/verification/sprint4-auth-listings-checklist.md` (R1–R6). The record does not give a test date. These observations are UI evidence only, not proof of direct database RLS enforcement.

| Test ID | What is being tested | Expected result | Observed result or evidence | Status |
|---|---|---|---|---|
| X1 | Sponsor A creates and views a property on the older route. | Sponsor A can create and see their own listing. | The prior verification record reports Sponsor A created and viewed “Test Property A” on `/dashboard/listings`. | PASS |
| X2 | Sponsor B uses a separate session on the older route. | Sponsor B cannot see Sponsor A's listing. | The prior record reports Sponsor B signed in through a separate Chrome Incognito session and saw the empty state rather than Sponsor A's listing. | PASS |
| X3 | Sponsor B creates a listing and Sponsor A checks again on the older route. | Sponsor B sees their own listing; Sponsor A does not see Sponsor B's listing. | The prior record reports Sponsor B created and viewed “Test Property B”; after refresh, Sponsor A still saw A and not B on `/dashboard/listings`. | PASS |
| X4 | Sponsor A sees Sponsor A's own rows on `/dashboard/properties`. | Sponsor A sees their authorized current-route properties. | No current-route two-account browser evidence was provided or observed. | NOT RUN |
| X5 | Sponsor A cannot see Sponsor B's rows on `/dashboard/properties`. | Sponsor B's rows are absent from Sponsor A's current-route results. | No current-route two-account browser test was performed. | NOT RUN |
| X6 | Sponsor B sees Sponsor B's own rows on `/dashboard/properties`. | Sponsor B sees their authorized current-route properties. | No current-route two-account browser test was performed. | NOT RUN |
| X7 | Sponsor B cannot see Sponsor A's rows on `/dashboard/properties`. | Sponsor A's rows are absent from Sponsor B's current-route results. | No current-route two-account browser test was performed. | NOT RUN |
| X8 | Sponsor A tries to create a property owned by Sponsor B. | The request cannot assign Sponsor B as owner. | No cross-sponsor owner-tampering attempt was performed. | NOT RUN |
| X9 | Sponsor B tries to create a property owned by Sponsor A. | The request cannot assign Sponsor A as owner. | No cross-sponsor owner-tampering attempt was performed. | NOT RUN |
| X10 | An unauthenticated visitor tries to create a private property. | The mutation denies creation and no private row is inserted. | No unauthenticated create attempt was performed. | NOT RUN |
| X11 | Direct unauthorized database/API read or write. | PostgreSQL RLS denies Sponsor A access to Sponsor B's rows and rejects cross-owner writes. | Prior tests were through the older UI only. No direct authenticated database/API attempt or live policy enforcement result was recorded. | NOT RUN |

## 6. Residual Risks

| Test ID | What is being tested | Expected result | Observed result or evidence | Status |
|---|---|---|---|---|
| R1 | Migration version uniqueness before deployment. | Each migration has a unique timestamp/version, or conflicting drafts are excluded from migration history. | `20250321000000_property_listings.sql` and `20250321000000_sponsors_properties_rls.sql` share version `20250321000000`. The second file labels itself assignment-only and says not to apply it; resolve/exclude the collision before deployment. | FAIL |
| R2 | Deployment environment configuration. | Deployment supplies the exact variables expected by the active modules, with public and privileged values kept in the correct server/client scope. | Deployment settings were not inspected. The source/template naming mismatch is recorded in E11 and means copied example values alone may not configure all current modules. | NOT RUN |
| R3 | Live PostgreSQL schema, grants, RLS setting, and policies. | Deployed permissions and policies match the reviewed migration and owner model. | Existing verification records say live RLS settings and policies were not confirmed. No live database inspection occurred in this review. | NOT RUN |
| R4 | Browser bundle secret scan. | No service-role or other privileged credential is present in generated browser assets. | No production browser bundle was generated or inspected. | NOT RUN |
| R5 | Supabase email-confirmation configuration. | Production confirmation settings are intentional and tested. | The older verification record says email confirmation was temporarily disabled for local testing; the current project setting and production behavior were not checked. | NOT RUN |
| R6 | Production deployment security checks. | Production auth, redirect, and secret configuration is reviewed before release. | No production deployment settings or hosted behavior were inspected. | NOT RUN |

Other confirmed configuration gap: E11 records disagreement between documented/example variable names and active source names. The service-role key is privileged and can bypass RLS; it must remain server-only and must not be used for ordinary sponsor listing operations. Browser-bundle exclusion and deployment settings remain unverified.

## 7. Final Stakeholder Verdict

**Review date:** 2026-10-24  
**Overall status:** **NOT READY for production release.**

Source review confirmed that the current code defines an authenticated properties query, derives create ownership from the verified user, and includes owner-based RLS policies in the reviewed migration. Environment ignore rules and placeholder handling were checked, and earlier manual two-sponsor UI observations were recorded for the older `/dashboard/listings` route. The current login, create, and `/dashboard/properties` flows have not been tested in a browser; live RLS, direct unauthorized access, and the browser bundle have not been verified. Before production, reconcile environment variable names, resolve the migration timestamp collision, and complete current-route browser tests plus live RLS and bundle checks. The recorded older UI test is not sufficient to claim production security or current-route isolation.

**Test totals:** 33 `PASS` | 2 `FAIL` | 29 `NOT RUN` (64 rows)