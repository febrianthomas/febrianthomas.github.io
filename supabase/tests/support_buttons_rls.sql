-- Verify support settings permissions without retaining changes.
begin;

set local role anon;
do $$
begin
  if (select count(*) from public.support_buttons) <> 4 then
    raise exception 'Public cannot read support settings';
  end if;
  begin
    update public.support_buttons set enabled = false where id = 'streamlabs';
    raise exception 'Anonymous users can update support settings';
  exception when insufficient_privilege then null;
  end;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
do $$
declare changed integer;
begin
  update public.support_buttons set enabled = false where id = 'streamlabs';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Other users can update support settings'; end if;
end $$;

select set_config('request.jwt.claim.sub', '1007e0fb-6f2f-473f-8305-067666bc643f', true);
do $$
declare changed integer;
begin
  update public.support_buttons set enabled = not enabled where id = 'streamlabs';
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'Owner cannot update support settings'; end if;
end $$;
rollback;
