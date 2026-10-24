# PREIshare — Data Model and RLS Policy Matrix

## 1. Purpose and Client Requirements

This document describes the current sponsor identity and property-listing
database design, records the listing policies defined by the migration, and
proposes private-profile policies for a possible future sponsor table. It is a
design and documentation reference; it does not apply migrations or verify
live database policy behavior.

The main source for client requirements is
[`sponsor-auth-requirements.md`](./sponsor-auth-requirements.md). It says
sponsors sign in through Supabase Auth and should access only listings
associated with their verified identity. The relevant requirements are to
read and create owned listings. Editing and deleting are outside the current
sprint. The client story does not include administrator roles, reviewer roles,
public listing search, or public listing writes.

Supabase Auth manages authenticated identities in `auth.users`. PostgreSQL
stores the property listing rows in `public.property_listings`. A separate
public sponsor-profile table is not defined by the reviewed migration. A
minimal `public.sponsors` table is described below as **PROPOSED / NOT
IMPLEMENTED** only.

The requirements and verification sources do not claim every feature is fully
tested. The verification checklist reports the table was observed and that
two-sponsor UI isolation checks passed, but live schema details and live RLS
enforcement remain unverified. See [Verification status](#verification-status).

## 2. Database Table Design

### Supabase Auth identity

`auth.users` is managed by Supabase Auth. It stores the identity used to
authenticate a sponsor; PREIshare should not replace it with a custom password
table. On a database request made with a verified sponsor session,
`auth.uid()` identifies that sponsor's Auth user UUID.

### `public.property_listings` — IMPLEMENTED IN THE REVIEWED MIGRATION

The migration
[`20250321000000_property_listings.sql`](../supabase/migrations/20250321000000_property_listings.sql)
defines the following table. `NOT NULL` columns are required; `address_line2`
is nullable. Defaults and check constraints are shown as written in the
migration.

| Column | PostgreSQL Type | Required/Optional | Purpose | Status |
|---|---|---|---|---|
| `id` | `uuid` | Required | Primary key; generated with `gen_random_uuid()`. | IMPLEMENTED in migration |
| `sponsor_id` | `uuid` | Required | References `auth.users(id)` and identifies the sponsor associated with the listing. | IMPLEMENTED in migration |
| `title` | `text` | Required | Listing title. | IMPLEMENTED in migration |
| `summary` | `text` | Required | Listing summary. | IMPLEMENTED in migration |
| `property_type` | `text` | Required | Property category; check constraint permits `single_family`, `multi_family`, `commercial`, or `land`. | IMPLEMENTED in migration |
| `address_line1` | `text` | Required | Main street address. | IMPLEMENTED in migration |
| `address_line2` | `text` | Optional | Additional address details, such as a unit or suite. | IMPLEMENTED in migration |
| `city` | `text` | Required | City. | IMPLEMENTED in migration |
| `region` | `text` | Required | State, province, or region. | IMPLEMENTED in migration |
| `postal_code` | `text` | Required | ZIP or postal code. | IMPLEMENTED in migration |
| `country` | `text` | Required | Country. | IMPLEMENTED in migration |
| `asking_price` | `numeric(12, 2)` | Required | Asking price; check constraint requires a value greater than or equal to zero. | IMPLEMENTED in migration |
| `currency` | `text` | Required | Currency for the asking price. | IMPLEMENTED in migration |
| `status` | `text` | Required | Listing status; check constraint permits `draft`, `active`, `under_contract`, or `closed`. | IMPLEMENTED in migration |
| `created_at` | `timestamptz` | Required | Creation timestamp; defaults to `pg_catalog.now()`. | IMPLEMENTED in migration |
| `updated_at` | `timestamptz` | Required | Update timestamp; defaults to `pg_catalog.now()` and is refreshed by a before-update trigger. | IMPLEMENTED in migration |

The UUID primary key uniquely identifies each listing row. The required
`sponsor_id` foreign key connects the listing to a Supabase Auth user for
access control; it does not represent legal ownership of the property. The
name `sponsor_id` serves the same ownership purpose as the assignment example
`owner_id`. Keep the implemented name rather than renaming it or creating a
duplicate `properties` table without a documented requirement.

The migration also creates indexes on `sponsor_id`, `city`, `region`,
`property_type`, and `status`. The `updated_at` trigger maintains the update
timestamp. Those database objects do not grant extra access.

### `public.sponsors` — PROPOSED / NOT IMPLEMENTED

No separate sponsor/profile table is defined in the reviewed migration files.
If the assignment or product needs sponsor display information, this minimal
profile table could be considered:

| Column | PostgreSQL Type | Required/Optional | Purpose | Status |
|---|---|---|---|---|
| `id` | `uuid` | Required | Primary key and foreign key to `auth.users(id)`; uses the same UUID as the authenticated sponsor. | PROPOSED / NOT IMPLEMENTED |
| `display_name` | `text` | Optional | Sponsor name to display. No reviewed requirement makes it mandatory. | PROPOSED / NOT IMPLEMENTED |
| `created_at` | `timestamptz` | Required | Records profile creation time; a proposed default could be `now()`. | PROPOSED / NOT IMPLEMENTED |

A profile table may be useful for storing display information separately from
authentication credentials. It is not required for listing ownership because
`property_listings.sponsor_id` already references `auth.users(id)`. Supabase
Auth remains responsible for user identities and passwords; do not create a
custom password table.

## 3. Table Relationships

- **Existing in the migration:** `public.property_listings.sponsor_id`
  references `auth.users(id)`. One Auth user can be associated with multiple
  property listings.
- **Proposed only:** `public.sponsors.id` would reference
  `auth.users(id)`, with the same UUID used for the Auth user and profile.
  That would represent at most one profile row per Auth user because `id` is
  the profile primary key.
- **No implemented profile-to-listing relationship:** Listings reference
  `auth.users` directly, not a sponsor profile table.

The foreign key ensures that a referenced Auth user exists according to the
database relationship. RLS uses the UUID identity from `auth.uid()` to compare
the requesting sponsor with the listing's `sponsor_id`. The migration does not
specify a custom foreign-key deletion action, so this document does not assume
one.

## 4. Row Level Security Policy Matrix

The following property-listing policies and grants are **defined in the
migration**. That is not the same as confirming they have been applied to the
live Supabase database. Sponsor profile rows below are **PROPOSED / NOT
IMPLEMENTED**.

| Table | Operation | Who | Rule in Plain English | Notes |
|---|---|---|---|---|
| `public.property_listings` | SELECT | Authenticated sponsor | Retrieve only rows where `sponsor_id` matches that sponsor's authenticated user ID. | **IMPLEMENTED in migration:** `USING (sponsor_id = auth.uid())`. Protecting reads prevents sponsors from retrieving one another's private listings. |
| `public.property_listings` | INSERT | Authenticated sponsor | Create a row only when its `sponsor_id` equals the authenticated user's ID. | **IMPLEMENTED in migration:** `WITH CHECK (sponsor_id = auth.uid())`. The trusted server operation should derive the ID from the verified session, not browser input. |
| `public.property_listings` | UPDATE | Authenticated sponsor | Target only owned rows, and allow the update only if the resulting row still has the sponsor's ID. | **IMPLEMENTED in migration:** `USING` checks the existing row and `WITH CHECK` checks the updated row. The `UPDATE` grant includes listing fields but excludes `sponsor_id`, `id`, and timestamps, so the normal `authenticated` role cannot change ownership through its column-level grant. Product requirement: updates are out of scope for this sprint. |
| `public.property_listings` | DELETE | Authenticated sponsor | Delete only rows owned by that sponsor. | **IMPLEMENTED in migration:** `USING (sponsor_id = auth.uid())`; `DELETE` is granted to `authenticated`. Product requirement: deletion is out of scope for this sprint, and the checklist does not confirm that deletion was tested or exposed in the UI. |
| `public.sponsors` **(PROPOSED / NOT IMPLEMENTED)** | SELECT | Authenticated sponsor | Read only the profile whose `id` equals `auth.uid()`. | Proposed owner-only rule: `USING (id = auth.uid())`. Needed if this table stores private sponsor profile information. |
| `public.sponsors` **(PROPOSED / NOT IMPLEMENTED)** | INSERT | Authenticated sponsor, if sponsor-created profile setup is approved | Insert a profile only when its `id` equals `auth.uid()`. | Proposed `WITH CHECK (id = auth.uid())`. The requirements do not decide whether profile creation occurs via a signup trigger, trusted server operation, or another flow. |
| `public.sponsors` **(PROPOSED / NOT IMPLEMENTED)** | UPDATE | Authenticated sponsor, if profile editing is approved | Target only the sponsor's own profile and ensure the saved row still has `id = auth.uid()`. | Proposed `USING (id = auth.uid())` and `WITH CHECK (id = auth.uid())`. Profile editing is not specified in the client requirements. |
| `public.sponsors` **(PROPOSED / NOT IMPLEMENTED)** | DELETE | None unless separately approved | Do not allow sponsor deletion by default. | No sponsor DELETE policy is proposed as enabled. Profile/account deletion requires a stakeholder decision. |

### `USING` and `WITH CHECK`

`USING` controls which existing rows a user may see or target. For example,
the listing SELECT policy uses `USING (sponsor_id = auth.uid())` so each
sponsor's query only sees their own rows. For UPDATE, `USING` filters which
existing rows can be changed.

`WITH CHECK` controls whether a new or changed row may be stored. INSERT needs
a `WITH CHECK` rule because there is no old row to filter; PostgreSQL must
validate the row being added. UPDATE needs both checks: `USING` restricts the
existing row, and `WITH CHECK` ensures the saved row remains authorized and
owned by the same sponsor.

The migration's policy shapes are:

```sql
-- Existing listing row must belong to the authenticated sponsor.
USING (sponsor_id = auth.uid())

-- A new or updated listing must remain assigned to that sponsor.
WITH CHECK (sponsor_id = auth.uid())
```

These are documentation examples of the migration's existing conditions, not
new executable SQL.

## 5. Anonymous Access Rules

The migration revokes table privileges from `anon` and defines no anonymous
policies. An unauthenticated request normally has `auth.uid()` equal to
`NULL`; a comparison such as `sponsor_id = auth.uid()` does not match a
sponsor-owned row. Anonymous users therefore should not read, insert, update,
or delete private sponsor listings. If the proposed private profile table is
created, anonymous users should not read sponsor profiles either.

There is no public listing-read or public listing-write requirement in the
client story. A dashboard redirect is useful for the interface, but the
database permissions and RLS checks must still protect data if someone sends a
request outside the React page.

## 6. Security and Authorization Decisions

- **Authentication:** Supabase Auth verifies the sponsor and provides the user
  identity represented by `auth.uid()` for an authenticated database request.
- **Database authorization:** PostgreSQL RLS enforces row-level ownership. A
  React component hiding a listing or button cannot substitute for these
  database checks.
- **Reads and writes:** SELECT must be protected as carefully as INSERT,
  UPDATE, and DELETE. Preventing unauthorized writes while returning private
  rows to the wrong sponsor would still expose protected information.
- **Trusted owner ID:** Server functions must verify the session and derive
  `sponsor_id` from it. They must not trust a sponsor ID submitted by the
  browser.
- **Normal sponsor requests:** Use the authenticated sponsor's permissions so
  RLS applies. Do not use a privileged service-role credential for ordinary
  sponsor reads or writes.
- **Privileged credentials:** Supabase secret/service-role credentials can
  bypass RLS. Keep them in trusted server-only code; never expose them to
  browser components, client bundles, or client-visible responses.
- **Database grants:** The migration revokes table privileges from `PUBLIC`,
  `anon`, and `authenticated`, then grants `SELECT`, `INSERT`, and `DELETE`
  to `authenticated` and `UPDATE` on selected listing columns. Grants allow
  operations at the table/column level; RLS still limits which rows qualify.
- **Ownership immutability:** The migration's authenticated UPDATE grant
  excludes `sponsor_id`, and the UPDATE policy checks both old and resulting
  ownership. Together these prevent a normal authenticated sponsor update
  from transferring a listing to another sponsor.

## 7. Requirement → Design Mapping

| Requirement from Client Story | Database or Security Design | How It Meets the Requirement |
|---|---|---|
| Supabase Auth verifies sponsor email-and-password identity. | Supabase-managed `auth.users`; authenticated request identity available through `auth.uid()`. | Auth owns user identity and credentials; PREIshare does not create a password table. |
| Sponsors need property-listing information saved in PostgreSQL. | `public.property_listings` with listing columns documented in Section 2. | The migration defines a persistent relational row shape; live persistence still needs verification. |
| Sponsors need listing fields such as title, summary, property type, address, asking price, and status. | Required columns `title`, `summary`, `property_type`, address columns, `asking_price`, `currency`, and `status`; optional `address_line2`. | The migration stores the requested listing details and enforces its documented type, nullability, and check constraints. |
| A sponsor can retrieve only authorized listings (FR6). | `public.property_listings` SELECT policy: `USING (sponsor_id = auth.uid())`. | PostgreSQL filters returned rows to those owned by the authenticated sponsor. The policy is in the migration; live RLS enforcement is not verified. |
| A sponsor can create an owned listing (FR7). | `sponsor_id` foreign key and INSERT policy: `WITH CHECK (sponsor_id = auth.uid())`; server derives the ID from the verified session. | The database rejects a row whose owner does not match the authenticated sponsor. The application must not use a browser-supplied owner ID as authority. |
| Updating existing listings is outside the current sprint (FR8). | Owner-limited UPDATE policy uses `USING` and `WITH CHECK`; authenticated UPDATE grant excludes `sponsor_id`. | The migration contains future-safe database restrictions, but the requirement does not authorize an update UI or current-sprint edit feature. |
| Deleting listings is outside the current sprint. | Owner-limited DELETE policy and authenticated DELETE grant exist in the migration. | The database design restricts any permitted delete to owned rows, but this is not product approval to expose delete functionality. The checklist does not show deletion testing. |
| Prevent unauthorized access, including another sponsor changing a URL or ID. | RLS policies compare listing `sponsor_id` to `auth.uid()` for each operation. | A request for another sponsor's row does not satisfy the owner condition. Live database behavior still needs direct verification. |
| Protect other sponsors' private information. | SELECT policy applies the ownership condition to reads; anonymous role has no table grant. | Unauthorized users should not receive another sponsor's listing rows, even if the UI is bypassed. |
| Unauthenticated visitors must not see protected dashboard/listing data. | No `anon` table privileges or listing policies; authenticated policies use `auth.uid()`. | Anonymous requests have no authenticated owner identity and do not receive the authenticated role's grants. |
| Keep privileged credentials private and do not bypass RLS for ordinary requests. | Public browser configuration is separate from server-only secret/service-role credentials; ordinary reads/writes use authenticated sponsor permissions. | Privileged keys can bypass RLS, so they must remain server-only and must not be used as the normal sponsor data path. |
| Maintain private profile details, if needed. | **PROPOSED / NOT IMPLEMENTED:** `public.sponsors`, keyed by `id` referencing `auth.users(id)`, with owner-only proposed policies. | This is not a current client requirement or implemented table. Stakeholders must confirm whether the profile table and its create/edit lifecycle are needed. |

## 8. Out of Scope and Open Questions

### Out of scope for the current sprint

- Administrator dashboards, reviewer roles, and approval workflows.
- Public listing search, a public marketplace, or public listing writes.
- Editing, deleting, or archiving listings as user-facing features.
- Multi-sponsor/team ownership, payments, investment transactions, document
  uploads, and financial calculations.
- A new authentication system or a custom password table.
- A sponsor profile table unless the assignment or product owner confirms it
  is needed; the table in this document is only proposed.

### Open questions

- Should sponsor self-registration be allowed, or should account creation be
  invitation-only?
- Is `public.sponsors` required, and if so, what process creates a profile
  row? Is `display_name` optional as proposed, or should another requirement
  define profile fields?
- Should sponsors be allowed to edit profile data? Profile deletion should
  remain denied unless a stakeholder approves an account/profile lifecycle.
- When, if ever, should listing update or delete functionality be enabled?
- The [RLS policy review](./data-model/rls-policy-review.md) says the migration
  has no status allowed-values constraint, but the actual migration includes
  a `status` check constraint for `draft`, `active`, `under_contract`, and
  `closed`. The SQL migration is the source of truth for this document; resolve
  the documentation mismatch separately.
- The requirements brief describes an earlier frontend-demo state, while the
  sponsor-auth requirements and verification checklist describe later
  implementation evidence. Treat source code/migration as the implementation
  definition and the checklist as reported evidence, not as proof of all live
  behavior.

### Verification status

The [Sprint 4 verification checklist](./verification/sprint4-auth-listings-checklist.md)
reports:

- The table's existence was previously observed (P1), but live column
  comparison, RLS enablement, and live policy inspection are **NOT VERIFIED**
  (P2–P4).
- Two-sponsor UI observations report each sponsor saw their own listing and
  not the other's (R1–R6 **PASS**). The checklist explicitly says this is not
  a direct database-level RLS test.
- Direct verification of database ownership enforcement is **NOT VERIFIED**
  (R7, S8). Listing save/persistence checks are also **NOT VERIFIED** (P9–P12).
- Therefore, policies are **defined in the migration**, but this document
  does not claim every policy or operation has been tested or confirmed in the
  live database.

No credentials are included in this document. The matrix records the existing
migration and a clearly separated profile proposal; it does not create tables,
policies, or migrations.