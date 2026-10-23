# RLS policy review: property_listings

## What the table stores

The `property_listings` table stores one sponsor-owned property listing per
row. It includes the title and summary, property type, address, asking price
and currency, workflow status, and creation and update times. Its columns and
types follow the approved
[property listings schema](./property-listings-schema.md).

Each row has a generated UUID `id` and a required `sponsor_id` UUID that
references `auth.users(id)`. Supabase Auth sets `auth.uid()` to the ID of the
signed-in user. The policies compare that ID with `sponsor_id` to enforce row
ownership.

## Policies

All four policies apply only to the `authenticated` role:

| Operation | Policy rule | What it allows |
| --- | --- | --- |
| SELECT | `USING (sponsor_id = auth.uid())` | A sponsor can read only listings they own. |
| INSERT | `WITH CHECK (sponsor_id = auth.uid())` | A sponsor can insert a row only when its `sponsor_id` is their own ID. |
| UPDATE | `USING (sponsor_id = auth.uid())` and `WITH CHECK (sponsor_id = auth.uid())` | A sponsor can update only their rows, and the saved row must still belong to them. This blocks transferring a listing to another sponsor. |
| DELETE | `USING (sponsor_id = auth.uid())` | A sponsor can delete only listings they own. |

Table privileges are also revoked from `PUBLIC` and `anon`; CRUD privileges are
granted to `authenticated`. The grants alone do not allow access to another
sponsor's rows because RLS applies the ownership checks. Do not use a
service-role key for normal sponsor operations: privileged service access can
bypass RLS.

## Applying the migration

The migration is
[`supabase/migrations/20250321000000_property_listings.sql`](../../supabase/migrations/20250321000000_property_listings.sql).
It has not been run as part of this review.

To apply it in the Supabase SQL Editor:

1. Open the project dashboard and go to **SQL Editor**.
2. Create a new query and paste in the full migration file.
3. Run the query and check that it completes successfully.

Alternatively, with the Supabase CLI installed and the project linked to the
correct Supabase project, run:

```sh
supabase db push
```

This applies pending migrations. Confirm the linked project before running it.

## Verifying the table and RLS

In the SQL Editor, check that the table exists:

```sql
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
  and table_name = 'property_listings';
```

Check that RLS is enabled (`rowsecurity` should be `true`):

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename = 'property_listings';
```

List the policies and their operations:

```sql
select policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename = 'property_listings'
order by cmd;
```

The policy query should show SELECT, INSERT, UPDATE, and DELETE policies for
`authenticated`.

## Risks and open questions

- **Listing status values need a decision.** The approved schema names the
  TypeScript values `draft`, `active`, `under_contract`, and `closed`, but it
  also identifies a conflict with another domain brief and says to choose one
  shared set before adding a database constraint or migration. This migration
  keeps `status` as required `text` without a default or allowed-values
  constraint until the team confirms the set.
- **Editing and deleting remain a product-scope question.** The sponsor
  requirements brief excludes editing and deleting in its planned sprint, but
  this requested migration includes ownership-limited UPDATE and DELETE
  policies. Keep those app operations unavailable until the sprint scope is
  approved; the policies do not add app functionality by themselves.
- **Server code must use the sponsor's authenticated session.** It should
  derive `sponsor_id` from the verified session, not browser input, and should
  use a client subject to RLS. A service-role key can bypass these policies and
  must remain server-only.
- **Public listing access is not included.** The current rules allow a sponsor
  to see only their own rows. If listings should later be visible to other
  sponsors or the public, confirm that requirement and design separate
  read-access rules.

## Review notes

- Columns and data types follow the approved schema.
- Ownership uses `sponsor_id` referencing `auth.users(id)`.
- Four owner-only RLS policies are present; UPDATE checks both the old and new
  row ownership.
- Indexes, timestamp defaults, and an `updated_at` trigger are included.
- No public or anonymous table privileges are granted, and the migration
  contains no credentials.
