import { useEffect, useState } from 'react'
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ResetIcon,
  TimerIcon,
} from '../../components/ui/icons'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { QuizRunner } from '../../components/dashboard/QuizRunner'
import { PhaseGate } from '../../components/dashboard/PhaseGate'
import { EligibilityGate } from '../../components/dashboard/EligibilityGate'
import { toast } from '../../lib/toast'
import { formatDate, formatDateTime } from '../../lib/utils'
import { supabase } from '../../lib/supabase'
import {
  fetchPhaseQuestions,
  gradePhase,
  useApplication,
  type PhaseNumber,
} from '../../store/application'
import type { PhaseOutcome, QuizPhaseRow, QuizQuestion } from '../../lib/database.types'

const PASS_THRESHOLD = 60
const TOTAL_PHASES = 3

type Screen =
  | { kind: 'intro' }
  | { kind: 'running'; questions: QuizQuestion[] }
  | { kind: 'result'; outcome: PhaseOutcome }

function PhaseIntro({
  phase,
  definition,
  onStart,
  starting,
}: {
  phase: PhaseNumber
  definition: QuizPhaseRow | null
  onStart: () => void
  starting: boolean
}) {
  return (
    <Card>
      <CardHeader
        title={definition?.title ?? `Phase ${phase}`}
        description={definition?.theme}
        action={definition ? <Badge tone="brand">{definition.day}</Badge> : null}
      />
      <CardBody className="space-y-6">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Questions', value: 10 },
            { label: 'Durée totale', value: '≈ 2 min' },
            { label: 'Seuil de réussite', value: `${PASS_THRESHOLD} %` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-ink-50 p-4">
              <dt className="text-xs font-bold tracking-[0.08em] text-ink-400 uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-ink-900">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="space-y-2 text-sm leading-relaxed text-ink-600">
          <li className="flex gap-2.5">
            <TimerIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            Chaque question est chronométrée de 5 à 10 secondes. Le passage à la suivante est
            automatique à la fin du temps imparti.
          </li>
          <li className="flex gap-2.5">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            La session se déroule d’une traite : ne quittez pas la page avant la dernière question.
          </li>
        </ul>

        <Button size="lg" onClick={onStart} loading={starting}>
          Démarrer la phase {phase}
          <ArrowRightIcon className="h-4 w-4" aria-hidden />
        </Button>
      </CardBody>
    </Card>
  )
}

function PhaseResult({
  outcome,
  onRetry,
  onContinue,
}: {
  outcome: PhaseOutcome
  onRetry: () => void
  onContinue: () => void
}) {
  const percentage = Math.round((outcome.score / outcome.total) * 100)
  const isLast = outcome.phase >= TOTAL_PHASES

  return (
    <Card className={outcome.passed ? 'border-emerald-200' : 'border-amber-200'}>
      <CardBody className="space-y-6 text-center sm:py-10">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            outcome.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {outcome.passed ? (
            <CheckCircleIcon className="h-7 w-7" aria-hidden />
          ) : (
            <AlertIcon className="h-7 w-7" aria-hidden />
          )}
        </span>

        <div>
          <h2 className="text-2xl text-ink-900 sm:text-3xl">
            {outcome.passed ? `Phase ${outcome.phase} validée` : 'Score insuffisant'}
          </h2>
          <p className="mt-2 text-ink-600">
            {outcome.score} bonne(s) réponse(s) sur {outcome.total} — {percentage} %
            {outcome.passed ? '' : `, le seuil de réussite est fixé à ${PASS_THRESHOLD} %.`}
          </p>
        </div>

        {outcome.passed && !isLast && (
          <div className="mx-auto max-w-lg rounded-2xl bg-brand-50 p-5 text-left ring-1 ring-brand-100">
            <p className="flex items-center gap-2 text-sm font-extrabold text-brand-700">
              <ClockIcon className="h-4 w-4" aria-hidden />
              Revenez dans 48 heures
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              La phase {outcome.phase + 1} s’ouvrira
              {outcome.unlock_at ? (
                <>
                  {' '}
                  le{' '}
                  <strong className="font-bold text-ink-900">
                    {formatDateTime(outcome.unlock_at)}
                  </strong>
                </>
              ) : (
                ' dans 48 heures'
              )}
              . Le compte à rebours reste affiché dans votre espace.
            </p>
          </div>
        )}

        {outcome.passed && isLast && (
          <div className="mx-auto max-w-lg rounded-2xl bg-emerald-50 p-5 text-left ring-1 ring-emerald-100">
            <p className="text-sm font-extrabold text-emerald-700">Évaluation terminée</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Les trois sessions sont validées. Vous pouvez maintenant déposer vos preuves de
              garantie.
            </p>
          </div>
        )}

        {outcome.passed ? (
          <Button size="lg" onClick={onContinue}>
            {isLast ? 'Passer au dépôt de ma garantie' : 'Voir le compte à rebours'}
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button size="lg" variant="secondary" onClick={onRetry}>
            <ResetIcon className="h-4 w-4" aria-hidden />
            Repasser la session
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

function PhaseHistory({ titles }: { titles: Map<number, string> }) {
  const phases = useApplication((state) => state.phases)
  if (phases.length === 0) return null

  return (
    <Card>
      <CardHeader title="Sessions déjà passées" />
      <CardBody className="space-y-2">
        {phases.map((result) => (
          <div
            key={result.phase}
            className="flex items-center justify-between gap-4 rounded-xl border border-ink-200 px-4 py-3"
          >
            <div>
              <p className="text-sm font-bold text-ink-900">
                {titles.get(result.phase) ?? `Phase ${result.phase}`}
              </p>
              <p className="text-xs text-ink-500">Validée le {formatDate(result.completed_at)}</p>
            </div>
            <Badge tone="success">{Math.round((result.score / result.total) * 100)} %</Badge>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export function Evaluation() {
  const dossier = useApplication((state) => state.dossier)
  const eligibility = useApplication((state) => state.eligibility)
  const refresh = useApplication((state) => state.refresh)

  const [screen, setScreen] = useState<Screen>({ kind: 'intro' })
  const [starting, setStarting] = useState(false)
  const [definitions, setDefinitions] = useState<QuizPhaseRow[]>([])

  useEffect(() => {
    void supabase
      .from('quiz_phases')
      .select('*')
      .order('phase')
      .then(({ data }) => setDefinitions(data ?? []))
  }, [])

  if (!dossier) return null

  const currentPhase = dossier.current_phase as PhaseNumber
  const titles = new Map(definitions.map((d) => [d.phase, d.title]))

  async function start() {
    setStarting(true)
    try {
      const questions = await fetchPhaseQuestions(currentPhase)
      setScreen({ kind: 'running', questions })
    } catch (error) {
      toast.error(
        'Session indisponible',
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Réessayez dans un instant.',
      )
    } finally {
      setStarting(false)
    }
  }

  // Les écrans de session en cours priment sur les branches de statut : sans
  // cela, le compte à rebours masquerait le score dès la phase validée.
  if (screen.kind === 'running') {
    return (
      <QuizRunner
        questions={screen.questions}
        title={titles.get(currentPhase) ?? `Phase ${currentPhase}`}
        onFinish={(answers) => {
          void gradePhase(currentPhase, answers)
            .then(async (outcome) => {
              setScreen({ kind: 'result', outcome })
              await refresh()
              if (outcome.passed) {
                toast.success(
                  `Phase ${outcome.phase} validée`,
                  outcome.phase >= TOTAL_PHASES
                    ? 'Vous pouvez déposer votre garantie.'
                    : 'La phase suivante s’ouvrira dans 48 heures.',
                )
              } else {
                toast.error('Score insuffisant', `Le seuil de réussite est de ${PASS_THRESHOLD} %.`)
              }
            })
            .catch(() => {
              toast.error('Envoi impossible', 'Vos réponses n’ont pas pu être transmises.')
              setScreen({ kind: 'intro' })
            })
        }}
      />
    )
  }

  if (screen.kind === 'result') {
    return (
      <div className="space-y-6">
        <PhaseResult
          outcome={screen.outcome}
          onRetry={() => setScreen({ kind: 'intro' })}
          onContinue={() => setScreen({ kind: 'intro' })}
        />
        <PhaseHistory titles={titles} />
      </div>
    )
  }

  if (dossier.status === 'awaiting_next_phase' && dossier.unlock_at) {
    return (
      <div className="space-y-6">
        <PhaseGate
          completedPhase={(currentPhase - 1) as PhaseNumber}
          nextPhase={currentPhase}
          unlockAt={new Date(dossier.unlock_at).getTime()}
        />
        <PhaseHistory titles={titles} />
      </div>
    )
  }

  if (['evaluated', 'proofs_submitted', 'financed'].includes(dossier.status)) {
    return (
      <div className="space-y-6">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircleIcon className="h-6 w-6" aria-hidden />
            </span>
            <div className="flex-1">
              <h1 className="text-2xl text-ink-900">Évaluation terminée</h1>
              <p className="mt-1 text-ink-600">
                Les {TOTAL_PHASES} phases sont validées. Passez au dépôt de votre garantie.
              </p>
            </div>
            <ButtonLink to="/dashboard/funding" size="lg">
              Continuer
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </CardBody>
        </Card>
        <PhaseHistory titles={titles} />
      </div>
    )
  }

  if (dossier.status !== 'approved') {
    return (
      <Card className="border-amber-200 bg-amber-50/60">
        <CardBody className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <ClockIcon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-lg text-ink-900">Évaluation non encore ouverte</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
              La première session s’ouvrira dès que l’administration aura validé votre dossier.
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!eligibility) {
    return <EligibilityGate amount={dossier.amount ?? 0} />
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="outline">Étape 2 sur 3</Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">Évaluation chronométrée</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Trois sessions de 10 questions, espacées de 48 heures, évaluent votre maîtrise du projet,
          de sa gestion financière et de ses engagements.
        </p>
      </div>
      <PhaseIntro
        phase={currentPhase}
        definition={definitions.find((d) => d.phase === currentPhase) ?? null}
        onStart={() => void start()}
        starting={starting}
      />
      <PhaseHistory titles={titles} />
    </div>
  )
}
