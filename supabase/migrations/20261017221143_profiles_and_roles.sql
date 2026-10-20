-- Rôles et statuts du parcours
create type public.user_role as enum ('candidate', 'admin');

create type public.dossier_status as enum (
  'draft',
  'submitted',
  'approved',
  'awaiting_next_phase',
  'evaluated',
  'proofs_submitted',
  'financed',
  'rejected'
);

create type public.document_kind as enum (
  'project',
  'identity',
  'deposit_receipt',
  'account_proof'
);

-- Un profil par compte Auth
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  birth_date date,
  role public.user_role not null default 'candidate',
  created_at timestamptz not null default now()
);

comment on column public.profiles.role is
  'Jamais renseigné par le client : le trigger d''inscription force « candidate ». Un admin se promeut depuis le tableau de bord Supabase.';

alter table public.profiles enable row level security;

-- Le profil est créé par le trigger, pas par le client : le rôle demandé dans
-- les métadonnées d'inscription est délibérément ignoré.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, birth_date)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'birth_date', '')::date
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- `security definer` : lire profiles depuis une politique de profiles
-- provoquerait une récursion RLS.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

-- Le rôle ne se modifie pas depuis le client.
create function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Le rôle ne peut pas être modifié depuis le client';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role_on_update
  before update on public.profiles
  for each row
  execute function public.protect_profile_role();

create policy "Un profil est lisible par son titulaire ou un admin"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or public.is_admin());

create policy "Un titulaire met à jour son propre profil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
