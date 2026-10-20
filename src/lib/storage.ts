import { supabase } from './supabase'
import type { DocumentKind, DocumentRow } from './database.types'

/**
 * Fichiers du dossier.
 *
 * Deux buckets privés : les pièces d'identité sont séparées des pièces du
 * dossier, leur conservation et leurs accès n'étant pas les mêmes. Aucun
 * fichier n'est accessible par URL publique — la lecture passe par une URL
 * signée à durée limitée, délivrée seulement si la RLS autorise l'accès.
 */
const IDENTITY_BUCKET = 'identity-documents'
const DOSSIER_BUCKET = 'dossier-files'

export function bucketFor(kind: DocumentKind): string {
  return kind === 'identity' ? IDENTITY_BUCKET : DOSSIER_BUCKET
}

/** Le premier segment du chemin porte l'identifiant du dossier : les politiques
 *  Storage s'appuient dessus pour vérifier la propriété. */
function pathFor(dossierId: string, kind: DocumentKind, fileName: string): string {
  const safe = fileName.replace(/[^\w.-]+/g, '-').slice(-80)
  return `${dossierId}/${kind}/${crypto.randomUUID()}-${safe}`
}

export async function uploadDocument(
  dossierId: string,
  kind: DocumentKind,
  file: File,
): Promise<DocumentRow> {
  const bucket = bucketFor(kind)
  const path = pathFor(dossierId, kind, file.name)

  const upload = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })
  if (upload.error) throw upload.error

  const { data, error } = await supabase
    .from('documents')
    .insert({
      dossier_id: dossierId,
      kind,
      storage_path: path,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    })
    .select()
    .single()

  if (error) {
    // La ligne n'a pas été écrite : on ne laisse pas le fichier orphelin.
    await supabase.storage.from(bucket).remove([path])
    throw error
  }

  return data
}

export async function removeDocument(document: DocumentRow): Promise<void> {
  const { error } = await supabase.from('documents').delete().eq('id', document.id)
  if (error) throw error
  await supabase.storage.from(bucketFor(document.kind)).remove([document.storage_path])
}

/** URL signée valable une heure, suffisante pour consulter une pièce. */
export async function signedUrlFor(document: DocumentRow): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucketFor(document.kind))
    .createSignedUrl(document.storage_path, 3600)

  if (error) return null
  return data.signedUrl
}
