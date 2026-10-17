-- Postgres accorde EXECUTE à tous par défaut, et PostgREST expose tout le
-- schéma public : sans ces révocations, un visiteur non connecté peut appeler
-- /rest/v1/rpc/approve_dossier ou les fonctions de trigger.

-- 1. Rien n'est appelable depuis l'API par défaut.
revoke execute on all functions in schema public from anon, authenticated;

-- 2. Fonctions de trigger : jamais appelables depuis l'API. Le droit EXECUTE
-- n'est vérifié qu'à la création du trigger, pas à son déclenchement.
--    (aucun grant : elles restent révoquées)

-- 3. Helpers utilisés dans les politiques RLS. Une politique s'évalue avec les
-- droits de l'appelant : « authenticated » doit pouvoir les exécuter, sans quoi
-- toute requête sur documents, eligibility ou storage échouerait.
grant execute on function public.is_admin() to authenticated;
grant execute on function public.my_dossier_id() to authenticated;
grant execute on function public.my_dossier_status() to authenticated;

-- 4. Parcours du candidat.
grant execute on function public.ensure_dossier() to authenticated;
grant execute on function public.submit_dossier(text, numeric, smallint, text) to authenticated;
grant execute on function public.accept_eligibility(boolean, boolean, boolean, boolean) to authenticated;
grant execute on function public.get_phase_questions(smallint) to authenticated;
grant execute on function public.submit_phase_answers(smallint, smallint[]) to authenticated;
grant execute on function public.submit_funding(text, text) to authenticated;

-- 5. Instruction. Ces fonctions vérifient elles-mêmes public.is_admin() : le
-- grant à « authenticated » ne donne pas les droits d'admin.
grant execute on function public.approve_dossier(uuid) to authenticated;
grant execute on function public.reject_dossier(uuid, text) to authenticated;
grant execute on function public.validate_funding(uuid) to authenticated;

-- 6. Les fonctions créées plus tard ne seront pas exposées par inadvertance.
alter default privileges in schema public revoke execute on functions from anon, authenticated;
