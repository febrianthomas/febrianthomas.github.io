create table public.support_buttons (
  id text primary key check (id in ('streamlabs', 'saweria', 'kofi', 'trakteer')),
  enabled boolean not null default true
);

insert into public.support_buttons (id) values ('streamlabs'), ('saweria'), ('kofi'), ('trakteer');

alter table public.support_buttons enable row level security;
revoke all on public.support_buttons from anon, authenticated;
grant select on public.support_buttons to anon, authenticated;
grant update (enabled) on public.support_buttons to authenticated;

create policy "Anyone can read support buttons" on public.support_buttons
  for select to anon, authenticated using (true);

create policy "Only the site owner can update support buttons" on public.support_buttons
  for update to authenticated
  using ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid)
  with check ((select auth.uid()) = '1007e0fb-6f2f-473f-8305-067666bc643f'::uuid);
