import { CheckIcon, CloseIcon, LockIcon } from '../ui/icons'
import { Badge } from '../ui/Badge'
import { JOURNEY, rejectionStep, stepState, type StepState } from '../../lib/journey'
import { cn } from '../../lib/utils'
import type { DossierStatus } from '../../lib/database.types'

const MARK: Record<StepState, string> = {
  done: 'bg-brand-600 text-white',
  current: 'bg-brand-600 text-white ring-4 ring-brand-100',
  upcoming: 'bg-ink-100 text-ink-500',
  rejected: 'bg-rose-600 text-white',
}

/**
 * Le parcours, avec l'étape en cours et ce qui vient juste après.
 * L'état vient du dossier déjà enregistré côté serveur.
 */
export function JourneyStepper({
  status,
  hasProject,
  phaseCount,
  hasFunding,
}: {
  status: DossierStatus
  hasProject: boolean
  phaseCount: number
  hasFunding: boolean
}) {
  const stoppedAt =
    status === 'rejected' ? rejectionStep({ hasProject, phaseCount, hasFunding }) : null

  return (
    <ol aria-label="Parcours du dossier">
      {JOURNEY.map((step, index) => {
        const state = stepState(step, status, stoppedAt)
        const last = index === JOURNEY.length - 1
        return (
          <li key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  MARK[state],
                )}
              >
                {state === 'done' ? (
                  <CheckIcon className="h-4 w-4" aria-hidden />
                ) : state === 'rejected' ? (
                  <CloseIcon className="h-4 w-4" aria-hidden />
                ) : state === 'upcoming' ? (
                  <LockIcon className="h-4 w-4" aria-hidden />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </span>
              {!last && (
                <span
                  className={cn('my-1 w-px flex-1', state === 'done' ? 'bg-brand-300' : 'bg-ink-200')}
                  aria-hidden
                />
              )}
            </div>
            <div className={cn('min-w-0 flex-1', last ? 'pb-0' : 'pb-6')}>
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    'text-base font-bold',
                    state === 'upcoming' ? 'text-ink-500' : 'text-ink-900',
                  )}
                >
                  {step.label}
                </p>
                {state === 'current' && <Badge tone="brand">En cours</Badge>}
                {state === 'rejected' && <Badge tone="danger">Interrompu</Badge>}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                {state === 'current' ? step.next : step.detail}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
