-- Public marketplace media buckets.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('portfolio', 'portfolio', true, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('brand-assets', 'brand-assets', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- AVATARS
drop policy if exists "Public can view avatars" on storage.objects;
create policy "Public can view avatars"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'avatars');

drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own avatar" on storage.objects;
create policy "Users can delete own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- PORTFOLIO
drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Creators can upload own portfolio media" on storage.objects;
create policy "Creators can upload own portfolio media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'creator'
  )
);

drop policy if exists "Creators can update own portfolio media" on storage.objects;
create policy "Creators can update own portfolio media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Creators can delete own portfolio media" on storage.objects;
create policy "Creators can delete own portfolio media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- BRAND ASSETS
drop policy if exists "Public can view brand assets" on storage.objects;
create policy "Public can view brand assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'brand-assets');

drop policy if exists "Brands can upload own brand assets" on storage.objects;
create policy "Brands can upload own brand assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'brand-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role = 'brand'
  )
);

drop policy if exists "Brands can update own brand assets" on storage.objects;
create policy "Brands can update own brand assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'brand-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'brand-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Brands can delete own brand assets" on storage.objects;
create policy "Brands can delete own brand assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'brand-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);
