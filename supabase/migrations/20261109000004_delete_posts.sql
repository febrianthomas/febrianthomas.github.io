grant delete on public.posts to authenticated;

create policy "Only the site owner can delete posts" on public.posts
  for delete to authenticated
  using ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid);
