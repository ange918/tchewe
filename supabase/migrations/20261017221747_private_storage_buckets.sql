-- Deux buckets privés. Les pièces d'identité sont séparées des pièces du
-- dossier : leur durée de conservation et leurs accès ne sont pas les mêmes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'dossier-files',
    'dossier-files',
    false,
    10485760,
    array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'identity-documents',
    'identity-documents',
    false,
    10485760,
    array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  );

-- Convention de chemin : {dossier_id}/{fichier}. Le premier dossier du chemin
-- est comparé en texte, jamais converti en uuid : un chemin forgé ferait
-- échouer la conversion et donc la requête entière.
create policy "Lecture de ses fichiers de dossier ou de tous pour un admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('dossier-files', 'identity-documents')
    and (
      (storage.foldername(name))[1] = public.my_dossier_id()::text
      or public.is_admin()
    )
  );

create policy "Dépôt dans son propre dossier"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('dossier-files', 'identity-documents')
    and (storage.foldername(name))[1] = public.my_dossier_id()::text
  );

create policy "Retrait de ses propres fichiers"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('dossier-files', 'identity-documents')
    and (storage.foldername(name))[1] = public.my_dossier_id()::text
  );
