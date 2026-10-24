# PREIShare Sponsor Authentication Requirements

## 1. Client Story

PREIShare sponsors need to sign in securely, open a protected dashboard, and
work with the property listings they are allowed to access. Listing information
should be saved in PostgreSQL so it is still available after the page is
refreshed, rather than existing only in temporary React state or sample arrays.

Supabase Auth verifies which sponsor is signed in. PostgreSQL ownership rules
then limit which listings that sponsor can read or change. This matters because
hiding information in the page is not enough to stop someone from requesting
another sponsor's data directly. Private credentials and secret keys must also
stay out of browser code and GitHub.

These are product requirements, not a claim that every part of the feature has
been implemented or verified.

## 2. Actors

| Actor | Need |
| --- | --- |
| Sponsor | Sign in and access only the property listings they are authorized to manage. |
| Unauthenticated visitor | Reach the login page, but not see protected dashboard information or listings. |

No administrator, reviewer, or other user role is part of this client story.

## 3. Goals

1. Sponsors can sign in with an email address and password, and Supabase Auth
   verifies their identity.
2. A signed-in sponsor can open protected dashboard pages, including their
   listing pages.
3. A sponsor can retrieve their authorized property listings from PostgreSQL,
   where the records remain saved after a page refresh.
4. New listings are associated with the identity from the sponsor's verified
   session, not an owner ID supplied by the browser.
5. Sponsors cannot view or modify listings they are not authorized to access.
6. Authentication checks and PostgreSQL Row Level Security (RLS) protect
   sponsor information, rather than relying only on what the React interface
   displays.

## 4. Functional Requirements

- **FR1 — Sign in:** A sponsor can sign in with valid email-and-password
  credentials. Supabase Auth must verify those credentials.
- **FR2 — Reject invalid credentials:** Invalid credentials do not create an
  authenticated session, and the login page shows a useful error.
- **FR3 — Successful destination:** After successful sign-in, the sponsor is
  redirected to `/dashboard`.
- **FR4 — Sign out:** A signed-in sponsor can sign out. The ended session no
  longer grants access to protected pages or listing data.
- **FR5 — Protect dashboard routes:** An unauthenticated visitor who opens
  `/dashboard` is redirected to `/auth/login`. Dashboard child routes, such as
  `/dashboard/listings`, must apply the same protection and must not show
  protected data.
- **FR6 — Read owned listings:** A signed-in sponsor can retrieve their
  authorized rows from PostgreSQL's `property_listings` table. The query and
  database permissions must prevent another sponsor's rows from being returned.
- **FR7 — Create an owned listing:** A sponsor can create a property listing
  within the agreed create scope. The trusted server operation derives
  `sponsor_id` from the verified sponsor identity; it does not trust a sponsor
  ID sent by the browser.
- **FR8 — Restrict updates:** The current planned sprint does not include
  editing existing listings. If listing updates are approved later, both the
  server operation and database policy must verify ownership of the existing
  row and ensure it remains owned by that sponsor.
- **FR9 — Useful listing errors:** Invalid required listing information or a
  failed listing request is not reported as a successful save. The sponsor
  receives a clear error.

