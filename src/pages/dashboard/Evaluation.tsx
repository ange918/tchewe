import { useState } from 'react'
import { AlertIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon, ResetIcon, TimerIcon } from '../../components/ui/icons'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { QuizRunner } from '../../components/dashboard/QuizRunner'
import { PhaseGate } from '../../components/dashboard/PhaseGate'
import { toast } from '../../lib/toast'
import { getPhase, PASS_THRESHOLD, PHASES } from '../../data/quiz'
import { formatDate } from '../../lib/utils'
import { useApplication, type PhaseNumber } from '../../store/application'

type Screen = { kind: 'intro' } | { kind: 'running' } | { kind: 'result'; score: number; total: number }

function PhaseIntro({ phase, onStart }: { phase: PhaseNumber; onStart: () => void }) {
  const definition = getPhase(phase)
  const totalSeconds = definition.questions.reduce((sum, item) => sum + item.seconds, 0)

  return (
    <Card>
      <CardHeader
        title={definition.title}
        description={definition.theme}
        action={<Badge tone="brand">{definition.day}</Badge>}
      />
      <CardBody className="space-y-6">
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Questions', value: definition.questions.length },
            { label: 'Durée totale', value: `≈ ${Math.ceil(totalSeconds / 60)} min` },
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

        <Button size="lg" onClick={onStart}>
          Démarrer la phase {phase}
          <ArrowRightIcon className="h-4 w-4" aria-hidden />
        </Button>
      </CardBody>
    </Card>
  )
}

function PhaseResult({
  phase,
  score,
  total,
  passed,
  onRetry,
}: {
  phase: PhaseNumber
  score: number
  total: number
  passed: boolean
  onRetry: () => void
}) {
  const percentage = Math.round((score / total) * 100)

  return (
    <Card className={passed ? 'border-emerald-200' : 'border-amber-200'}>
      <CardBody className="space-y-6 text-center sm:py-10">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
            passed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {passed ? (
            <CheckCircleIcon className="h-7 w-7" aria-hidden />
          ) : (
            <AlertIcon className="h-7 w-7" aria-hidden />
          )}
        </span>

        <div>
          <h2 className="text-2xl text-ink-900 sm:text-3xl">
            {passed ? `Phase ${phase} validée` : `Score insuffisant`}
          </h2>
          <p className="mt-2 text-ink-600">
            {score} bonne(s) réponse(s) sur {total} — {percentage} %
            {passed ? '' : `, le seuil de réussite est fixé à ${PASS_THRESHOLD} %.`}
          </p>
        </div>

        {!passed && (
          <Button size="lg" variant="secondary" onClick={onRetry}>
            <ResetIcon className="h-4 w-4" aria-hidden />
            Repasser la session
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

function PhaseHistory() {
  const phases = useApplication((state) => state.phases)
  if (phases.length === 0) return null

  return (
    <Card>
      <CardHeader title="Sessions déjà passées" />
      <CardBody className="space-y-2">
        {phases.map((result) => {
          const percentage = Math.round((result.score / result.total) * 100)
          return (
            <div
              key={result.phase}
              className="flex items-center justify-between gap-4 rounded-xl border border-ink-200 px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold text-ink-900">
                  {getPhase(result.phase).title}
                </p>
                <p className="text-xs text-ink-500">Validée le {formatDate(result.completedAt)}</p>
              </div>
              <Badge tone="success">{percentage} %</Badge>
            </div>
          )
        })}
      </CardBody>
    </Card>
  )
}

export function Evaluation() {
  const status = useApplication((state) => state.status)
  const currentPhase = useApplication((state) => state.currentPhase)
  const unlockAt = useApplication((state) => state.unlockAt)
  const completePhase = useApplication((state) => state.completePhase)

  const [screen, setScreen] = useState<Screen>({ kind: 'intro' })

  // Verrouillage entre deux sessions (J+2, J+4)
  if (status === 'awaiting_next_phase' && unlockAt) {
    return (
      <div className="space-y-6">
        <PhaseGate
          completedPhase={(currentPhase - 1) as PhaseNumber}
          nextPhase={currentPhase}
          unlockAt={unlockAt}
        />
        <PhaseHistory />
      </div>
    )
  }

  // Les trois phases sont validées
  if (['evaluated', 'proofs_submitted', 'financed'].includes(status)) {
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
                Les {PHASES.length} phases sont validées. Passez au dépôt de votre garantie.
              </p>
            </div>
            <ButtonLink to="/dashboard/funding" size="lg">
              Continuer
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </CardBody>
        </Card>
        <PhaseHistory />
      </div>
    )
  }

  // Dossier pas encore validé par l'administration
  if (status !== 'approved') {
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

  if (screen.kind === 'running') {
    return (
      <QuizRunner
        phase={getPhase(currentPhase)}
        onFinish={(score, total) => {
          const passed = (score / total) * 100 >= PASS_THRESHOLD
          setScreen({ kind: 'result', score, total })
          if (passed) {
            completePhase(currentPhase, score, total)
            toast.success(
              `Phase ${currentPhase} validée`,
              currentPhase === 3
                ? 'Vous pouvez déposer votre garantie.'
                : 'La phase suivante s’ouvrira dans 48 heures.',
            )
          } else {
            toast.error('Score insuffisant', `Le seuil de réussite est de ${PASS_THRESHOLD} %.`)
          }
        }}
      />
    )
  }

  if (screen.kind === 'result') {
    const passed = (screen.score / screen.total) * 100 >= PASS_THRESHOLD
    return (
      <div className="space-y-6">
        <PhaseResult
          phase={currentPhase}
          score={screen.score}
          total={screen.total}
          passed={passed}
          onRetry={() => setScreen({ kind: 'intro' })}
        />
        <PhaseHistory />
      </div>
    )
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
      <PhaseIntro phase={currentPhase} onStart={() => setScreen({ kind: 'running' })} />
      <PhaseHistory />
    </div>
  )
}
