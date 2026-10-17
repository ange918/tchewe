import { useRef, useState } from 'react'
import { FileIcon, LoaderIcon, PaperclipIcon, TrashIcon, UploadIcon } from './icons'
import { cn, formatBytes } from '../../lib/utils'
import { removeDocument, uploadDocument } from '../../lib/storage'
import type { DocumentKind, DocumentRow } from '../../lib/database.types'

/**
 * Dépôt de pièces jointes.
 *
 * Le fichier part directement vers un bucket privé, puis la ligne de métadonnées
 * est écrite. En cas d'échec de la seconde étape, le fichier téléversé est
 * supprimé pour ne pas laisser d'orphelin dans le stockage.
 */
export function Dropzone({
  label,
  hint,
  dossierId,
  kind,
  documents,
  onAdded,
  onRemoved,
  accept = 'application/pdf',
  multiple = true,
  maxSizeMb = 10,
  error,
}: {
  label: string
  hint?: string
  dossierId: string
  kind: DocumentKind
  documents: DocumentRow[]
  onAdded: (document: DocumentRow) => void
  onRemoved: (id: string) => void
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState<string>()

  function accepts(file: File) {
    return accept
      .split(',')
      .map((rule) => rule.trim())
      .some((rule) =>
        rule.endsWith('/*') ? file.type.startsWith(rule.slice(0, -1)) : file.type === rule,
      )
  }

  async function addFiles(incoming: FileList | null) {
    if (!incoming?.length || busy) return
    setBusy(true)
    setLocalError(undefined)

    for (const file of Array.from(incoming)) {
      if (!accepts(file)) {
        setLocalError(`« ${file.name} » n’est pas dans un format accepté.`)
        continue
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setLocalError(`« ${file.name} » dépasse ${maxSizeMb} Mo.`)
        continue
      }
      try {
        const document = await uploadDocument(dossierId, kind, file)
        onAdded(document)
        if (!multiple) break
      } catch (cause) {
        setLocalError(
          cause && typeof cause === 'object' && 'message' in cause
            ? String((cause as { message: unknown }).message)
            : 'Le téléversement a échoué.',
        )
      }
    }

    setBusy(false)
  }

  async function remove(document: DocumentRow) {
    try {
      await removeDocument(document)
      onRemoved(document.id)
    } catch {
      setLocalError('Suppression impossible.')
    }
  }

  const shown = error ?? localError

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <span className="block text-sm font-bold text-ink-800">{label}</span>
        {hint && <p className="text-sm text-ink-500">{hint}</p>}
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-busy={busy}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (!busy && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          void addFiles(event.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition',
          dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-ink-200 bg-ink-50/60 hover:border-brand-300 hover:bg-brand-50/50',
          busy && 'cursor-wait opacity-70',
          shown && 'border-rose-300 bg-rose-50/50',
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
          {busy ? (
            <LoaderIcon className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <UploadIcon className="h-5 w-5" aria-hidden />
          )}
        </span>
        <span className="text-sm font-bold text-ink-800">
          {busy ? (
            'Téléversement en cours…'
          ) : (
            <>
              Déposez vos fichiers ou <span className="text-brand-600">parcourez</span>
            </>
          )}
        </span>
        <span className="text-xs text-ink-500">
          {accept.includes('pdf') && accept.includes('image')
            ? 'PDF, JPG ou PNG'
            : accept.includes('pdf')
              ? 'PDF uniquement'
              : 'JPG ou PNG'}{' '}
          · {maxSizeMb} Mo maximum par fichier
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            void addFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {shown && <p className="text-sm font-medium text-rose-600">{shown}</p>}

      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((document) => (
            <li
              key={document.id}
              className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                {document.mime_type === 'application/pdf' ? (
                  <FileIcon className="h-4 w-4" aria-hidden />
                ) : (
                  <PaperclipIcon className="h-4 w-4" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-900">
                  {document.file_name}
                </span>
                <span className="block text-xs text-ink-500">
                  {formatBytes(document.size_bytes ?? 0)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => void remove(document)}
                aria-label={`Retirer ${document.file_name}`}
                className="rounded-full p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <TrashIcon className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
