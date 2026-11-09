-- Keep existing and older-client posts as plain text; new editors may publish Markdown.
alter table public.posts
  add column body_format text not null default 'plain'
  check (body_format in ('plain', 'markdown'));

grant insert (body_format) on public.posts to authenticated;
