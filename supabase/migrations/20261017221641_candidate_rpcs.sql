create sequence public.dossier_reference_seq start 1000;

-- Délai imposé entre deux sessions d'évaluation.
create function public.phase_gap()
returns interval
language sql
immutable
set search_path = ''
as $$ select interval '48 hours' $$;

-- Une session est ouverte si l'évaluation vient d'être autorisée, ou si le
-- délai de 48 h entre deux phases est écoulé. Aucun statut à basculer : la
-- date fait foi, donc un client ne peut pas se déverrouiller lui-même.
create function public.evaluation_is_open(p_status public.dossier_status, p_unlock_at timestamptz)
returns boolean
language sql
stable
set search_path = ''
as $$
  select p_status = 'approved'
      or (p_status = 'awaiting_next_phase' and p_unlock_at is not null and now() >= p_unlock_at);
$$;

-- Crée le brouillon au premier accès, ou renvoie le dossier existant.
create function public.ensure_dossier()
returns public.dossiers
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentification requise' using errcode = '42501';
  end if;

  select * into v_dossier from public.dossiers where owner_id = (select auth.uid());
  if found then
    return v_dossier;
  end if;

  insert into public.dossiers (owner_id, reference)
  values (
    (select auth.uid()),
    'INF-' || to_char(now(), 'YYYY') || '-' || nextval('public.dossier_reference_seq')
  )
  returning * into v_dossier;

  return v_dossier;
end;
$$;

create function public.submit_dossier(
  p_title text,
  p_amount numeric,
  p_duration_months smallint,
  p_summary text
)
returns public.dossiers
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
  v_documents int;
begin
  select * into v_dossier from public.dossiers where owner_id = (select auth.uid()) for update;
  if not found then
    raise exception 'Aucun dossier pour ce compte' using errcode = 'P0002';
  end if;

  if v_dossier.status not in ('draft', 'rejected') then
    raise exception 'Le dossier a déjà été déposé' using errcode = 'P0001';
  end if;

  if coalesce(length(btrim(p_title)), 0) < 4 then
    raise exception 'Intitulé trop court' using errcode = '22023';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Montant invalide' using errcode = '22023';
  end if;
  if coalesce(length(btrim(p_summary)), 0) < 120 then
    raise exception 'Résumé exécutif trop court' using errcode = '22023';
  end if;

  select count(*) into v_documents
  from public.documents
  where dossier_id = v_dossier.id and kind = 'project';

  if v_documents = 0 then
    raise exception 'Au moins une pièce jointe est requise' using errcode = '22023';
  end if;

  update public.dossiers
  set title = btrim(p_title),
      amount = p_amount,
      duration_months = p_duration_months,
      summary = btrim(p_summary),
      status = 'submitted',
      review_note = null,
      submitted_at = now()
  where id = v_dossier.id
  returning * into v_dossier;

  return v_dossier;
end;
$$;

-- Les trois conditions bloquantes sont vérifiées ici : un client qui
-- contournerait l'écran ne peut pas enregistrer un refus.
create function public.accept_eligibility(
  p_is_adult boolean,
  p_revenue_share boolean,
  p_determined boolean,
  p_guarantee_ready boolean
)
returns public.eligibility
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
  v_row public.eligibility;
begin
  select * into v_dossier from public.dossiers where owner_id = (select auth.uid());
  if not found then
    raise exception 'Aucun dossier pour ce compte' using errcode = 'P0002';
  end if;

  if v_dossier.status in ('draft', 'submitted', 'rejected') then
    raise exception 'Le dossier doit être approuvé avant les conditions' using errcode = 'P0001';
  end if;

  if not (p_is_adult and p_revenue_share and p_guarantee_ready) then
    raise exception 'Une condition obligatoire a été refusée' using errcode = 'P0001';
  end if;

  insert into public.eligibility (dossier_id, is_adult, revenue_share, determined, guarantee_ready)
  values (v_dossier.id, p_is_adult, p_revenue_share, p_determined, p_guarantee_ready)
  on conflict (dossier_id) do update
    set is_adult = excluded.is_adult,
        revenue_share = excluded.revenue_share,
        determined = excluded.determined,
        guarantee_ready = excluded.guarantee_ready,
        accepted_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

