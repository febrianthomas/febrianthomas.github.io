alter table public.posts
  drop constraint posts_body_format_check,
  add constraint posts_body_format_check check (body_format in ('plain', 'markdown', 'tiptap'));
