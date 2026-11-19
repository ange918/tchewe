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
          <span className="text-sm font-bold text-ink-600">{totalLabel}</span>
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
            <span className="text-sm font-semibold text-ink-600 tabular-nums">{bar.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Courbe courte, lue à côté d'un indicateur. Les valeurs viennent des dates réelles. */
export function Sparkline({ values, color = '#3d2be8' }: { values: number[]; color?: string }) {
  const width = 96
  const height = 32
  const max = Math.max(1, ...values, 0)
  const step = values.length > 1 ? width / (values.length - 1) : width
  const points = values
    .map((value, index) => {
      const x = index * step
      const y = height - 3 - (value / Math.max(max, 1)) * (height - 8)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-24" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aire lissée d'une seule série. Chaque point porte sa valeur dans un titre. */
export function AreaChart({ points, color = '#3d2be8' }: { points: Bar[]; color?: string }) {
  const gradientId = useId().replace(/:/g, '')
  const width = 640
  const height = 220
  const pad = 18
  const max = Math.max(1, ...points.map((point) => point.value))
  const coords = points.map((point, index) => {
    const x = pad + (points.length <= 1 ? 0 : (index / (points.length - 1)) * (width - pad * 2))
    const y = height - pad - (point.value / max) * (height - pad * 2)
    return { x, y, point }
  })
  const line = smooth(coords)
  const first = coords[0]
  const last = coords[coords.length - 1]
  const area = first && last ? `${line} L ${last.x} ${height - pad} L ${first.x} ${height - pad} Z` : ''

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full" role="img" aria-label="Dossiers déposés sur la période">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {area && <path d={area} fill={`url(#${gradientId})`} />}
        {line && <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />}
        {coords.map((coord) => (
          <circle key={coord.point.title} cx={coord.x} cy={coord.y} r="3.5" fill={color}>
            <title>{`${coord.point.title} : ${coord.point.value}`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-2 flex justify-between gap-2 text-sm font-semibold text-ink-600">
        <span>{points[0]?.label}</span>
        <span>{points[Math.floor(points.length / 2)]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  )
}

function smooth(coords: { x: number; y: number }[]) {
  if (coords.length === 0) return ''
  let path = `M ${coords[0].x} ${coords[0].y}`
  for (let index = 0; index < coords.length - 1; index++) {
    const previous = coords[index - 1] ?? coords[index]
    const current = coords[index]
    const next = coords[index + 1]
    const after = coords[index + 2] ?? next
    const c1x = current.x + (next.x - previous.x) / 6
    const c1y = current.y + (next.y - previous.y) / 6
    const c2x = next.x - (after.x - current.x) / 6
    const c2y = next.y - (after.y - current.y) / 6
    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${next.x} ${next.y}`
  }
  return path
}
