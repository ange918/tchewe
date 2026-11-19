import type { DossierStatus } from './database.types'
import type { AdminDossier } from '../hooks/useDossiers'

/** Fenêtres de temps réellement couvertes par les dates enregistrées. */
export type RangeKey = '14j' | '8s' | '6m'

export interface Bucket {
  label: string
  title: string
  start: number
  end: number
}

export interface Point {
  label: string
  title: string
  value: number
}

const RANGES: Record<RangeKey, { count: number; step: 'day' | 'week' | 'month' }> = {
  '14j': { count: 14, step: 'day' },
  '8s': { count: 8, step: 'week' },
  '6m': { count: 6, step: 'month' },
}

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** Découpe la période en seaux contigus, du plus ancien au plus récent. */
export function buckets(range: RangeKey, now = new Date()): Bucket[] {
  const { count, step } = RANGES[range]
  const end = startOfDay(now)
  const items: Bucket[] = []

  for (let index = count - 1; index >= 0; index--) {
    const start = new Date(end)
    if (step === 'day') start.setDate(end.getDate() - index)
    if (step === 'week') start.setDate(end.getDate() - index * 7)
    if (step === 'month') start.setMonth(end.getMonth() - index)

    const next = new Date(start)
    if (step === 'day') next.setDate(start.getDate() + 1)
    if (step === 'week') next.setDate(start.getDate() + 7)
    if (step === 'month') next.setMonth(start.getMonth() + 1)

    const title = start.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: step === 'month' ? 'long' : 'short',
      year: step === 'month' ? 'numeric' : undefined,
    })

    items.push({
      label: step === 'month' ? start.toLocaleDateString('fr-FR', { month: 'short' }) : String(start.getDate()),
      title,
      start: start.getTime(),
      end: next.getTime(),
    })
  }

  return items
}

/** Compte les dates qui tombent dans chaque seau. Les dates absentes sont ignorées. */
export function series(dates: Array<string | null | undefined>, range: RangeKey, now = new Date()): Point[] {
  return buckets(range, now).map((bucket) => ({
    label: bucket.label,
    title: bucket.title,
    value: dates.filter((value) => {
      if (!value) return false
      const time = new Date(value).getTime()
      return time >= bucket.start && time < bucket.end
    }).length,
  }))
}

/** Sept derniers jours, pour les petites courbes des indicateurs. */
export function spark(dates: Array<string | null | undefined>, now = new Date()): number[] {
  return series(dates, '14j', now)
    .slice(-7)
    .map((point) => point.value)
}

export function countWhere(dossiers: AdminDossier[], statuses: DossierStatus[]) {
  return dossiers.filter((dossier) => statuses.includes(dossier.status)).length
}

export function submittedOn(dossier: AdminDossier) {
  return dossier.submitted_at
}
