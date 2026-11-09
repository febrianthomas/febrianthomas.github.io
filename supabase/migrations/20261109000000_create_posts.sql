-- Posts are public; only the site owner's confirmed account can publish.
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users(id),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null check (char_length(btrim(description)) between 1 and 240),
  body text not null check (char_length(btrim(body)) between 1 and 20000),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;
revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert (title, description, body) on public.posts to authenticated;

create policy "Anyone can read posts" on public.posts
  for select to anon, authenticated using (true);

create policy "Only the site owner can publish posts" on public.posts
  for insert to authenticated
  with check (
    (select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid
    and author_id = (select auth.uid())
  );
