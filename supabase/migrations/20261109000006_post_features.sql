alter table public.posts
  add column tags text[] not null default '{}',
  add column featured boolean not null default false,
  add column image_caption text,
  add column updated_at timestamptz;

alter table public.posts
  add constraint posts_tags_limit check (cardinality(tags) <= 10 and char_length(array_to_string(tags, ',')) <= 400),
  add constraint posts_image_caption_limit check (image_caption is null or char_length(image_caption) <= 300);

create function public.prepare_post_features() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new is distinct from old then
    new.updated_at := now();
  end if;
  return new;
end $$;

create trigger prepare_post_features before update on public.posts
  for each row execute function public.prepare_post_features();

grant insert (tags, featured, image_caption) on public.posts to authenticated;
grant update (tags, featured, image_caption) on public.posts to authenticated;
