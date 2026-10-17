-- Statut du dossier du candidat connecté, sans déclencher la RLS de dossiers.
create function public.my_dossier_status()
returns public.dossier_status
language sql
stable
security definer
set search_path = ''
as $$
  select d.status from public.dossiers d where d.owner_id = (select auth.uid());
$$;

-- Le candidat dépose ses pièces lui-même, mais seulement celles que l'étape
-- en cours autorise.
create policy "Dépôt de ses pièces, selon l''étape du dossier"
  on public.documents for insert
  to authenticated
  with check (
    dossier_id = public.my_dossier_id()
    and case kind
      when 'project' then public.my_dossier_status() in ('draft', 'rejected')
      when 'identity' then public.my_dossier_status() in ('approved', 'awaiting_next_phase')
      else public.my_dossier_status() = 'evaluated'
    end
  );

create policy "Retrait de ses pièces tant que l''étape est ouverte"
  on public.documents for delete
  to authenticated
  using (
    dossier_id = public.my_dossier_id()
    and case kind
      when 'project' then public.my_dossier_status() in ('draft', 'rejected')
      when 'identity' then public.my_dossier_status() in ('approved', 'awaiting_next_phase')
      else public.my_dossier_status() = 'evaluated'
    end
  );

-- Instruction du dossier — réservée aux administrateurs.
create function public.approve_dossier(p_dossier_id uuid)
returns public.dossiers
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs' using errcode = '42501';
  end if;

  select * into v_dossier from public.dossiers where id = p_dossier_id for update;
  if not found then
    raise exception 'Dossier introuvable' using errcode = 'P0002';
  end if;

  if v_dossier.status <> 'submitted' then
    raise exception 'Seul un dossier déposé peut être approuvé' using errcode = 'P0001';
  end if;

  update public.dossiers
  set status = 'approved', current_phase = 1, unlock_at = null, review_note = null
  where id = p_dossier_id
  returning * into v_dossier;

  return v_dossier;
end;
$$;

create function public.reject_dossier(p_dossier_id uuid, p_note text)
returns public.dossiers
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs' using errcode = '42501';
  end if;

  if coalesce(length(btrim(p_note)), 0) < 10 then
    raise exception 'Un motif d''au moins 10 caractères est requis' using errcode = '22023';
  end if;

  select * into v_dossier from public.dossiers where id = p_dossier_id for update;
  if not found then
    raise exception 'Dossier introuvable' using errcode = 'P0002';
  end if;

  if v_dossier.status <> 'submitted' then
    raise exception 'Seul un dossier déposé peut être rejeté' using errcode = 'P0001';
  end if;

  update public.dossiers
  set status = 'rejected', review_note = btrim(p_note)
  where id = p_dossier_id
  returning * into v_dossier;

  return v_dossier;
end;
$$;

create function public.validate_funding(p_dossier_id uuid)
returns public.dossiers
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs' using errcode = '42501';
  end if;

  select * into v_dossier from public.dossiers where id = p_dossier_id for update;
  if not found then
    raise exception 'Dossier introuvable' using errcode = 'P0002';
  end if;

  if v_dossier.status <> 'proofs_submitted' then
    raise exception 'Les preuves de garantie n''ont pas été déposées' using errcode = 'P0001';
  end if;

  update public.dossiers set status = 'financed' where id = p_dossier_id
  returning * into v_dossier;

  return v_dossier;
end;
$$;
