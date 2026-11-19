import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FileIcon, LoaderIcon, TrashIcon, UploadIcon } from './icons'
import { cn, formatBytes } from '../../lib/utils'
import { removeDocument, signedUrlFor, uploadDocument } from '../../lib/storage'
import type { DocumentKind, DocumentRow } from '../../lib/database.types'

/**
 * Dépôt de pièces jointes.
 *
 * Le fichier part vers un bucket privé, avec une barre d'avancement, puis la
 * ligne de métadonnées est écrite. Un aperçu local s'affiche tout de suite
 * pour les images ; les fichiers déjà enregistrés sont relus via une URL signée.
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
  readOnly = false,
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
  readOnly?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const urls = useRef<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [pendingName, setPendingName] = useState<string>()
  const [localPreview, setLocalPreview] = useState<Record<string, string>>({})
  const [remotePreview, setRemotePreview] = useState<Record<string, string>>({})
  const [localError, setLocalError] = useState<string>()
  const reduced = useReducedMotion()

  useEffect(() => {
    const owned = urls.current
    return () => {
      for (const url of owned) URL.revokeObjectURL(url)
    }
  }, [])

  const imageKey = documents
    .filter((document) => document.mime_type?.startsWith('image/'))
    .map((document) => document.id)
    .join('|')

  useEffect(() => {
    const images = documents.filter((document) => document.mime_type?.startsWith('image/'))
    if (images.length === 0) return
    let cancelled = false
    void Promise.all(
      images.map(async (document) => [document.id, await signedUrlFor(document)] as const),
    ).then((pairs) => {
      if (cancelled) return
      setRemotePreview((current) => {
        const next = { ...current }
        for (const [id, url] of pairs) {
          if (url) next[id] = url
        }
        return next
      })
    })
    return () => {
      cancelled = true
    }
    // La clé résume les images déjà connues : on ne relance pas à chaque nouveau tableau.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageKey])

  function accepts(file: File) {
    return accept
      .split(',')
      .map((rule) => rule.trim())
      .some((rule) =>
        rule.endsWith('/*') ? file.type.startsWith(rule.slice(0, -1)) : file.type === rule,
      )
  }

  function formats() {
    if (accept.includes('pdf') && accept.includes('image')) return 'PDF, JPG ou PNG'
    if (accept.includes('pdf')) return 'PDF uniquement'
    return 'JPG ou PNG'
  }

  async function addFiles(incoming: FileList | null) {
    if (!incoming?.length || busy || readOnly) return
    if (!dossierId) {
      setLocalError('Le dossier n’est pas encore prêt. Rechargez la page.')
      return
    }
    setBusy(true)
    setLocalError(undefined)

    const previous = !multiple ? [...documents] : []

    for (const file of Array.from(incoming)) {
      if (!accepts(file)) {
        setLocalError(`« ${file.name} » n’est pas au format attendu (${formats()}).`)
        continue
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setLocalError(`« ${file.name} » dépasse ${maxSizeMb} Mo.`)
        continue
      }
      if (file.size === 0) {
        setLocalError(`« ${file.name} » est vide.`)
        continue
      }

      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      if (preview) urls.current.push(preview)
      setPendingName(file.name)
      setProgress(0.04)

      try {
        const document = await uploadDocument(dossierId, kind, file, (ratio) => setProgress(ratio))
        if (preview) {
          setLocalPreview((current) => ({ ...current, [document.id]: preview }))
        }
        onAdded(document)
        if (!multiple) {
          for (const old of previous) {
            try {
              await removeDocument(old)
              onRemoved(old.id)
            } catch {
              setLocalError('Le nouveau fichier est en place, mais l’ancien n’a pas pu être retiré.')
            }
          }
          break
        }
      } catch (cause) {
        setLocalError(
          cause && typeof cause === 'object' && 'message' in cause
            ? String((cause as { message: unknown }).message)
            : 'Le téléversement a échoué.',
        )
      }
    }

    setBusy(false)
    setProgress(null)
    setPendingName(undefined)
  }

  async function remove(document: DocumentRow) {
    setLocalError(undefined)
    try {
      await removeDocument(document)
      onRemoved(document.id)
    } catch {
      setLocalError('Suppression impossible. Réessayez dans un instant.')
    }
  }

  const shown = error ?? localError
  const ratio = progress === null ? 0 : Math.round(progress * 100)

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="block text-sm font-bold text-ink-800">{label}</span>
        {hint && <p className="text-sm leading-relaxed text-ink-600">{hint}</p>}
      </div>

      {!readOnly && (
        <div
          role="button"
          tabIndex={0}
          aria-busy={busy}
          aria-disabled={busy}
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
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition duration-200',
            'active:scale-[0.97]',
            dragging
              ? 'border-brand-500 bg-brand-50'
              : 'border-ink-200 bg-ink-50/60 hover:border-brand-300 hover:bg-brand-50/50',
            busy && 'cursor-wait',
            shown && 'border-rose-400 bg-rose-50/60',
          )}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
            {busy ? (
              <LoaderIcon className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <UploadIcon className="h-5 w-5" aria-hidden />
            )}
          </span>
          <span className="text-base font-bold text-ink-800">
            {busy ? (
              `Envoi de ${pendingName ?? 'votre fichier'}…`
            ) : documents.length > 0 && !multiple ? (
              <>
                Remplacer le fichier ou <span className="text-brand-600">parcourir</span>
              </>
            ) : (
              <>
                Glissez le fichier ici ou <span className="text-brand-600">parcourez</span>
              </>
            )}
          </span>
          <span className="text-sm text-ink-600">
            {formats()} · {maxSizeMb} Mo maximum
          </span>
          {busy && (
            <div className="mt-2 w-full max-w-xs" aria-hidden={false}>
              <div
                className="h-2 overflow-hidden rounded-full bg-ink-200"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={ratio}
                aria-label="Avancement du téléversement"
              >
                <div
                  className="h-full rounded-full bg-brand-600 transition-[width] duration-200"
                  style={{ width: `${Math.max(ratio, 6)}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-bold text-brand-700">{ratio} %</p>
            </div>
          )}
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
      )}

      {shown && (
        <p role="alert" className="text-sm font-medium text-rose-700">
          {shown}
        </p>
      )}

      {documents.length === 0 && !busy && (
        <p className="text-sm text-ink-600">
          {readOnly ? 'Aucune pièce transmise.' : 'Aucun fichier pour l’instant.'}
        </p>
      )}

      {documents.length > 0 && (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {documents.map((document) => {
              const preview = localPreview[document.id] ?? remotePreview[document.id]
              const isImage = document.mime_type?.startsWith('image/')
              return (
                <motion.li
                  key={document.id}
                  layout
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl border border-ink-200 bg-white"
                >
                  {isImage && preview && (
                    <img
                      src={preview}
                      alt={`Aperçu de ${document.file_name}`}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  {!isImage && (
                    <div className="flex h-24 items-center justify-center bg-ink-50 text-brand-700">
                      <FileIcon className="h-8 w-8" aria-hidden />
                      <span className="ml-2 text-sm font-bold">
                        {document.mime_type === 'application/pdf' ? 'PDF' : 'Fichier'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink-900">
                        {document.file_name}
                      </span>
                      <span className="block text-sm text-ink-600">
                        {formatBytes(document.size_bytes ?? 0)}
                      </span>
                    </span>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => void remove(document)}
                        aria-label={`Retirer ${document.file_name}`}
                        className="rounded-full p-2 text-ink-500 transition duration-200 hover:bg-rose-50 hover:text-rose-700 active:scale-[0.97]"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
