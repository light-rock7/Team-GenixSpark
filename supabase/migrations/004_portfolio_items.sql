create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creator_profiles(user_id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  description text,
  media_url text not null,
  thumbnail_url text,
  media_type text not null default 'image'
    check (media_type in ('image', 'video', 'link')),
  category text,
  ai_tools text[] not null default '{}',
  skills text[] not null default '{}',
  prompt_summary text,
  workflow_summary text,
  commercial_rights text,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.portfolio_items enable row level security;

drop policy if exists "Published portfolio items are publicly readable" on public.portfolio_items;
create policy "Published portfolio items are publicly readable"
on public.portfolio_items
for select
to anon, authenticated
using (is_published = true or auth.uid() = creator_id);

drop policy if exists "Creators can create own portfolio items" on public.portfolio_items;
create policy "Creators can create own portfolio items"
on public.portfolio_items
for insert
to authenticated
with check (
  auth.uid() = creator_id
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'creator'
  )
);

drop policy if exists "Creators can update own portfolio items" on public.portfolio_items;
create policy "Creators can update own portfolio items"
on public.portfolio_items
for update
to authenticated
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

drop policy if exists "Creators can delete own portfolio items" on public.portfolio_items;
create policy "Creators can delete own portfolio items"
on public.portfolio_items
for delete
to authenticated
using (auth.uid() = creator_id);

create index if not exists idx_portfolio_creator_created
  on public.portfolio_items(creator_id, created_at desc);
create index if not exists idx_portfolio_tools
  on public.portfolio_items using gin(ai_tools);
create index if not exists idx_portfolio_skills
  on public.portfolio_items using gin(skills);
