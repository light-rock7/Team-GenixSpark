create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.creative_briefs(id) on delete cascade,
  creator_id uuid not null references public.creator_profiles(user_id) on delete cascade,
  message text,
  proposed_price numeric(12,2) check (proposed_price is null or proposed_price >= 0),
  currency text not null default 'INR',
  expected_delivery_days integer check (
    expected_delivery_days is null or expected_delivery_days > 0
  ),
  status text not null default 'pending'
    check (status in ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (brief_id, creator_id)
);

alter table public.applications enable row level security;

drop policy if exists "Creators can view own applications" on public.applications;
create policy "Creators can view own applications"
on public.applications
for select
to authenticated
using (auth.uid() = creator_id);

drop policy if exists "Brands can view applications to own briefs" on public.applications;
create policy "Brands can view applications to own briefs"
on public.applications
for select
to authenticated
using (
  exists (
    select 1
    from public.creative_briefs b
    where b.id = brief_id and b.brand_id = auth.uid()
  )
);

drop policy if exists "Creators can apply to open briefs" on public.applications;
create policy "Creators can apply to open briefs"
on public.applications
for insert
to authenticated
with check (
  auth.uid() = creator_id
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'creator'
  )
  and exists (
    select 1 from public.creative_briefs b
    where b.id = brief_id and b.status = 'open'
  )
);

drop policy if exists "Brands can update applications to own briefs" on public.applications;
create policy "Brands can update applications to own briefs"
on public.applications
for update
to authenticated
using (
  exists (
    select 1
    from public.creative_briefs b
    where b.id = brief_id and b.brand_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.creative_briefs b
    where b.id = brief_id and b.brand_id = auth.uid()
  )
);

create index if not exists idx_applications_brief_created
  on public.applications(brief_id, created_at desc);
create index if not exists idx_applications_creator_created
  on public.applications(creator_id, created_at desc);
