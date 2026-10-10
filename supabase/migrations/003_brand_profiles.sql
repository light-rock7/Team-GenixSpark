create table if not exists public.brand_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  company_name text,
  industry text,
  bio text,
  website_url text,
  logo_url text,
  location text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.brand_profiles enable row level security;

drop policy if exists "Brand profiles are publicly readable" on public.brand_profiles;
create policy "Brand profiles are publicly readable"
on public.brand_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Brands can update own brand profile" on public.brand_profiles;
create policy "Brands can update own brand profile"
on public.brand_profiles
for update
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'brand'
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'brand'
  )
);
