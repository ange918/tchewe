import { ArrowRightIcon } from '../../components/ui/icons'
import { Badge } from '../../components/ui/Badge'
import { ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { GuaranteeExplainer } from '../../components/guarantee/GuaranteeExplainer'
import { JourneyStepper } from '../../components/dashboard/JourneyStepper'
import { ProofStatusCard } from '../../components/dashboard/ProofStatusCard'
import { JOURNEY, rejectionStep, stepState } from '../../lib/journey'
import { formatDate, formatEuro } from '../../lib/utils'
import { useAuth } from '../../store/auth'
import {
  GUARANTEE_RATE,
  routeForStatus,
  STATUS_LABELS,
  useApplication,
  type DossierStatus,
} from '../../store/application'

const NEXT_ACTION: Record<DossierStatus, { label: string; to: string } | null> = {
  draft: { label: 'Présenter mon projet', to: '/dashboard/submission' },
  submitted: { label: 'Consulter mon dossier', to: '/dashboard/submission' },
  approved: { label: 'Démarrer l’évaluation', to: '/dashboard/evaluation' },
  awaiting_next_phase: { label: 'Voir le compte à rebours', to: '/dashboard/evaluation' },
  evaluated: { label: 'Déposer ma garantie', to: '/dashboard/funding' },
  proofs_submitted: { label: 'Suivre la preuve', to: '/dashboard/funding' },
  financed: { label: 'Voir mon financement', to: '/dashboard/funding' },
  rejected: { label: 'Lire le motif', to: '/dashboard/submission' },
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Chargement du dossier">
      <div className="h-6 w-32 animate-pulse rounded-full bg-ink-100" />
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-ink-100" />
      <div className="h-48 animate-pulse rounded-2xl bg-ink-100" />
    </div>
  )
}

export function Overview() {
  const user = useAuth((state) => state.user)
  const dossier = useApplication((state) => state.dossier)
  const phases = useApplication((state) => state.phases)
  const funding = useApplication((state) => state.funding)
  const loading = useApplication((state) => state.loading)

  if (loading && !dossier) return <OverviewSkeleton />

  const status = dossier?.status ?? 'draft'
  const reference = dossier?.reference ?? null
  const project = dossier && dossier.title ? dossier : null
  const action = NEXT_ACTION[status] ?? { label: 'Continuer', to: routeForStatus(status) }
  const hasProject = Boolean(project)
  const hasFunding = Boolean(funding)
  const stoppedAt =
    status === 'rejected'
      ? rejectionStep({ hasProject, phaseCount: phases.length, hasFunding })
      : null
  const active =
    JOURNEY.find((step) => stepState(step, status, stoppedAt) === 'current') ??
    JOURNEY.find((step) => stepState(step, status, stoppedAt) === 'rejected')
  const guarantee = project ? Math.round((project.amount ?? 0) * GUARANTEE_RATE) : 0

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="outline">{STATUS_LABELS[status]}</Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">Suivez votre dossier.</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-600">
          {user?.firstName ? `Bonjour ${user.firstName}. ` : ''}
          {project
            ? `Référence ${reference} — ${project.title}.`
            : 'Le dossier n’est pas encore déposé. Commencez par présenter votre projet.'}
        </p>
      </div>

      {project && (
        <dl className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Montant sollicité', value: formatEuro(project.amount ?? 0) },
            { label: 'Garantie sur votre compte', value: formatEuro(guarantee) },
            { label: 'Phases validées', value: `${phases.length} / 3` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-ink-200/80 bg-white p-4 sm:p-6">
              <dt className="text-sm font-bold text-ink-600">{item.label}</dt>
              <dd className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-ink-900">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {status === 'rejected' && (
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-6">
          <h2 className="text-lg text-ink-900">Le dossier est interrompu.</h2>
          <p className="mt-2 text-base leading-relaxed text-ink-700">
            {dossier?.review_note?.trim() || 'Aucun motif n’a été précisé par l’administration.'}
          </p>
        </article>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card>
          <CardHeader
            title="Les étapes"
            description="Chaque étape s’ouvre quand la précédente est enregistrée."
          />
          <CardBody>
            <JourneyStepper
              status={status}
              hasProject={hasProject}
              phaseCount={phases.length}
              hasFunding={hasFunding}
            />
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Ce qui suit" description={active?.next ?? 'Continuez votre dossier.'} />
            <CardBody className="space-y-4">
              {funding?.submitted_at && status === 'proofs_submitted' && (
                <p className="text-sm text-ink-600">
                  Preuve transmise le {formatDate(funding.submitted_at)}.
                </p>
              )}
              <ButtonLink to={action.to}>
                {action.label}
                <ArrowRightIcon className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </CardBody>
          </Card>

          <ProofStatusCard
            status={status}
            submittedAt={funding?.submitted_at ? formatDate(funding.submitted_at) : null}
            reviewNote={dossier?.review_note ?? null}
            hasFunding={hasFunding}
            guaranteeLabel={guarantee > 0 ? formatEuro(guarantee) : '30 %'}
          />
        </div>
      </div>

      {project && <GuaranteeExplainer amountLabel={formatEuro(guarantee)} compact />}
    </div>
  )
}
