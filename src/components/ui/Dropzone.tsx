import { useRef, useState } from 'react'
import { FileText, Paperclip, Trash2, UploadCloud } from 'lucide-react'
import { cn, formatBytes } from '../../lib/utils'
import { releaseFile, storeFile, type FileMeta } from '../../lib/fileVault'

export function Dropzone({
  label,
  hint,
  accept = 'application/pdf',
  multiple = true,
  maxSizeMb = 10,
  files,
  onChange,
  error,
}: {
  label: string
  hint?: string
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  files: FileMeta[]
  onChange: (files: FileMeta[]) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState<string>()

  function accepts(file: File) {
    return accept
      .split(',')
      .map((rule) => rule.trim())
      .some((rule) =>
        rule.endsWith('/*') ? file.type.startsWith(rule.slice(0, -1)) : file.type === rule,
      )
  }

  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return
    const next: FileMeta[] = []
    for (const file of Array.from(incoming)) {
      if (!accepts(file)) {
        setLocalError(`« ${file.name} » n'est pas dans un format accepté.`)
        continue
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setLocalError(`« ${file.name} » dépasse ${maxSizeMb} Mo.`)
        continue
      }
      next.push(storeFile(file))
    }
    if (!next.length) return
    setLocalError(undefined)
    onChange(multiple ? [...files, ...next] : next.slice(0, 1))
  }

  function remove(id: string) {
    releaseFile(id)
    onChange(files.filter((file) => file.id !== id))
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
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
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
          addFiles(event.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition',
          dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-ink-200 bg-ink-50/60 hover:border-brand-300 hover:bg-brand-50/50',
          shown && 'border-rose-300 bg-rose-50/50',
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
          <UploadCloud className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-sm font-bold text-ink-800">
          Déposez vos fichiers ou <span className="text-brand-600">parcourez</span>
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
            addFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {shown && <p className="text-sm font-medium text-rose-600">{shown}</p>}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                {file.type === 'application/pdf' ? (
                  <FileText className="h-4 w-4" aria-hidden />
                ) : (
                  <Paperclip className="h-4 w-4" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-900">{file.name}</span>
                <span className="block text-xs text-ink-500">{formatBytes(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => remove(file.id)}
                aria-label={`Retirer ${file.name}`}
                className="rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
