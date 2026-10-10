create table if not exists public.creative_briefs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand_profiles(user_id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 140),
  description text not null,
  category text,
  required_tools text[] not null default '{}',
  required_skills text[] not null default '{}',
  deliverables text,
  aspect_ratio text,
  usage_rights text,
  budget_min numeric(12,2) check (budget_min is null or budget_min >= 0),
  budget_max numeric(12,2) check (budget_max is null or budget_max >= 0),
  currency text not null default 'INR',
  deadline date,
  reference_notes text,
  status text not null default 'draft'
    check (status in ('draft', 'open', 'closed', 'awarded')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint budget_range_valid
    check (budget_min is null or budget_max is null or budget_max >= budget_min)
);

alter table public.creative_briefs enable row level security;

drop policy if exists "Open briefs are publicly readable" on public.creative_briefs;
create policy "Open briefs are publicly readable"
on public.creative_briefs
for select
to anon, authenticated
using (status = 'open' or auth.uid() = brand_id);

drop policy if exists "Brands can create own briefs" on public.creative_briefs;
create policy "Brands can create own briefs"
on public.creative_briefs
for insert
to authenticated
with check (
  auth.uid() = brand_id
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'brand'
  )
);

drop policy if exists "Brands can update own briefs" on public.creative_briefs;
create policy "Brands can update own briefs"
on public.creative_briefs
for update
to authenticated
using (auth.uid() = brand_id)
with check (auth.uid() = brand_id);

drop policy if exists "Brands can delete own briefs" on public.creative_briefs;
create policy "Brands can delete own briefs"
on public.creative_briefs
for delete
to authenticated
using (auth.uid() = brand_id);

create index if not exists idx_briefs_status_created
  on public.creative_briefs(status, created_at desc);
create index if not exists idx_briefs_required_tools
  on public.creative_briefs using gin(required_tools);
create index if not exists idx_briefs_required_skills
  on public.creative_briefs using gin(required_skills);
