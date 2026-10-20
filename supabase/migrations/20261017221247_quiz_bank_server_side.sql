create table public.quiz_phases (
  phase smallint primary key check (phase between 1 and 3),
  title text not null,
  theme text not null,
  day text not null
);

-- La colonne answer_index ne sort jamais vers le client : aucune politique RLS
-- n'est créée sur cette table, et la lecture passe par get_phase_questions().
create table public.quiz_questions (
  id text primary key,
  phase smallint not null references public.quiz_phases (phase),
  position smallint not null,
  statement text not null,
  options text[] not null check (array_length(options, 1) = 3),
  answer_index smallint not null check (answer_index between 0 and 2),
  seconds smallint not null check (seconds between 3 and 60),
  unique (phase, position)
);

alter table public.quiz_phases enable row level security;
alter table public.quiz_questions enable row level security;

create policy "Les intitulés de phase sont publics"
  on public.quiz_phases for select
  to authenticated
  using (true);

comment on table public.quiz_questions is
  'Aucune politique RLS : la table est inaccessible au client. Les énoncés sont servis sans la bonne réponse par public.get_phase_questions(), et la correction se fait dans public.submit_phase_answers().';

-- Seuil de réussite d'une phase, en pourcentage.
create function public.pass_threshold()
returns smallint
language sql
immutable
set search_path = ''
as $$ select 60::smallint $$;
