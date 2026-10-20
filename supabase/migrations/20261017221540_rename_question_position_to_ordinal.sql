-- « position » est un mot réservé : il ne peut pas nommer une colonne de sortie
-- dans une clause `returns table`.
alter table public.quiz_questions rename column position to ordinal;
