-- VagaCerta product gate — compatibility, follow-up, interview prep and resume versions
-- Safe to apply on the shared pizzaria-db project.

alter table if exists public.vagacerta_applications
  add column if not exists requirements jsonb not null default '[]'::jsonb,
  add column if not exists follow_up_at date,
  add column if not exists follow_up_status text not null default 'pending',
  add column if not exists interview_prep jsonb not null default '{"questions":[],"review":[],"notes":""}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'vagacerta_applications_follow_up_status_check'
  ) then
    alter table public.vagacerta_applications
      add constraint vagacerta_applications_follow_up_status_check
      check (follow_up_status in ('pending','completed','postponed'));
  end if;
end $$;

create table if not exists public.vagacerta_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references public.vagacerta_applications(id) on delete cascade,
  kind text not null default 'resume',
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vagacerta_documents
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists application_id uuid references public.vagacerta_applications(id) on delete cascade,
  add column if not exists kind text not null default 'resume',
  add column if not exists title text not null default '',
  add column if not exists content text not null default '',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists vagacerta_applications_follow_up_idx
  on public.vagacerta_applications (user_id, follow_up_status, follow_up_at);

create index if not exists vagacerta_documents_application_idx
  on public.vagacerta_documents (user_id, application_id, created_at desc);

alter table public.vagacerta_documents enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vagacerta_documents' and policyname='vagacerta_documents_select_own'
  ) then
    create policy vagacerta_documents_select_own on public.vagacerta_documents
      for select to authenticated using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vagacerta_documents' and policyname='vagacerta_documents_insert_own'
  ) then
    create policy vagacerta_documents_insert_own on public.vagacerta_documents
      for insert to authenticated with check (
        auth.uid() = user_id
        and exists (
          select 1 from public.vagacerta_applications a
          where a.id = application_id and a.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vagacerta_documents' and policyname='vagacerta_documents_update_own'
  ) then
    create policy vagacerta_documents_update_own on public.vagacerta_documents
      for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='vagacerta_documents' and policyname='vagacerta_documents_delete_own'
  ) then
    create policy vagacerta_documents_delete_own on public.vagacerta_documents
      for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

revoke all on table public.vagacerta_documents from anon;
grant select, insert, update, delete on table public.vagacerta_documents to authenticated;
