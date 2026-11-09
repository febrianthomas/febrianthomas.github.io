begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '1007e0fb-6f2f-473f-8305-067666bc643f', true);
insert into public.posts (title, description, body, tags, featured, image_caption)
values ('temporary feature policy test', 'temporary', 'temporary', array['drawing'], true, 'caption');
do $$ begin
  if not exists (select 1 from public.posts where title = 'temporary feature policy test' and tags = array['drawing'] and featured and updated_at is null) then raise exception 'Post metadata insert failed'; end if;
end $$;
update public.posts set title = 'temporary feature policy test updated' where title = 'temporary feature policy test';
do $$ begin
  if not exists (select 1 from public.posts where title = 'temporary feature policy test updated' and updated_at is not null) then raise exception 'Update timestamp failed'; end if;
end $$;
rollback;
