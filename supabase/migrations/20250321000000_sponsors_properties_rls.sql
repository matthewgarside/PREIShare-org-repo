-- ASSIGNMENT-ONLY DRAFT: do not apply this file.
--
-- Migration-version conflict: this filename and
-- 20250321000000_property_listings.sql use the same Supabase migration version
-- (20250321000000). Resolve the version collision before integrating either
-- file into migration history.
--
-- Object conflict: the existing migration already creates
-- public.property_listings, its indexes, timestamp trigger, grants, RLS, and
-- four owner-only policies. Reapplying those definitions would conflict with
-- the existing objects. This standalone assignment draft repeats them for
-- review and must not be run as-is or represented as ready to apply.
--
-- public.sponsors below is a proposed, not implemented, profile table from
-- docs/data-model-and-rls-matrix.md. Its creation and profile lifecycle still
-- need product approval.

begin;

-- Already implemented in 20250321000000_property_listings.sql.
create table public.property_listings (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references auth.users (id),
  title text not null,
  summary text not null,
  property_type text not null
    check (property_type in ('single_family', 'multi_family', 'commercial', 'land')),
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null,
  asking_price numeric(12, 2) not null
    check (asking_price >= 0),
  currency text not null,
  status text not null
    check (status in ('draft', 'active', 'under_contract', 'closed')),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

-- Already implemented indexes; do not add duplicates to the existing schema.
create index property_listings_sponsor_id_idx
  on public.property_listings (sponsor_id);
create index property_listings_city_idx
  on public.property_listings (city);
create index property_listings_region_idx
  on public.property_listings (region);
create index property_listings_property_type_idx
  on public.property_listings (property_type);
create index property_listings_status_idx
  on public.property_listings (status);

-- Already implemented timestamp maintenance for listing updates.
create or replace function public.set_property_listings_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create trigger property_listings_set_updated_at
before update on public.property_listings
for each row
execute function public.set_property_listings_updated_at();

-- Proposed / not implemented sponsor profile table.
create table public.sponsors (
  id uuid primary key references auth.users (id),
  display_name text,
  created_at timestamptz not null default pg_catalog.now()
);

alter table public.property_listings enable row level security;
alter table public.sponsors enable row level security;

-- Match the existing listing privileges. Column-level UPDATE privileges omit
-- id, sponsor_id, and timestamps so authenticated sponsors cannot reassign
-- ownership or edit system-managed fields.
revoke all on table public.property_listings from public, anon, authenticated;
grant select, insert, delete on table public.property_listings to authenticated;
grant update (
  title,
  summary,
  property_type,
  address_line1,
  address_line2,
  city,
  region,
  postal_code,
  country,
  asking_price,
  currency,
  status
) on table public.property_listings to authenticated;

-- Proposed profile privileges: no DELETE privilege or policy is provided.
revoke all on table public.sponsors from public, anon, authenticated;
grant select on table public.sponsors to authenticated;
grant insert (id, display_name) on table public.sponsors to authenticated;
grant update (display_name) on table public.sponsors to authenticated;

-- Already implemented owner-only listing policies.
create policy property_listings_select_own
  on public.property_listings
  for select
  to authenticated
  using (sponsor_id = auth.uid());

create policy property_listings_insert_own
  on public.property_listings
  for insert
  to authenticated
  with check (sponsor_id = auth.uid());

create policy property_listings_update_own
  on public.property_listings
  for update
  to authenticated
  using (sponsor_id = auth.uid())
  with check (sponsor_id = auth.uid());

create policy property_listings_delete_own
  on public.property_listings
  for delete
  to authenticated
  using (sponsor_id = auth.uid());

-- Proposed owner-only sponsor profile policies. DELETE remains denied because
-- there is no DELETE grant or allow policy.
create policy sponsors_select_own
  on public.sponsors
  for select
  to authenticated
  using (id = auth.uid());

create policy sponsors_insert_own
  on public.sponsors
  for insert
  to authenticated
  with check (id = auth.uid());

create policy sponsors_update_own
  on public.sponsors
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

commit;