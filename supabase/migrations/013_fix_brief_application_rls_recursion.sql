-- Prevent circular RLS evaluation between creative_briefs and applications.
--
-- creative_briefs needs to remain readable by a creator after they have applied,
-- including after the brand closes or awards the brief. A direct policy subquery
-- against applications can recurse because applications policies also inspect
-- creative_briefs. Use a narrowly-scoped SECURITY DEFINER helper instead.

create or replace function public.current_user_applied_to_brief(p_brief_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.applications a
    where a.brief_id = p_brief_id
      and a.creator_id = auth.uid()
  );
$$;

revoke all on function public.current_user_applied_to_brief(uuid) from public;
grant execute on function public.current_user_applied_to_brief(uuid) to authenticated;

drop policy if exists "Creators can read briefs they applied to"
on public.creative_briefs;

create policy "Creators can read briefs they applied to"
on public.creative_briefs
for select
to authenticated
using (public.current_user_applied_to_brief(id));

-- Remove the temporary two-argument helper if the production hotfix created it.
drop function if exists public.has_creator_applied_to_brief(uuid, uuid);
