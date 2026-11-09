-- Run with a database role that can switch to Supabase's anon/authenticated roles.
-- Test rows are rolled back at the end; roll back the transaction if an assertion fails.
begin;

set local role authenticated;
select set_config('request.jwt.claim.sub', '1007e0fb-6f2f-473f-8305-067666bc643f', true);
insert into public.posts (title, description, body)
values ('temporary policy check', 'temporary policy check', 'temporary policy check');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
do $$
begin
  begin
    insert into public.posts (title, description, body)
    values ('forbidden policy check', 'forbidden policy check', 'forbidden policy check');
    raise exception 'Other authenticated users can publish';
  exception when insufficient_privilege then null;
  end;
end $$;

set local role anon;
do $$
begin
  if not exists (select 1 from public.posts where title = 'temporary policy check') then
    raise exception 'Public read failed';
  end if;
  begin
    insert into public.posts (title, description, body)
    values ('anonymous policy check', 'anonymous policy check', 'anonymous policy check');
    raise exception 'Anonymous users can publish';
  exception when insufficient_privilege then null;
  end;
end $$;

rollback;
