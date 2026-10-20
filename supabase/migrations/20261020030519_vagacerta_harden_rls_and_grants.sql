-- VagaCerta hardening — consolidate RLS policies and reduce Data API privileges.
-- Anonymous mode is browser-only; cloud tables require Supabase Auth.

drop policy if exists vagacerta_documents_select_own on public.vagacerta_documents;
drop policy if exists vagacerta_documents_insert_own on public.vagacerta_documents;
drop policy if exists vagacerta_documents_update_own on public.vagacerta_documents;
drop policy if exists vagacerta_documents_delete_own on public.vagacerta_documents;

revoke all privileges on table public.vagacerta_applications from anon;
revoke all privileges on table public.vagacerta_documents from anon;

revoke all privileges on table public.vagacerta_applications from authenticated;
revoke all privileges on table public.vagacerta_documents from authenticated;

grant select, insert, update, delete
  on table public.vagacerta_applications
  to authenticated;

grant select, insert, update, delete
  on table public.vagacerta_documents
  to authenticated;
