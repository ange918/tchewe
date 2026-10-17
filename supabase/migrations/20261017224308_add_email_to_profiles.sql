-- auth.users n'est pas lisible depuis l'API : le back-office a besoin de
-- l'adresse pour identifier un candidat, elle est donc recopiée dans le profil
-- par le trigger d'inscription.
alter table public.profiles add column email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, birth_date, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'birth_date', '')::date,
    new.email
  );
  return new;
end;
$$;

-- Profils déjà créés avant l'ajout de la colonne.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;
