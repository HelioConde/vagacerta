-- VagaCerta: block cross-account document/application associations on ALL actions.
-- RESTRICTIVE composes with existing permissive owner policies (instead of
-- being bypassed by OR-combination of multiple permissive policies).
create policy vagacerta_documents_application_owner_guard
on public.vagacerta_documents
as restrictive
for all
to authenticated
using (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.vagacerta_applications as application
    where application.id = vagacerta_documents.application_id
      and application.user_id = (select auth.uid())
  )
)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.vagacerta_applications as application
    where application.id = vagacerta_documents.application_id
      and application.user_id = (select auth.uid())
  )
);
