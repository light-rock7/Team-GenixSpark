-- Expose Stage 1/2 tables through Supabase PostgREST while keeping RLS enforcement active.

grant usage on schema public to anon, authenticated;

grant select on table public.user_profiles to anon, authenticated;
grant select on table public.creator_profiles to anon, authenticated;
grant select on table public.brand_profiles to anon, authenticated;
grant select on table public.portfolio_items to anon, authenticated;
grant select on table public.creative_briefs to anon, authenticated;

grant update on table public.user_profiles to authenticated;
grant update on table public.creator_profiles to authenticated;
grant update on table public.brand_profiles to authenticated;

grant insert, update, delete on table public.portfolio_items to authenticated;
grant insert, update, delete on table public.creative_briefs to authenticated;
grant select, insert, update, delete on table public.applications to authenticated;
