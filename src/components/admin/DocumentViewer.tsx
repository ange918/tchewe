import { useEffect, useState } from 'react'
import { FileBlankIcon, LoaderIcon } from '../ui/icons'
import { cn, formatBytes } from '../../lib/utils'
import { signedUrlFor } from '../../lib/storage'
import type { DocumentRow } from '../../lib/database.types'

/**
 * Visualiseur de pièce jointe.
 *
 * Les buckets sont privés : l'aperçu passe par une URL signée à durée limitée,
 * délivrée seulement si la RLS autorise l'accès au dossier.
 */
export function DocumentViewer({
  file,
  className,
}: {
  file: DocumentRow
  className?: string
}) {
  const [url, setUrl] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [shown, setShown] = useState(file)

  // Remise à zéro au changement de pièce, pendant le rendu : un setState
  // synchrone dans l'effet provoquerait un rendu intermédiaire inutile.
  if (shown !== file) {
    setShown(file)
    setUrl(null)
    setState('loading')
  }

  useEffect(() => {
    let cancelled = false

    void signedUrlFor(file).then((signed) => {
      if (cancelled) return
      setUrl(signed)
      setState(signed ? 'ready' : 'failed')
    })

    return () => {
      cancelled = true
    }
  }, [file])

  if (state === 'loading') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border border-ink-200 bg-ink-50',
          className,
        )}
      >
        <LoaderIcon className="h-6 w-6 animate-spin text-ink-400" aria-hidden />
      </div>
    )
  }

  if (state === 'failed' || !url) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-ink-50 p-8 text-center',
          className,
        )}
      >
        <FileBlankIcon className="h-6 w-6 text-ink-400" aria-hidden />
        <p className="text-sm font-bold text-ink-700">{file.file_name}</p>
        <p className="max-w-xs text-xs leading-relaxed text-ink-500">
          Aperçu indisponible : le fichier n’a pas pu être récupéré depuis le stockage.
        </p>
      </div>
    )
  }

  if (file.mime_type?.startsWith('image/')) {
    return (
      <img
        src={url}
        alt={file.file_name}
        className={cn('w-full rounded-xl border border-ink-200 object-contain', className)}
      />
    )
  }

  return (
    <iframe
      src={url}
      title={file.file_name}
      className={cn('w-full rounded-xl border border-ink-200 bg-white', className)}
    />
  )
}

export function DocumentTabs({
  files,
  activeId,
  onSelect,
}: {
  files: DocumentRow[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {files.map((file) => (
        <button
          key={file.id}
          type="button"
          onClick={() => onSelect(file.id)}
          className={cn(
            'shrink-0 rounded-lg px-3 py-2 text-left text-xs font-bold transition',
            file.id === activeId
              ? 'bg-brand-600 text-white'
              : 'bg-ink-100 text-ink-600 hover:bg-ink-200',
          )}
        >
          <span className="block max-w-40 truncate">{file.file_name}</span>
          <span className={cn('block', file.id === activeId ? 'text-brand-100' : 'text-ink-400')}>
            {formatBytes(file.size_bytes ?? 0)}
          </span>
        </button>
      ))}
    </div>
  )
}
