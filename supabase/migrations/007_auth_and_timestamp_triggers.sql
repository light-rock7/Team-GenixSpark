-- Shared updated_at trigger.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_creator_profiles_updated_at on public.creator_profiles;
create trigger set_creator_profiles_updated_at
before update on public.creator_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_brand_profiles_updated_at on public.brand_profiles;
create trigger set_brand_profiles_updated_at
before update on public.brand_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_portfolio_items_updated_at on public.portfolio_items;
create trigger set_portfolio_items_updated_at
before update on public.portfolio_items
for each row execute function public.set_updated_at();

drop trigger if exists set_creative_briefs_updated_at on public.creative_briefs;
create trigger set_creative_briefs_updated_at
before update on public.creative_briefs
for each row execute function public.set_updated_at();

drop trigger if exists set_applications_updated_at on public.applications;
create trigger set_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

-- Prevent a signed-in user from switching their own account role.
create or replace function public.prevent_self_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role <> old.role and auth.uid() = old.id then
    raise exception 'Account role cannot be changed by the signed-in user.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_user_profile_role_change on public.user_profiles;
create trigger prevent_user_profile_role_change
before update of role on public.user_profiles
for each row execute function public.prevent_self_role_change();

-- Existing frontend signUp metadata contract: display_name + role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  requested_name text;
begin
  requested_role := case
    when new.raw_user_meta_data ->> 'role' in ('creator', 'brand')
      then new.raw_user_meta_data ->> 'role'
    else 'creator'
  end;

  requested_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '');
  if requested_name is null then
    requested_name := split_part(coalesce(new.email, 'user'), '@', 1);
  end if;

  insert into public.user_profiles (id, role, display_name)
  values (new.id, requested_role, requested_name)
  on conflict (id) do update
    set role = excluded.role,
        display_name = excluded.display_name;

  if requested_role = 'creator' then
    insert into public.creator_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  else
    insert into public.brand_profiles (user_id, company_name)
    values (new.id, requested_name)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Backfill profiles for users created before this migration.
insert into public.user_profiles (id, role, display_name)
select
  u.id,
  case
    when u.raw_user_meta_data ->> 'role' in ('creator', 'brand')
      then u.raw_user_meta_data ->> 'role'
    else 'creator'
  end,
  coalesce(
    nullif(trim(u.raw_user_meta_data ->> 'display_name'), ''),
    split_part(coalesce(u.email, 'user'), '@', 1)
  )
from auth.users u
on conflict (id) do nothing;

insert into public.creator_profiles (user_id)
select p.id
from public.user_profiles p
where p.role = 'creator'
on conflict (user_id) do nothing;

insert into public.brand_profiles (user_id, company_name)
select p.id, p.display_name
from public.user_profiles p
where p.role = 'brand'
on conflict (user_id) do nothing;
