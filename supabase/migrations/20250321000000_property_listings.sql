begin;

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

alter table public.property_listings enable row level security;

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

commit;
