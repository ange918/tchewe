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
  onProgress?: (ratio: number) => void,
): Promise<DocumentRow> {
  const bucket = bucketFor(kind)
  const path = pathFor(dossierId, kind, file.name)

  // Le client Supabase envoie le fichier d'un bloc, sans progression. On reprend
  // le même envoi multipart, via XHR, pour pouvoir afficher l'avancement.
  await uploadWithProgress(bucket, path, file, onProgress)

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

function storageMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string; error?: string }
    const message = parsed.message || parsed.error
    if (message && message.length < 180 && !message.startsWith('{')) return message
  } catch {
    // Le corps n'est pas du JSON : on garde la phrase générique.
  }
  return 'Le téléversement a échoué.'
}

/** Même contrat que `storage.upload` pour un File : formulaire multipart, sans upsert. */
function uploadWithProgress(
  bucket: string,
  path: string,
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<void> {
  return supabase.auth.getSession().then(({ data }) => {
    const token = data.session?.access_token
    if (!token) {
      return Promise.reject(new Error('Reconnectez-vous pour déposer un fichier.'))
    }

    const form = new FormData()
    form.append('cacheControl', '3600')
    form.append('', file)

    const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', endpoint)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
      xhr.setRequestHeader('x-upsert', 'false')
      xhr.upload.onprogress = (event) => {
        if (!onProgress || !event.lengthComputable || event.total === 0) return
        onProgress(Math.min(0.98, event.loaded / event.total))
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(1)
          resolve()
          return
        }
        reject(new Error(storageMessage(xhr.responseText)))
      }
      xhr.onerror = () => reject(new Error('Le téléversement a échoué. Vérifiez votre connexion.'))
      xhr.send(form)
    })
  })
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
