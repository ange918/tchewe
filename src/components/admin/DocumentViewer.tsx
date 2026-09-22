import { FileBlankIcon } from '../ui/icons'
import { cn, formatBytes } from '../../lib/utils'
import { getFileUrl, type FileMeta } from '../../lib/fileVault'

/**
 * Visualiseur de pièce jointe intégré.
 *
 * Les PDF sont rendus dans une `iframe`, les images dans une balise `img`. Les
 * pièces du jeu de démonstration n'ont pas de blob : on affiche alors un état
 * explicite plutôt qu'un cadre vide.
 */
export function DocumentViewer({ file, className }: { file: FileMeta; className?: string }) {
  const url = getFileUrl(file.id)

  if (!url) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-ink-50 p-8 text-center',
          className,
        )}
      >
        <FileBlankIcon className="h-6 w-6 text-ink-400" aria-hidden />
        <p className="text-sm font-bold text-ink-700">{file.name}</p>
        <p className="max-w-xs text-xs leading-relaxed text-ink-500">
          Aperçu indisponible : le fichier n’a pas été téléversé dans cette session de
          démonstration. En production, il serait servi depuis le stockage du programme.
        </p>
      </div>
    )
  }

  if (file.type.startsWith('image/')) {
    return (
      <img
        src={url}
        alt={file.name}
        className={cn('w-full rounded-xl border border-ink-200 object-contain', className)}
      />
    )
  }

  return (
    <iframe
      src={url}
      title={file.name}
      className={cn('w-full rounded-xl border border-ink-200 bg-white', className)}
    />
  )
}

export function DocumentTabs({
  files,
  activeId,
  onSelect,
}: {
  files: FileMeta[]
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
          <span className="block max-w-40 truncate">{file.name}</span>
          <span className={cn('block', file.id === activeId ? 'text-brand-100' : 'text-ink-400')}>
            {formatBytes(file.size)}
          </span>
        </button>
      ))}
    </div>
  )
}
