-- Le premier administrateur doit bien pouvoir être créé quelque part.
-- auth.uid() est nul hors session utilisateur : console Supabase, clé de
-- service, migrations. Les requêtes du navigateur portent toujours un `sub`,
-- et restent donc bloquées. La politique UPDATE de profiles empêche de toute
-- façon un visiteur non connecté de toucher une ligne.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Le rôle ne peut pas être modifié depuis le client'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

comment on function public.protect_profile_role() is
  'Empêche un candidat de se promouvoir administrateur. La promotion se fait depuis la console Supabase (clé de service), ou par un administrateur déjà en place.';
