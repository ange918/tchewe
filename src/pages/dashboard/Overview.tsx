import { ArrowRight, Check, Circle, Lock } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { cn, formatEuro } from '../../lib/utils'
import { useAuth } from '../../store/auth'
import {
  GUARANTEE_RATE,
  routeForStatus,
  STATUS_LABELS,
  useApplication,
  type DossierStatus,
} from '../../store/application'

const TIMELINE: { label: string; done: DossierStatus[]; current: DossierStatus[] }[] = [
  {
    label: 'Inscription',
    done: ['draft', 'submitted', 'approved', 'awaiting_next_phase', 'evaluated', 'proofs_submitted', 'financed', 'rejected'],
    current: [],
  },
  {
    label: 'Soumission du dossier',
    done: ['submitted', 'approved', 'awaiting_next_phase', 'evaluated', 'proofs_submitted', 'financed'],
    current: ['draft'],
  },
  {
    label: 'Validation par l’administration',
    done: ['approved', 'awaiting_next_phase', 'evaluated', 'proofs_submitted', 'financed'],
    current: ['submitted'],
  },
  {
    label: 'Évaluation — 3 phases',
    done: ['evaluated', 'proofs_submitted', 'financed'],
    current: ['approved', 'awaiting_next_phase'],
  },
  {
    label: 'Dépôt de la garantie de 30 %',
    done: ['proofs_submitted', 'financed'],
    current: ['evaluated'],
  },
  {
    label: 'Virement de la subvention',
    done: ['financed'],
    current: ['proofs_submitted'],
  },
]

const NEXT_ACTION: Record<DossierStatus, { label: string; to: string } | null> = {
  draft: { label: 'Présenter mon projet', to: '/dashboard/submission' },
  submitted: { label: 'Consulter mon dossier', to: '/dashboard/submission' },
  approved: { label: 'Démarrer l’évaluation', to: '/dashboard/evaluation' },
  awaiting_next_phase: { label: 'Voir le compte à rebours', to: '/dashboard/evaluation' },
  evaluated: { label: 'Déposer ma garantie', to: '/dashboard/funding' },
  proofs_submitted: { label: 'Suivre la vérification', to: '/dashboard/funding' },
  financed: { label: 'Voir mon financement', to: '/dashboard/funding' },
  rejected: { label: 'Consulter le motif', to: '/dashboard/submission' },
}

export function Overview() {
  const user = useAuth((state) => state.user)
  const { status, project, reference, phases } = useApplication()
  const action = NEXT_ACTION[status] ?? { label: 'Continuer', to: routeForStatus(status) }

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="outline">{STATUS_LABELS[status]}</Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">
          Bonjour {user?.firstName}, voici votre dossier.
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          {project
            ? `Référence ${reference} — ${project.title}`
            : 'Votre dossier n’est pas encore déposé. Commencez par présenter votre projet.'}
        </p>
      </div>

      {project && (
        <dl className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Montant sollicité', value: formatEuro(project.amount) },
            { label: 'Garantie à déposer', value: formatEuro(Math.round(project.amount * GUARANTEE_RATE)) },
            { label: 'Phases validées', value: `${phases.length} / 3` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-ink-200/80 bg-white p-5">
              <dt className="text-xs font-bold tracking-[0.08em] text-ink-400 uppercase">
                {item.label}
              </dt>
              <dd className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-ink-900">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <Card>
        <CardHeader
          title="Avancement"
          description="Chaque étape se débloque dès que la précédente est validée."
          action={
            <ButtonLink to={action.to} size="sm">
              {action.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          }
        />
        <CardBody>
          <ol className="space-y-1">
            {TIMELINE.map((step) => {
              const done = step.done.includes(status)
              const current = step.current.includes(status)
              return (
                <li key={step.label} className="flex items-center gap-3.5 py-2.5">
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      done
                        ? 'bg-emerald-600 text-white'
                        : current
                          ? 'bg-brand-600 text-white'
                          : 'bg-ink-100 text-ink-400',
                    )}
                  >
                    {done ? (
                      <Check className="h-4 w-4" aria-hidden />
                    ) : current ? (
                      <Circle className="h-3 w-3 fill-current" aria-hidden />
                    ) : (
                      <Lock className="h-3.5 w-3.5" aria-hidden />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-[0.98rem] font-semibold',
                      done || current ? 'text-ink-900' : 'text-ink-400',
                    )}
                  >
                    {step.label}
                  </span>
                  {current && <Badge tone="brand" className="ml-auto">En cours</Badge>}
                </li>
              )
            })}
          </ol>
        </CardBody>
      </Card>
    </div>
  )
}
