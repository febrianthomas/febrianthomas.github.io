begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '1007e0fb-6f2f-473f-8305-067666bc643f', true);
insert into public.posts (title, description, body, inline_image_paths)
values ('temporary inline policy test', 'temporary', 'temporary', array['00000000-0000-0000-0000-000000000099.png']);
do $$ begin
  if not exists (select 1 from public.posts where title = 'temporary inline policy test' and '00000000-0000-0000-0000-000000000099.png' = any(inline_image_paths)) then raise exception 'Inline image was not linked'; end if;
end $$;
update public.posts set inline_image_paths = '{}' where title = 'temporary inline policy test';
do $$ begin
  if not exists (select 1 from public.posts where title = 'temporary inline policy test' and cardinality(inline_image_paths) = 0) then raise exception 'Inline image was not unlinked'; end if;
end $$;
rollback;
