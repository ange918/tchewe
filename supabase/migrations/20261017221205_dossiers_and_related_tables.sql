-- Un dossier par candidat : l'interface n'en gère qu'un.
create table public.dossiers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles (id) on delete cascade,
  reference text not null unique,
  status public.dossier_status not null default 'draft',
  title text,
  amount numeric(12, 2) check (amount is null or amount > 0),
  duration_months smallint check (duration_months is null or duration_months between 1 and 60),
  summary text,
  current_phase smallint not null default 1 check (current_phase between 1 and 3),
  unlock_at timestamptz,
  review_note text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.dossiers is
  'Écrit uniquement par les fonctions RPC : aucune politique INSERT/UPDATE n''est accordée au client, pour qu''un candidat ne puisse pas se faire passer en « approved » ou « financed ».';

create table public.eligibility (
  dossier_id uuid primary key references public.dossiers (id) on delete cascade,
  is_adult boolean not null,
  revenue_share boolean not null,
  determined boolean not null,
  guarantee_ready boolean not null,
  accepted_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers (id) on delete cascade,
  kind public.document_kind not null,
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  uploaded_at timestamptz not null default now()
);

create index documents_dossier_kind_idx on public.documents (dossier_id, kind);

create table public.phase_results (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers (id) on delete cascade,
  phase smallint not null check (phase between 1 and 3),
  score smallint not null check (score >= 0),
  total smallint not null check (total > 0),
  completed_at timestamptz not null default now(),
  unique (dossier_id, phase)
);

create table public.funding_proofs (
  dossier_id uuid primary key references public.dossiers (id) on delete cascade,
  iban text not null,
  bank_name text not null,
  submitted_at timestamptz not null default now()
);

alter table public.dossiers enable row level security;
alter table public.eligibility enable row level security;
alter table public.documents enable row level security;
alter table public.phase_results enable row level security;
alter table public.funding_proofs enable row level security;

-- Le dossier du candidat connecté, sans déclencher la RLS de dossiers.
create function public.my_dossier_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select d.id from public.dossiers d where d.owner_id = (select auth.uid());
$$;

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger dossiers_touch_updated_at
  before update on public.dossiers
  for each row
  execute function public.touch_updated_at();

-- Lecture : son propre dossier, ou tout pour un admin.
create policy "Lecture de son dossier ou de tous pour un admin"
  on public.dossiers for select
  to authenticated
  using (owner_id = (select auth.uid()) or public.is_admin());

create policy "Lecture de ses conditions ou de toutes pour un admin"
  on public.eligibility for select
  to authenticated
  using (dossier_id = public.my_dossier_id() or public.is_admin());

create policy "Lecture de ses documents ou de tous pour un admin"
  on public.documents for select
  to authenticated
  using (dossier_id = public.my_dossier_id() or public.is_admin());

create policy "Lecture de ses résultats ou de tous pour un admin"
  on public.phase_results for select
  to authenticated
  using (dossier_id = public.my_dossier_id() or public.is_admin());

create policy "Lecture de ses preuves ou de toutes pour un admin"
  on public.funding_proofs for select
  to authenticated
  using (dossier_id = public.my_dossier_id() or public.is_admin());
