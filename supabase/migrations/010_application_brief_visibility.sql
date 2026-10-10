-- Keep a brief readable to a creator after they have applied, even when the brand
-- later closes or awards it. This lets creators track application outcomes without
-- making all non-open briefs public.

drop policy if exists "Creators can read briefs they applied to" on public.creative_briefs;
create policy "Creators can read briefs they applied to"
on public.creative_briefs
for select
to authenticated
using (
  exists (
    select 1
    from public.applications a
    where a.brief_id = creative_briefs.id
      and a.creator_id = auth.uid()
  )
);
