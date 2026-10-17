-- Correctif. Postgres accorde EXECUTE au pseudo-rôle PUBLIC à la création
-- d'une fonction, et anon/authenticated en héritent : révoquer sur ces deux
-- rôles ne retire rien tant que le grant à PUBLIC subsiste.
revoke execute on all functions in schema public from public;
alter default privileges in schema public revoke execute on functions from public;

-- Helpers appelés depuis les politiques RLS : évaluées avec les droits de
-- l'appelant, elles échoueraient sans ce grant.
grant execute on function public.is_admin() to authenticated;
grant execute on function public.my_dossier_id() to authenticated;
grant execute on function public.my_dossier_status() to authenticated;

-- Parcours du candidat.
grant execute on function public.ensure_dossier() to authenticated;
grant execute on function public.submit_dossier(text, numeric, smallint, text) to authenticated;
grant execute on function public.accept_eligibility(boolean, boolean, boolean, boolean) to authenticated;
grant execute on function public.get_phase_questions(smallint) to authenticated;
grant execute on function public.submit_phase_answers(smallint, smallint[]) to authenticated;
grant execute on function public.submit_funding(text, text) to authenticated;

-- Instruction : le contrôle du rôle est fait dans le corps des fonctions.
grant execute on function public.approve_dossier(uuid) to authenticated;
grant execute on function public.reject_dossier(uuid, text) to authenticated;
grant execute on function public.validate_funding(uuid) to authenticated;
