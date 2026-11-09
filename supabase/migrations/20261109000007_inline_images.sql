alter table public.posts
  add column inline_image_paths text[] not null default '{}',
  add constraint posts_inline_images_limit check (cardinality(inline_image_paths) <= 20);

grant insert (inline_image_paths) on public.posts to authenticated;
grant update (inline_image_paths) on public.posts to authenticated;

drop policy "Site owner can remove unused post images" on storage.objects;
create policy "Site owner can remove unused post images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'post-images'
    and (select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid
    and not exists (select 1 from public.posts where image_path = storage.objects.name or storage.objects.name = any(inline_image_paths))
  );
