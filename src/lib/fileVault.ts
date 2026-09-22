/**
 * Coffre de fichiers éphémère.
 *
 * Les métadonnées des pièces jointes sont persistées dans le store, mais un objet
 * `File` n'est pas sérialisable : les blobs ne vivent donc que le temps de l'onglet.
 * Au rechargement, la fiche reste consultable et le visualiseur affiche un état
 * « document indisponible » plutôt qu'une URL morte.
 */
export interface FileMeta {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: number
}

const blobs = new Map<string, string>()

export function storeFile(file: File): FileMeta {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  blobs.set(id, URL.createObjectURL(file))
  return { id, name: file.name, size: file.size, type: file.type, uploadedAt: Date.now() }
}

export function getFileUrl(id: string): string | undefined {
  return blobs.get(id)
}

export function releaseFile(id: string): void {
  const url = blobs.get(id)
  if (url) {
    URL.revokeObjectURL(url)
    blobs.delete(id)
  }
}
