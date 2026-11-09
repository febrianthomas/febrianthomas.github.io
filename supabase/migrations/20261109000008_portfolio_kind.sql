alter table public.posts
  add column kind text not null default 'post' check (kind in ('post', 'portfolio'));

-- kind is chosen at creation and is not editable afterwards.
grant insert (kind) on public.posts to authenticated;
