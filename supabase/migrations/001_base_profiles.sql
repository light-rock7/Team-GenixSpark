-- GenixSpark Stage 1
-- Base profile contract shared by the React auth layer and marketplace modules.

create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('creator', 'brand')),
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.user_profiles enable row level security;

drop policy if exists "Public profiles are readable" on public.user_profiles;
create policy "Public profiles are readable"
on public.user_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create index if not exists idx_user_profiles_role on public.user_profiles(role);
