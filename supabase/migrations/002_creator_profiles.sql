create table if not exists public.creator_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  headline text,
  bio text,
  location text,
  availability text not null default 'available'
    check (availability in ('available', 'busy', 'unavailable')),
  years_experience integer not null default 0 check (years_experience >= 0 and years_experience <= 80),
  hourly_rate numeric(12,2) check (hourly_rate is null or hourly_rate >= 0),
  skills text[] not null default '{}',
  ai_tools text[] not null default '{}',
  specializations text[] not null default '{}',
  website_url text,
  social_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.creator_profiles enable row level security;

drop policy if exists "Creator profiles are publicly readable" on public.creator_profiles;
create policy "Creator profiles are publicly readable"
on public.creator_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Creators can update own creator profile" on public.creator_profiles;
create policy "Creators can update own creator profile"
on public.creator_profiles
for update
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'creator'
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'creator'
  )
);

create index if not exists idx_creator_profiles_availability
  on public.creator_profiles(availability);
create index if not exists idx_creator_profiles_skills
  on public.creator_profiles using gin(skills);
create index if not exists idx_creator_profiles_ai_tools
  on public.creator_profiles using gin(ai_tools);
create index if not exists idx_creator_profiles_specializations
  on public.creator_profiles using gin(specializations);
