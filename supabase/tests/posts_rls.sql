-- Run with a database role that can switch to Supabase's anon/authenticated roles.
-- Test rows are rolled back at the end; roll back the transaction if an assertion fails.
begin;

set local role authenticated;
select set_config('request.jwt.claim.sub', '1007e0fb-6f2f-473f-8305-067666bc643f', true);
insert into public.posts (title, description, body, body_format, image_path, image_alt)
values ('temporary policy check', 'temporary policy check', '{"type":"doc"}', 'tiptap', '00000000-0000-0000-0000-000000000002.png', 'Test image');

insert into public.posts (title, description, body)
values ('temporary plain check', 'temporary plain check', 'temporary plain check');

do $$
begin
  if not exists (select 1 from public.posts where title = 'temporary plain check' and body_format = 'plain') then
    raise exception 'Existing clients must default to plain text';
  end if;
  begin
    insert into public.posts (title, description, body, body_format)
    values ('invalid format check', 'invalid format check', 'invalid format check', 'invalid');
    raise exception 'Invalid body format accepted';
  exception when check_violation then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
do $$
begin
  begin
    insert into public.posts (title, description, body)
    values ('forbidden policy check', 'forbidden policy check', 'forbidden policy check');
    raise exception 'Other authenticated users can publish';
  exception when insufficient_privilege then null;
  end;
  update public.posts set description = 'forbidden update' where title = 'temporary policy check';
  if exists (select 1 from public.posts where title = 'temporary policy check' and description = 'forbidden update') then
    raise exception 'Other authenticated users can edit posts';
  end if;
  delete from public.posts where title = 'temporary policy check';
  if not exists (select 1 from public.posts where title = 'temporary policy check') then
    raise exception 'Other authenticated users can delete posts';
  end if;
end $$;

set local role anon;
do $$
begin
  if not exists (select 1 from public.posts where title = 'temporary policy check' and body_format = 'tiptap') then
    raise exception 'Public read failed';
  end if;
  begin
    insert into public.posts (title, description, body)
    values ('anonymous policy check', 'anonymous policy check', 'anonymous policy check');
    raise exception 'Anonymous users can publish';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.posts set description = 'anonymous update' where title = 'temporary policy check';
    raise exception 'Anonymous users can edit posts';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.posts where title = 'temporary policy check';
    raise exception 'Anonymous users can delete posts';
  exception when insufficient_privilege then null;
  end;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '1007e0fb-6f2f-473f-8305-067666bc643f', true);
update public.posts set description = 'owner update' where title = 'temporary policy check';
do $$
begin
  if not exists (select 1 from public.posts where title = 'temporary policy check' and description = 'owner update') then
    raise exception 'Owner could not edit post';
  end if;
end $$;
delete from public.posts where title = 'temporary policy check';
do $$
begin
  if exists (select 1 from public.posts where title = 'temporary policy check') then
    raise exception 'Owner could not delete post';
  end if;
end $$;

rollback;
