-- Existing text-only posts remain valid. Images are public, uploads are owner-only.
alter table public.posts
  add column image_path text check (image_path is null or image_path ~ '^[0-9a-f-]{36}\.(png|jpg|webp|gif)$'),
  add column image_alt text check (image_alt is null or char_length(image_alt) <= 300);

grant insert (image_path, image_alt) on public.posts to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

create policy "Site owner can upload post images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'post-images'
    and (select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid
    and name ~ '^[0-9a-f-]{36}\.(png|jpg|webp|gif)$'
  );

create policy "Site owner can find post images" on storage.objects
  for select to authenticated
  using (bucket_id = 'post-images' and (select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid);

-- Permit cleanup of failed uploads, but never delete an image attached to a post.
create policy "Site owner can remove unused post images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'post-images'
    and (select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid
    and not exists (select 1 from public.posts where image_path = storage.objects.name)
  );
