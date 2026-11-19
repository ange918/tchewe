import { CheckCircleIcon, ClockIcon, AlertCircleIcon, ShieldIcon } from '../ui/icons'
import { proofVisual, type ProofVisual } from '../../lib/proof'
import { cn } from '../../lib/utils'
import type { DossierStatus } from '../../lib/database.types'

const TONE: Record<ProofVisual['kind'], { wrap: string; icon: string; Icon: typeof ShieldIcon }> = {
  later: {
    wrap: 'border-ink-200 bg-white',
    icon: 'bg-ink-100 text-ink-600',
    Icon: ShieldIcon,
  },
  todo: {
    wrap: 'border-brand-200 bg-brand-50/70',
    icon: 'bg-brand-600 text-white',
    Icon: ShieldIcon,
  },
  pending: {
    wrap: 'border-brass-100 bg-brass-50',
    icon: 'bg-brass-700 text-white',
    Icon: ClockIcon,
  },
  validated: {
    wrap: 'border-emerald-200 bg-emerald-50',
    icon: 'bg-emerald-600 text-white',
    Icon: CheckCircleIcon,
  },
  rejected: {
    wrap: 'border-rose-200 bg-rose-50',
    icon: 'bg-rose-600 text-white',
    Icon: AlertCircleIcon,
  },
}

/** Statut de la preuve, lisible d'un coup d'œil. */
export function ProofStatusCard({
  status,
  submittedAt,
  reviewNote,
  hasFunding,
  guaranteeLabel,
}: {
  status: DossierStatus
  submittedAt: string | null
  reviewNote: string | null
  hasFunding: boolean
  guaranteeLabel: string
}) {
  const visual = proofVisual({ status, submittedAt, reviewNote, hasFunding, guaranteeLabel })
  const tone = TONE[visual.kind]
  const Icon = tone.Icon

  return (
    <article className={cn('rounded-2xl border p-4 sm:p-6', tone.wrap)} aria-label="Statut de la preuve">
      <div className="flex items-start gap-4">
        <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', tone.icon)}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg text-ink-900">{visual.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{visual.detail}</p>
        </div>
      </div>
      {visual.kind === 'rejected' && (
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm leading-relaxed text-ink-800 ring-1 ring-rose-200">
          <span className="font-bold">Motif. </span>
          {visual.reason}
        </p>
      )}
    </article>
  )
}
