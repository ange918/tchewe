import { useId } from 'react'
import { cn } from '../../lib/utils'

export interface Slice {
  label: string
  value: number
  color: string
}

function polar(cx: number, cy: number, r: number, fraction: number) {
  const angle = fraction * 2 * Math.PI - Math.PI / 2
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
}

/**
 * Anneau de répartition, accompagné de sa légende chiffrée.
 *
 * La couleur ne porte jamais seule l'information : chaque part est nommée et
 * chiffrée dans la légende, et un `<title>` la redit au survol comme aux
 * lecteurs d'écran. Un anneau ne convient qu'à une répartition d'un tout —
 * c'est le cas ici, chaque dossier occupant exactement une étape.
 */
export function Donut({
  slices,
  total,
  totalLabel,
  className,
}: {
  slices: Slice[]
  total: number
  totalLabel: string
  className?: string
}) {
  const titleId = useId()
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 76
  const stroke = 26

  const visibles = slices.filter((s) => s.value > 0)
  let debut = 0

  return (
    <div className={cn('flex flex-col items-center gap-6 sm:flex-row sm:items-center', className)}>
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-44 w-44"
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>
            Répartition des dossiers par étape, {total} au total
          </title>

          {total === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8eaf0" strokeWidth={stroke} />
          ) : (
            visibles.map((slice) => {
              const part = slice.value / total
              const from = debut
              debut += part

              // Un tour complet ne peut pas s'écrire en arc : on le trace en cercle.
              if (part >= 0.999) {
                return (
                  <circle
                    key={slice.label}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={stroke}
                  >
                    <title>{`${slice.label} : ${slice.value} (100 %)`}</title>
                  </circle>
                )
              }

              const [x1, y1] = polar(cx, cy, r, from)
              const [x2, y2] = polar(cx, cy, r, from + part)
              const grandArc = part > 0.5 ? 1 : 0

              return (
                <path
                  key={slice.label}
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${grandArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={stroke}
                  // Un écart de 2 px de la couleur du fond sépare les parts.
                  strokeLinecap="butt"
                  className="[vector-effect:non-scaling-stroke]"
                >
                  <title>{`${slice.label} : ${slice.value} (${Math.round(part * 100)} %)`}</title>
                </path>
              )
            })
          )}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-[-0.04em] text-ink-900">{total}</span>
          <span className="text-[0.65rem] font-bold tracking-[0.08em] text-ink-400 uppercase">
            {totalLabel}
          </span>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-1.5">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-ink-600">{slice.label}</span>
            <span className="font-extrabold text-ink-900 tabular-nums">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface Bar {
  label: string
  /** Libellé complet, pour le survol. */
  title: string
  value: number
}

/**
 * Série de barres pour une évolution dans le temps. Une seule série, donc pas
 * de légende : le titre du bloc la nomme. Seules les valeurs non nulles sont
 * étiquetées, pour ne pas couvrir le graphique de chiffres.
 */
export function Bars({ bars, color = '#3d2be8' }: { bars: Bar[]; color?: string }) {
  const max = Math.max(1, ...bars.map((b) => b.value))

  return (
    <div className="flex h-44 items-end gap-1.5" role="group" aria-label="Évolution par jour">
      {bars.map((bar) => {
        const hauteur = (bar.value / max) * 100
        return (
          <div key={bar.title} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-[4px] transition-opacity hover:opacity-80"
                style={{
                  height: `${Math.max(bar.value > 0 ? 4 : 2, hauteur)}%`,
                  backgroundColor: bar.value > 0 ? color : '#e8eaf0',
                }}
                title={`${bar.title} : ${bar.value}`}
              />
            </div>
            <span className="text-[0.6rem] font-semibold text-ink-400 tabular-nums">
              {bar.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
