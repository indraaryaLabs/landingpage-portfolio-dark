-- Structured content for the RECON portfolio. Existing columns and rows are preserved.
alter table public.site_settings
  add column if not exists portfolio_content jsonb not null default '{}'::jsonb;

-- Only the confirmed portfolio owner may publish content or replace media.
drop policy if exists "Auth delete" on public.site_settings;
drop policy if exists "Auth insert" on public.site_settings;
drop policy if exists "Auth update" on public.site_settings;
drop policy if exists "Auth write site_settings" on public.site_settings;
create policy "Portfolio owner writes site settings" on public.site_settings
  for all to authenticated
  using ((select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid)
  with check ((select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid);

drop policy if exists "Auth delete" on public.projects;
drop policy if exists "Auth insert" on public.projects;
drop policy if exists "Auth update" on public.projects;
drop policy if exists "Auth write projects" on public.projects;
create policy "Portfolio owner writes projects" on public.projects
  for all to authenticated
  using ((select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid)
  with check ((select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid);

drop policy if exists "Auth upload portfolio-media" on storage.objects;
drop policy if exists "Auth update portfolio-media" on storage.objects;
drop policy if exists "Auth delete portfolio-media" on storage.objects;
create policy "Portfolio owner uploads media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid);
create policy "Portfolio owner updates media" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and (select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid)
  with check (bucket_id = 'portfolio-media' and (select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid);
create policy "Portfolio owner deletes media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select auth.uid()) = 'f7366b74-7f46-42b9-a447-1f38b218e7ae'::uuid);
