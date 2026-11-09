-- Separate table for portfolio projects, matching public.posts schema and RLS.
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users(id),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null check (char_length(btrim(description)) between 1 and 240),
  body text not null check (char_length(btrim(body)) between 1 and 20000),
  body_format text not null default 'plain' check (body_format in ('plain', 'markdown', 'tiptap')),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  image_path text check (image_path is null or image_path ~ '^[0-9a-f-]{36}\.(png|jpg|webp|gif)$'),
  image_alt text check (image_alt is null or char_length(image_alt) <= 300),
  image_caption text check (image_caption is null or char_length(image_caption) <= 300),
  tags text[] not null default '{}',
  featured boolean not null default false,
  inline_image_paths text[] not null default '{}',
  constraint projects_tags_limit check (cardinality(tags) <= 10 and char_length(array_to_string(tags, ',')) <= 400),
  constraint projects_inline_images_limit check (cardinality(inline_image_paths) <= 20)
);

alter table public.projects enable row level security;
revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;
grant insert (title, description, body, body_format, image_path, image_alt, image_caption, tags, featured, inline_image_paths) on public.projects to authenticated;
grant update (title, description, body, body_format, image_path, image_alt, image_caption, tags, featured, inline_image_paths) on public.projects to authenticated;
grant delete on public.projects to authenticated;

create policy "Anyone can read projects" on public.projects
  for select to anon, authenticated using (true);

create policy "Only the site owner can publish projects" on public.projects
  for insert to authenticated
  with check (
    (select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid
    and author_id = (select auth.uid())
  );

create policy "Only the site owner can edit projects" on public.projects
  for update to authenticated
  using ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid)
  with check ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid);

create policy "Only the site owner can delete projects" on public.projects
  for delete to authenticated
  using ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid);

create trigger prepare_project_features before update on public.projects
  for each row execute function public.prepare_post_features();

create policy "Protect project images from deletion" on storage.objects
  as restrictive
  for delete to authenticated
  using (
    bucket_id <> 'post-images'
    or not exists (select 1 from public.projects where image_path = storage.objects.name or storage.objects.name = any(inline_image_paths))
  );
