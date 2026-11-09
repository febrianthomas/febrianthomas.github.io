grant update (title, description, body, body_format, image_path, image_alt) on public.posts to authenticated;

create policy "Only the site owner can edit posts" on public.posts
  for update to authenticated
  using ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid)
  with check ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid);