-- Les énoncés partent sans answer_index, et seulement pour la phase ouverte.
create function public.get_phase_questions(p_phase smallint)
returns table (
  question_id text,
  ordinal smallint,
  statement text,
  options text[],
  seconds smallint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
begin
  select * into v_dossier from public.dossiers where owner_id = (select auth.uid());
  if not found then
    raise exception 'Aucun dossier pour ce compte' using errcode = 'P0002';
  end if;

  if not public.evaluation_is_open(v_dossier.status, v_dossier.unlock_at) then
    raise exception 'L''évaluation n''est pas ouverte' using errcode = '42501';
  end if;

  if v_dossier.current_phase is distinct from p_phase then
    raise exception 'Cette phase n''est pas la phase en cours' using errcode = '42501';
  end if;

  if not exists (select 1 from public.eligibility e where e.dossier_id = v_dossier.id) then
    raise exception 'Les conditions d''accès n''ont pas été validées' using errcode = '42501';
  end if;

  return query
    select q.id, q.ordinal, q.statement, q.options, q.seconds
    from public.quiz_questions q
    where q.phase = p_phase
    order by q.ordinal;
end;
$$;

-- La correction se fait ici. Le client envoie des réponses, jamais un score.
create function public.submit_phase_answers(p_phase smallint, p_answers smallint[])
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
  v_total int;
  v_score int;
  v_passed boolean;
  v_unlock_at timestamptz;
begin
  select * into v_dossier from public.dossiers where owner_id = (select auth.uid()) for update;
  if not found then
    raise exception 'Aucun dossier pour ce compte' using errcode = 'P0002';
  end if;

  if not public.evaluation_is_open(v_dossier.status, v_dossier.unlock_at) then
    raise exception 'L''évaluation n''est pas ouverte' using errcode = '42501';
  end if;

  if v_dossier.current_phase is distinct from p_phase then
    raise exception 'Cette phase n''est pas la phase en cours' using errcode = '42501';
  end if;

  if exists (select 1 from public.phase_results r where r.dossier_id = v_dossier.id and r.phase = p_phase) then
    raise exception 'Cette phase est déjà validée' using errcode = 'P0001';
  end if;

  select count(*) into v_total from public.quiz_questions q where q.phase = p_phase;

  if coalesce(array_length(p_answers, 1), 0) <> v_total then
    raise exception 'Nombre de réponses inattendu' using errcode = '22023';
  end if;

  select count(*) into v_score
  from public.quiz_questions q
  where q.phase = p_phase
    and p_answers[q.ordinal] = q.answer_index;

  v_passed := (v_score::numeric / v_total) * 100 >= public.pass_threshold();

  if not v_passed then
    return jsonb_build_object(
      'passed', false, 'score', v_score, 'total', v_total, 'phase', p_phase
    );
  end if;

  insert into public.phase_results (dossier_id, phase, score, total)
  values (v_dossier.id, p_phase, v_score, v_total);

  if p_phase >= 3 then
    update public.dossiers
    set status = 'evaluated', unlock_at = null
    where id = v_dossier.id;
    v_unlock_at := null;
  else
    v_unlock_at := now() + public.phase_gap();
    update public.dossiers
    set status = 'awaiting_next_phase',
        current_phase = p_phase + 1,
        unlock_at = v_unlock_at
    where id = v_dossier.id;
  end if;

  return jsonb_build_object(
    'passed', true,
    'score', v_score,
    'total', v_total,
    'phase', p_phase,
    'unlock_at', v_unlock_at
  );
end;
$$;

create function public.submit_funding(p_iban text, p_bank_name text)
returns public.funding_proofs
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dossier public.dossiers;
  v_row public.funding_proofs;
  v_iban text := upper(regexp_replace(coalesce(p_iban, ''), '\s', '', 'g'));
begin
  select * into v_dossier from public.dossiers where owner_id = (select auth.uid()) for update;
  if not found then
    raise exception 'Aucun dossier pour ce compte' using errcode = 'P0002';
  end if;

  if v_dossier.status <> 'evaluated' then
    raise exception 'L''évaluation doit être terminée' using errcode = 'P0001';
  end if;

  if v_iban !~ '^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$' then
    raise exception 'IBAN invalide' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.documents d
    where d.dossier_id = v_dossier.id and d.kind = 'deposit_receipt'
  ) or not exists (
    select 1 from public.documents d
    where d.dossier_id = v_dossier.id and d.kind = 'account_proof'
  ) then
    raise exception 'Le reçu de dépôt et le justificatif de compte sont requis' using errcode = '22023';
  end if;

  insert into public.funding_proofs (dossier_id, iban, bank_name)
  values (v_dossier.id, v_iban, btrim(p_bank_name))
  on conflict (dossier_id) do update
    set iban = excluded.iban, bank_name = excluded.bank_name, submitted_at = now()
  returning * into v_row;

  update public.dossiers set status = 'proofs_submitted' where id = v_dossier.id;

  return v_row;
end;
$$;