The earlier client brief calls for sponsor account creation, while the later
work includes an `/auth/signup` page. Neither settles whether anyone may
self-register or whether accounts are invitation-only. A signup page and its
unverified test status do not by themselves approve unrestricted public signup;
see [Open Questions](#10-open-questions).

## 5. Security Requirements and Threats

- An unauthenticated visitor must never receive protected sponsor dashboard
  information or listing data. A route redirect alone is not enough if a
  server request can still return the data.
- Sponsor A must never receive Sponsor B's private property listings, even if
  Sponsor A guesses or changes a listing URL or identifier.
- A sponsor must never create, update, or delete another sponsor's listing
  without authorization. Creating a listing must use the verified sponsor's
  identity. Updates and deletes are not included in the current sprint, but
  must be owner-restricted if approved later.
- The browser must never receive a Supabase service-role key, secret key,
  database password, privileged database URL, session secret, or other private
  credential. A secret/service-role key can bypass database protections.
- Database passwords and private credentials must never be hardcoded into
  React components or other source files.
- Real environment files such as `.env` and `.env.local` must not be committed
  to GitHub. Only placeholder examples belong in `.env.example`.
- Authentication must use a real verified Supabase Auth session. A mock login
  session or a hardcoded user must never be treated as proof of identity.
- Normal sponsor listing operations must use the authenticated sponsor's
  permissions and must not bypass RLS with a service-role key.
- Every protected server operation must verify the sponsor's session and
  authorization before returning or changing data. Hiding a button in React
  does not enforce permission.

## 6. Database Ownership and RLS

The proposed listing table is `public.property_listings` in PostgreSQL. Each
listing has a unique `id` (a generated UUID primary key) and a required
`sponsor_id` UUID that references `auth.users(id)`. The `sponsor_id` connects a
listing to the sponsor account that owns it for access-control purposes; it
does not describe legal ownership of the property.

When a database request uses a sponsor's authenticated Supabase session,
`auth.uid()` identifies that signed-in user. RLS policies compare the listing's
`sponsor_id` with that identity:

| Operation | Ownership check | Result |
| --- | --- | --- |
| `SELECT` | `sponsor_id = auth.uid()` | Return only listings owned by the signed-in sponsor. |
| `INSERT` | Check the new row with `sponsor_id = auth.uid()`. | Allow creation only when the new listing belongs to that sponsor. |
| `UPDATE` | Check the existing row and the saved row against `auth.uid()`. | If updates are approved, a sponsor can change only their own listing and cannot transfer it to another sponsor. |
| `DELETE` | Check the row with `sponsor_id = auth.uid()`. | If deletion is approved, a sponsor can delete only their own listing. |

The database must enforce ownership because browser input can be changed and
requests can be made without using the page's buttons. The server must also
derive the owner from the verified session. The current listing scope is
viewing and creating; the schema's UPDATE and DELETE ownership rules describe
protection for possible later operations, not approval to add those features
now.

The schema and handoff documents describe the table and policies, and the
verification checklist reports that the table exists. Live column definitions,
live RLS configuration, and database-level policy enforcement are not recorded
as verified. This requirements document does not add or change SQL migrations.

## 7. Server-Only Boundaries

The documented Supabase environment variable names are:

| Variable | Visibility | Use |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Public | Supabase project URL; safe for browser configuration. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public | Supabase publishable key; safe for browser configuration, but not authorization by itself. |
| `SUPABASE_SECRET_KEY` | Server-only | Privileged key; keep out of browser code and responses. |

The `VITE_` variables are exposed to browser code by Vite. `SUPABASE_SECRET_KEY`
must not use the `VITE_` prefix and must only be read in trusted server-side
code if it is needed. Never put real values in this document.

Normal sponsor listing requests should use the sponsor's authenticated
permissions so PostgreSQL RLS applies. Do not use a service-role key to perform
ordinary sponsor reads or writes, because it can bypass those ownership
policies. A protected server operation must verify the sponsor's session and
authorization before accessing a listing; the browser cannot make that
decision on its own.

## 8. In Scope and Out of Scope

**In scope**

- Email-and-password sponsor sign-in through Supabase Auth.
- Protected dashboard and listing routes, sign-out, and useful authentication
  errors.
- Viewing authorized sponsor listings and creating a listing associated with
  the authenticated sponsor.
- PostgreSQL persistence, sponsor ownership, and RLS requirements for listing
  access.
- Keeping private credentials server-only and real environment files out of
  source control.

**Out of scope**

- Approval of unrestricted public registration; the account-creation policy is
  an open question.
- Editing, deleting, or archiving listings in the current sprint.
- Public listing search or a public marketplace.
- Administrator dashboards, reviewer roles, or new approval systems.
- Payments, investment transactions, document uploads, or financial
  calculations.
- Social sign-in or password-recovery features unless separately approved.

## 9. Success Criteria

Each item is a testable expected result. The status records prior evidence from
the Sprint 4 verification checklist; it does not change the requirement.

| # | Testable result | Existing evidence |
| --- | --- | --- |
| 1 | A sponsor signs in with valid email and password and reaches `/dashboard`. | **PASS reported** (A3–A4). |
| 2 | Invalid credentials do not sign in, and a useful error is shown. | **NOT VERIFIED** (A9). |
| 3 | A signed-out visitor opening `/dashboard` or a protected child route is redirected to `/auth/login`, with no listing data shown. | **NOT VERIFIED** (A6–A7). |
| 4 | A sponsor signs out and can no longer access protected content. | **NOT VERIFIED** (A5). |
| 5 | Sponsor A creates and sees their own listing; Sponsor B also sees their own listing. | **PASS reported in two-session UI observations** (R1–R2, R5); form and saved-row checks remain unverified (P7–P10). |
| 6 | Sponsor A cannot see Sponsor B's listing, and Sponsor B cannot see Sponsor A's listing in separate sessions. | **PASS reported in UI observations** (R3–R6); live database RLS enforcement remains unverified (R7, P3–P4, S8). |
| 7 | A successfully saved listing is present in PostgreSQL and remains visible after a full page refresh. | **NOT VERIFIED as a persistence test** (P9–P12). R6 separately reports that A still saw A's listing after refresh, but the checklist does not record a database row check and its persistence statuses conflict. |
| 8 | Browser-facing code contains no server-only key or private database credential. | **PASS by static source/configuration review** (S1–S4); deployment settings were not inspected. |
| 9 | Real environment files are ignored by Git, while `.env.example` contains placeholders only. | **PASS reported** (S5–S6). |
| 10 | Live PostgreSQL RLS policies enforce sponsor ownership for protected listing operations. | **NOT VERIFIED against the live database** (P3–P4, R7, S8). |

The checklist and handoff report contradictory evidence: R1–R6 record
successful two-sponsor UI observations, while P9–P12 and the checklist's
summary leave listing persistence and its refresh test unverified. The UI
observations support the expected behavior, but they are not proof of live
database ownership or RLS enforcement. Overall Sprint 4 verification remains
**not complete**.

## 10. Open Questions

- Should sponsors be allowed to register themselves, or should accounts be
  invitation-only? The brief calls for account creation and a signup route is
  documented, but public registration is not clearly approved and its test is
  unverified.
- Should sponsors be allowed to edit, delete, or archive existing listings in
  a later sprint? The current requirements exclude these operations.
- Are additional user roles planned for a future sprint? No additional role is
  defined for this work.
- Which listing status values should be standard? The schema proposal and
  domain brief list different status values; resolve that before enforcing a
  shared database constraint.